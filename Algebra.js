// Some abstract Algebra
class SubSpace extends WebSystemObject {
    static #Continuous = class extends SubSpace { // Pass throw class, implemented abstraction
        constructor(metric, base = new CanonicalBase(3), elements = []) {
            super();
        }
    }
    static #DisContinuous = class extends SubSpace { // Pass throw class, implemented abstraction
        constructor(metric, base = new CanonicalBase(3), elements = []) {
            super();
        }
    }
    static #Euclidean = class extends SubSpace.#Continuous { // Pass throw class, implemented abstraction
        constructor(metric, base = new CanonicalBase(3), elements = []) {
            super();
        }
    }
    static #Riemann = class extends SubSpace.#DisContinuous { // Pass throw class, implemented abstraction
        constructor(metric, base = new CanonicalBase(3), elements = []) {
            super();
        }
    }
    // Una superficie o parte de una hiperesfera
    static Surface = class extends SubSpace.#Euclidean {
        constructor() {
            super();
        }
    }
    // El contenido o parte de una bola
    static Wall = class extends SubSpace.#Euclidean {
        constructor() {
            super();
        }
    }
    static Rare = class extends SubSpace.#Riemann {
        constructor() {
            super();
        }
    }
    // We have a lot's of work, just implement...

    // I'm working in... esto representa un variedad geométrica.
    static VectorialSpace = class extends SubSpace {
        constructor(metric, base = new CanonicalBase(3), elements = []) {
            super();
            this.base = [].concat(base);
            if (!metric) { // Métrica (o norma) euclidiana si no se especifica alguna otra.
                this.metric = (p1, p2) => {
                    let result = 0;
                    for (let i = 0; i < Math.min(p1.dimmensions.length, p2.dimmensions.length); i++) {
                        result += Math.pow(p1.dimmensions[i] - p2.dimmensions[i], 2);
                    }
                    return Math.sqrt(result);
                }
            } else {
                this.metric = metric;
            }
            this.elements = [].concat(elements); // Algunos elementos del espacio al que se refiere.
        }
    }
    volume() {

    }
    dimmensions() {

    }
    area() {

    }
    distance() {

    }
    reachableFrom() {

    }
}
