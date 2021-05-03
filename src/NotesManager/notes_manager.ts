import * as fs from 'fs';
import { InvalidUsernameError, RepeatedNoteError, InvalidNote, NoEdition, InvalidColor } from './Errors';
import { KnownColors } from './Interfaces/colored';
import { EditObj } from './Interfaces/edit-obj';
import { Note } from "./note";


/**
 * Gestor de notas
 */
export class NotesManager {

  /**
   * 
   * @param {string} dbPath Ruta al directorio donde se guardarán los directorios de los usuarios que contendrán las notas.
   */
  private dbPath: string;
  constructor(dbPath = './Notes/') {
    this.dbPath = this.normalizePath(dbPath);
  }

  /**
   * Normalizes path adding '/' at the end of it if is not already there
   * @param {string} denormalizedPath Path to normalize
   */
  normalizePath(denormalizedPath: string): string {
    return denormalizedPath[denormalizedPath.length-1] !== '/' ? denormalizedPath + '/' : denormalizedPath;
  }

  /**
   * Añade una nueva nota
   * @param {string} username Nombre de usuario propietario de la nota
   * @param {Note} note Nota a añadir
   */
  addNote(username: string, note: Note) {
    // Si no existe el directorio principal, se crea
    if (!fs.existsSync(this.dbPath)) fs.mkdirSync(this.dbPath);

    // Si no hay un dir para el usuario, se crea
    const userDir = this.dbPath + username;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    // Si existe una nota con el mismo título se lanza un error
    const notePath = userDir + '/' + note.getTitle() + '.json';
    if (fs.existsSync(notePath)) throw new RepeatedNoteError(notePath);

    // Se añade la nota
    fs.writeFileSync(notePath, JSON.stringify(note, null, 1));
  }

  /**
   * Devuelve un listado de las notas de un usuario (títulos coloreados)
   * @param {string} username Nombre del usuario
   * @returns {string[]} Títulos coloreados de las notas (según el color de cada nota)
   */
  listNotes(username: string) {
    // Si no existe el usuario se lanza un error
    const userDir = this.dbPath + username;
    if (!fs.existsSync(userDir)) throw new InvalidUsernameError(username);


    return fs.readdirSync(userDir).map((noteFile) => noteFile.substr(0, noteFile.lastIndexOf('.')))
        .map((noteTitle) => this.searchNote(username, noteTitle)?.printTitle());
  }

  /**
   * Imprime una nota específica
   * @param {string} username Nombre del usuario propietario de la nota
   * @param {string} noteTitle Título de la nota a imprimir
   * @returns {string} Nota impresa
   */
  printNote(username: string, noteTitle: string): string {
    // Verifica que existe el usuario
    const userDir = this.dbPath + username;
    if (!fs.existsSync(userDir)) throw new InvalidUsernameError(username);

    // Verifica que existe la nota
    const notePath = userDir + '/' + noteTitle + '.json';
    if (!fs.existsSync(notePath)) throw new InvalidNote(notePath);

    // Muestra la nota
    return this.searchNote(username, noteTitle)?.print() as string;
  }

  /**
   * Elimina una nota
   * @param {string} username Nombre de usuario propietario de la nota
   * @param noteTitle Título de la nota a eliminar
   */
  removeNote(username: string, noteTitle: string) {
    // Verifica que existe el usuario
    const userDir = this.dbPath + username;
    if (!fs.existsSync(userDir)) throw new InvalidUsernameError(username);

    // Verifica que existe la nota
    const notePath = userDir + '/' + noteTitle + '.json';
    if (!fs.existsSync(notePath)) throw new InvalidNote(notePath);

    // Elimina la nota
    fs.rmSync(notePath);
  }

  /**
   * Busca una nota y devuelve un objeto Note
   * @param {string} username Nombre del usuario propietario de la nota
   * @param {string} noteTitle Título de la nota
   * @returns {Note | undefined} Si existe la nota devuelve una instancia de Note con sus valores, undefined en otro caso.
   */
  searchNote(username: string, noteTitle: string): Note | undefined {
    const userDir = this.dbPath + username;
    const notePath = userDir + '/' + noteTitle + '.json';

    if (!fs.existsSync(notePath)) return undefined;

    const parsed: { title: string, body: string, color: KnownColors } = JSON.parse(fs.readFileSync(notePath).toString());

    return new Note(parsed.title, parsed.body, parsed.color);
  }

  editNote(username: string, noteTitle: string, newValues: EditObj) {

    // Verifica que existe el usuario
    const userDir = this.dbPath + username;
    if (!fs.existsSync(userDir)) throw new InvalidUsernameError(username);

    // Verifica que existe la nota
    const notePath = userDir + '/' + noteTitle + '.json';
    if (!fs.existsSync(notePath)) throw new InvalidNote(notePath);
    
    // Verifica que se introdujo un valor que editar
    if (Object.values(newValues).filter((value) => value !== undefined).length === 0) throw new NoEdition(notePath);
    
    // Edita la nota
    const newNote = this.searchNote(username, noteTitle) as Note;

    if (typeof newValues.newTitle === 'string') {
      newNote.setTitle(newValues.newTitle);
    }
    
    if (typeof newValues.newBody === 'string') {
      newNote.setBody(newValues.newBody);
    }

    if (typeof newValues.newColor === 'string') {
      if (!Note.checkColor(newValues.newColor)) throw new InvalidColor(newValues.newColor);
      newNote.setColor(newValues.newColor as KnownColors);     
    }
   

    // Sustituye la nota
    this.removeNote(username, noteTitle);
    this.addNote(username, newNote);
  }

}

