class TArreglo extends WebSystemObject {
    /**
     * initialize MyArray
     *
     * in this case we'll use JavaScript built-in array
     * we should probably try using an object next time
     */
    constructor(n) {
        super();
        if (!n) {
            n = 0;
        }
        if (n instanceof Array) {
            this._array = [].concat(n);
        } else {
            this._array = new Array(n); // number of elements
        }
    }

    /**
     * get o set the size/length of the array
     */
    get length() {
        return this._array.length;
    }

    set length(n) {
        this._array.length = n;
    }

    /**
     * get an item given its index on the array
     * @param {number} index index of the item to get
     * @return {any} the item found at the given index
     */
    getValue(index) {
        return this._array[index];
    }

    setValue(index, value) { // así debería funcionar.
        this._array[index] = value;
        return this.getValue(index); // porsia
    }

    /**
     * adds an item onto the array
     * @param {any} item
     */
    add(item) {
        this.length = this.length + 1;
        this._array[this.length - 1] = item;
        return this;
    }

    insert(item) {
        this.add(item);
        return this;
    }

    push(item) {
        this.add(item);
        return this;
    }

    /**
     * removes an item value from the array
     * @param  {any} item item value
     */
    remove(item) {
        this._array = this._array.filter((data) => data !== item);
        return this;
    }

    /**
     * removes an indexed item from the array
     * @param position
     */
    removePosition(position) {
        this._array = this._array.filter((data, index) => index !== position);
        return this;
    }

    /**
     * look for the given item in the array
     * @param  {any} item
     * @return {number}      the array index position of the item found
     */
    search(item) {
        const foundIndex = this._array.indexOf(item);
        return foundIndex || null;
    }

    /**
     * prints the contents of the array
     * @return {any}
     */
    log() {
        // console.log(this.array.join(' '));
        return this._array.join(' ');
    }

    // verdadero si este arreglo es igual a otro arreglo b, es decir, tienen los mismos elementos en ese orden.
    isEqual(b) {
        return this._array.length === b.length && this._array.every((d, i) => this.equals(d, b[i]));
    }

    /**
     * Obtener un subarreglo en sus propios términos.
     */
    subArray(start, end) {
        const resultado = new TArreglo(end - start + 1);
        for (let i = start; i < end - start + 1; i++) {
            resultado[i - start] = this.getValue(i);
        }
        return resultado;
    }

    miSubArray(start, end) {
        return this._array.filter((v, i) => (start <= i) && (i <= end));
    }

    /**
     * Convert to a real Array.
     */
    toArray(start, end) {
        const resultado = Array(end - start + 1);
        for (let i = start; i < end - start + 1; i++) {
            resultado[i - start] = this.getValue(i);
        }
        return resultado;
    }

    // Pasar todos los métodos de arreglo para el método arreglo y san se acabó
    // que están preparados para las funciones de esta librería y tienen una
    // pila de ventajas y validaciones...
    esUnArregloOrdenado() {
        // Solamente para definir funciones flecha, recuérdalo.
        // Este determina si un arreglo está ordenado utilizando iteradores y es mucho + rápido.
        // const isArraySorted = (array) => {
        //    return array.every((val, i, arr) => !i || (val >= arr[i - 1]));
        // };
        // return _array.every((val, i, arr) => !i || (val >= arr[i - 1]));
        for (let i = 1; i < this._array.length; i++) {
            if (this._array[i] < this._array[i - 1]) return false; // Hay un atraso
        }
        return true; // No hubo atraso
    }

    /**
     * Binary Search implementation using iteration
     * @param  {string|number} target
     * @return {number} the index of the found element
     */
    busquedaBinaria(target) {
        if (!this.esUnArregloOrdenado()) {
            throw new Error('El arreglo provisto no está ordenado.');
        }

        let start = 0;
        let end = this._array.length - 1;

        while (start <= end) {
            const mid = Math.floor((end - start) / 2) + start;

            if (target < this._array[mid]) {
                end = mid - 1;
            } else if (target > this._array[mid]) {
                start = mid + 1;
            } else {
                return mid;
            }
        }

        return -1;
    }

