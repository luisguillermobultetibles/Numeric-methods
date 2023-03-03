import {WebSystemObject} from "./system/WebSystemObject.mjs";

/*
Para representar un subconjunto numérico real, según la teoría matemática de conjuntos (incluye intervalos abiertos y/o cerrados), en matemática:
Intervalos abiertos (a, b) desde a hasta b sin incluirlos, utiliza los símbolos "(" y ")".
Intervalos cerrados [a, b] desde a hasta b incluyéndolos, utiliza los símbolos "[" y "]".
Intervalos semiabiertos o semi cerrados (a, b]  o [a, b) desde a hasta b, con o sin inclusión, utilizan los símbolos "(", ")", "[" y "]".
Rayos (-∞, a) o (-∞, a] desde -∞ hasta a, incluyéndolo o no a a.
Rayos (b, +∞) o [b, +∞) desde b hasta +∞, incluyéndolo o no a b.
Por convenio los rayos no incluyen las infinitudes +∞ y -∞, pues son elementos abstractos.
Línea de los reales (-∞, +∞) to do el dominio de los reales.
Para representar un elemento discreto como intervalo se utiliza x.
Para representar un conjunto vacío [], o bien [a, a], [b, b] e incluso [a, b] cuando a = b.

Para vectorizar esos casos utilizamos una notación de intervalos con dos variables, que son arreglos de intervalos o elementos, donde el
primer elemento es el extremo izquiero y el segundo es el extremo derecho del intervalo, estos extremos no están incluidos en el intervalo
pues el mismo es abierto. Con intervalos abiertos y puntos discretos podemos definir cualquier conjunto numérico básico.
Desde luego que se deben implementar optimizaciónes acorde a la teoría de conjuntos para eliminar posibles redundancias a la hora de definirlos.

Notación

Conjunto                Vectorización              Explicación
---------------------------------------------------------------------------------------------------------------------------------------
(a, b)                  [[a, b]]                   Intervalo abierto con origen en a y fin en b (sin incluirlos).
[a, b]                  [[a, b], a , b]            Íntervalo cerrado con origen en a y fin en b (incluyéndolos).
(a, b]                  [[a, b], b]                Intervalo semiaberto (semicerrado) con origen en a y fin en b, incluye a b y no a a
[a, b)                  [[a, b], a]                Intervalo semiaberto (semicerrado) con origen en a y fin en b, incluye a a y no a b
(-∞, a)                 [[-Infinity, a]]           Rayo con fin en a sin incluirlo.
(-∞, a]                 [[-Infinity, a], a]        Rayo con fin en a incluyéndolo.
(b, +∞)                 [[b, +Infinity]]           Rayo con origen en b sin incluirlo.
[b, +∞)                 [[b, +Infinity], b]        Rayo con origen en b incluyéndolo.
(-∞, +∞)                [-Infinity, +Infinity]     Dominio real, es el valor por defecto si no se especifica ninguna inclusión.
{a}                     [a]                        Conjunto unitario a.
{a, b}                  [a, b]                     Conjunto de a y b (par no ordenado).
{a, b}                  [a, b]                     Ídem. notación simplificada.


Ejemplos:

let ri = new RealInterval([[-1, 2]]); // Es el subconjunto abierto (1, 2)

let dominio = new NumericDomain([[1, 2], -2, -3])

*/

export class NumericSet extends WebSystemObject {
    constructor(definition) { // Array of elements (elements, or open sub sets)
        super();
        this.elements = []; // Almacenará la lista de elementos e intervalos
        if (arguments.length > 1) {
            definition = arguments;
        }
        if (definition instanceof Array) {
            definition.forEach((element) => this.include(element)); // do it in this way
        } else {
            this.asString = definition;
        }
        this.sort();
    }

