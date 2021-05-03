import { BasicError } from "./basic_error";

export class RepeatedNoteError extends BasicError {
  constructor(private notePath: string) {
    super(`There\'s already a note called ${notePath} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}
