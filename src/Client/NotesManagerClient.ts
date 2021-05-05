import chalk = require('chalk');
import 'colors';
import yargs = require('yargs');
import { InvalidColor } from '../NotesManager/Errors/invalid_color';
import { KnownColors } from '../NotesManager/Interfaces/colored';
import { Note } from '../NotesManager/note';
import * as net from 'net';
import { RequestType } from '../helpers';
import EventEmitter = require('events');
import { boolean } from 'yargs';


/**
 * @param {boolean} emitRequestSent If set to true it will emit a `requestSent` event after completing a request process.
 */
export type ProcessRequestOptions = {
  emitRequestSent: boolean
}

/**
 * A class that manages a client connection for NotesManager service 
 */
export class NotesManagerClient extends EventEmitter {

  /**
   * 
   * @param {EventEmitter} connection Client connection
   */
  constructor(private connection: EventEmitter) {
    super();
    this.setHandlers(this.connection);
  }


  /**
   * Sets handlers for current connection
   */
  setHandlers(connection: EventEmitter) {
    // Error handler
    connection.on('error', (err) => {
      console.log(`There has been an error: ${err.message}`.red);
      process.exit(-1);
    });

    // Data handler (emits a 'response' event when a complete response has been received)
    let incomingResponse = '';
    connection.on('data', (chunk) => {
      incomingResponse += chunk;

      if (incomingResponse[incomingResponse.length - 1] === '\n') {
        this.emit('response', JSON.parse(incomingResponse));
        incomingResponse = '';
      }
    });

  }

  /**
   * It splits the request into 50 character chunks and the callback is executed passing
   * each of those chunks and the client connection.
   * @param {RequestType} request Request to send
   * @param {(chunk: string, connection: EventEmitter) => void} cb Callback for each data chunk
   * @param {ProcessRequestOptions} opts
   */
  processRequest(req: RequestType,  cb: (chunk: string, connection: EventEmitter) => void, 
  opts: ProcessRequestOptions = {emitRequestSent: true}) {

    let stringifiedRequest = JSON.stringify(req).split('');
    while (stringifiedRequest.length > 0) {
      let chunk = stringifiedRequest.splice(0, 51).join('');
      chunk += stringifiedRequest.length === 0 ? '\n' : '';
      cb(chunk, this.connection);
    }
  }
  
}