    // Conjunto como literal
    get asString() {
        let addIntervals = () => {
            return [...this.elements.map((element) => {
                let par = element.join(', ');
                if (this.isAnInterval(element)) {
                    if (this.isAnEscalar(element[0])) {
                        par = '[' + par;
                    } else {
                        par = '(' + par;
                    }
                    if (this.isAnEscalar(element[1])) {
                        par = par + ']';
                    } else {
                        par = par + ')';
                    }
                }
                return par;
            })].split(' U ');
        }

        if (this.elements.some((p) => this.isAnEscalar(p))) {
            if (this.elements.some((p) => this.isAnInterval(p))) { // ambos
                return '{' + this.elements.map((element) => this.isAnEscalar(element)).join(', ') + '} U ' + addIntervals();
            } else { // solamente escalares
                return '{' + this.elements.join(', ') + '}';
            }
        } else { // solamente intervalos
            return addIntervals();
        }
    }

    set asString(value) {
        this.elements = [];
        if (!value) {
            return;
        }
        const impersonal = String(value).replaceAll(' ', '').replaceAll('U', '!');
        const elementos = impersonal.split('!');
        elementos.forEach((elemento) => {
            if (elemento.length > 0) {
                let leftClosed = true;
                let rightClosed = true;
                let interval = false;
                if (elemento === 'R') {
                    elemento = '(-Infinity, +Infinity)';
                }
                if (elemento.substring(0, 1) === '[') {
                    elemento = elemento.replaceAll('[', '');
                    interval = true;
                } else if (elemento.substring(0, 1) === '(') {
                    elemento = elemento.replaceAll('(', '');
                    leftClosed = false;
                    interval = true;
                }
                if (elemento.substring(elemento.length - 1, elemento.length) === ']') {
                    elemento = elemento.replaceAll(']', '');
                    interval = true;
                } else if (elemento.substring(elemento.length - 1, elemento.length) === ')') {
                    elemento = elemento.replaceAll(')', '');
                    rightClosed = false;
                    interval = true;
                }

                let subNumber = (y) => {
                    switch (y) {
                        case 'Infinity':
                        case '+Infinity':
                        case '∞':
                        case '+∞':
                            return Infinity;
                        case '-Infinity':
                        case '-∞':
                            return -Infinity;
                        default:
                            return Number(y);
                    }
                }

                if (interval) {
                    const extremes = elemento.split(',').map((x) => subNumber(x));
                    this.include(extremes);
                    if (leftClosed) {
                        this.include(extremes[0]);
                    }
                    if (rightClosed) {
                        this.include(extremes[1]);
                    }
                } else {
                    if (elemento.substring(0, 1) === '{' && elemento.substring(elemento.length - 1, elemento.length) === '}') {
                        elemento = elemento.replace('{', '').replace('}', '');
                        this.elements = [].concat(elemento.split(',').map((x) => subNumber(x)));
                    } else {
                        throw new Error(`The set "${elemento}", is ambiguous or bad defined.`);
                    }
                }
            }
        });
    }

    isAnInterval(a) {
        return a instanceof Array;
    }

    isAnEscalar(a) {
        return !this.isAnInterval(a);
    }

    sort() { // Revisar, es el que falla no optimiza cuando se re-introduce 1.5 en el demo...
        this.elements = this.elements.sort((a, b) => {
            const isna = this.isAnEscalar(a);
            const isnb = this.isAnEscalar(b);
            if (isna && isnb) {
                return a - b;
            } else if (isna && !isnb) {
                return a - b[1];
            } else if (!isna && isnb) {
                return a[1] - b;
            } else if (!isna && !isnb) {
                return a[1] - b[1];
            }
        });
        // if 3 online, makes an absorption, done
        for (let i = this.elements.length - 1; i > 1; i--) {
            if (this.isAnInterval(this.elements[i]) && this.isAnEscalar(this.elements[i - 1]) && this.isAnInterval(this.elements[i - 2])) {
                if (this.elements[i][0] === this.elements[i - 1] && this.elements[i - 1] === this.elements[i - 2][1]) {
                    this.elements[i - 2][1] = this.elements[i][1];
                    this.elements.splice(i - 1, 2);
                    i--;
                }
            }
        }
    }

