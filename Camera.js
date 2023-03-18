// Camera
import {WebSystemObject} from './WebSystemObject';

export class Camera extends WebSystemObject {
  constructor(viewport = null) {
    super();
    this.viewport = viewport;
  }
}
