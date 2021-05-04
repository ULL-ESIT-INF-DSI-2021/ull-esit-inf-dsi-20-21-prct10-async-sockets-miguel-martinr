import chalk = require('chalk');
import 'colors';
import yargs = require('yargs');
import { InvalidColor } from '../NotesManager/Errors/invalid_color';
import { KnownColors } from '../NotesManager/Interfaces/colored';
import { Note } from '../NotesManager/note';
import * as net from 'net';
import { RequestType } from '../helpers';
import EventEmitter = require('events');

/**
 * A class that manages a client connection for NotesManager service 
 */
export class NotesManagerClient extends EventEmitter{
  private connection: net.Socket;
  private port: number;

  constructor() {
    super();
  }
  
  /**
   * Opens a new connection closing the older one (if there was one) And
   * sets handlers for it
   * @param {number} port 
   */
  connect(port: number) {
    this.connection?.end();
    this.port = port;
    this.connection = net.connect(this.port);
    this.setHandlers();
  }

  /**
   * Sets handlers for current connection
   */
  setHandlers() {
    // Error handler
    this.connection.on('error', (err) => {
      console.log(`There has been an error: ${err.message}`.red);
      process.exit(-1);
    });
  
    // Data handler (emits a 'response' event when a complete response has been received)
    let incomingResponse = '';
    this.connection.on('data', (chunk) => {
      incomingResponse += chunk;
      
      if (incomingResponse[incomingResponse.length - 1] === '\n') {
        this.emit('response', JSON.parse(incomingResponse));
        incomingResponse = '';
      }
    });

    // Connection end handler (closes current connection)
    this.connection.on('end', () => {
      // console.log(`Server has ended the connection`.yellow);
      this.connection.end();
    })  
  }

  /**
   * Sends stringified request on 50 characters chunks. \n is used as delimiter
   * @param {RequestType} request Request to send
   * @param {number} port Server port
   */
  sendRequest(request: RequestType, port: number = this.port) {

    if (port !== this.port) {
      this.connect(port);
    }

  
    let stringifiedRequest = JSON.stringify(request).split('');

    while (stringifiedRequest.length > 0) {
      let chunk = stringifiedRequest.splice(0, 51).join('');
      chunk += stringifiedRequest.length === 0 ? '\n' : '';
      this.connection.write(chunk);
    }
  }
}