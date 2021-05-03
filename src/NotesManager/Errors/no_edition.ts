import { BasicError } from "./basic_error";


export class NoEdition extends BasicError {
  constructor(private notePath: string) {
    super(`You haven\'t edited any value of note ${notePath} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}
