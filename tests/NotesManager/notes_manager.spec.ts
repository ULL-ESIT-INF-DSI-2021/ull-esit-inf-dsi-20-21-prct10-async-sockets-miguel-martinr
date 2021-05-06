import 'mocha';
import * as fs from 'fs';
import { expect } from 'chai';
import { NotesManager } from '../src/notes_manager';
import { Note } from '../src/note';
import { KnownColors } from '../src/Interfaces/colored';
import { InvalidColor, InvalidNote, InvalidUsernameError, RepeatedNoteError } from '../src/Errors';

const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');


chai.use(deepEqualInAnyOrder);

describe('NotesManager good values tests', () => {
  
  // Deletes Notes folder
  fs.rmSync('./tests/Notes', {
    recursive: true,
    force: true,
  });
  
  const manager = new NotesManager('./tests/Notes');
  const firstNote = new Note('FrankNote', 'This is Frank\'s note', KnownColors.green);
  const secondNote = new Note('SecondNote', 'This is Frank\'s second note', KnownColors.blue);

  it('Normalizes path', () => {
    expect(manager.normalizePath('apath')).to.be.eq('apath/');
  });

  it('A note for a new user is added', () => {
    manager.addNote('Frank', firstNote);
    expect(fs.existsSync('./tests/Notes/Frank/FrankNote.json')).to.be.true;
  });

  it('A note for an existing user is added', () => {
    manager.addNote('Frank', secondNote);
    expect(fs.existsSync('./tests/Notes/Frank/SecondNote.json')).to.be.true;
  });

  it('List all users notes', () => {
    expect(manager.listNotes('Frank')).to.deep.equalInAnyOrder([
      firstNote.printTitle(),
      secondNote.printTitle(),
    ]);
  });

  it('Prints a note', () => {
    expect(manager.printNote('Frank', 'SecondNote')).to.be.eql(secondNote.print());
  });

  it('Removes an existing note', () => {
    manager.removeNote('Frank', 'SecondNote');
    expect(fs.existsSync('./tests/Notes/Frank/SecondNote.json')).to.be.false;
  });

  it('Searches an existing note', () => {
    expect(manager.searchNote('Frank', 'FrankNote')).to.be.eql(firstNote);
  });

  it('Edits a note', () => {
    manager.editNote('Frank', 'FrankNote', {newTitle: 'NewFrankNote'});
    expect(manager.searchNote('Frank', 'NewFrankNote')).to.be.eql(new Note('NewFrankNote', 'This is Frank\'s note', KnownColors.green));
  });
});

describe('NotesManager wrong values tests', () => {
  
  // Deletes Notes folder
  fs.rmSync('./tests/Notes', {
    recursive: true,
    force: true,
  });
  
  const manager = new NotesManager('./tests/Notes');
  const firstNote = new Note('FrankNote', 'This is Frank\'s note', KnownColors.green);


  it('Normalizes path', () => {
    expect(manager.normalizePath('apath/')).to.be.eq('apath/');
  });

  it('Adding a repeated note produces an RepeatedNoteError', () => {
    manager.addNote('Frank', firstNote);
    let err: RepeatedNoteError = new RepeatedNoteError('');
    try {
      manager.addNote('Frank', firstNote);
    } catch (error) {
      err = error;
    }
    expect(err.toString()).to.be.eql(new RepeatedNoteError('./tests/Notes/Frank/FrankNote.json').toString());
  });


  it('Listing a non-existing users notes produces an error', () => {
    let err: InvalidUsernameError = new InvalidUsernameError('');
    try {
      manager.listNotes('Bill');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).to.eq(new InvalidUsernameError('Bill').toString());
  });

  it('Printing a non-existing note produces an error', () => {
    let err = new InvalidNote('');
    try {
      manager.printNote('Frank', 'SecondNote');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).to.be.eq(new InvalidNote('./tests/Notes/Frank/SecondNote.json').toString());
  });

  it('Removing a non-existing note produces an error', () => {
    let err = new InvalidNote('');
    try {
      manager.removeNote('Frank', 'SecondNote');
    } catch (error) {
      err = error;
    }
    expect(err.toString()).to.be.eq(new InvalidNote('./tests/Notes/Frank/SecondNote.json').toString());
  });

  it('Returns undefined when can\'t find a note', () => {
    expect(manager.searchNote('Frank', 'SecondNote')).to.be.undefined;
  });

  it('Editing a note with a wrong color produces an error', () => {
    let err = new InvalidNote('');
    try {
      manager.editNote('Frank', 'FrankNote', {newColor: 'purple'});
    } catch (error) {
      err = error;
    }
    expect(err.toString()).to.be.eq(new InvalidColor('purple').toString());
  });
});
