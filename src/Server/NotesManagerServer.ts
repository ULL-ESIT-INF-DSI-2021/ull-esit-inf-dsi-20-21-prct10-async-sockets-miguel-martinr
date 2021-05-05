import * as net from 'net';
import { EventEmitter } from 'events';
import { NotesManager } from '../NotesManager/notes_manager';
import { Note } from '../NotesManager/note';
import { fail, RequestType, ResponseType, success, warn } from '../helpers';



/**
 * A class that manages a server connection for a NotesManager
 */
export class NotesManagerServer extends EventEmitter {

  private server: net.Server;
  private notesManager: NotesManager;
  
  constructor() {
    super();
    this.notesManager = new NotesManager();
    this.server = net.createServer((connection) => {
      
      // Handle a possible error on connection
      connection.on('error', (err) => {
        console.log(fail(`There has been an error: ${err.message}`));
        process.exit(-1);
      });

      
      /**
       * Handles received data for getting a complete RequestType (emits a 'request' event passing
       * the request and the connection)
       */
      let incomingRequest = '';
      connection.on('data', (chunk) => {
        incomingRequest += chunk;
        
        // if (incomingRequest[incomingRequest.length - 1] === '\n') {      
        //   this.emit('request', JSON.parse(incomingRequest), connection);
        //   incomingRequest = '';
        // }
      });
    });  
    
    // Handles a 'request' event for each connection
    this.on('request', (req, connection) => {
      console.log(`Request received: ${JSON.stringify(req)}`);
      let response = this.processRequest(req);
      this.sendResponse(connection, response);
      connection.end();
    });

  }

  /**
   * Starts listenning on a especified port
   * @param {number} port Port to listen
   */
  listen(port: number) {
    this.server.listen(port, () => {
      console.log(warn(`NotesManager server is listenning on ${port}`));
    });
  }

  /**
   * Sends a ResponseType on a especified connection. It sends that response by stringifying it
   * and splitting it in 50 characters chunks, last one has a '\n' at last index.
   * @param {netSocket} connection 
   * @param {ResponseType} res 
   */
  sendResponse(connection: net.Socket, res: ResponseType) {
    const splittedRes = JSON.stringify(res).split('');

    while(splittedRes.length > 0) {
      let chunk = splittedRes.splice(0, 51).join('');
      chunk += splittedRes.length === 0 ? '\n' : '';
      connection.write(chunk);
    }
  }

  /**
   * Process a RequestType
   * @param {RequestType} req 
   * @returns {ResponseType} response
   */
  processRequest(req: RequestType) {
    let response: ResponseType = {
      success: true,
      output: undefined,
    };

    try {
      switch (req.type) {
        case 'add':
          this.notesManager.addNote(req.username, new Note(req.title!, req.body!, req.color!));
          response.output = success(`Note ${req.username}/${req.title} correctly added!`);
          break;
        case 'list':
          response.output = this.notesManager.listNotes(req.username);
          break;
        case 'read':
          response.output = this.notesManager.printNote(req.username, req.title!);
          break;
        case 'remove':
          this.notesManager.removeNote(req.username, req.title!);
          response.output = success(`Note ${req.username}/${req.title} removed correctly!`);
          break;
        case 'edit':
          this.notesManager.editNote(req.username, req.title!, req.params!);
          response.output = success(`Note ${req.username}/${req.title} edited correctly!`);
          break;
        default:
          response.output(fail(`Unkown command: ${req.type}`));
      }
    } catch (error: any) {
      response.success = false;
      response.output = error.toString() || error;
    }

    return response;
  }
}
