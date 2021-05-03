import chalk = require('chalk');
import 'colors';
import yargs = require('yargs');
import { InvalidColor } from './NotesManager/Errors/invalid_color';
import { KnownColors } from './NotesManager/Interfaces/colored';
import { Note } from './NotesManager/note';
import * as net from 'net';
import { requestType } from '.';
import EventEmitter = require('events');


class NotesManagerClient extends EventEmitter{
  private connection: net.Socket;
  constructor(private port: number) {
    super();

    this.connection = net.connect(port);

    this.connection.on('error', (err) => {
      console.log(`There has been an error: ${err.message}`.red);
      process.exit(-1);
    });

    let incomingResponse = '';
    this.connection.on('data', (chunk) => {
      incomingResponse += chunk;
      
      if (incomingResponse[incomingResponse.length - 1] === '\n') {
        this.emit('response', JSON.parse(incomingResponse));
        incomingResponse = '';
      }
    });

    this.connection.on('end', () => {
      console.log(`Server has ended the connection`.yellow);
      this.connection.end();
    })
  }

  sendRequest(request: requestType) {
    // Sends stringified request on 50 characters chunks. \n is used as delimiter
    let stringifiedRequest = JSON.stringify(request).split('');

    while (stringifiedRequest.length > 0) {
      let chunk = stringifiedRequest.splice(0, 51).join('');
      chunk += stringifiedRequest.length === 0 ? '\n' : '';
      this.connection.write(chunk);
      // console.log(stringifiedRequest);
    }

    console.log(`Request sended!`.yellow);
  }
}




const success = chalk.green;

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
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string' &&
      typeof argv.color === 'string' && typeof argv.body === 'string' && typeof argv.port === 'number') {

      if (!Note.checkColor(argv.color)) throw new InvalidColor(argv.color);

      const client = new NotesManagerClient(argv.port);
      client.sendRequest({
        type: 'add',
        username: argv.username,
        title: argv.title,
        body: argv.body,
        color: argv.color as KnownColors
      });

      client.on('response', (res) => {
        console.log(`Response received: ${JSON.stringify(res)}`);
      })
    }
  },
});

// // Remove note
// yargs.command({
//   command: 'remove',
//   describe: 'Removes a note',
//   builder: {
//     username: {
//       describe: 'Note\'s owner username',
//       demandOption: true,
//       type: 'string',
//     },
//     title: {
//       describe: 'Note title',
//       demandOption: true,
//       type: 'string',
//     },
//     port: {
//       describe: 'Connection port',
//       demandOption: false,
//       default: 5510,
//       type: 'number'
//     }
//   },
//   handler(argv) {
//     if (typeof argv.username === 'string' && typeof argv.title === 'string') {
//       manager.removeNote(argv.username, argv.title);
//       console.log(success(`Note ${argv.username}/${argv.title} removed correctly!`));
//     }
//   },
// });

// // Edit note
// yargs.command({
//   command: 'edit',
//   describe: 'Edits a note',
//   builder: {
//     username: {
//       describe: 'Note\'s owner username',
//       demandOption: true,
//       type: 'string',
//     },
//     title: {
//       describe: 'Title of note to edit',
//       demandOption: true,
//       type: 'string',
//     },
//     newTitle: {
//       describe: 'Title of note to edit',
//       demandOption: false,
//       type: 'string',
//     },
//     newColor: {
//       describe: 'New note color [red, yellow, green, blue]',
//       demandOption: false,
//       type: 'string',
//     },
//     newBody: {
//       describe: 'New note body',
//       demandOption: false,
//       type: 'string',
//     },
//     port: {
//       describe: 'Connection port',
//       demandOption: false,
//       default: 5510,
//       type: 'number'
//     }
//   },
//   handler(argv) {
//     if (typeof argv.username === 'string' && typeof argv.title === 'string') {
//       const newValues = {
//         newTitle: argv.newTitle,
//         newBody: argv.newBody,
//         newColor: argv.newColor,
//       };

//       manager.editNote(argv.username, argv.title, newValues);
//       console.log(success(`Note ${argv.username}/${argv.title} edited correctly!`));
//     }
//   },
// });

// // List notes
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
    }
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.port === 'number') {
      const client = new NotesManagerClient(argv.port);
      client.sendRequest(
        {
          type: 'list',
          username: argv.username,
        }
      );

      client.on('response', (res) => {
        console.log(`Response received: ${JSON.stringify(res)}`);
      })
    }
  },
});

// // Read note
// yargs.command({
//   command: 'read',
//   describe: 'Read one note',
//   builder: {
//     username: {
//       describe: 'Note\'s owner username',
//       demandOption: true,
//       type: 'string',
//     },
//     title: {
//       describe: 'Note\'s title',
//       demandOption: true,
//       type: 'string',
//     },
//     port: {
//       describe: 'Connection port',
//       demandOption: false,
//       default: 5510,
//       type: 'number'
//     }
//   },
//   handler(argv) {
//     if (typeof argv.username === 'string' && typeof argv.title === 'string') {
//       console.log(manager.printNote(argv.username, argv.title));
//     }
//   },
// });


try {
  yargs.parse();
} catch (error) {
  console.log(error.toString());
}
