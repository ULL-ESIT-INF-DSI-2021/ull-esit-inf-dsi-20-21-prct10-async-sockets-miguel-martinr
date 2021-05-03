import chalk = require('chalk');
import yargs = require('yargs');
import { InvalidColor } from './Errors/invalid_color';
import { KnownColors } from './Interfaces/colored';
import { Note } from './note';
import { NotesManager } from './notes_manager';

const success = chalk.green;
const manager = new NotesManager();
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
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string' &&
      typeof argv.color === 'string' && typeof argv.body === 'string') {
      
      if (!Note.checkColor(argv.color)) throw new InvalidColor(argv.color);
      manager.addNote(argv.username, new Note(argv.title, argv.body, argv.color as KnownColors));
      console.log(success(`Note ${argv.username}/${argv.title} correctly added!`));
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
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string') {
      manager.removeNote(argv.username, argv.title);
      console.log(success(`Note ${argv.username}/${argv.title} removed correctly!`));
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
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string') {
      const newValues = {
        newTitle: argv.newTitle,
        newBody: argv.newBody,
        newColor: argv.newColor,
      };

      manager.editNote(argv.username, argv.title, newValues);
      console.log(success(`Note ${argv.username}/${argv.title} edited correctly!`));
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
  },
  handler(argv) {
    if (typeof argv.username === 'string') {
      manager.listNotes(argv.username).forEach((note) => {
        console.log(note);
      });
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
  },
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string') {
      console.log(manager.printNote(argv.username, argv.title));
    }
  },
});


try {
  yargs.parse();
} catch (error) {
  console.log(error.toString());
}
