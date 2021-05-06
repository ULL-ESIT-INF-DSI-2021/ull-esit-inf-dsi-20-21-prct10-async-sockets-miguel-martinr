
import * as chalk from 'chalk';

export abstract class BasicError extends Error {
  constructor(msg? : string) {
    super(msg);
  }

  color(message: string) {
    return chalk.red(message);
  }
}