    /**
     * Linear Search implementation
     * @param  {string|number} target
     * @return {number}        the index of the found element
     */
    busquedaLineal(target) {
        let result = -1;

        this._array.forEach((item, index) => {
            if (target === item) result = index;
        });

        return result;
    }

    /**
     * Binary Search implementation using recursion
     * @param  {string|number} target
     * @return {number}             the index of the found element
     */
    busquedaBinariaRecursiva(target) {
        if (!this.esUnArregloOrdenado()) {
            throw new Error('El arreglo provisto no está ordenado.');
        }

        return (function recurse(start, end) {
            let result = -1;

            if (start > end) return result;

            const mid = Math.floor((end - start) / 2) + start;

            if (target === this._array[mid]) {
                result = mid;
            } else if (target < this._array[mid]) {
                result = recurse(start, mid - 1);
            } else {
                result = recurse(mid + 1, end);
            }

            return result;
        })(0, this._array.length - 1);
    }

    /**
     * bubble sort implementation
     * @return {array}       sorted array
     */
    ordenammientoBurbuja() {
        this._array.forEach((item, index) => {
            for (let i = 0; i < this._array.length - index - 1; i++) {
                // we can either start at the beggining or finish of the arrays
                // starting at the beggining, we compare the first two numbers
                // together
                if (this._array[i] > this._array[i + 1]) {
                    // after comparing them, if the number on the right is found
                    // to be smaller, the numbers will be swapped
                    const smaller = this._array[i + 1];
                    this._array[i + 1] = this._array[i];
                    this._array[i] = smaller; // swap in memoriam
                }
                // after the comparison is finished, the scales (our comparator,
                // comparing two numbers at a time), move one position to the
                // right i.e. we advance to the next index and the numbers are
                // compared once again and this operation is repeated until the
                // scales reach the end of the sequence/array
            }

            // The same above operations are repeated until all the numbers
            // are fully sorted as evidenced by the use of our forEach
            // array helper here.
        });

        // return the array as it is sorted by now
        return this._array;
    }

    /**
     * insertion sort implementation
     * @return {array}       sorted array
     */
    ordenamientoInsercion() {
        this._array.forEach((number, index) => {
            // to begin, this algorithm considers the leftmost number fully sorted
            let previousIndex = index - 1;
            const temp = this._array[index];

            // next, from the remaining numbers the leftmost number is taken out
            // and compared to the already sorted number to its left
            while (previousIndex >= 0 && this._array[previousIndex] > temp) {
                // if the already sorted number is larger, the two numbers swap
                this._array[previousIndex + 1] = this._array[previousIndex];
                previousIndex--;
            }

            // the above operation repeats until either a number smaller
            // appears, or the number reaches the left edge

            this._array[previousIndex + 1] = temp;
        });

        return this._array;
    }

    /**
     * utility function that merges and sorts two arrays
     * @param  {array} left
     * @param  {array} right
     * @return {array}       the merged sorted array
     */
    merge(left, right) {
        const results = [];

        // when being combined, each group's numbers are arranged so that
        // they are ordered from smallest to largest after combination
        // when groups with multiple numbers are combined, the first
        // numbers are compared
        while (left.length && right.length) {
            if (left[0] < right[0]) {
                results.push(left.shift());
            } else {
                results.push(right.shift());
            }
        }

        return [...results, ...left, ...right];
    }

    /**
     * merge sort implementation
     * @return {array}       sorted array
     */
    ordenamientoMerge() {
        if (this._array.length <= 1) return this._array;

        // first, the sequence/array is divided further and further into halves
        // in our algorithm, the divisions are done via recursion i.e. calling
        // this function over and over again until the divisions are complete
        const middle = Math.floor(this._array.length / 2);
        const left = this._array.slice(0, middle);
        const right = this._array.slice(middle);

        // next, the divided groups are combined using our helper merge function
        // also, the combining of groups is repeated recursively until all numbers
        // form one group
        return merge(mergeSort(left), mergeSort(right));
    }

