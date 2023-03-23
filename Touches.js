import {WebSystemObject} from './WebSystemObject.js';

// Clase para controlar los toques en pantallas táctiles ...
export class Touches extends WebSystemObject {
  #isFingerDown = false;
  #ongoingTouches = [];
  #tpCache = [];
  target = window;
  static x = 0;
  static y = 0;
  static count = 0;

  static #DownEvents = [];
  static #UpEvents = [];
  static #MoveEvents = [];
  static #CancelEvents = [];

  static #TouchDown(ev) {
    Touches.count++;
    if (this.#isFingerDown) {
      console.log(`${Touches.count} toque de pantalla con otro dedo...`);
    }
    this.#isFingerDown = true;
    document.title = `Dedo abajo ${ev}: estado actual ${this.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    document.body.style.cursor = 'grabbing';
    ev.changedTouches((touch) => {
      Touches.#DownEvents.forEach((event) => event(touch));
    });
  };

  static #TouchUp(ev) {
    if (!this.#isFingerDown || Touches.count === 0) {
      console.log(`Toque no contabilizado, (se juntaron los dedos o vino desde otra ventana).`);
    } else {
      console.log(`Fin del toque de pantalla ${Touches.count}.`);
    }
    this.#isFingerDown = false;
    Touches.count > 0 ? Touches.count-- : Touches.count = 0;
    document.title = `Dedo arriba ${ev}: estado actual ${this.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    document.body.style.cursor = 'grab';
    ev.changedTouches((touch) => {
      Touches.#UpEvents.forEach((event) => event(touch));
    });
  };

  static #TouchMove(ev) {
    Touches.x = ev.clientX;
    Touches.y = ev.clientY;
    document.title = `Dedo moviéndose ${ev}: estado actual ${this.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    ev.changedTouches((touch) => {
      Touches.#MoveEvents.forEach((event) => event(touch));
    });
  };

  static #TouchCancel(ev) {
    document.title = `Cancelando el touch.`;
    ev.touches;
    ev.changedTouches((touch) => {
      Touches.#CancelEvents.forEach((event) => event(touch));
    });
  };


  constructor(onTouchDown, onTouchMove, onTouchUp, onTouchCancel, target = window) {
    super();
    this.target = target;
    if (Touches.#DownEvents.length === 0 && Touches.#UpEvents.length === 0 && Touches.#MoveEvents.length === 0 && this.target) {
      this.target.addEventListener('touchstart', Touches.#TouchDown, false);
      this.target.addEventListener('touchmove', Touches.#TouchMove, false);
      this.target.addEventListener('touchend', Touches.#TouchUp, false);
      this.target.addEventListener('touchcancel', Touches.#TouchCancel, false);

    }
    this.downEventsPosition = -1;
    this.upEventsPosition = -1;
    this.moveEventsPosition = -1;
    if (onTouchDown) {
      Touches.#DownEvents.push(onTouchDown);
      this.downEventsPosition = Touches.#DownEvents.length - 1;
    }
    if (onTouchMove) {
      Touches.#MoveEvents.push(onTouchMove);
      this.moveEventsPosition = Touches.#MoveEvents.length - 1;
    }
    if (onTouchUp) {
      Touches.#UpEvents.push(onTouchUp);
      this.upEventsPosition = Touches.#UpEvents.length - 1;
    }
    if (onTouchCancel) {
      Touches.#UpEvents.push(onTouchUp);
      this.upEventsPosition = Touches.#UpEvents.length - 1;
    }
  }

  get down() { // don't care if move all around
    return this.#isFingerDown;
  }

  free() {
    Touches.#DownEvents = Touches.#DownEvents.filter((event, Index) => Index !== this.downEventsPosition);
    Touches.#UpEvents = Touches.#UpEvents.filter((event, Index) => Index !== this.upEventsPosition);
    Touches.#MoveEvents = Touches.#MoveEvents.filter((event, Index) => Index !== this.moveEventsPosition);

    if (Touches.#DownEvents.length === 0 & Touches.#UpEvents.length === 0 && Touches.#MoveEvents.length === 0 && this.target) {
      this.target.removeEventListener('touchstart', Touches.#TouchDown, false);
      this.target.removeEventListener('touchend', Touches.#TouchUp, false);
      this.target.removeEventListener('touchmove', Touches.#TouchMove, false);
    }
  }

}

