import { BasicError } from "./basic_error";


export class ConnnectionError extends BasicError {
  constructor(private errMessage: string) {
    super(`There has been an error on connection${errMessage} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}

