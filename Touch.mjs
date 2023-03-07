import {WebSystemObject} from "./WebSystemObject.mjs";

// Clase para controlar los toques en la pantalla ...
export class Touch extends WebSystemObject {
    static #isFingerDown = false;
    static x = 0;
    static y = 0;

    static #DownEvents = [];
    static #UpEvents = [];
    static #MoveEvents = [];

    static #TouchDown(e) {
        Touch.#isFingerDown = true;
        document.title = `Dedo abajo ${e}: estado ${Touch.#isFingerDown ? 'abajo' : 'arriba'} en (${Touch.x}, ${Touch.y}).`;
        document.body.style.cursor = 'grabbing';
        Touch.#DownEvents.forEach((event) => event(e));
    };

    static #TouchUp(e) {
        Touch.#isFingerDown = false;
        document.title = `Dedo arriba ${e}: estado ${Touch.#isFingerDown ? 'abajo' : 'arriba'} en (${Touch.x}, ${Touch.y}).`;
        document.body.style.cursor = 'grab';
        Touch.#UpEvents.forEach((event) => event(e));
    };

    static #TouchMove(e) {
        Touch.x = e.clientX;
        Touch.y = e.clientY;
        document.title = `Dedo moviéndose ${e}: estado ${Touch.#isFingerDown ? 'abajo' : 'arriba'} en (${Touch.x}, ${Touch.y}).`;
        Touch.#MoveEvents.forEach((event) => event(e));
    };


    constructor(onTouchDown, onTouchMove, onTouchUp, onTouchWheel) {
        super();
        if (Touch.#DownEvents.length === 0 && Touch.#UpEvents.length === 0 && Touch.#MoveEvents.length === 0) {
            window.addEventListener('touchstart', Touch.#TouchDown, false);
            window.addEventListener('touchend', Touch.#TouchUp, false);
            window.addEventListener('touchmove', Touch.#TouchMove, false);
        }
        this.downEventsPosition = -1;
        this.upEventsPosition = -1;
        this.moveEventsPosition = -1;
        if (onTouchDown) {
            Touch.#DownEvents.push(onTouchDown);
            this.downEventsPosition = Touch.#DownEvents.length - 1;
        }
        if (onTouchUp) {
            Touch.#UpEvents.push(onTouchUp);
            this.upEventsPosition = Touch.#UpEvents.length - 1;
        }
        if (onTouchMove) {
            Touch.#MoveEvents.push(onTouchMove);
            this.moveEventsPosition = Touch.#MoveEvents.length - 1;
        }
        if (onTouchWheel) {
            Touch.#WheelEvents.push(onTouchWheel);
            this.wheelEventsPosition = Touch.#WheelEvents.length - 1;
        }
    }

    get down() { // don't care if move all around
        return Touch.#isFingerDown;
    }

    free() {
        Touch.#DownEvents = Touch.#DownEvents.filter((event, Index) => Index !== this.downEventsPosition);
        Touch.#UpEvents = Touch.#UpEvents.filter((event, Index) => Index !== this.upEventsPosition);
        Touch.#MoveEvents = Touch.#MoveEvents.filter((event, Index) => Index !== this.moveEventsPosition);

        if (Touch.#DownEvents.length === 0 & Touch.#UpEvents.length === 0 && Touch.#MoveEvents.length === 0) {
            window.removeEventListener('touchstart', Touch.#TouchDown, false);
            window.removeEventListener('touchend', Touch.#TouchUp, false);
            window.removeEventListener('touchmove', Touch.#TouchMove, false);
        }
    }
}

