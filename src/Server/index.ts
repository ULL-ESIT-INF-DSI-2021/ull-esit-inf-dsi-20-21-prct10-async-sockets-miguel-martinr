import { NotesManagerServer } from "./NotesManagerServer";


const port = parseInt(process.argv[2]) | 5510;

const server = new NotesManagerServer();

server.listen(port);
