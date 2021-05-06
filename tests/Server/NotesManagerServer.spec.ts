import { NotesManagerServer } from '../../src/Server/NotesManagerServer';
import 'mocha';
import { expect } from 'chai';
import { EventEmitter } from 'events';
import { fail, RequestType, ResponseType } from '../../src/helpers';
import { ConnnectionError } from '../../src/Errors';
import { ServerConnnectionError } from '../../src/Errors/server_connection_error';


describe('NotesManagerServer tests', () => {

  it('Should emit a request event once it gets a complete request', (done) => {
    const endPoint = new EventEmitter();
    const server = new NotesManagerServer((chunk) => { });

    const client = new EventEmitter();

    const request: RequestType = {
      type: 'list',
      username: 'John',
    };

    server.on('request', (req, _) => {
      expect(req).to.be.eql(request);
      done()
    });

    server.listen(endPoint);
    server.setConnectionHandlers(client);



    client.emit('data', '{"type": "list", "username": "John"');
    client.emit('data', '}\n');
  });

  it('Should emit a serverError event once the server endpoint emits an error', (done) => {
    const endPoint = new EventEmitter();
    const server = new NotesManagerServer((chunk) => { });

    server.listen(endPoint);

    server.on('serverError', (err) => {
      expect(err).to.be.instanceOf(ServerConnnectionError);
      done();
    });

    endPoint.emit('error', new ServerConnnectionError(`Server Error`));
  });

  it('Should emit a connectionError event once the client endpoint emits an error', (done) => {
    const endPoint = new EventEmitter();
    const server = new NotesManagerServer((chunk) => { });
    const client = new EventEmitter();

    server.listen(endPoint);

    server.on('connectionError', (err) => {
      expect(err).to.be.instanceOf(ConnnectionError);
      done();
    });

    server.setConnectionHandlers(client);

    client.emit('error', new ConnnectionError(`Client Error`));
  });

  it('Should emit a responseSent event once it has sent a complete response', (done) => {
    const endPoint = new EventEmitter();
    const server = new NotesManagerServer((chunk) => { });

    const client = new EventEmitter();

    const request: RequestType = {
      type: 'list',
      username: 'John',
    };

    const response: ResponseType = {
      success: false,
      output: fail(`Error: Can't find a user called John !`),
    };
    
    server.on('responseSent', (res, req) => {
      expect(req).to.be.eql(request);
      expect(res).to.be.eql(response);
      done()
    });

    server.listen(endPoint);
    server.setConnectionHandlers(client);



    client.emit('data', '{"type": "list", "username": "John"');
    client.emit('data', '}\n');
  });


});