    /**
     * simple quick sort implementation (pivot is the first element of the array)
     * @return {array}       sorted array
     */
    ordenamientoSimpleQuickSort() {
        // one characteristics of quicksort is that it involves fewer
        // comparisons and swaps than other algorithms, so it's able
        // to sort quickly in many cases

        // let's start. the first operation targets the entire
        // array/sequence of numbers.

        // if array has less than or equal to one elements
        // then it is already sorted.
        if (this._array.length < 2) return this._array;

        // initialize left and right arrays
        const left = [];
        const right = [];

        // a number is chosen as a reference for sorting
        // this number is called the "pivot"
        // the pivot is normally a number chosen at random but, this time,
        // for convinience, the leftmost number will be chosen as the pivot
        // take the first element of the array as the pivot
        const pivot = this._array.shift();

        this._array.forEach((number, index) => {
            if (this._array[index] < pivot) {
                left.push(this._array[index]);
            } else {
                right.push(this._array[index]);
            }
        });

        // return [...simpleQuickSort(left), pivot, ...simpleQuickSort(right)];
        return this.ordenamientoSimpleQuickSort(left).concat(pivot, ordenamientoSimpleQuickSort(right));
    }

    /**
     * swap helper function
     * @param  {number} i
     * @param  {number} j
     * @return {void}
     */
    swap(i, j) {
        if (this.isNumber(this._array[i]) && this.isNumber(this._array[j])) {
            // depend of processor capacity
            this._array[i] = this._array[i] + this._array[j];
            this._array[j] = this._array[i] - this._array[j];
            this._array[i] = this._array[i] - this._array[j];
        } else {
            // depend of memory capacity
            const temp = this._array[i];
            this._array[i] = this._array[j];
            this._array[j] = temp;
        }
    }

    /**
     * lomuto partition scheme, it is less efficient than the Hoare partition scheme
     * @param  {number} left  leftmost index
     * @param  {number} right rightmost index
     * @return {number}       the pivot element
     */
    partitionLomuto(left, right) {
        let i = left;
        let j = left;
        for (j; j < right; j++) {
            if (this._array[j] <= this._array[right]) {
                this.swap(i, j);
                i += 1;
            }
        }

        this.swap(i, j);

        return i;
    }

    /**
     * hoare partition scheme, it is more efficient than the
     * lomuto partition scheme because it does three times
     * fewer swaps on average
     * @param  {number} left  leftmost index
     * @param  {number} right rightmost index
     * @return {number}       the pivot element
     */
    partitionHoare(left, right) {
        const pivot = Math.floor((left + right) / 2);

        while (left <= right) {
            while (this._array[left] < this._array[pivot]) left++;

            while (this._array[right] > this._array[pivot]) right--;

            if (left <= right) {
                this.swap(left, right);
                left++;
                right--;
            }
        }

        return left;
    }

    /**
     * classic implementation (with hoare or lomuto partition scheme)
     * @param  {number} left  leftmost index
     * @param  {number} right rightmost index
     * @return {array}       sorted array
     */
    ordenamientoQuickSort(left = 0, right = array.length - 1) {
        const pivot = partitionHoare(left, right);
        if (left < pivot - 1) quickSort(left, pivot - 1);
        if (right > pivot) quickSort(pivot, right);
        return this._array;
    }

    /**
     * selection sort implementation
     * @return {array}       sorted array
     */
    ordenamientoSeleccion() {
        this._array.forEach((number, index) => {
            let indexOfMin = index;

            // using linear search, the smallest value's index
            // in the sequesnce is located. we can replace this
            // for loop block with the linear search algorithm
            // written elsewhere in this repo
            for (let j = index + 1; j < this._array.length; j++) {
                if (this._array[j] < this._array[indexOfMin]) indexOfMin = j;
            }

            // if the smallest value happens to already be in the
            // leftmost position, no operation is carried out
            if (indexOfMin !== index) {
                const lesser = this._array[indexOfMin];

                // the smallest value swaps with the leftmost
                // number and is considered fully sorted
                this._array[indexOfMin] = this._array[index];
                this._array[index] = lesser;
            }

            // the same above operation is repeated until all
            // the numbers are fully sorted as evidence by
            // our forEach array helper
        });

        // sorting is complete
        // return the array
        return this._array;
    }

