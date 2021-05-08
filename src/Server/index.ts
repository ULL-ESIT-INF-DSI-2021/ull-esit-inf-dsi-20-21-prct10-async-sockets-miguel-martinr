import { NotesManagerServer } from "./NotesManagerServer";
import * as net from 'net';
import { warn } from "../helpers";
import { BasicError } from "../Errors/basic_error";
import chalk = require("chalk");

const port = parseInt(process.argv[2]) || 5510;

const server = new NotesManagerServer((chunk: string, connection: net.Socket) => connection.write(chunk),
  (connection: net.Socket) => connection.end());


// Server handlers

const errorHandler = (err: BasicError) => {
  console.log(err.toString());
  process.exit(-1);
};
server.on('serverError', errorHandler);
server.on('connectionError', errorHandler)

server.on('responseSent', (res, req) => {
  console.log(warn('Transaction complete:\n') +
    chalk.blue('\n  Req:') + JSON.stringify(req) +
    chalk.green('\n  Res:') + JSON.stringify(res)
  );
});



const serverEndPoint = net.createServer((connection) => server.setConnectionHandlers(connection));

server.listen(serverEndPoint, (oldEndpoint: net.Server) => oldEndpoint?.close(), (endPoint: net.Server) => endPoint.listen(port, () => {
  console.log(warn(`NotesManager server is running on port ${port}`));
}));
