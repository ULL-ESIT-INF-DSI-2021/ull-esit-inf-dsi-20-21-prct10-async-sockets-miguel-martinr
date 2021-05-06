import { NotesManagerServer } from "./NotesManagerServer";
import * as net from 'net';
import { warn } from "../helpers";
import { BasicError } from "../Errors/basic_error";

const port = parseInt(process.argv[2]) || 5510;

const server = new NotesManagerServer((chunk: string, connection: net.Socket) => connection.write(chunk));

const errorHandler = (err: BasicError) => {
  console.log(err.toString());
  process.exit(-1);
};

server.on('serverError', errorHandler);
server.on('connectionError', errorHandler)
server.on('request', (req) => console.log(`Request received: ${JSON.stringify(req)}`));


const serverEndPoint = net.createServer((connection) => server.setConnectionHandlers(connection));

server.listen(serverEndPoint, undefined, (endPoint: net.Server) => endPoint.listen(port, () => {
  console.log(warn(`NotesManager server is running on port ${port}`));
}));
