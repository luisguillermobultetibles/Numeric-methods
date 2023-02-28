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
class Keyboard {
    static #lastKeyCode;
    static #lastKey;
    static #UpDownstates = [];
    static #DownEvents = [];
    static #UpEvents = [];
    keyBACKSPACE = 8;
    keyTAB = 9;
    keyENTER = 13;
    keySHIFT = 16;
    keyCTRL = 17;
    keyALT = 18;
    keyPAUSE_BREAK = 19;
    keyCAPS_LOCK = 20;
    keyESCAPE = 27;
    keySPACE = 32;
    keyPAGE_UP = 33;
    keyPAGE_DOWN = 34;
    keyEND = 35;
    keyHOME = 36;
    keyLEFT_ARROW = 37;
    keyUP_ARROW = 38;
    keyRIGHT_ARROW = 39;
    keyDOWN_ARROW = 40;
    keyINSERT = 45;
    keyDELETE = 46;
    key0 = 48;
    key1 = 49;
    key2 = 50;
    key3 = 51;
    key4 = 52;
    key5 = 53;
    key6 = 54;
    key7 = 55;
    key8 = 56;
    key9 = 57;
    keya = 65;
    keyb = 66;
    keyc = 67;
    keyd = 68;
    keye = 69;
    keyf = 70;
    keyg = 71;
    keyh = 72;
    keyi = 73;
    keyj = 74;
    keyk = 75;
    keyl = 76;
    keym = 77;
    keyn = 78;
    keyo = 79;
    keyp = 80;
    keyq = 81;
    keyr = 82;
    keys = 83;
    keyt = 84;
    keyu = 85;
    keyv = 86;
    keyw = 87;
    keyx = 88;
    keyy = 89;
    keyz = 90;
    keyLET_WINDOW = 91;
    keyRIGHT_WINDOW = 92;
    keySELECT = 93;
    keyNUMPAD_0 = 96;
    keyNUMPAD_1 = 97;
    keyNUMPAD_2 = 98;
    keyNUMPAD_3 = 99;
    keyNUMPAD_4 = 100;
    keyNUMPAD_5 = 101;
    keyNUMPAD_6 = 102;
    keyNUMPAD_7 = 103;
    keyNUMPAD_8 = 104;
    keyNUMPAD_9 = 105;
    keyMULTIPLY = 106;
    keyADD = 107;
    keySUBTRACT = 109;
    keyDECIMAL_POINT = 110;
    keyDIVIDE = 111;
    keyF1 = 112;
    keyF2 = 113;
    keyF3 = 114;
    keyF4 = 115;
    keyF5 = 116;
    keyF6 = 117;
    keyF7 = 118;
    keyF8 = 119;
    keyF9 = 120;
    keyF10 = 121;
    keyF11 = 122;
    keyF12 = 123;
    keyNUM_LOCK = 144;
    keySCROLL_LOCK = 145;
    keySEMI_COLON = 186;
    keyEQUAL_SIGN = 187;
    keyCOMMA = 188;
    keyDASH = 189;
    keyPERIOD = 190;
    keyFORWARD_SLASH = 191;
    keyGRAVE_ACENT = 192;
    keyOPEN_BRACKET = 219;
    keyBACK_SLASH = 220;
    keyOPEN_BRACKET = 221;
    keySINGLE_QUOTE = 222;

    constructor(keyCode, onPressed, onReleased) {
        if (arguments.length === 1 && arguments[0] instanceof Array) {
            // Array of events
            arguments[0].forEach((attach) => new Keyboard(...attach));
        } else {
            // The normal
            if (Keyboard.#DownEvents.length === 0 && Keyboard.#UpEvents.length === 0) {
                window.addEventListener("keypress", Keyboard.#keyPress, false);
                window.addEventListener("keyup", Keyboard.#keyUpEvent, false);
                window.addEventListener("keydown", Keyboard.#keyDownEvent, false);
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
        let deco = e.keyCode ? e.keyCode : Keyboard.#lastKeyCode;
        Keyboard.#UpDownstates[deco] = true;
        if (Keyboard.#DownEvents[deco]) {
            Keyboard.#DownEvents[deco](e);
        }
    }

    static #keyUpEvent = (e) => {
        let deco = e.keyCode ? e.keyCode : Keyboard.#lastKeyCode;
        Keyboard.#UpDownstates[deco] = false;
        if (Keyboard.#UpEvents[deco]) {
            Keyboard.#UpEvents[deco](e);
        }
    }

    free() {
        if (this.onPressed) {
            Keyboard.#DownEvents = Keyboard.#DownEvents.filter((event, Index) => Index !== this.keyCode);
        }
        if (this.onReleased) {
            Keyboard.#DownEvents = Keyboard.#UpEvents.filter((event, Index) => Index !== this.keyCode);
        }
        if (Keyboard.#DownEvents.length === 0 && Keyboard.#UpEvents.length === 0) {
            window.removeEventListener("keypress", Keyboard.#keyPress);
            window.removeEventListener("keyup", Keyboard.#keyUpEvent);
            window.removeEventListener("keydown", Keyboard.#keyDownEvent);
        }
    }
}
