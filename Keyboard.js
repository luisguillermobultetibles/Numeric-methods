import {WebSystemObject} from "./WebSystemObject.js";
/*
   Clase para controlar el teclado...
   Usage (to attach key press and released):
       let teclado = new Keyboard(40, () => {
             Game.controls.down = true
       }, () => {
             Game.controls.down = false
       });
   or just key pressed:
       let teclado = new Keyboard(80, () => {
             Game.togglePause();
       });
   or multiples:
       let teclado = new Keyboard([[37, () => {Game.controls.left = true}, () => {Game.controls.left = false}],
                                   [38, () => {Game.controls.up = true}, () => {Game.controls.up = false}],
                                   [39, () => {Game.controls.right = true}, () => {Game.controls.right = false}],
                                   [40, () => {Game.controls.down = true}, () => {Game.controls.down = false}],
                                   [80, () => {Game.togglePause()}]]);
*/
export class Keyboard extends WebSystemObject {
    static #lastKeyCode;
    static #lastKey;
    static #UpDownstates = [];
    static #DownEvents = [];
    static #UpEvents = [];
    static #keyBACKSPACE = 8;
    static #keyTAB = 9;
    static #keyENTER = 13;
    static #keySHIFT = 16;
    static #keyCTRL = 17;
    static #keyALT = 18;
    static #keyPAUSE_BREAK = 19;
    static #keyCAPS_LOCK = 20;
    static #keyESCAPE = 27;
    static #keySPACE = 32;
    static #keyPAGE_UP = 33;
    static #keyPAGE_DOWN = 34;
    static #keyEND = 35;
    static #keyHOME = 36;
    static #keyLEFT_ARROW = 37;
    static #keyUP_ARROW = 38;
    static #keyRIGHT_ARROW = 39;
    static #keyDOWN_ARROW = 40;
    static #keyINSERT = 45;
    static #keyDELETE = 46;
    static #key0 = 48;
    static #key1 = 49;
    static #key2 = 50;
    static #key3 = 51;
    static #key4 = 52;
    static #key5 = 53;
    static #key6 = 54;
    static #key7 = 55;
    static #key8 = 56;
    static #key9 = 57;
    static #keya = 65;
    static #keyb = 66;
    static #keyc = 67;
    static #keyd = 68;
    static #keye = 69;
    static #keyf = 70;
    static #keyg = 71;
    static #keyh = 72;
    static #keyi = 73;
    static #keyj = 74;
    static #keyk = 75;
    static #keyl = 76;
    static #keym = 77;
    static #keyn = 78;
    static #keyo = 79;
    static #keyp = 80;
    static #keyq = 81;
    static #keyr = 82;
    static #keys = 83;
    static #keyt = 84;
    static #keyu = 85;
    static #keyv = 86;
    static #keyw = 87;
    static #keyx = 88;
    static #keyy = 89;
    static #keyz = 90;
    static #keyLET_WINDOW = 91;
    static #keyRIGHT_WINDOW = 92;
    static #keySELECT = 93;
    static #keyNUMPAD_0 = 96;
    static #keyNUMPAD_1 = 97;
    static #keyNUMPAD_2 = 98;
    static #keyNUMPAD_3 = 99;
    static #keyNUMPAD_4 = 100;
    static #keyNUMPAD_5 = 101;
    static #keyNUMPAD_6 = 102;
    static #keyNUMPAD_7 = 103;
    static #keyNUMPAD_8 = 104;
    static #keyNUMPAD_9 = 105;
    static #keyMULTIPLY = 106;
    static #keyADD = 107;
    static #keySUBTRACT = 109;
    static #keyDECIMAL_POINT = 110;
    static #keyDIVIDE = 111;
    static #keyF1 = 112;
    static #keyF2 = 113;
    static #keyF3 = 114;
    static #keyF4 = 115;
    static #keyF5 = 116;
    static #keyF6 = 117;
    static #keyF7 = 118;
    static #keyF8 = 119;
    static #keyF9 = 120;
    static #keyF10 = 121;
    static #keyF11 = 122;
    static #keyF12 = 123;
    static #keyNUM_LOCK = 144;
    static #keySCROLL_LOCK = 145;
    static #keySEMI_COLON = 186;
    static #keyEQUAL_SIGN = 187;
    static #keyCOMMA = 188;
    static #keyDASH = 189;
    static #keyPERIOD = 190;
    static #keyFORWARD_SLASH = 191;
    static #keyGRAVE_ACENT = 192;
    static #keyOPEN_BRACKET = 219;
    static #keyBACK_SLASH = 220;
    static #keyCLOSE_BRACKET = 221;
    static #keySINGLE_QUOTE = 222;

    constructor(keyCode, onPressed, onReleased) {
        if (arguments.length === 1 && arguments[0] instanceof Array) {
            // Array of events
            arguments[0].forEach((attach) => new Keyboard(...attach));
        } else {
            // The normal
            if (Keyboard.#DownEvents.length === 0 && Keyboard.#UpEvents.length === 0) {
                window.addEventListener('keypress', Keyboard.#keyPress, false);
                window.addEventListener('keyup', Keyboard.#keyUpEvent, false);
                window.addEventListener('keydown', Keyboard.#keyDownEvent, false);
            }
            this.keyCode = keyCode;
            this.onPressed = Object(onPressed);
            Keyboard.#DownEvents[this.keyCode] = this.onPressed;
            if (onReleased) {
                this.onReleased = Object(onReleased);
                Keyboard.#UpEvents[this.keyCode] = this.onReleased;
            }
        }
    }

    static #keyPress(e) {
        Keyboard.#lastKeyCode = e.keyCode;
        Keyboard.#lastKey = String.fromCharCode(Keyboard.#lastKeyCode);
    }

    static #keyDownEvent = (e) => {
        const deco = e.keyCode ? e.keyCode : Keyboard.#lastKeyCode;
        Keyboard.#UpDownstates[deco] = true;
        if (Keyboard.#DownEvents[deco]) {
            Keyboard.#DownEvents[deco](e);
        }
    };

    static #keyUpEvent = (e) => {
        const deco = e.keyCode ? e.keyCode : Keyboard.#lastKeyCode;
        Keyboard.#UpDownstates[deco] = false;
        if (Keyboard.#UpEvents[deco]) {
            Keyboard.#UpEvents[deco](e);
        }
    };

    free() {
        if (this.onPressed) {
            Keyboard.#DownEvents = Keyboard.#DownEvents.filter((event, Index) => Index !== this.keyCode);
        }
        if (this.onReleased) {
            Keyboard.#DownEvents = Keyboard.#UpEvents.filter((event, Index) => Index !== this.keyCode);
        }
        if (Keyboard.#DownEvents.length === 0 && Keyboard.#UpEvents.length === 0) {
            window.removeEventListener('keypress', Keyboard.#keyPress);
            window.removeEventListener('keyup', Keyboard.#keyUpEvent);
            window.removeEventListener('keydown', Keyboard.#keyDownEvent);
        }
    }
}
