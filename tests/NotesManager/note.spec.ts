import 'mocha';
import { expect } from 'chai';
import { Note } from '../src/note';
import { KnownColors } from '../src/Interfaces/colored';

describe('Note tests', () => {
  it('It can be instanciated', () => {
    expect(new Note('', '', KnownColors.green) instanceof Note).to.be.true;
  });

  it('Note::checkColor static method returns true if valid color', () => {
    expect(Note.checkColor('red')).to.be.true;
  });

  it('Note::checkColor static method returns false if not valid color', () => {
    expect(Note.checkColor('purple')).to.be.false;
  });

  const note = new Note('Spanish test', 'Study for test on tuesday', KnownColors.red);
  it('Retrieves note\'s title', () => {
    expect(note.getTitle()).to.be.eq('Spanish test');
  });

  it('Retrieves note\'s body', () => {
    expect(note.getBody()).to.be.eq('Study for test on tuesday');
  });

  it('Retrieves note\'s color', () => {
    expect(note.getColor()).to.be.eq(KnownColors.red);
  });

  it('Change title', () => {
    note.setTitle('newTitle');
    expect(note.getTitle()).to.be.eq('newTitle');
  });

  it('Change color', () => {
    note.setColor(KnownColors.blue);
    expect(note.getColor()).to.be.eq(KnownColors.blue);
  });

  it('Change body', () => {
    note.setBody('newBody');
    expect(note.getBody()).to.be.eq('newBody');
  });
  
});


