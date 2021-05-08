import { RequestType } from '../helpers';
import { EventEmitter } from 'events';
import { Timer } from './Timer';
import { ConnnectionError } from '../Errors';



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
  private connection: EventEmitter;
  /**
   * 
   * @param {EventEmitter} connection Client connection
   * @param {number} timeoutLimit Minimum ammount of time a client will wait for a server response before emitting a 
   * `timeout`event
   */
  constructor(timeoutLimit: number = 2000) {
    super();
    this.timer = new Timer();

    /**
     * Every time a request is sent, timer is started.
     */
    this.on('requestSent', (req) => {
      this.timer.start(timeoutLimit);
    })

    /**
     * Every time a response is received timer is stopped
     */
    this.on('response', () => {
      this.timer.stop();
    });

    /**
     * When timer times out a `timeout` event is emitted
     */
    this.timer.on('timeout', () => {
      this.emit('timeout', this.connection);
    })

    this.connect(new EventEmitter());
  }

  /**
   * Updates connection
   * @param newConnection 
   */
  connect(newConnection: EventEmitter) {
    this.connection = newConnection;
    this.setHandlers(this.connection);
  }

  /**
   * Sets handlers for a connection
   */
  setHandlers(connection: EventEmitter) {
    // Error handler
    connection.on('error', (err) => {
      let message = '';
      if (err && err.message) message = ': ' + err.message;
      this.emit('error', new ConnnectionError(message));
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
   * @param {(chunk: string, connection: EventEmitter) => void} cb Callback for each data chunk (isually a sending method)
   * @param {ProcessRequestOptions} opts
   */
  processRequest(req: RequestType, cb: (chunk: string, connection: EventEmitter) => void,
    opts: ProcessRequestOptions = { emitRequestSent: true }) {

    let stringifiedRequest = JSON.stringify(req).split('');
    while (stringifiedRequest.length > 0) {
      let chunk = stringifiedRequest.splice(0, 51).join('');
      chunk += stringifiedRequest.length === 0 ? '\n' : '';
      cb(chunk, this.connection);
    }

    if (opts.emitRequestSent) this.emit('requestSent', req);

  }
}




