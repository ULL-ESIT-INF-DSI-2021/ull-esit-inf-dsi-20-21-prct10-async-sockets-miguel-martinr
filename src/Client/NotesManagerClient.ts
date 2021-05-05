import { RequestType } from '../helpers';
import EventEmitter = require('events');

import { Timer } from './Timer';
import { fail } from '../helpers';


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
  private timer: Timer;

  /**
   * 
   * @param {EventEmitter} connection Client connection
   */
  constructor(private connection: EventEmitter) {
    super();
    this.timer = new Timer();
    this.setHandlers(this.connection);
  }


  /**
   * Sets handlers for current connection
   */
  setHandlers(connection: EventEmitter) {
    // Error handler
    connection.on('error', (err) => {
      console.log(fail(`There has been an error: ${err.message}`));
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

    this.on('requestSent', (req) => {
      this.timer.start(2000);
    })

    this.on('response', () => {
      this.timer.stop();
    });

    this.timer.on('timeout', () => {
      this.emit('timeout', this.connection);
    })

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

    opts.emitRequestSent ? this.emit('requestSent', req) : true;
  }
  
}




