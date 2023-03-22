import {WebSystemObject} from './WebSystemObject.js';

// Clase para controlar los toques en pantallas táctiles ...
export class Touches extends WebSystemObject {
  static #isFingerDown = false;
  static x = 0;
  static y = 0;
  static count = 0;

  static #DownEvents = [];
  static #UpEvents = [];
  static #MoveEvents = [];

  static #TouchDown(e) {
    Touches.count++;
    if (Touches.#isFingerDown) {
      console.log(`${Touches.count} toque de pantalla con otro dedo...`);
    }
    Touches.#isFingerDown = true;
    document.title = `Dedo abajo ${e}: estado actual ${Touches.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    document.body.style.cursor = 'grabbing';
    Touches.#DownEvents.forEach((event) => event(e));
  };

  static #TouchUp(e) {
    if (!Touches.#isFingerDown || Touches.count === 0) {
      console.log(`Toque no contabilizado, (se juntaron los dedos o vino desde otra ventana).`);
    } else {
      console.log(`Fin del toque de pantalla ${Touches.count}.`);
    }
    Touches.#isFingerDown = false;
    Touches.count > 0 ? Touches.count-- : Touches.count = 0;
    document.title = `Dedo arriba ${e}: estado actual ${Touches.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    document.body.style.cursor = 'grab';
    Touches.#UpEvents.forEach((event) => event(e));
  };

  static #TouchMove(e) {
    Touches.x = e.clientX;
    Touches.y = e.clientY;
    document.title = `Dedo moviéndose ${e}: estado actual ${Touches.#isFingerDown ? 'abajo' : 'arriba'} en (${Touches.x}, ${Touches.y}).`;
    Touches.#MoveEvents.forEach((event) => event(e));
  };


  constructor(onTouchDown, onTouchMove, onTouchUp) {
    super();
    if (Touches.#DownEvents.length === 0 && Touches.#UpEvents.length === 0 && Touches.#MoveEvents.length === 0) {
      window.addEventListener('touchstart', Touches.#TouchDown, false);
      window.addEventListener('touchmove', Touches.#TouchMove, false);
      window.addEventListener('touchend', Touches.#TouchUp, false);
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
  }

  get down() { // don't care if move all around
    return Touches.#isFingerDown;
  }

  free() {
    Touches.#DownEvents = Touches.#DownEvents.filter((event, Index) => Index !== this.downEventsPosition);
    Touches.#UpEvents = Touches.#UpEvents.filter((event, Index) => Index !== this.upEventsPosition);
    Touches.#MoveEvents = Touches.#MoveEvents.filter((event, Index) => Index !== this.moveEventsPosition);

    if (Touches.#DownEvents.length === 0 & Touches.#UpEvents.length === 0 && Touches.#MoveEvents.length === 0) {
      window.removeEventListener('touchstart', Touches.#TouchDown, false);
      window.removeEventListener('touchend', Touches.#TouchUp, false);
      window.removeEventListener('touchmove', Touches.#TouchMove, false);
    }
  }
}

