import { BasicError } from "./basic_error";

/**
 * Error on server connection
 */
export class ServerConnnectionError extends BasicError {
  constructor(private errMessage: string) {
    super(`There has been an error on server connection${errMessage} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}

