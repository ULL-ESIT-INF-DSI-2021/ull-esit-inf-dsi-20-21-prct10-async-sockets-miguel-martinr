import * as net from 'net';
import * as yargs from 'yargs';
import { KnownColors } from './NotesManager/Interfaces/colored';



export type requestType = {
  type: 'add' | 'remove' | 'list' | 'edit' | 'read';
  username: string,
  title?: string,
  body?: string,
  color?: KnownColors
}





yargs
  .scriptName('client.js')
  .usage('$0 <cmd> [args]')
  .command({
    command: 'add',
    describe: 'Opens a session on server',
    builder: {
      user: {
        describe: 'Username',
        demandOption: true,
        type: 'string',
      },
      port: {
        describe: 'Port to connect',
        demandOption: true,
        type: 'number',
      },
    },
    handler(argv: any) {
      if (typeof argv.path === 'string') {

      }
    }
  });