    /**
     * shell sort implementation
     *
     * can be seen as either a generalization of sorting
     * by exchange (bubble sort) or sorting by insertion (insertion sort)
     * the method starts by sorting pairs of elements far apart from each
     * other, then progressively reducing the gap between elements to be compared
     *
     * @return {array}       sorted array
     */
    ordenamientoShell() {
        // our intervals
        const GAPS = [500, 240, 128, 54, 26, 9, 4, 1];
        GAPS.forEach((gap) => {
            for (let index = gap; index < this._array.length; index++) {
                let j = index;
                const temp = this._array[index];

                for (j; j >= gap && this._array[j - gap] > temp; j -= gap) {
                    this._array[j] = this._array[j - gap];
                }

                this._array[j] = temp;
            }
        });

        return this._array;
    }

    _cartesianProduct(sets, index, current) {
        const result = [];
        if (index === sets.length) {
            return result.push(current.slice());
        }
        for (let i = 0; i < sets[index].length; i += 1) {
            current[index] = sets[index][i];
            this._cartesianProduct(sets, index + 1, current);
        }
    }

    /**
     * Calculates Cartesian product of provided sets.
     *
     **/
    productoCartesiano() {
        const result = [];
        this._cartesianProduct(this._array, 0, []);
        return result;
    }

    // posición del valor mínimo
    minimo() {
        let minimo = 0;
        for (let k = 1; k < this._array.length; k++) {
            if (this._array[k] < this._array[minimo]) {
                minimo = k;
            }
        }
        return minimo;
    }

    // posición del valor máximo
    maximo() {
        let maximo = 0;
        for (let k = 1; k < this._array.length; k++) {
            if (this._array[k] > this._array[maximo]) {
                maximo = k;
            }
        }
        return maximo;
    }

    // suma de todos los elementos
    total() {
        let result = 0;
        for (let k = 0; k < this._array.length; k++) {
            result += this._array[k];
        }
        return result;
    }

    // promedio
    media() {
        return this.total() / this._array.length;
    }

    // mcd
    mcd(eps = this.epsilon) {
        let result;
        this._array.forEach((element, i) => {
            if (i === 0) {
                result = element;
            } else {
                result = this.euclides(result, element, eps);
            }
        });
        return result;
    }

    // clonar
    clone() {
        const resultado = new TArreglo(this._array.count);
        resultado._array = [].concat(this._array);
        return resultado;
    }

    // contar (so a...)
    count(predicate = (a) => a === a) {
        let resultado = 0;
        this._array.forEach((element) => {
            if (predicate(element)) {
                resultado++;
            }
        });
        return resultado;
    }

    // contar los elementos mayores que él.
    contarMayores(el) {
        return this.count((x) => x > el);
    }

    // contar los elementos mayores que el
    contarMenores(el) {
        return this.count((x) => x < el);
    }

    // moda (elemento que mas aparece)
    moda() {
        const conteos = new TArreglo(this.length);
        for (let k = 0; k < s.length; k++) {
            conteos[k] = this.count(this.getValue[k]);
        }
        return this.getValue[conteos.maximo()];
    }

    // moda (elemento no nulo del conjunto que menos aparece)
    antiModa() {
        const conteos = new TArreglo(this.length);
        for (let k = 0; k < s.length; k++) {
            conteos[k] = this.count(this.getValue[k]);
        }
        return this.getValue[conteos.minimo()];
    }

    // elemento que tiene la misma cantidad por arriba que por abajo
    mediana() {
        for (let k = 0; k < s.length; k++) {
            if (this.contarMayores(this.getValue[k]) === this.contarMenores(this.getValue[k])) {
                return this.getValue[k];
            }
        }
        return this.media();
    }

    probabilidad(el) {
        return this.count(el) / this.length;
    }

    // cantidad de elementos diferentes entre sí, del arreglo (revisar)
    universo() {
        const chequeado = new TArreglo(this.length);
        for (let k = 0; k < s.length; k++) {
            chequeado[k] = false;
        }
        for (let k = 0; k < s.length - 1; k++) {
            for (let l = k + 1; l < s.length; l++) {
                if ((!chequeado.getValue[k]) && (this.count(this.getValue[l]) > 0)) {
                    chequeado.getValue[k] = true;
                }
            }
        }
        return this.count(true);
    }

