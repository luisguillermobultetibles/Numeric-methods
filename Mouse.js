import {WebSystemObject} from './WebSystemObject.js';
import {Vector} from './Vector';
import {Keyboard} from './Keyboard';


// Clase para controlar el ratón...
export class Mouse extends WebSystemObject {
  #isMouseDown = false;
  target = window;
  position = new Vector(0, 0);
  #lastPosition = new Vector(x, y);
  direction = new Vector(0, 0);
  leftButton = false;
  midButton = false;
  rightButton = false; // Context menu, use in conjunction with: document.addEventListener("contextmenu", function(e){ e.preventDefault() });
  fourthButton = false; // Browserback
  fifthButton = false; // Browser forward
  shift = Keyboard.upDownStates[Keyboard.keySHIFT];
  alt = Keyboard.upDownStates[Keyboard.keyALT];
  ctrlKey = Keyboard.upDownStates[Keyboard.keyCTRL];
  #DownEvents = [];
  #UpEvents = [];
  #MoveEvents = [];
  #WheelEvents = [];

  static #mouseDown(e) {
    this.#isMouseDown = true;
    document.title = `Mouse abajo ${e}: estado ${this.#isMouseDown ? 'abajo' : 'arriba'} en (${this.position.x}, ${this.position.y}).`;
    document.body.style.cursor = 'grabbing';

    if (e.which === 1 || e.button === 0) {
      this.leftButton = true;
    } else if (e.which === 2 || e.button === 1) {
      this.midButton = true;
    } else if (e.which === 3 || e.button === 2) {
      this.rightButton = true;
    } else if (e.which === 4 || e.button === 3) {
      this.fourthButton = true;
    } else if (e.which === 5 || e.button === 4) {
      this.fifthButton = true;
    }

    this.shift = e.shiftKey;
    this.alt = e.altKey;
    this.ctrlKey = e.ctrlKey;

    this.#DownEvents.forEach((event) => event(e));
  };

  static #mouseUp(e) {
    this.#isMouseDown = false;
    document.title = `Mouse arriba ${e}: estado ${this.#isMouseDown ? 'abajo' : 'arriba'} en (${this.position.x}, ${this.position.y}).`;
    document.body.style.cursor = 'grab';

    if (e.which === 1 || e.button === 0) {
      this.leftButton = false;
    } else if (e.which === 2 || e.button === 1) {
      this.midButton = false;
    } else if (e.which === 3 || e.button === 2) {
      this.rightButton = false;
    } else if (e.which === 4 || e.button === 3) {
      this.fourthButton = false;
    } else if (e.which === 5 || e.button === 4) {
      this.fifthButton = false;
    }

    this.#UpEvents.forEach((event) => event(e));
  };

  static #mouseMove(e) {
    this.position.x = e.clientX;
    this.position.y = e.clientY;

    [this.direction.x, this.direction.y] = [x - this.#lastPosition.x, y - this.#lastPosition.y];
    [this.#lastPosition.x, this.#lastPosition.y] = [x, y];

    document.title = `Mouse moviéndose ${e}: estado ${this.#isMouseDown ? 'abajo' : 'arriba'} en (${this.position.x}, ${this.position.y}).`;
    this.#MoveEvents.forEach((event) => event(e));
  };

  static #mouseWheel(e) {
    this.position.x = e.clientX;
    this.position.y = e.clientY;

    let dx = Math.sign(e.deltaX);
    let dy = Math.sign(e.deltaY);
    let dz = Math.sign(e.deltaZ);

    let units;

    if (e.deltaMode === 0) {
      units = 'pixels';
    } else if (e.deltaMode === 1) {
      units = 'lines';
    } else if (e.deltaMode === 2) {
      units = 'pages';
    }

    document.title = `Mouse wheel ${Math.sqrt(dx + dy + dz)} ${units}, ${dx > 0 ? 'hacia derecha.' : 'hacia izquierda.'}.`;
    document.title += ` ${dy > 0 ? 'hacia abajo.' : 'hacia arriba.'}.`;
    document.title += ` ${dz > 0 ? 'hacia arriba.' : 'hacia abajo.'}.`;
    this.#WheelEvents.forEach((event) => event(e));

  };

  /*

  function zoom(event) {
    event.preventDefault();

    scale += event.deltaY * -0.01;

    // Restrict scale
    scale = Math.min(Math.max(0.125, scale), 4);

    // Apply scale transform
    el.style.transform = `scale(${scale})`;
  }

Incluir además mouseenter, mouseleave, mouseout (se va de los hijos) y mouseover


  */

  constructor(onMouseDown, onMouseMove, onMouseUp, onMouseWheel, target = window) {
    super();

    if (this.#DownEvents.length === 0 && this.#UpEvents.length === 0 && this.#MoveEvents.length === 0) {
      if (target) {
        this.target = target;
      }
      this.target.addEventListener('mousedown', this.#mouseDown, false);
      this.target.addEventListener('mouseup', this.#mouseUp, false);
      this.target.addEventListener('mousemove', this.#mouseMove, false);
      this.target.addEventListener('wheel', this.#mouseWheel, false);
    }
    this.downEventsPosition = -1;
    this.upEventsPosition = -1;
    this.moveEventsPosition = -1;

    if (onMouseDown) {
      this.#DownEvents.push(onMouseDown);
      this.downEventsPosition = this.#DownEvents.length - 1;
    }
    if (onMouseUp) {
      this.#UpEvents.push(onMouseUp);
      this.upEventsPosition = this.#UpEvents.length - 1;
    }
    if (onMouseMove) {
      this.#MoveEvents.push(onMouseMove);
      this.moveEventsPosition = this.#MoveEvents.length - 1;
    }
    if (onMouseWheel) {
      this.#WheelEvents.push(onMouseWheel);
      this.wheelEventsPosition = this.#WheelEvents.length - 1;
    }
  }

  get down() { // don't care if move all around
    return this.#isMouseDown;
  }

  free() {
    this.#DownEvents = this.#DownEvents.filter((event, Index) => Index !== this.downEventsPosition);
    this.#UpEvents = this.#UpEvents.filter((event, Index) => Index !== this.upEventsPosition);
    this.#MoveEvents = this.#MoveEvents.filter((event, Index) => Index !== this.moveEventsPosition);
    this.#WheelEvents = this.#WheelEvents.filter((event, Index) => Index !== this.wheelEventsPosition);

    if (this.#DownEvents.length === 0 & this.#UpEvents.length === 0 && this.#MoveEvents.length === 0 && this.target) {
      this.target.removeEventListener('mousedown', this.#mouseDown, false);
      this.target.removeEventListener('mouseup', this.#mouseUp, false);
      this.target.removeEventListener('mousemove', this.#mouseMove, false);
      this.target.removeEventListener('wheel', this.#mouseMove, false);
    }
  }
}
