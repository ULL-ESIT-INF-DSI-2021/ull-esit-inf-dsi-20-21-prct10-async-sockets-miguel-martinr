import { BasicError } from "./basic_error";

/**
 * Error on connection (usually a client connection)
 */
export class ConnnectionError extends BasicError {
  constructor(private errMessage: string) {
    super(`There has been an error on connection${errMessage} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}

