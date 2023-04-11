// PointerDevice.js
import {WebSystemObject} from './WebSystemObject.js';

export class PointerDevice extends WebSystemObject {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return {x: this.x, y: this.y};
  }


}

