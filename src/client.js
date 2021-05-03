"use strict";
exports.__esModule = true;
var chalk = require("chalk");
require("colors");
var yargs = require("yargs");
var invalid_color_1 = require("./NotesManager/Errors/invalid_color");
var note_1 = require("./NotesManager/note");
var net = require("net");
var NotesManagerClient = /** @class */ (function () {
    function NotesManagerClient(port) {
        this.port = port;
        this.connection = net.connect(port);
        this.connection.on('error', function (err) {
            console.log(("There has been an error: " + err.message).red);
            process.exit(-1);
        });
    }
    NotesManagerClient.prototype.sendRequest = function (request) {
        // Sends stringified request on 50 characters chunks. \n is used as delimiter (49 + \n)
        var stringifiedRequest = JSON.stringify(request).split('');
        while (stringifiedRequest.length > 0) {
            var chunk = stringifiedRequest.splice(0, 50).join('') + '\n';
            this.connection.write(chunk);
        }
        console.log("Request sended!".yellow);
    };
    return NotesManagerClient;
}());
var success = chalk.green;
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
            type: 'string'
        },
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        color: {
            describe: 'Note color [red, yellow, green, blue]',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        },
        port: {
            describe: 'Connection port',
            demandOption: false,
            "default": 5510,
            type: 'number'
        }
    },
    handler: function (argv) {
        if (typeof argv.username === 'string' && typeof argv.title === 'string' &&
            typeof argv.color === 'string' && typeof argv.body === 'string' && typeof argv.port === 'number') {
            if (!note_1.Note.checkColor(argv.color))
                throw new invalid_color_1.InvalidColor(argv.color);
            var client = new NotesManagerClient(argv.port);
            client.sendRequest({
                type: 'add',
                username: argv.username,
                title: argv.title,
                body: argv.body,
                color: argv.color
            });
            // manager.addNote(argv.username, new Note(argv.title, argv.body, argv.color as KnownColors));
            // console.log(success(`Note ${argv.username}/${argv.title} correctly added!`));
        }
    }
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
// yargs.command({
//   command: 'list',
//   describe: 'List an user\'s notes',
//   builder: {
//     username: {
//       describe: 'Note\'s owner username',
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
//     if (typeof argv.username === 'string') {
//       manager.listNotes(argv.username).forEach((note) => {
//         console.log(note);
//       });
//     }
//   },
// });
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
}
catch (error) {
    console.log(error.toString());
}