    isEmpty(a) {
        return (a instanceof Array && ((a.length === 0) || (a[0] === a[1])));
    }

    // notaciones simplificadas, to do revisar para elementos simples y conjuntos de...
    normalization(a) {
        if (this.isEmpty(a)) {
            return [];
        } else if (!(a instanceof Array)) {
            return a;
        } else if ((a instanceof Array) && a.length === 2 && !(a[0] instanceof Array) && !(a[1] instanceof Array)) {
            if (a[0] > a[1]) {
                [a[1], a[0]] = [a[0], a[1]];
            }
            return [a[0], a[1]];
        } else {
            const result = [];
            a.forEach((element) => {
                result.push(this.normalization(element));
            });
            return result;
        }
    }

    // Puede usarse indistintamente para inclusión o pertenencia
    isIncluded(a) {
        const isna = !(a instanceof Array);
        return this.elements.some((b) => {
            const isnb = !(b instanceof Array);
            if (isna && isnb) {
                return a === b;
            } else if (isna && !isnb) {
                return a > b[0] && a < b[1];
            } else if (!isna && isnb) {
                return this.isEmpty(a);
            } else if (!isna && !isnb) {
                return (a[0] > b[0]) && (a[1] < b[1]);
            }
        });
    }

    // just one element or escalar
    include(x) {
        x = this.normalization(x);
        if (!this.elements.some((element) => {
            return this.isAnInterval(element) && x > element[0] && x < element[1];
        })) {
            if (!(x instanceof Array)) {
                this.elements.push(x);
            } else {
                this.elements.push([x[0], x[1]]);
            }
            this.sort();
        }
    }

    // begin of bug (ideas key just to overload if you wish extend Set javascript class)
    has(x) {
        return this.include(x);
    }

    clear() {
        this.elements = [];
    }

    size() {
        return this.elements.length;
    }

    // end of bug

    add(x) {
        this.include(x);
    }

    delete(x) {
        this.exclude(x);
    }

    areEquals(a) {
        const tmp = new NumericSet(a);
        return this.elements.every((element) => tmp.isIncluded(element)) && tmp.elements.every((element) => this.isIncluded(element));
    }

    areInside(a) {
        const tmp = new NumericSet(a);
        return this.elements.every((element) => tmp.isIncluded(element));
    }

    areOutSide(a) {
        const tmp = new NumericSet(a);
        return tmp.elements.every((element) => this.isIncluded(element));
    }

    areIsolated(a) {
        const tmp = new NumericSet(a);
        return this.elements.every((element) => !tmp.isIncluded(element)) && tmp.elements.every((element) => !this.isIncluded(element));
    }

    // extras valor añadido

    areCrossed(a) {
        const tmp = new NumericSet(a);
        return !this.elements.areIsolated(a);
    }

    exclude(a) {
        a = this.normalization(a);
        const isToExcludeEscalar = this.isAnEscalar(a);
        const result = [];
        this.elements.forEach((b) => {
            const isActualEscalar = this.isAnEscalar(b);
            if (isToExcludeEscalar && isActualEscalar) {
                if (a !== b) {
                    result.push(b);
                }
            } else if (isToExcludeEscalar && !isActualEscalar) {
                if (a > b[0] && a < b[1]) {
                    result.push([b[0], a]);
                    result.push([a, b[1]]);
                }
            } else if (!isToExcludeEscalar && isActualEscalar) {
                if ((b < a[0] && b > a[1])) {
                    result.push(b);
                }
            } else if (!isToExcludeEscalar && !isActualEscalar) {
                if (a[0] < b[0] && a[1] < b[1] && a[1] > b[0]) {
                    result.push([a[1], b[1]]);
                    result.push(a[1]);
                } else if (a[0] > b[0] && a[1] > b[1] && a[0] < b[1]) {
                    result.push([b[0], a[0]]);
                    result.push(b[0]);
                } else if (a[0] > b[0] && a[1] < b[1]) {
                    result.push([a[0], b[0]]);
                    result.push([a[1], b[1]]);
                    result.concat([a[0], b[1]]);
                } else if (a[0] !== b[0] && a[1] !== b[1]) {
                    result.push(b);
                }
            }
        });
        this.elements = result;
        this.sort();
    }

