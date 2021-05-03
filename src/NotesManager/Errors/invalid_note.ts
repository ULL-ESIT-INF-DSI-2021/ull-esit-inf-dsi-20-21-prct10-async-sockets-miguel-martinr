import { BasicError } from "./basic_error";


export class InvalidNote extends BasicError {
  constructor(private notePath: string) {
    super(`Can\'t find note called ${notePath} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}