    desviaciones(ref) {
        const resultado = new TArreglo(this.length);
        for (let k = 0; k < s.length; k++) {
            resultado[k] = this.getValue[k] - ref;
        }
        return resultado;
    }

    // Propiedad 1: la suma de las desviaciones con respecto a la media debe ser cero
    // Propiedad 2: la suma de los cuadrados de las desviaciones con respecto a la media debe ser cero
    varianza() {
        const cuadDes = this.desviaciones(this.media());
        for (let k = 0; k < s.length; k++) {
            cuadDes[k] = cuadDes[k] * cuadDes[k];
        }
        return cuadDes.media();
    }

    // Incluir el cálculo de la covarianza, que es el grado de variación conjunta de dos variables aleatorias respecto a sus medias.
    // //Es el dato básico para determinar si existe una dependencia entre ambas variables y además es el dato necesario para estimar otros parámetros básicos

    // function covarianza(cx, cy) {
    //     return (productoEscalar(cx, cy)/cx.length) - (meanValue(cx)*meanValue(cy));
    // }

    // Propiedad 1: La varianza siempre es un número no negativo (mayor o igual que cero)
    // Propiedad 2: Un conjunto de valores todos iguales tiene varianza cero
    // Propiedad 3: Si a cada valor del arreglo se le suma o se le resta una constante, la varianza se mantiene igual
    // Propiedad 4: Si cada valor del arreglo se multiplica por una constante, la varianza se multiplica

    desviacionTipica() {
        return Math.sqrt(this.varianza());
    }

    // Propiedad 1: La desviación típica siempre en un número no negativo
    // Propiedad 2: La desviación típica de un conjunto de elementos todos es cero
    // Propiedad 3: Si a cada valor del arreglo se le suma o se le resta una constante, la desviación típica se mantiene igual
    // Propiedad 4: Si cada valor del arreglo se multiplica por una constante, la la desviación se multiplica por su módulo (valor absoluto)

    // Momentos de Pearson
    momento(orden, ref) {
        const resultado = new TArreglo(this.length);
        for (let k = 0; k < s.length; k++) {
            resultado[k] = Math.pow(this.getValue[k] - ref, orden);
        }
        return resultado.media();
    }

    // returns ascendant or descendant sorted array.
    ascendantSort() {
        return this._array.sort((a, b) => a - b);
    }

    descendantSort() {
        return this._array.sort((a, b) => b - a);
    }

    nearestSort(x) {
        return this._array.sort((a, b) => Math.abs(a - x) - Math.abs(x - b));
    }

    farestSort(x) {
        return this._array.sort((a, b) => Math.abs(x - a) - Math.abs(b - x));
    }

    // Los dos primeros momentos son 0 y s²
    // Implementar concatenar con otro arreglo, contar apariciones, eliminar repetidos, etc...
    // Implementar crear conjunto
    // Implementar las interfaces join y split para cadenas...

    // The faster knapsack solution (mochila unidimensional)... v1.0
    // @author: ®2021 Luis Guillermo Bultet Ibles
    // @sample: knapsack(100, [{name: "calabazas", price: 1.75, weigh: 3}, {name: "yucas", price: 5.50, weigh: 1}, {name: "pepinos", price: 3.25, weigh: 1}])
    knapsack(capability) {
        const reOrdered = this._array.sort((a, b) => {
            if ((a.price / a.weigh) > (b.price / b.weigh)) {
                return 1;
            } else if ((a.price / a.weigh) < (b.price / b.weigh)) {
                return -1;
            }
            if (a.weigh > b.weigh) {
                return -1;
            } else if (a.weigh < b.weigh) {
                return 1;
            }
            return 0;
        });
        const theResult = [];
        let remainingCamability = capability;
        let quantity = 0;
        for (let i = 0; i < reOrdered.length; i++) {
            if (remainingCamability >= reOrdered[i].weigh) {
                quantity = Math.trunc(remainingCamability / reOrdered[i].weigh);
                theResult.push({
                    name: reOrdered[i].name,
                    price: reOrdered[i].price,
                    weigh: reOrdered[i].weigh,
                    quantity: quantity,
                });
                remainingCamability = remainingCamability - quantity * reOrdered[i].weigh;
            } else if (remainingCamability <= 0) {
                break;
            }
        }
        return theResult;
    }

