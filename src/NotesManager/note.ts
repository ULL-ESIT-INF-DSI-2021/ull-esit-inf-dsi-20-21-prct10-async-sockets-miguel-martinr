import { Colored, KnownColors } from "./Interfaces/colored";
import * as chalk from 'chalk';

/**
 * Clase que representa una nota
 */
export class Note implements Colored {
  /**
   * 
   * @param {string} title Título de lanota
   * @param {string} body Cuerpo de la nota
   * @param {KnownColors} color  Color de la nota
   */
  private color: KnownColors;
  constructor(private title: string, private body: string, color: KnownColors) {

    this.color = color;
  }

  /**
   * Verifica si se trata de un color conocido. 
   * @param {string} color Color a analizar
   * @return  {boolean} Verdadero si es conocido, Falso en otro caso
   */
  static checkColor(color: string): boolean {
    const knownColors = Object.values(KnownColors) as string[];
    return knownColors.includes(color);
  }

  /**
   * Actualiza el color de la nota
   * @param {KnownColors} newColor Nuevo color de la nota
   */
  setColor(newColor: KnownColors) {
    this.color = newColor;
  }

  /**
   * Actualiza el título de la nota
   * @param {string} newTitle  Nuevo título de la nota
   */
  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  /**
   * Actualiza el cuerpo de la nota
   * @param {string} newBody Nuevo cuerpo de la nota
   */
  setBody(newBody: string) {
    this.body = newBody;
  }

  /**
   * Devuelve el color de la nota
   * @returns {KnownColors} Color de la nota
   */
  getColor(): KnownColors {
    return this.color;
  }

  /**
   * Devuelve el título de la nota
   * @returns {string} Título de la nota
   */
  getTitle() {
    return this.title;
  }

  /**
   * Devuelve el cuerpo de la nota
   * @returns {string} Cuerpo de la nota
   */
  getBody() {
    return this.body;
  }

  /**
   * Imprime el título de la nota con su respectivo color
   * @returns {string} Título de la nota coloreado
   */
  printTitle(): string {
    return chalk[this.color](this.title);
  }

  /**
   * Imprime la nota con su respectivo color
   * @returns {string} Nota coloreada
   */
  print(): string {
    return chalk[this.color](`${this.title}\n\n` + 
                             `  ${this.body}\n\n`);
  }
}


