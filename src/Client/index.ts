import { NotesManagerClient } from './NotesManagerClient';
import * as yargs from 'yargs';
import { Note } from '../NotesManager/note';
import { InvalidColor } from '../NotesManager/Errors';
import { KnownColors } from '../NotesManager/Interfaces/colored';
import * as net from 'net';
import { fail } from '../helpers';


const sendRequest = (chunk: string, connection: net.Socket) => connection.write(chunk);

const client = new NotesManagerClient();

// Client handlers
client.on('timeout', (connection: net.Socket) => {
  console.log(fail(`Timeout! Server took too long to respond`));
  process.exit(-1);
});

client.on('error', (err) => {
  console.log(err.toString());
  process.exit(-1);
});



yargs
  .scriptName('notes-app')
  .usage('$0 <cmd> [args]');


// Add note
yargs.command({
  command: 'add',
  describe: 'Adds a new note',
  builder: {
    username: {
      describe: 'Note\'s owner username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color [red, yellow, green, blue]',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    port: {
      describe: 'Connection port',
      demandOption: false,
      default: 5510,
      type: 'number'
    },
    host: {
      describe: 'Server host',
      demandOption: false,
      default: '127.0.0.1',
      type: 'string',
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string' &&
      typeof argv.color === 'string' && typeof argv.body === 'string' && 
      typeof argv.port === 'number' && typeof argv.host === 'string') {

      if (!Note.checkColor(argv.color)) throw new InvalidColor(argv.color);

      client.connect(net.connect(argv.port, argv.host));
      client.on('response', (res) => {
        console.log(res.output);
      });
      client.processRequest({
        type: 'add',
        username: argv.username,
        title: argv.title,
        body: argv.body,
        color: argv.color as KnownColors
      }, sendRequest);

    }
  },
});

// Remove note
yargs.command({
  command: 'remove',
  describe: 'Removes a note',
  builder: {
    username: {
      describe: 'Note\'s owner username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    port: {
      describe: 'Connection port',
      demandOption: false,
      default: 5510,
      type: 'number'
    },
    host: {
      describe: 'Server host',
      demandOption: false,
      default: '127.0.0.1',
      type: 'string',
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string'
      && typeof argv.port === 'number' && typeof argv.host === 'string') {
      
      client.connect(net.connect(argv.port, argv.host));
      client.on('response', (res) => {
        console.log(res.output);
      });
      client.processRequest({
        type: 'remove',
        username: argv.username,
        title: argv.title,
      }, sendRequest);

    }
  },
});

// Edit note
yargs.command({
  command: 'edit',
  describe: 'Edits a note',
  builder: {
    username: {
      describe: 'Note\'s owner username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Title of note to edit',
      demandOption: true,
      type: 'string',
    },
    newTitle: {
      describe: 'Title of note to edit',
      demandOption: false,
      type: 'string',
    },
    newColor: {
      describe: 'New note color [red, yellow, green, blue]',
      demandOption: false,
      type: 'string',
    },
    newBody: {
      describe: 'New note body',
      demandOption: false,
      type: 'string',
    },
    port: {
      describe: 'Connection port',
      demandOption: false,
      default: 5510,
      type: 'number'
    },
    host: {
      describe: 'Server host',
      demandOption: false,
      default: '127.0.0.1',
      type: 'string',
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string'
      && typeof argv.port === 'number' && typeof argv.host === 'string') {
      const params = {
        newTitle: argv.newTitle,
        newBody: argv.newBody,
        newColor: argv.newColor,
      };

      client.connect(net.connect(argv.port, argv.host));
      client.on('response', (res) => {
        console.log(res.output);
      });
      client.processRequest({
        type: 'edit',
        username: argv.username,
        title: argv.title,
        params: params,
      }, sendRequest);

    }
  },
});

// List notes
yargs.command({
  command: 'list',
  describe: 'List an user\'s notes',
  builder: {
    username: {
      describe: 'Note\'s owner username',
      demandOption: true,
      type: 'string',
    },
    port: {
      describe: 'Connection port',
      demandOption: false,
      default: 5510,
      type: 'number'
    },
    host: {
      describe: 'Server host',
      demandOption: false,
      default: '127.0.0.1',
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.port === 'number'
      && typeof argv.host === 'string') {

      
      client.connect(net.connect(argv.port, argv.host));
      client.on('response', (res) => {
        if (res.success) {
          res.output.forEach((noteTitle: string) => console.log(noteTitle));
        } else {
          console.log(res.output);
        }
      });
      client.processRequest({
        type: 'list',
        username: argv.username,
      }, sendRequest);


    }
  },
});

// Read note
yargs.command({
  command: 'read',
  describe: 'Read one note',
  builder: {
    username: {
      describe: 'Note\'s owner username',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note\'s title',
      demandOption: true,
      type: 'string',
    },
    port: {
      describe: 'Connection port',
      demandOption: false,
      default: 5510,
      type: 'number'
    },
    host: {
      describe: 'Server host',
      demandOption: false,
      default: '127.0.0.1',
      type: 'string',
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string'
      && typeof argv.port === 'number' && typeof argv.host === 'string') {

      client.connect(net.connect(argv.port, argv.host));
      client.on('response', (res) => {
        console.log(res.output);
      });
      client.processRequest({
        type: 'read',
        username: argv.username,
        title: argv.title
      }, sendRequest);

    }
  },
});


try {
  yargs.parse();
} catch (error) {
  console.log(error.toString());
}