    // SUMSET (TESTED) FOR REALS AND INTEGERS (Todas las soluciones racionales del Subconjunto suma, better now).
    // @author: Lic. Luis Guillermo Bultet Ibles.
    // @licence: dic 15, 2022, 10:58 AM Licencia de código fuente abierto y software libre: GPL 2.0+
    // @parameters: capacity -> suma total, eg. 3
    // @parameters: weighs -> pesos, eg. [-3, -2, -1 , 0, 1, 2, 3, 0.1, 0.9, 0.5, 0.4]
    sumSet(capacity, eps = this.epsilon) {
        // will contain all solutions.
        const solutions = [];
        // console.warn("los elementos recibidos son:", weighs, " para analizar con una capacidad:", capacity, " solución: ", solutions);

        // returns ascendant sorted array.
        const ascendantSort = (s) => {
            return s.sort((a, b) => a - b);
        };

        // add new simple solution.
        const addSolution = (sol) => {
            // just sort it to compare or save
            sol = ascendantSort(sol);
            // risk hypothesis (same sets? => theorem)
            const numArrayEq = (a, b) => a.length === b.length && a.every((d, i) => this.equivalents(d, b[i]));
            // then verify if it doesn't be registered previously.
            if (!solutions.some((er) => numArrayEq(sol, er))) solutions.push(sol);
        };

        // register and suppress trivial
        if (this._array.some((element) => this.equivalents(element, capacity))) {
            addSolution([capacity]);
            this._array = this._array.filter((data) => !this.equivalents(data, capacity));
        }

        // register if some element is equivalent to capacity, and remove all occurrences
        if (this._array.some((element) => this.equivalents(element, capacity))) {
            addSolution([capacity]);
            this._array = this._array.filter((data) => !this.equivalents(data, capacity));
        }

        // suppress zeros or infinitesimals
        this._array = this._array.filter((data) => !this.equivalents(data, 0));

        // Get the upper and lower limits indexes
        let [minPos, maxPos] = [this._array.indexOf(Math.min(this._array)), this._array.indexOf(Math.max(this._array))];

        // the minimal overflows ?
        while (this._array.length > 0 && this._array[minPos] > capacity) {
            this._array = supressElement(this._array, minPos);
            minPos = this._array.indexOf(Math.min(this._array));
        }

        // the maximal overflows ? register if solve but...
        while (this._array.length > 1 && this._array[minPos] + this._array[maxPos] > capacity) {
            if (this.equivalents(this._array[maxPos], capacity)) {
                addSolution([this._array[maxPos]]);
            }
            this._array = supressElement(this._array, maxPos);
            maxPos = this._array.indexOf(Math.max(this._array));
        }

        // punctual on cases 0, 1 and 2 elements
        if (this._array.length === 0) {
            return solutions;
        } else if (this._array.length === 1) {
            if (this.equivalents(this._array[0], capacity)) {
                addSolution([this._array[0]]);
            }
            return solutions;
        } else if (this._array.length === 2) {
            if (this.equivalents(this._array[0], capacity)) {
                addSolution([this._array[0]]);
            }
            if (this.equivalents(this._array[1], capacity)) {
                addSolution([this._array[1]]);
            }
            if (this.equivalents(this._array[0] + this._array[1], capacity)) {
                addSolution(this._array);
            }
            return solutions;
        }

        // else calculates mcd
        const mcd = this.mcd(eps);
        if (!this.divides(capacity, mcd, eps)) { // if mcd does not divide sum NTS (Bezout condition), otherwise follow.
            return solutions;
        }

        // console.warn(`Buscando la solución del conjunto [${weighs.join(", ")}], con mcd = ${mcd}; para una suma de ${capacity}.`);
        // returns an array with one element deleted from the given zero based position.
        const supressElement = (arreglo, position) => {
            return arreglo.filter((data, index) => index !== position);
        };

        // add multiples sub solutions for a given capacity.
        const addToSolutionSet = (sols, localCapacity) => {
            sols.forEach((sol) => {
                sol = sol.concat(localCapacity);
                // console.warn(` Encontrada la solución: ${sol}.`);
                addSolution(sol);
            });
        };

        // The classic - brutal core.
        const visiteds = [];
        let subSolution = [];
        let subSet = [];
        for (let i = 0; i < this._array.length - 1; i++) {
            if (visiteds.indexOf(x) !== -1) continue;
            visiteds.push(this._array[i]);
            subSet = supressElement(this._array, i);
            // console.warn(` Analizando el elemento ${weighs[i]} sobre el objetivo [${subSet}], para una suma de ${capacity - weighs[i]}.`);
            subSolution = sumSet(capacity - this._array[i], subSet);
            addToSolutionSet(subSolution, this._array[i]);
        }

        // returns the resulting solutions set.
        return solutions;
    }

