import * as chalk from 'chalk';
import { KnownColors } from './NotesManager/Interfaces/colored';
import { EditObj } from './NotesManager/Interfaces/edit-obj';

export type CommandType = 'add' | 'remove' | 'list' | 'edit' | 'read';

export type ResponseType = {
  success: boolean,
  output: any,
};

export type RequestType = {
  type: CommandType;
  username: string,
  title?: string,
  body?: string,
  color?: KnownColors,
  params?: EditObj 
}


// Colors
export const warn = chalk.yellow;
export const success = chalk.green;
export const fail = chalk.red;