import { NotesManagerClient } from '../../src/Client/NotesManagerClient';
import 'mocha';
import { expect } from 'chai';
import { EventEmitter } from 'events';
import { RequestType } from '../../src/helpers';
import { ConnnectionError } from '../../src/Errors';


describe('NotesManagerClient', () => {
  it('Should emit a response event once it gets a complete response', (done) => {
    const socket = new EventEmitter();
    const client = new NotesManagerClient();

    client.connect(socket);
    client.on('response', (res) => {
      expect(res).to.be.eql({ 'success': 'true', 'output': 'NoteOne', 'curr': 26 });
      done();
    });


    socket.emit('data', '{"success": "true", "output": "NoteOne"');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
  });

  it('Should emit a requestSent event when a complete request has been sent', (done) => {
    const socket = new EventEmitter();
    const client = new NotesManagerClient(1500);

    client.connect(socket);

    const request: RequestType = {
      type: 'add',
      username: 'any',
    };

    client.on('requestSent', (req) => {
      expect(req).to.be.eql(request);
      done();
    })
    
    client.processRequest({
      type: 'add',
      username: 'any',
    }, (chunk, connection) => {
      
    }, {emitRequestSent: true});
  });

  it('Should emit a timeout event when, at least,  0.5 seconds have passed after sending a request', (done) => {
    const socket = new EventEmitter();
    const client = new NotesManagerClient(500);

    client.connect(socket);
    client.on('timeout', () => {
      done();
    });

    client.processRequest({
      type: 'add',
      username: 'any',
    }, (chunk, connection) => {
      
    }, {emitRequestSent: true});
  });


  it('Should emit an error event with a ConnectionError object when connection emits an error event', (done) => {
    const socket = new EventEmitter();
    const client = new NotesManagerClient();

    client.connect(socket);
    
    client.on('error', (err) => {
      expect(err instanceof ConnnectionError).to.be.true;
      done();
    });

    socket.emit('error');
  });


});
