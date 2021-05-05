import {EventEmitter} from 'events';


export class Timer extends EventEmitter {
  
  private timer: NodeJS.Timeout;
  constructor() {
    super();
  }

  start(timeMS: number) {
    this.timer = setTimeout(() => {
      this.emit('timeout');
    }, timeMS);
  }

  stop() {
    clearTimeout(this.timer);
  }
}