    // Cálculo de la cantidad de clases de un arreglo numérico
    classes() {
        const groupedArray = this.elements.reduce((previous, current) => {
            if (!previous[current]) {
                previous[current] = [];
            }
            previous[current].push(current);
            return previous;
        }, []).filter((element) => element != null);
        return groupedArray.length;
    }

    // fix include ranges and infinity ranges...
    total() {
        let sum = 0;
        this.elements.filter((element) => this.isAnEscalar(element)).forEach((x) => sum += x);
    }

    // Calculo de la entropía de un arreglo numérico
    enthropy() {
        const groupedArray = this.elements.reduce((previous, current) => {
            if (!previous[current]) {
                previous[current] = [];
            }
            previous[current].push(current);
            return previous;
        }, []).filter((element) => element != null);
        const probabilities = [];
        groupedArray.forEach((element) => {
            probabilities.push({
                element: [element[0]], probability: element.length / this.elements.length,
            });
        });
        let result = 0;
        probabilities.forEach((element) => {
            result = element.probability * Math.log(element.probability);
        });
        return result;
    }

    // Útil para sumset... NOT TESTED

    // Soluciones básicas la capacidad expresada en forma de combinación lineal de pesos (suma diofántica).
    sumset(capacity, strategy = 'scholar') {
        // divisibilidad de a por b
        function divisibilidad(a, b) {
            // this trivials checks avoids div. by zero (se supone que cero no divide a ninguno),
            // ni siquiera a cero, pues 0/0 puede ser un valor finito... pero indeterminado.
            if (!b) {
                return false;
            }
            // Es divisible si el resto de la división es cero
            return a % b === 0;
        }

        // This is my original code... (devuelve el mcd entre a y b)
        // el mcd divide a ambos, pero lo mas importante: mcd * mcm = a * b
        function euclides(b, a) {
            // this trivials checks avoids div. by zero.
            if (!a) {
                if (!b) {
                    return null;
                } else {
                    return b;
                }
            } else if (!b) {
                if (!a) {
                    return null;
                } else {
                    return a;
                }
            }
            if ((a === 1) || (b === 1)) {
                return 1;
            }
            // this is Euclides alg.
            let result = b;
            while (!!a) {
                b = result;
                result = a;
                a = b % a;
            }
            return result;
        }

        // mínimo común múltiplo
        function mcm(a, b) {
            // this trivials checks avoids div. by zero.
            if (!a || !b) {
                return 0;
            }
            if (a === 1) {
                return b;
            } else if (b === 1) {
                return a;
            }
            // fundamental prop. of mcd.
            return (a * b) / euclides(a, b);
        }

        // calcula el mcd de to do el array
        function arrayEuclides(a) {
            if (a.length === 0) {
                return null;
            }
            let mc = a[0];
            for (let i = 1; i < a.length; i++) {
                mc = euclides(mc, a[i]);
            }
            return mc;
        }

        function multiplicarArray(a, e) {
            for (let i = 0; i < a.length; i++) {
                a[i] = a[i] * e;
            }
            return a;
        }

        function divisibilidadArray(a, f) {
            for (let i = 0; i < a.length; i++) {
                if (!divisibilidad(a[i], f)) {
                    return false;
                }
            }
            return true;
        }

        // resuelve una ecuación diofántica lineal., encontrar [a, b] tal que ax + by = z
        function diofanticaLineal(x, y, z) {
            // encuentra [s, t, r] tal que as + bt = d, donde d = mcd(a, b).
            function euclidesExtendido(a, b) {
                const q = [];
                const r = [];
                const s = [];
                const t = [];
                let i;
                r[0] = a;
                s[0] = 1;
                t[0] = 0;
                r[1] = b;
                s[1] = 0;
                t[1] = 1;
                i = 1;
                while (!!r[i]) {
                    q[i] = Math.trunc(r[i - 1] / r[i]);
                    r[i + 1] = r[i - 1] % r[i];
                    s[i + 1] = s[i - 1] - q[i] * s[i];
                    t[i + 1] = t[i - 1] - q[i] * t[i];
                    i++;
                }
                return [s[i - 1], t[i - 1], r[i - 1]];
            }

            // Primero se chequea si la ecuación diofántica lineal tiene solución : mcd(x, y) / z ?
            const mcd = euclides(x, y);
            if (!divisibilidad(z, mcd)) {
                return []; // NTS (Bezout condition)
            }
            const q = euclidesExtendido(x, y);
            const a = q[0] * z / mcd;
            const b = q[1] * z / mcd;
            // console.log(`${a} * ${x} + ${b} * ${y} = ${z}`);
            return [a, b];
        }

        // Reportar la solución
        function solution(s) {
            if (!strategy) {
                strategy = 'productive';
            }
            switch (strategy) {
                case 'scholar': {
                    if (!s) {
                        return 'NTS';
                    } else if (s instanceof Array) {
                        switch (s.length) {
                            case 0:
                                return 'NTS';
                            case 1:
                                return `${s[0][0]} * ${s[0][1]}`;
                            case 2:
                                return `${s[0][0]} * ${s[0][1]} + ${s[1][0]} * ${s[1][1]}`;
                        }
                    }
                    break;
                }
                case 'productive': {
                    if (!s) {
                        return [];
                    } else if (s instanceof Array) {
                        switch (s.length) {
                            case 0:
                                return [];
                            case 1:
                                return [{coeff: s[0][0], term: s[0][1]}];
                            case 2:
                                return [{coeff: s[0][0], term: s[0][1]}, {
                                    coeff: s[1][0], term: s[1][1],
                                }];
                        }
                    }
                    break;
                }
                case 'development':
                    return s;
            }
        }

        // Se descartan los errores imperdonables y las soluciones evidentes...
        if (this.elements.length === 0) {
            return solution();
        }
        const c = capacity;
        let w = [].concat(this.elements);

        const results = [];

        // Solución trivial, se toma cero por el primero...
        if (!c) {
            return solution([[0, w[0]]]);
        }

        // se eliminan los ceros, nulos y los duplicados...
        w = w.filter((element) => !!element).filter((item, index) => {
            return w.indexOf(item) === index;
        });

        // Si existe algún divisor: ¿Existen elementos en proporción directa con la capacidad?
        const divisores = w.filter((element) => capacity % element === 0);
        if (divisores.length > 0) {
            return solution([[divisores[0], capacity / divisores[0]]]);
        }

        // Before the brutal core...
        const mcd = arrayEuclides(this.elements);
        if (!divisibilidad(capacity, mcd)) {
            return solution();
            // ni sigas, que no tiene solución...
        }

        // Brutal core: ¿Existen elementos con los que se pueda establecer una ecuación diofántica lineal?
        let resultado;
        for (let i = 0; i < w.length; ++i) {
            for (let j = 0; j < w.length; ++j) {
                resultado = diofanticaLineal(w[i], w[j], capacity);
                if (resultado.length === 2) {
                    return solution([[resultado[0], w[i]], [resultado[1], w[j]]]);
                }
            }
        }

        return solution();
        // No se encuentran más soluciones
    }
}
