"use strict";
exports.__esModule = true;
exports.Note = void 0;
var colored_1 = require("./Interfaces/colored");
var chalk = require("chalk");
/**
 * Clase que representa una nota
 */
var Note = /** @class */ (function () {
    function Note(title, body, color) {
        this.title = title;
        this.body = body;
        this.color = color;
    }
    /**
     * Verifica si se trata de un color conocido.
     * @param {string} color Color a analizar
     * @return  {boolean} Verdadero si es conocido, Falso en otro caso
     */
    Note.checkColor = function (color) {
        var knownColors = Object.values(colored_1.KnownColors);
        return knownColors.includes(color);
    };
    /**
     * Actualiza el color de la nota
     * @param {KnownColors} newColor Nuevo color de la nota
     */
    Note.prototype.setColor = function (newColor) {
        this.color = newColor;
    };
    /**
     * Actualiza el título de la nota
     * @param {string} newTitle  Nuevo título de la nota
     */
    Note.prototype.setTitle = function (newTitle) {
        this.title = newTitle;
    };
    /**
     * Actualiza el cuerpo de la nota
     * @param {string} newBody Nuevo cuerpo de la nota
     */
    Note.prototype.setBody = function (newBody) {
        this.body = newBody;
    };
    /**
     * Devuelve el color de la nota
     * @returns {KnownColors} Color de la nota
     */
    Note.prototype.getColor = function () {
        return this.color;
    };
    /**
     * Devuelve el título de la nota
     * @returns {string} Título de la nota
     */
    Note.prototype.getTitle = function () {
        return this.title;
    };
    /**
     * Devuelve el cuerpo de la nota
     * @returns {string} Cuerpo de la nota
     */
    Note.prototype.getBody = function () {
        return this.body;
    };
    /**
     * Imprime el título de la nota con su respectivo color
     * @returns {string} Título de la nota coloreado
     */
    Note.prototype.printTitle = function () {
        return chalk[this.color](this.title);
    };
    /**
     * Imprime la nota con su respectivo color
     * @returns {string} Nota coloreada
     */
    Note.prototype.print = function () {
        return chalk[this.color](this.title + "\n\n" +
            ("  " + this.body + "\n\n"));
    };
    return Note;
}());
exports.Note = Note;
