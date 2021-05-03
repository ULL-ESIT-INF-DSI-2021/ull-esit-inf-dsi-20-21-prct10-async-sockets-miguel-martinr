import { BasicError } from "./basic_error";


export class InvalidUsernameError extends BasicError {
  constructor(private username: string) {
    super(`Can\'t find a user called ${username} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}
