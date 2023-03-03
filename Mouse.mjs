import {WebSystemObject} from "./system/WebSystemObject.mjs";

// Clase para controlar el ratón...
export class Mouse extends WebSystemObject {
    static #isMouseDown = false;
    static x = 0;
    static y = 0;

    static #DownEvents = [];
    static #UpEvents = [];
    static #MoveEvents = [];
    static #WheelEvents = [];

    static #mouseDown(e) {
        Mouse.#isMouseDown = true;
        document.title = `Mouse abajo ${e}: estado ${Mouse.#isMouseDown ? 'abajo' : 'arriba'} en (${Mouse.x}, ${Mouse.y}).`;
        Mouse.#DownEvents.forEach((event) => event(e));
    };

    static #mouseUp(e) {
        Mouse.#isMouseDown = false;
        document.title = `Mouse arriba ${e}: estado ${Mouse.#isMouseDown ? 'abajo' : 'arriba'} en (${Mouse.x}, ${Mouse.y}).`;
        Mouse.#UpEvents.forEach((event) => event(e));
    };

    static #mouseMove(e) {
        Mouse.x = e.clientX;
        Mouse.y = e.clientY;
        document.title = `Mouse moviéndose ${e}: estado ${Mouse.#isMouseDown ? 'abajo' : 'arriba'} en (${Mouse.x}, ${Mouse.y}).`;
        Mouse.#MoveEvents.forEach((event) => event(e));
    };

    static #mouseWheel(e) {
        Mouse.x = e.clientX;
        Mouse.y = e.clientY;
        document.title = `Mouse scroll ${e}: estado ${Mouse.#isMouseDown ? 'abajo' : 'arriba'} en (${Mouse.x}, ${Mouse.y}).`;
        Mouse.#WheelEvents.forEach((event) => event(e));
    };

    constructor(onMouseDown, onMouseMove, onMouseUp, onMouseWheel) {
        super();
        if (Mouse.#DownEvents.length === 0 && Mouse.#UpEvents.length === 0 && Mouse.#MoveEvents.length === 0) {
            window.addEventListener('mousedown', Mouse.#mouseDown, false);
            window.addEventListener('mouseup', Mouse.#mouseUp, false);
            window.addEventListener('mousemove', Mouse.#mouseMove, false);
            window.addEventListener('wheel', Mouse.#mouseWheel, false);
            /*
                      Revisar los eventos: "touchstart" y "touchend".

             */
        }
        this.downEventsPosition = -1;
        this.upEventsPosition = -1;
        this.moveEventsPosition = -1;
        if (onMouseDown) {
            Mouse.#DownEvents.push(onMouseDown);
            this.downEventsPosition = Mouse.#DownEvents.length - 1;
        }
        if (onMouseUp) {
            Mouse.#UpEvents.push(onMouseUp);
            this.upEventsPosition = Mouse.#UpEvents.length - 1;
        }
        if (onMouseMove) {
            Mouse.#MoveEvents.push(onMouseMove);
            this.moveEventsPosition = Mouse.#MoveEvents.length - 1;
        }
        if (onMouseWheel) {
            Mouse.#WheelEvents.push(onMouseWheel);
            this.wheelEventsPosition = Mouse.#WheelEvents.length - 1;
        }
    }

    get down() { // don't care if move all around
        return Mouse.#isMouseDown;
    }

    free() {
        Mouse.#DownEvents = Mouse.#DownEvents.filter((event, Index) => Index !== this.downEventsPosition);
        Mouse.#UpEvents = Mouse.#UpEvents.filter((event, Index) => Index !== this.upEventsPosition);
        Mouse.#MoveEvents = Mouse.#MoveEvents.filter((event, Index) => Index !== this.moveEventsPosition);
        Mouse.#WheelEvents = Mouse.#WheelEvents.filter((event, Index) => Index !== this.wheelEventsPosition);

        if (Mouse.#DownEvents.length === 0 & Mouse.#UpEvents.length === 0 && Mouse.#MoveEvents.length === 0) {
            window.removeEventListener('mousedown', Mouse.#mouseDown, false);
            window.removeEventListener('mouseup', Mouse.#mouseUp, false);
            window.removeEventListener('mousemove', Mouse.#mouseMove, false);
            window.removeEventListener('wheel', Mouse.#mouseMove, false);
        }
    }
}
