import { BasicError } from "./basic_error";


export class InvalidColor extends BasicError {
  constructor(private invalidColor: string) {
    super(`Can\'t recognize color ${invalidColor} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}

