import { NotesManagerClient } from '../../src/Client/NotesManagerClient';
import 'mocha';
import { expect } from 'chai';
import { EventEmitter } from 'events';
import * as net from 'net';
import { write } from 'node:fs';


describe('NotesManagerClient', () => {
  it('Should emit a response event once it gets a complete response', (done) => {
    const socket = new EventEmitter();
    const client = new NotesManagerClient(socket);

    client.on('response', (res) => {
      expect(res).to.be.eql({ 'success': 'true', 'output': 'NoteOne', 'curr': 26 });
      done();
    });


    socket.emit('data', '{"success": "true", "output": "NoteOne"');
    socket.emit('data', ', "curr": 26}');
    socket.emit('data', '\n');
  });
});
