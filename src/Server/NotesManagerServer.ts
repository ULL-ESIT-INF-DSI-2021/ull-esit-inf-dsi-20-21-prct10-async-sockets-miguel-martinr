import { EventEmitter } from 'events';
import { NotesManager } from '../NotesManager/notes_manager';
import { Note } from '../NotesManager/note';
import { fail, RequestType, ResponseType, success } from '../helpers';
import { ServerConnnectionError } from '../Errors/server_connection_error';
import { ConnnectionError } from '../Errors';



/**
 * A class that manages a server connection for a NotesManager
 */
export class NotesManagerServer extends EventEmitter {

  // NotesManager app
  private notesManager: NotesManager;

  // Server endpoint
  private endpoint: EventEmitter;

/**
 * 
 * @param {(chunk: string, connection: EventEmitter) => void)} sendingMethod Defines how data chunks will be sent on each connection
 * @param {(connection: EventEmitter) => void} endingMethod Defines an action a client connection must perform before ending. For example,
 * for a net.Socket connection could be `connection.end()`
 */
  constructor(private sendingMethod: (chunk: string, connection: EventEmitter) => void,
    private endingMethod?: (connection: EventEmitter) => void) {
    
    super();
    this.notesManager = new NotesManager();

    // Handles a 'request' event for each connection
    this.on('request', (req, connection) => {
      let response = this.processRequest(req);
      this.sendResponse(connection, response, req);

      if (this.endingMethod) this.endingMethod(connection);
    });

    
  }

  /**
   * Starts listenning on a specific endpoint
   * @param {EventEmitter} endPoint New endpoint
   * @param {(oldEndpoint: EventEmitter) => void} endingProcess (Optional) Action performed by the old endpoint before shifting it
   * @param {(endPoint: EventEmitter) => void} startingProcess (Optional) Action performed by new endpoint right after commiting the shift
   */
  listen(endPoint: EventEmitter, endingProcess?: (oldEndpoint: EventEmitter) => void, startingProcess?: (server: EventEmitter) => void) {
    if (endingProcess) endingProcess(this.endpoint);
    this.endpoint = endPoint;
    this.setEndpointHandlers(this.endpoint);
    if (startingProcess) startingProcess(this.endpoint);
  }

  /**
   * Sets endpoint\'s handlers
   * @param {EventEmitter} endpoint 
   */
  setEndpointHandlers(endpoint: EventEmitter) {
    // Server Error handling
    endpoint.on('error', (err) => {
      let message = '';
      if (err && err.message) message = ': ' + err.message;
      this.emit('serverError', new ServerConnnectionError(message));
    });
  }

  /**
   * Sets connection handlers
   * @param {EventEmitter} connection 
   */
  setConnectionHandlers(connection: EventEmitter) {
    // Handle a possible error on connection
    connection.on('error', (err) => {
      let message = '';
      if (err && err.message) message = ': ' + err.message;
      this.emit('connectionError', new ConnnectionError(message));
    });

    /**
     * Handles received data for getting a complete request (RequestType) (emits a 'request' event passing
     * the request and the connection)
     */
    let incomingRequest = '';
    connection.on('data', (chunk) => {
      incomingRequest += chunk;

      if (incomingRequest[incomingRequest.length - 1] === '\n') {
        this.emit('request', JSON.parse(incomingRequest), connection);
        incomingRequest = '';
      }
    });
  }

  /**
   * Sends a ResponseType on a especified connection. It sends that response by stringifying it
   * and splitting it in 50 characters chunks, last one has a '\n' at last index. The request is sent 
   * by applying `sendingMethod` to each one of the data chunks
   * @param {EventEmitter} connection 
   * @param {ResponseType} res 
   * @param {RequestType} req 
   */
  sendResponse(connection: EventEmitter, res: ResponseType, req?: RequestType) {
    const splittedRes = JSON.stringify(res).split('');

    while (splittedRes.length > 0) {
      let chunk = splittedRes.splice(0, 51).join('');
      chunk += splittedRes.length === 0 ? '\n' : '';
      this.sendingMethod(chunk, connection);
    }

    this.emit('responseSent', res, req);
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
