import {WebSystemObject} from "./WebSystemObject.mjs";

export class Autonumeric extends WebSystemObject {
    static #globalId = 0;

    constructor(lastPrevious = Autonumeric.#globalId, optimize = true, global = false) {
        super();
        this.global = global;
        this.optimize = optimize;
        this.lastPrevious = lastPrevious.map(x => Number(x));
    }

    get value() {

        // Función para generar un autonumérico a partir de un arreglo de id's.
        function autonum(array) {
            // Javascript program to find the smallest elements missing in a sorted array.
            function firstHole(array, start = 0, end = array.length - 1) {
                if (start > end) return end + 1;
                if (start !== array[start]) return start;
                let mid = Math.trunc((start + end) / 2);
                // Left half has all elements from 0 to mid
                if (array[mid] === mid) return firstHole(array, mid + 1, end);
                return firstHole(array, start, mid);
            }

            return firstHole(array.sort((a, b) => a - b));
        }

        let resultado;
        if (this.lastPrevious instanceof Array) {
            if (this.optimize) {
                resultado = autonum(this.lastPrevious);
            } else {
                resultado = Math.max(...this.lastPrevious) + 1;
            }
            this.lastPrevious.push(resultado);
        } else {
            resultado = this.lastPrevious++;
        }
        if (this.global) {
            Autonumeric.#globalId = resultado;
        }
        return resultado;
    }

    set value(v) {
        if (this.lastPrevious instanceof Array) {
            this.lastPrevious.push(v);
        } else {
            this.lastPrevious = v;
        }
        if (this.global) {
            Autonumeric.#globalId = v;
        }
    }
}