    // Extrapoación astronómica (Provisional ®Pipo '2023)
    sFT(xvalues, yvalues, x) {
        const residuo = (x, y) => {
            return x - y * Math.floor(x / y);
        };

        function gcd(a, b) {
            const eps = 0.00000000000001;
            let result;
            let [minFactor, maxFactor] = [Math.min(a, b), Math.max(a, b)];
            // this trivial checks avoids div. by zero.
            if (Math.abs(minFactor) <= eps) {
                if (Math.abs(maxFactor) <= eps) {
                    result = Infinity;
                } else {
                    result = maxFactor;
                }
            } else if (Math.abs(maxFactor) <= eps) {
                if (Math.abs(minFactor) <= eps) {
                    result = Infinity;
                } else {
                    result = minFactor;
                }
            } else {
                result = maxFactor;
                while (Math.abs(minFactor) > eps) {
                    maxFactor = result;
                    result = minFactor;
                    minFactor = residuo(maxFactor, minFactor);
                }
                if (minFactor > eps / 2) {
                    result = 1;
                }
            }
            return result;
        }

        function arrayMcd(arr) {
            let result;
            arr.forEach((element, i) => {
                if (i === 0) {
                    result = element;
                } else {
                    result = gcd(result, element);
                }
            });
            return result;
        }

        function divisibilidad(a, b) {
            const eps = 0.00000000000001;
            let result;
            if (Math.abs(b) < eps) {
                result = false;
            } else {
                result = Math.abs(residuo(a, b)) < eps;
            }
            return result;
        }

        // fast decay modpow
        function modpow(base, exp, m) {
            // Utility function to do
            // modular exponentiation.

            if (m === 1) return 0;
            if (exp === 0) return 1;
            if (base === 0) return 0;
            if (((base < 10) && (exp < 10) && (m < 10)) || (exp < 1)) {
                return residuo(Math.pow(base, exp), m);
            }

            const mcd = gcd(base, m);
            if (mcd > 1) { // this is another way, pack and leave.
                const mmcdd = m / mcd;
                return residuo(modpow(mcd, exp - 1, mmcdd) * mcd * modpow(base / mcd, exp, mmcdd), m);
            }

            while (exp >= 2 && divisibilidad(exp, 2)) {
                exp /= 2;
                base = Math.pow(base, 2);
            }
            while (exp >= 3 && divisibilidad(exp, 3)) {
                exp /= 3;
                base = Math.pow(base, 3);
            }
            while (exp >= 5 && divisibilidad(exp, 5)) {
                exp /= 5;
                base = Math.pow(base, 5);
            }

            if (exp > 1000000) {
                return modpow(Math.exp(1), exp * Math.log(base), m);
            }

            if (exp > 1000) {
                const r = Math.sqrt(exp);
                return modpow(modpow(base, r, m), r, m);
            }

            return residuo((base * modpow(base, exp - 1, m)), m);
        }

        const mcd = arrayMcd(xvalues);
        let result = 0;
        yvalues.forEach((y, i) => {
            const algo = modpow(2, Math.abs(x - xvalues[i]) / mcd - 1, 2);
            result += y * Math.sin(Math.PI * algo);
            // result += y * (1-Math.tan(Math.PI * algo/4));
        });
        return result;
    }
}
