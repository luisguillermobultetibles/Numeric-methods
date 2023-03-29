// Modalidades ontológicas, deónticas, etc...

import {WebSystemObject} from './WebSystemObject';


// Definición de base de conocimientos
// Todos heredan de sus sub-clases (nadie mas hereda directamente de concepto, está cerrado para uso interno):
class Concepto extends WebSystemObject {
  // Un concepto es una representación o modelo mental de un objeto

  // TIPOS DE CONCEPTOS
  static ConceptoSingular = class extends Concepto {

    // EN CUANTO SINGULARES, SE DIVIDEN DICOTÓMICAMENTE EN

    // Conceptos de objetos concretos (ya sean clases, objetos o instancias)
    static ObjetoConcreto = class extends Concepto.ConceptoSingular.ConceptoSingular {
      // De los conceptos concretos:
      // Hipótesis
      static Hipotesis = class extends Concepto.ConceptoSingular.ObjetoConcreto {
      };

      // Tesis
      static Tesis = class extends Concepto.ConceptoSingular.ObjetoConcreto {
      };
    };

    // Conceptos abstractos ()
    static ObjetoAbstracto = class extends Concepto.ConceptoSingular {

      // De los conceptos abstractos:
      // Un objeto analitico (de lo general a lo particular), por ejemplo el concepto de número
      static Analisis = class extends Concepto.ConceptoSingular.ObjetoAbstracto {
      };

      // Un objeto sintético o inducido (de lo particular a lo general), por ejemplo una cantidad, que no es lo mismo...
      static Sintesis = class extends Concepto.ConceptoSingular.ObjetoAbstracto {
      };

      // Un objeto hipostático (abstracción que resulta de elevar una clase, relación o propiedad a calidad de objeto)
      static Hipostasis = class extends Concepto.ConceptoSingular.ObjetoAbstracto {

        // De los conceptos hipostáticos:
        // Las propiedades
        static Propiedad = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis {
          /*
              Las clases quedan descritas por las propiedades, es decir, lo que hace que una clase sea una clase, es la presencia
             o ausencia de determinada propiedad. y la forma en que se establece el cumplimiento de esta propiedad es lo que hace
             que la división de los conceptos sean dicótomos, especificadores, jerárquicos., etc.
           */

          // De las propiedades (especiales), que representan comportamientos.
          // los métodos que nos dicen cómo hacer algo, generalmente una función que puede o no (procedure ó void)
          // devolver resultados, y que puede recibir parámetros.
          static Method = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad {

            // Y los eventos, que son métodos con la particularidad de que están orientados a que el usuarios los invoque, sino que
            // se generan (disparan) ante determinadas situaciones (condiciones internas o relaciones externas) del objeto con otros.
            static Evento = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method {

              static EventoAleatorio = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento {
                static solamenteimpredecible = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };
                static solamenteIrrelevante = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };
                static impredecibleIrrelevante = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };

                constructor() {
                  super(...arguments);
                }
              };

              static EventoNoAleatorio = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento {
                static hechoNormal = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoNoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };
                static ConsecuenciaDisipativa = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoNoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };
                static VariableOculta = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Propiedad.Method.Evento.EventoNoAleatorio {
                  constructor() {
                    super(...arguments);
                  }
                };

                constructor() {
                  super(...arguments);
                }
              };

              constructor(nombre, manipulador, condicion) {
                super(nombre, manipulador.toString(), '');
                this.nombre = nombre;
                if (manipulador) {
                  this.manipulador = manipulador;
                  if (condicion) {
                    this.condicion = condicion;
                  }
                }
              }

              handler(data, propagacion) { // virtual
                /*
                  la variable o parámetro data contiene los datos que generaron el evento... por ejemplo, el código de la tecla que se oprimió.
                  Este es el manipulador (driver, chofer o handler) de la interrupción, es implementado por el usuario y es el que se ejecuta
                  cada vez que se genera la actividad, la variable propagación me dice si es fue primero en atender.
                  Y debe retornar true, para que se realice otra propagación... o false para que se termine la atención a la interrupción...
                 */
              }

              perform(data, propagacion) {
                if (this.manipulador) {
                  this.manipulador(data);
                }
              }

              stopPropagation(target) {
                target.stopPropagation();
              }
            };

            constructor(nombre, codigo, parametros) {
              super();
              [this.nombre, this.codigo, this.parametros] = arguments;
            }
          };


        };

        // Las relaciones:
        // Las relaciones se dividen en restricciones y condiciones
        // Relaciones = Condiciones U Restricciones
        static Relation = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis {

          // Y en el límite de las clasificaciones, se encuentran las categorías...
          // (Esto, entre otras cosas puede ayudar a evitar que la estructura de conceptos aumente desproporcionalmente, ver tipos de datos)
          static Clase = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis {
          };

          static Condition = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation {
            /*  Definición de Condición.
                Las condiciones reflejan la relación del objeto con los fenómenos que le rodean,
                sin los cuales no puede existir, a diferencia de la causa, que engendra directamente
                al objeto, la condición es el medio donde este puede surgir, las mismas pueden
                definirse matemáticamente en forma de relaciones que pueden o no cumplirse,
                mientras que las restricciones son relaciones que obligatoriamente han de hacerlo
                o no, es decir, definen la forma en que el objeto se relaciona; mientras una de
                ellas tiene forma inquisitiva la otra es imperativa; las condiciones y las
                restricciones son, a mi entender, los dos tipos especiales de relaciones.
            */

            // Un permiso
            static Permission = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Condition {
              static PermisoImplicito = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Condition.Permission {

              };
              static PermisoExplicito = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Condition.Permission {
                constructor() {
                  super(...arguments);
                  this.base = arguments.length ? arguments[0] : 'Sin base legal';
                }
              };
            };

            constructor() {
              super();
            }

          };

          static Restriction = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation {

            // Modalidades deónticas (outside Relation class)

            // Polimórfica, debe heredar de Relation cuando se implemente
            static DeonticModality = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction {
              static RestrictionRelation = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality {
              };
              static Prohibition = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality.RestrictionRelation {
              };
              static Obligation = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality.RestrictionRelation {
              };

              static PermissionRelation = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality {
              };
              static Alternative = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality.PermissionRelation {
              };
              static Option = class extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation.Restriction.DeonticModality.PermissionRelation {
              };

              constructor() {
                super(...arguments);
              }
            };

            constructor(name) {
              super();
              this.name = name;
            }
          };

          // Relation constructor
          constructor() {
            super();
            if (arguments.length > 0 && arguments[0] instanceof String) {
              this.name = name;
            } else if (arguments.length > 0 && arguments[0] instanceof Array) {
              this.elementos = [].clone(arguments[0]);
            }
          }

        };

        // Una propiedad de las hipóstasis en cuanto abstracciones del pensamiento particular, es su alcance.
        static alcancePrivado = 0;
        static alcancePrivadoFinalizado = 1;
        static alcancePublico = 2; // Que no es secreto, por ejemplo: no elaborado.
        static alcancePublicado = 3; // Que se ha terminado
        static alcanceComun = 3;

        // Otras de las propiedades es el modo
        static modoEstatico = 0;
        static modoVirtual = 1;

        // Otras de las propiedades es la implementación
        static implementacionAbstracta = 0;
        static implementacionConcreta = 1;

      };
    };
  };
  static ConceptoGeneral = class extends Concepto {

    static Arreglo = class extends Concepto.ConceptoGeneral {
      /**
       * initialize MyArray
       *
       * in this case we'll use JavaScript built-in array
       * we should probably try using an object next time
       */
      data;

      constructor(n) {
        super();
        if (!n) {
          n = 0;
        }
        if (n instanceof Array) {
          this.data = [].concat(n);
        } else {
          this.data = new Array(n); // number of elements
        }
      }

      /**
       * get o set the size/length of the array
       */
      get length() {
        return this.data.length;
      }

      set length(n) {
        this.data.length = n;
      }

      /**
       * get an item given its index on the array
       * @param {number} index index of the item to get
       * @return {any} the item found at the given index
       */
      getValue(index) {
        return this.data[index];
      }

      setValue(index, value) { // así debería funcionar.
        this.data[index] = value;
        return this.getValue(index); // porsia
      }

      /**
       * adds an item onto the array
       * @param {any} item
       */
      add(item) {
        this.length = this.length + 1;
        this.data[this.length - 1] = item;
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
        this.data = this.data.filter((data) => data !== item);
        return this;
      }

      /**
       * removes an indexed item from the array
       * @param position
       */
      removePosition(position) {
        this.data = this.data.filter((data, index) => index !== position);
        return this;
      }

      /**
       * look for the given item in the array
       * @param  {any} item
       * @return {number}      the array index position of the item found
       */
      search(item) {
        const foundIndex = this.data.indexOf(item);
        return foundIndex || null;
      }

      /**
       * prints the contents of the array
       * @return {any}
       */
      log() {
        // console.log(this.array.join(' '));
        return this.data.join(' ');
      }

      // verdadero si este arreglo es igual a otro arreglo b, es decir, tienen los mismos elementos en ese orden.
      isEqual(b) {
        return this.data.length === b.length && this.data.every((d, i) => this.equals(d, b[i]));
      }

      /**
       * Obtener un subarreglo en sus propios términos.
       */
      subArray(start, end) {
        const resultado = new Concepto.ConceptoGeneral.Arreglo(end - start + 1);
        for (let i = start; i < end - start + 1; i++) {
          resultado[i - start] = this.getValue(i);
        }
        return resultado;
      }

      miSubArray(start, end) {
        return this.data.filter((v, i) => (start <= i) && (i <= end));
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
        for (let i = 1; i < this.data.length; i++) {
          if (this.data[i] < this.data[i - 1]) return false; // Hay un atraso
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
        let end = this.data.length - 1;

        while (start <= end) {
          const mid = Math.floor((end - start) / 2) + start;

          if (target < this.data[mid]) {
            end = mid - 1;
          } else if (target > this.data[mid]) {
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

        this.data.forEach((item, index) => {
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
        })(0, this.data.length - 1);
      }

      /**
       * bubble sort implementation
       * @return {array}       sorted array
       */
      ordenammientoBurbuja() {
        this.data.forEach((item, index) => {
          for (let i = 0; i < this.data.length - index - 1; i++) {
            // we can either start at the beggining or finish of the arrays
            // starting at the beggining, we compare the first two numbers
            // together
            if (this.data[i] > this.data[i + 1]) {
              // after comparing them, if the number on the right is found
              // to be smaller, the numbers will be swapped
              const smaller = this.data[i + 1];
              this.data[i + 1] = this.data[i];
              this.data[i] = smaller; // swap in memoriam
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
        return this.data;
      }

      /**
       * insertion sort implementation
       * @return {array}       sorted array
       */
      ordenamientoInsercion() {
        this.data.forEach((number, index) => {
          // to begin, this algorithm considers the leftmost number fully sorted
          let previousIndex = index - 1;
          const temp = this.data[index];

          // next, from the remaining numbers the leftmost number is taken out
          // and compared to the already sorted number to its left
          while (previousIndex >= 0 && this.data[previousIndex] > temp) {
            // if the already sorted number is larger, the two numbers swap
            this.data[previousIndex + 1] = this.data[previousIndex];
            previousIndex--;
          }

          // the above operation repeats until either a number smaller
          // appears, or the number reaches the left edge

          this.data[previousIndex + 1] = temp;
        });

        return this.data;
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
        if (this.data.length <= 1) return this.data;

        // first, the sequence/array is divided further and further into halves
        // in our algorithm, the divisions are done via recursion i.e. calling
        // this function over and over again until the divisions are complete
        const middle = Math.floor(this.data.length / 2);
        const left = this.data.slice(0, middle);
        const right = this.data.slice(middle);

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
        if (this.data.length < 2) return this.data;

        // initialize left and right arrays
        const left = [];
        const right = [];

        // a number is chosen as a reference for sorting
        // this number is called the "pivot"
        // the pivot is normally a number chosen at random but, this time,
        // for convinience, the leftmost number will be chosen as the pivot
        // take the first element of the array as the pivot
        const pivot = this.data.shift();

        this.data.forEach((number, index) => {
          if (this.data[index] < pivot) {
            left.push(this.data[index]);
          } else {
            right.push(this.data[index]);
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
        if (this.isNumber(this.data[i]) && this.isNumber(this.data[j])) {
          // depend of processor capacity
          this.data[i] = this.data[i] + this.data[j];
          this.data[j] = this.data[i] - this.data[j];
          this.data[i] = this.data[i] - this.data[j];
        } else {
          // depend of memory capacity
          const temp = this.data[i];
          this.data[i] = this.data[j];
          this.data[j] = temp;
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
          if (this.data[j] <= this.data[right]) {
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
          while (this.data[left] < this.data[pivot]) left++;

          while (this.data[right] > this.data[pivot]) right--;

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
        return this.data;
      }

      /**
       * selection sort implementation
       * @return {array}       sorted array
       */
      ordenamientoSeleccion() {
        this.data.forEach((number, index) => {
          let indexOfMin = index;

          // using linear search, the smallest value's index
          // in the sequesnce is located. we can replace this
          // for loop block with the linear search algorithm
          // written elsewhere in this repo
          for (let j = index + 1; j < this.data.length; j++) {
            if (this.data[j] < this.data[indexOfMin]) indexOfMin = j;
          }

          // if the smallest value happens to already be in the
          // leftmost position, no operation is carried out
          if (indexOfMin !== index) {
            const lesser = this.data[indexOfMin];

            // the smallest value swaps with the leftmost
            // number and is considered fully sorted
            this.data[indexOfMin] = this.data[index];
            this.data[index] = lesser;
          }

          // the same above operation is repeated until all
          // the numbers are fully sorted as evidence by
          // our forEach array helper
        });

        // sorting is complete
        // return the array
        return this.data;
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
          for (let index = gap; index < this.data.length; index++) {
            let j = index;
            const temp = this.data[index];

            for (j; j >= gap && this.data[j - gap] > temp; j -= gap) {
              this.data[j] = this.data[j - gap];
            }

            this.data[j] = temp;
          }
        });

        return this.data;
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
        this._cartesianProduct(this.data, 0, []);
        return result;
      }

      // posición del valor mínimo
      minimo() {
        let minimo = 0;
        for (let k = 1; k < this.data.length; k++) {
          if (this.data[k] < this.data[minimo]) {
            minimo = k;
          }
        }
        return minimo;
      }

      // posición del valor máximo
      maximo() {
        let maximo = 0;
        for (let k = 1; k < this.data.length; k++) {
          if (this.data[k] > this.data[maximo]) {
            maximo = k;
          }
        }
        return maximo;
      }

      // suma de todos los elementos
      total() {
        let result = 0;
        for (let k = 0; k < this.data.length; k++) {
          result += this.data[k];
        }
        return result;
      }

      // promedio
      media() {
        return this.total() / this.data.length;
      }

      // mcd
      mcd(eps = this.epsilon) {
        let result;
        this.data.forEach((element, i) => {
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
        const resultado = new Concepto.ConceptoGeneral.Arreglo(this.data.count);
        resultado._array = [].concat(this.data);
        return resultado;
      }

      // contar (so a...)
      count(predicate = (a) => a === a) {
        let resultado = 0;
        this.data.forEach((element) => {
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
        const conteos = new Concepto.ConceptoGeneral.Arreglo(this.length);
        for (let k = 0; k < s.length; k++) {
          conteos[k] = this.count(this.getValue[k]);
        }
        return this.getValue[conteos.maximo()];
      }

      // moda (elemento no nulo del conjunto que menos aparece)
      antiModa() {
        const conteos = new Concepto.ConceptoGeneral.Arreglo(this.length);
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
        const chequeado = new Concepto.ConceptoGeneral.Arreglo(this.length);
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
        const resultado = new Concepto.ConceptoGeneral.Arreglo(this.length);
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
        const resultado = new Concepto.ConceptoGeneral.Arreglo(this.length);
        for (let k = 0; k < s.length; k++) {
          resultado[k] = Math.pow(this.getValue[k] - ref, orden);
        }
        return resultado.media();
      }

      // returns ascendant or descendant sorted array.
      ascendantSort() {
        return this.data.sort((a, b) => a - b);
      }

      descendantSort() {
        return this.data.sort((a, b) => b - a);
      }

      nearestSort(x) {
        return this.data.sort((a, b) => Math.abs(a - x) - Math.abs(x - b));
      }

      farestSort(x) {
        return this.data.sort((a, b) => Math.abs(x - a) - Math.abs(b - x));
      }

      // Los dos primeros momentos son 0 y s²
      // Implementar concatenar con otro arreglo, contar apariciones, eliminar repetidos, etc...
      // Implementar crear conjunto
      // Implementar las interfaces join y split para cadenas...

      // The faster knapsack solution (mochila unidimensional)... v1.0
      // @author: ®2021 Luis Guillermo Bultet Ibles
      // @sample: knapsack(100, [{name: "calabazas", price: 1.75, weigh: 3}, {name: "yucas", price: 5.50, weigh: 1}, {name: "pepinos", price: 3.25, weigh: 1}])
      knapsack(capability) {
        const reOrdered = this.data.sort((a, b) => {
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
        if (this.data.some((element) => this.equivalents(element, capacity))) {
          addSolution([capacity]);
          this.data = this.data.filter((data) => !this.equivalents(data, capacity));
        }

        // register if some element is equivalent to capacity, and remove all occurrences
        if (this.data.some((element) => this.equivalents(element, capacity))) {
          addSolution([capacity]);
          this.data = this.data.filter((data) => !this.equivalents(data, capacity));
        }

        // suppress zeros or infinitesimals
        this.data = this.data.filter((data) => !this.equivalents(data, 0));

        // Get the upper and lower limits indexes
        let [minPos, maxPos] = [this.data.indexOf(Math.min(this.data)), this.data.indexOf(Math.max(this.data))];

        // the minimal overflows ?
        while (this.data.length > 0 && this.data[minPos] > capacity) {
          this.data = supressElement(this.data, minPos);
          minPos = this.data.indexOf(Math.min(this.data));
        }

        // the maximal overflows ? register if solve but...
        while (this.data.length > 1 && this.data[minPos] + this.data[maxPos] > capacity) {
          if (this.equivalents(this.data[maxPos], capacity)) {
            addSolution([this.data[maxPos]]);
          }
          this.data = supressElement(this.data, maxPos);
          maxPos = this.data.indexOf(Math.max(this.data));
        }

        // punctual on cases 0, 1 and 2 elements
        if (this.data.length === 0) {
          return solutions;
        } else if (this.data.length === 1) {
          if (this.equivalents(this.data[0], capacity)) {
            addSolution([this.data[0]]);
          }
          return solutions;
        } else if (this.data.length === 2) {
          if (this.equivalents(this.data[0], capacity)) {
            addSolution([this.data[0]]);
          }
          if (this.equivalents(this.data[1], capacity)) {
            addSolution([this.data[1]]);
          }
          if (this.equivalents(this.data[0] + this.data[1], capacity)) {
            addSolution(this.data);
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
        for (let i = 0; i < this.data.length - 1; i++) {
          if (visiteds.indexOf(x) !== -1) continue;
          visiteds.push(this.data[i]);
          subSet = supressElement(this.data, i);
          // console.warn(` Analizando el elemento ${weighs[i]} sobre el objetivo [${subSet}], para una suma de ${capacity - weighs[i]}.`);
          subSolution = this.sumSet(capacity - this.data[i], subSet);
          addToSolutionSet(subSolution, this.data[i]);
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
    };

    static Conjunto = class extends Concepto.ConceptoGeneral {
      // Just an array based Set alike class to classify into our model
      data;

      constructor() {
        super();
        this.data = [...arguments];
      }


      add(value) {
        if (!this.some((el)=>this.equals(value, el))) {
          this.data.push(value);
        }
      }

      clear() {
        this.data.length = 0;
      }

      delete(value) {
        this.data = this.data.filter((el)=>!this.equals(el, value));
      }

      forEach(callbackfn = (value, value2, set) => {
      }, thisArg = this) {
        this.data.forEach(callbackfn, thisArg);
      }

      has(value) {
        return this.data.some((el)=>this.equals(el, value));
      }

      readonly() {
        return this.data.readonly();
      }

    };

    static Poblacion = class extends Concepto.ConceptoGeneral {

    };

    static Distribucion = class extends Concepto.ConceptoGeneral {

    };

  };

  constructor() {
    super();
    if (arguments.length > 0 && arguments[0] instanceof String) {
      this.nombre = arguments[0];
    }
  }

}


// Las clases en sí ()


// De las clases algunos oximorones

/*
*   Todos los animales que vuelan no son aves.
*   Algunos mamíferos y peces, lo hacen.
*   Todos los animales que viven el el mar, no son peces;
*   Por ejemplo, los delfines, pertenecen a la clase de los mamíferos.
*   Existe una excepción de los mamíferos que ponen huevos.
*   Los delfines, al igual que los homo sapiens, hacen el amor por placer.
*   No solamente para reproducirse.
*   Etc...
*
* */

// Los objetos hipostáticos (métodos y propiedades) tienen a su vez algunas propiedades especiales que les pueden ser comunes y los describen:
// por ejemplo: tienen visibilidad (privado, público), si son (concretos o abstractos) esto es, si ya están implementados
// o si el compilador o intérprete ya tiene resueltas las referencias a ellos desde el principio.

// Aquí comienza el capítulo de lógica, necesita análisis pues en algunos manuales las operaciones se consideran relaciones, también se debe armar el concepto de función... etc...

class Juicio extends Concepto.ConceptoSingular.ObjetoAbstracto.Hipostasis.Relation {
  // TIPOS DE ARGUMENTOS (Se usan poco, y van bien grandes porque son esenciales).
  static tipoJuicioLEY_AXIOMA_O_POSTULADO = 1; // Por ejemplo, las leyes de la robótica, las carta de derechos de las naciones unidas (exceptuando los vetos), luego la constitución de la república, las leyes que se derivan, las necesidades básicas personales, los estados de necesidad, sin intermedios y en ese orden., luego the user, then homo sapien, humano, nacido, cubano, vivo, por último, las tortugas, nosotros, los salvavidas y desarrolladores.
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_LA_SOCIEDAD_O_LA_COMUNIDAD_CIENTIFICA = 2;
  static tipoJuicioDEFINICION = 3;
  static tipoJuicioTEOREMA = 4;
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_EL_USUARIO = 5; // Que lo vió con estos ojos que tengo aquí...
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_OTROS_USUARIOS = 6; // Que fulano o mengano y sutano lo dijeron...
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_OTROS_SISTEMAS = 7; // Que salió por tal periódico... (en todos caso siempre es bueno agregar una referencia al origen de la inf.)

  // TIPOS DE CUANTIFICADORES
  static cuantificadorExiste = 1;			// Cuantificador existencial
  static cuantificadorParaTodo = 2;	// ... universal

  // TIPOS DE CÓPULAS (forma en que se relacionan dos o más conceptos) REVISA LAS NUEVAS...
  static copulaObservacion = 1; // es una observación hecha a
  static copulaDefinicion = 2; // es una definición de, equivale a la cópula es
  static copulaDescripcion = 3; // es una descripción de
  static copulaIdentidad = 4; // es idéntico a
  static copulaEquilalencia = 5; // equivale a
  static copulaSuperContencion = 6; // contiene a (es un superconjunto de)
  static copulaMuestra = 7; // es un ejemplo de (es una muestra de)
  static copulaSignificado = 8; // significa según (en el caso de una relación ternaria) a segun b, significa c
  static copulaPertenencia = 9; // pertenece a
  static copulaSubContencion = 10; // está contenido en (es un subconjunto de)
  static copulaSuperconcepto = 11; // es el concepto superior de (es el padre o superclase de)
  static copulaSubconcepto = 12; // es un subconcepto de (es un hijo o subclase de)
  static copulaQuedaDefinido = 13; // queda definido por
  static copulaQuedaDescrito = 14; // queda descrito por
  static copulaQuedaDemostrado = 15; // queda demostrado por (se ejemplifica en)
  static copulaSinonimo = 16; // es sinónimo de
  static copulaAntonimo = 17; // es antónimo de
  static copulaFigurado = 18; // en un sentido figurado de

  // Almacena el valor de verdad de la proposición si se conoce
  _valorDeVerdad = undefined;

  constructor(veracidad, probabilidad = 1) {
    super(...arguments);
    if (probabilidad < 1) {
      this._probabilidad = probabilidad;
    }
  }

  get esConocido() {
    return this._valorDeVerdad !== undefined && this._valorDeVerdad !== null;
  }

  get esCierto() {
    return this.esConocido() && this._valorDeVerdad;
  }

  get esFalso() {
    return this.esConocido() && !this._valorDeVerdad;
  }

  //
  incertidumbre() {
    if (!this.esConocido) {
      return this._probabilidad ? (this._probabilidad / 2) * ((1 - this._probabilidad) / 2) : 1;
    } else {
      return 0;
    }
  }

  //
  get deducible() {
    return this._deducible;
  }

  set deducible(v) {
    this._deducible = v;
  }

  //
  get observable() {
    return this._observable;
  }

  set observable(v) {
    this._observable = v;
  }

  get demostrable() {
    return this.esConocido && (this.deducible || this.observable);
  }

  get verificable() {
    return this.esConocido && (!this.deducible || !this.observable);
  }

  get imposible() {
    return !this.esConocido && !this.deducible && !this.observable;
  }


}

// Proposición lógica
class Proposicion extends Juicio {

  // TIPOS DE PROPOSICIÓN
  static proposicionAtributiva = 1; // Se afirma o se niega que un objeto posee ciertas propiedades, estados o tipos de actividad, siguen el esquema: "S es P" o "S no es P". (la rosa es roja).
  static proposicionRelacional = 2; // Se refieren a las relaciones entre los objetos, siguen el esquema: "A R P" o "S no R P". ef (a > b, x=2, "el protón es mas pesado que el neutrón").
  static proposicionExistencial = 3; // Afirman o niegan la existencia de otros objetos (sucesos o fenómenos).

  constructor(
    nombre,
    tipo, // tipo de proposición
    texto, // La oración o frase a partir de la cual se construyó la proposición.
    modo, // Se afirma o se niega la proposición (true-afirmativo, false-negativo).
    argumento, //
    fuente, // Referencia al documento, lugar, fecha u hora o persona, que confirme el argumento.
    cuantificador, // Cuantificador existencial
    sujeto, // Aquí se espera un Concepto (el objeto de la proposición)
    copula, // Aquí se espera una cópula
    predicado, // Aquí se espera otro Concepto (lo que se dice del objeto)
  ) {
    super();
    this.nombre = nombre;
    this.tipo = tipo;
    this.texto = texto;
    this._valorDeVerdad = modo;
    this.argumento = argumento;
    this.fuente = fuente;
    this.cuantificador = cuantificador;
    this.conceptoSujeto = sujeto;
    this.copula = copula;
    this.conceptoPredicado = predicado;
  }

  /*
    Juicios universales
        .Afirmativo
        Todo a es b
        Todo a, b                               (con o sin coma)
        Para cada a, b                          (con o sin coma)
        Para cada a, existe b                   (con o sin coma)
        Cada a, b                               (con o sin coma)
        A cada a, b                             (con o sin coma)
        Todos los a son b
        A todos los a, b                        (con o sin coma)
        .Negativo
        No todo a es b
        No todos los a son b
    Juicios particulares
        .Afirmativo
        Existe un a que es b
        Existe un solo a que es b
        Existe un único a que es b
        Existe exactamente un a que es b
        Hay un a que es b
        Hay un solo a que es b
        Hay un único a que es b
        Tan solo un a es b
        .Negativo
        Ningún a es b
        Ningún a, b                             (con o sin coma)
        Nunguno de los a, b                     (con o sin coma)
        Nunguno de los a es b
        No existe un a que sea b                (existe, hay, se puede encontrar, se verifica, se halla, se cumple)
        No existe ni un solo a que sea b        (ni un solo, ni tan solo, ni un mero, ni un mísero)
        No existe ni un único a que sea b
        No existe ni siquiera un a que sea b
        Ni tan solo un a es b
        Ni tan solo un a, b                     (con o sin coma)
        Ni siquiera hay un a que b
        Ni siquiera hay un a que sea b
    Jucios singulares
        .Afirmativo
        a, b (con o sin coma)
        a es b
        a cumple b
        a cumple que b
        a se define como b
        la definición de a es b
        a significa b
        a quiere decir b
        el significado de a es b
        Este, tal, mas cual (pronombre) es b
        .Negativo
        a, no b (con o sin coma)
        a no es b
        a no cumple b
        a no cumple que b
        a no se define como b
        la definición de a no es b
        a no significa b
        a no quiere decir b
        el significado de a no es b
        Este, tal, algún, algunos, mas cual (pronombre) no es b

    Desde luego que todos las posiblidades deben quedar cubiertas por
    sistema de sinónimos y reconocimiento de patrones del español,
*/


  negar(cambiandoElModo = true) {
    if (cambiandoElModo) {
      // Negar el valor
      this._valorDeVerdad = !this._valorDeVerdad;
      // también se niega el cuantificador
      if (this.cuantificador === Juicio.cuantificadorExiste) {
        this.cuantificador = Juicio.cuantificadorParaTodo;
      } else if (this.cuantificador === Juicio.cuantificadorParaTodo) {
        this.cuantificador = Juicio.cuantificadorExiste;
      }
    } else {
      // Negar la afirmación, cambiando la estructura de la oración o sentencia
      throw new Error('Sin implementar...');
    }

  }

  // y
  conjuncion(c) {
    let result;
    if (!this._valorDeVerdad) {
      result = false;
    } else {
      if (t instanceof Proposicion) {
        result = c.valorDeVerdad;
      } else {
        result = c;
      }
    }
    return result;
  }

  y(c) {
    return this.conjuncion(c);
  }

  // o
  disyuncion(c) {
    let result;
    if (this._valorDeVerdad) {
      result = true;
    } else {
      if (t instanceof Proposicion) {
        result = c.valorDeVerdad;
      } else {
        result = c;
      }
    }
    return result;
  }

  o(c) {
    return this.disyuncion(c);
  }
}

// OPERACION LOGICA
class OperacionLogica extends Juicio {

  // TIPOS DE VINCULO ENTRE LOS OPERADORES
  static vinculoCasual = 1;
  /*
  El nexo entre a y b es puramente casual, entre ellos no hay una conexión evidente de causa-efecto, y al no convenir expresar la
  operación en forma de implicación; no se aplican las inferencias: 4, 5, 6, 7, 8, 9 y 12,
  */
  static vinculoNecesario = 2;
  /*
  El nexo entre a y b es necesario, entre ellos hay una conexión causa-efecto, y al convenir expresar la
  operación en forma de implicación; pueden aplicarse las 20 formas de inferencia.
  */

  // TIPOS DE OPERACIONES LOGICAS
  static operacionIdentidad = 1;
  static operacionNegacion = 2;
  static operacionConjuncion = 3;
  static operacionDisyuncion = 4;

  constructor(tipoDeOperacion, argumentos, vinculo) {
    super();
    this.tipo = tipoDeOperacion;
    this.vinculo = vinculo;
    this.operadores = [];
    if (argumentos instanceof Array) {
      this.operadores.push(argumentos[0]);
      this.operadores.push(argumentos[1]);
    } else {
      this.operadores.push(argumentos);
    }
  }

  establecerValorDeVerdad(x) {
    switch (this.tipo) {
      case OperacionLogica.operacionIdentidad: {
        this.operadores[0].establecerValorDeVerdad(x);
      }
        break;
      case OperacionLogica.operacionNegacion: {
        this.operadores[0].establecerValorDeVerdad(!x);
      }
        break;
      case OperacionLogica.operacionConjuncion: {
        if (!x) {
          this.tipo = OperacionLogica.operacionDisyuncion; // Por la ley de Morgan
          this.operadores[0].negar();
          this.operadores[1].negar();
        }
      }
        break;
      case OperacionLogica.operacionDisyuncion: {
        if (!x) {
          this.tipo = OperacionLogica.operacionConjuncion; // Ídem
          this.operadores[0].negar();
          this.operadores[1].negar();
        }
      }
        break;
    }
  }

  obtenerValorDeVerdad() {
    switch (this.tipo) {
      case OperacionLogica.operacionIdentidad: {
        return this.operadores[0].obtenerValorDeVerdad();
      }
        break;
      case OperacionLogica.operacionNegacion: {
        return !this.operadores[0].obtenerValorDeVerdad();
      }
        break;
      case OperacionLogica.operacionConjuncion: {
        return (
          this.operadores[0].obtenerValorDeVerdad() &&
          this.operadores[1].obtenerValorDeVerdad()
        );
      }
        break;
      case OperacionLogica.operacionDisyuncion: {
        return (
          this.operadores[0].obtenerValorDeVerdad() ||
          this.operadores[1].obtenerValorDeVerdad()
        );
      }
        break;
    }
  }
}

class Oracion extends Relation {
  // TIPOS DE ORACIONES
  static tipoOracionEcunciativa = 1;    // Se le puede asignar un valor de verdad
  static tipoOracionDeclarativa = 2;    // Idem
  static tipoOracionImperativa = 3;     // Manda (No tiene valor de verdad)
  static tipoOracionExhortativa = 3;    // Idem
  static tipoOracionExclamativa = 4;    // Tampoco tienen valor de verdad, tienen finalidad expresiva
  static tipoOracionInterrogativa = 5;  // Tampoco... sirven para solicitar información.
  static tipoOracionDubitativa = 6;     // Expresan una suposición o probabilidad.
  static tipoOracionOptativa = 7;       // Expresan un deseo, se pueden pronunciar de forma exclamativa.
  static tipoOracionDesiderativa = 7;   // Idem

  constructor(oracion) {
    super();
    this.texto = oracion;
  }

  analizarOracion() {
    /*
            Esta función debe construir una proposición o juicio a partir del texto original de la oración, es decir:
            Sustantivo (o nombre del sujeto, si es necesario, construye el concepto)
            Adjetivo
            Artículo
            Pronombre
            Verbo
            Adverbio
            Interjección
            Preposición
            Conjunción

            algo así..., creo que se adecua bastante bien el siguiente modelo:
            La estructura de la gramática de una oración puede ser la siguiente:

            Sujeto
                Sujeto principal
                Frase preposicional
                Cláusula relativa
                    Verbo
                    Sujeto relativo
                    Frase preposicional
            Predicado
                Verbo
                Objeto principal
                Frase preposicional
                Cláusula relativa
                    Verbo
                    Sujeto relativo
                    Frase preposicional
               Frase adjetival (complemento directo)
               Frase adverbial (complemento indirecto)


        */
    this.sujeto = new Concepto('tal', conceptoSingular);
    this.predicado = new Concepto('masCual', conceptoGeneral);
    this.copula = copulaDefinicion;
  }
}

//
class Palabra extends WebSystemObject {
  // Español
  /** Syllabler gets a word and outputs and array containing its syllables.
   *  This code belongs to https://github.com/vic/silabas.js
   *
   *    The up´s comment and the code itself was taken from Lorca library by Lic Luis Guillermo Bultet Ibles.
   */
  #syllaber(data) {
    let stressedFound = false;
    let stressed = 0;
    let letterAccent = -1;

    let wordLength = data.length;
    let positions = [];
    let word = data;

    function process() {
      let numSyl = 0;

      // Look for syllables in the word
      for (let i = 0; i < wordLength;) {
        positions[numSyl++] = i;

        i = onset(i);
        i = nucleus(i);
        i = coda(i);

        if (stressedFound && stressed === 0) {
          stressed = numSyl; // it marks the stressed syllable
        }
      }

      // If the word has not written accent, the stressed syllable is determined
      // according to the stress rules
      if (!stressedFound) {
        if (numSyl < 2) {
          stressed = numSyl;
        }// Monosyllables
        else {
          // Polysyllables
          let endLetter = toLower(wordLength - 1);

          if (
            !isConsonant(wordLength - 1) ||
            endLetter === 'y' ||
            endLetter === 'n' ||
            (endLetter === 's' && !isConsonant(wordLength - 2))
          ) {
            stressed = numSyl - 1;
          }// Stressed penultimate syllable
          else {
            stressed = numSyl;
          } // Stressed last syllable
        }
      }
    }

    function onset(pos) {
      let lastConsonant = 'a';

      while (pos < wordLength && isConsonant(pos) && toLower(pos) !== 'y') {
        lastConsonant = toLower(pos);
        pos++;
      }

      // (q | g) + u (example: queso, gueto)
      if (pos < wordLength - 1) {
        if (toLower(pos) === 'u') {
          if (lastConsonant === 'q') {
            pos++;
          } else if (lastConsonant === 'g') {
            let letter = toLower(pos + 1);
            if (
              letter === 'e' ||
              letter === 'é' ||
              letter === 'i' ||
              letter === 'í'
            ) {
              pos++;
            }
          }
        } else if (toLower(pos) === 'ü' && lastConsonant === 'g') {
          // The 'u' with diaeresis is added to the consonant
          pos++;
        }
      }

      return pos;
    }

    function nucleus(pos) {
      // Saves the type of previous vowel when two vowels together exists
      let previous = 0;
      // 0 = open
      // 1 = close with written accent
      // 2 = close

      if (pos >= wordLength) return pos; // ¡¿Doesn't it have nucleus?!

      // Jumps a letter 'y' to the starting of nucleus, it is as consonant
      if (toLower(pos) === 'y') pos++;

      // First vowel
      if (pos < wordLength) {
        switch (toLower(pos)) {
          // Open-vowel or close-vowel with written accent
          case 'á':
          case 'à':
          case 'é':
          case 'è':
          case 'ó':
          case 'ò':
            letterAccent = pos;
            stressedFound = true;
            break;
          case 'a':
          case 'e':
          case 'o':
            previous = 0;
            pos++;
            break;
          // Close-vowel with written accent breaks some possible diphthong
          case 'í':
          case 'ì':
          case 'ú':
          case 'ù':
          case 'ü':
            letterAccent = pos;
            pos++;
            stressedFound = true;
            return pos;
          // Close-vowel
          case 'i':
          case 'I':
          case 'u':
          case 'U':
            previous = 2;
            pos++;
            break;
        }
      }

      // If 'h' has been inserted in the nucleus then it doesn't determine diphthong neither hiatus
      let aitch = false;
      if (pos < wordLength) {
        if (toLower(pos) === 'h') {
          pos++;
          aitch = true;
        }
      }

      // Second vowel
      if (pos < wordLength) {
        switch (toLower(pos)) {
          // Open-vowel with written accent
          case 'á':
          case 'à':
          case 'é':
          case 'è':
          case 'ó':
          case 'ò':
            letterAccent = pos;
            if (previous !== 0) {
              stressedFound = true;
            }
            break;
          case 'a':
          case 'e':
          case 'o':
            if (previous === 0) {
              // Two open-vowels don't form syllable
              if (aitch) pos--;
              return pos;
            } else {
              pos++;
            }

            break;

          // Close-vowel with written accent, can't be a triphthong, but would be a diphthong
          case 'í':
          case 'ì':
          case 'ú':
          case 'ù':
            letterAccent = pos;

            if (previous !== 0) {
              // Diphthong
              stressedFound = true;
              pos++;
            } else if (aitch) pos--;

            return pos;
          // Close-vowel
          case 'i':
          case 'u':
          case 'ü':
            if (pos < wordLength - 1) {
              // ¿Is there a third vowel?
              if (!isConsonant(pos + 1)) {
                if (toLower(pos - 1) === 'h') pos--;
                return pos;
              }
            }

            // Two equals close-vowels don't form diphthong
            if (toLower(pos) !== toLower(pos - 1)) pos++;

            return pos; // It is a descendent diphthong
        }
      }

      // Third vowel?
      if (pos < wordLength) {
        if (toLower(pos) === 'i' || toLower(pos) === 'u') {
          // Close-vowel
          pos++;
          return pos; // It is a triphthong
        }
      }

      return pos;
    }

    function coda(pos) {
      if (pos >= wordLength || !isConsonant(pos)) {
        return pos; // Syllable hasn't coda
      } else if (pos === wordLength - 1) {
        // End of word
        pos++;
        return pos;
      }

      // If there is only a consonant between vowels, it belongs to the following syllable
      if (!isConsonant(pos + 1)) return pos;

      let c1 = toLower(pos);
      let c2 = toLower(pos + 1);

      // Has the syllable a third consecutive consonant?
      if (pos < wordLength - 2) {
        let c3 = toLower(pos + 2);

        if (!isConsonant(pos + 2)) {
          // There isn't third consonant
          // The groups ll, ch and rr begin a syllable

          if (c1 === 'l' && c2 === 'l') return pos;
          if (c1 === 'c' && c2 === 'h') return pos;
          if (c1 === 'r' && c2 === 'r') return pos;

          // A consonant + 'h' begins a syllable, except for groups sh and rh
          if (c1 !== 's' && c1 !== 'r' && c2 === 'h') return pos;

          // If the letter 'y' is preceded by the some
          // letter 's', 'l', 'r', 'n' or 'c' then
          // a new syllable begins in the previous consonant
          // else it begins in the letter 'y'
          if (c2 === 'y') {
            if (c1 === 's' || c1 === 'l' || c1 === 'r' || c1 === 'n' || c1 === 'c') {
              return pos;
            }
            pos++;

            return pos;
          }

          // groups: gl - kl - bl - vl - pl - fl - tl
          if (
            (c1 === 'b' ||
              c1 === 'v' ||
              c1 === 'c' ||
              c1 === 'k' ||
              c1 === 'f' ||
              c1 === 'g' ||
              c1 === 'p' ||
              c1 === 't') &&
            c2 === 'l'
          ) {
            return pos;
          }

          // groups: gr - kr - dr - tr - br - vr - pr - fr
          if (
            (c1 === 'b' ||
              c1 === 'v' ||
              c1 === 'c' ||
              c1 === 'd' ||
              c1 === 'k' ||
              c1 === 'f' ||
              c1 === 'g' ||
              c1 === 'p' ||
              c1 === 't') &&
            c2 === 'r'
          ) {
            return pos;
          }

          pos++;

          return pos;
        } else {
          // There is a third consonant
          if (pos + 3 === wordLength) {
            // Three consonants to the end, foreign words?
            if (c2 === 'y') {
              // 'y' as vowel
              if (c1 === 's' || c1 === 'l' || c1 === 'r' || c1 === 'n' || c1 === 'c') {
                return pos;
              }
            }

            if (c3 === 'y') {
              // 'y' at the end as vowel with c2
              pos++;
            } else {
              // Three consonants to the end, foreign words?
              pos += 3;
            }
            return pos;
          }

          if (c2 === 'y') {
            // 'y' as vowel
            if (c1 === 's' || c1 === 'l' || c1 === 'r' || c1 === 'n' || c1 === 'c') {
              return pos;
            }

            pos++;
            return pos;
          }

          // The groups pt, ct, cn, ps, mn, gn, ft, pn, cz, tz and ts begin a syllable
          // when preceded by other consonant

          if (
            (c2 === 'p' && c3 === 't') ||
            (c2 === 'c' && c3 === 't') ||
            (c2 === 'c' && c3 === 'n') ||
            (c2 === 'p' && c3 === 's') ||
            (c2 === 'm' && c3 === 'n') ||
            (c2 === 'g' && c3 === 'n') ||
            (c2 === 'f' && c3 === 't') ||
            (c2 === 'p' && c3 === 'n') ||
            (c2 === 'c' && c3 === 'z') ||
            (c2 === 't' && c3 === 's') ||
            (c2 === 't' && c3 === 's')
          ) {
            pos++;
            return pos;
          }

          if (
            c3 === 'l' ||
            c3 === 'r' || // The consonantal groups formed by a consonant
            // following the letter 'l' or 'r' cann't be
            // separated and they always begin syllable
            (c2 === 'c' && c3 === 'h') || // 'ch'
            c3 === 'y'
          ) {
            // 'y' as vowel
            pos++; // Following syllable begins in c2
          } else {
            pos += 2;
          } // c3 begins the following syllable
        }
      } else {
        if (c2 === 'y') return pos;

        pos += 2; // The word ends with two consonants
      }

      return pos;
    }

    function toLower(pos) {
      return word[pos].toLowerCase();
    }

    function isConsonant(pos) {
      return !/[aeiouáéíóúàèìòùüAEIOUÁÉÍÓÚÀÈÌÒÙÜ]/.test(word[pos]);
    }

    process();

    //this.positions = function () {
    //   return positions;
    //};

    let syllables = [];

    for (let i = 0; i < positions.length; i++) {
      let start = positions[i];
      let end = wordLength;
      if (positions.length > i + 1) {
        end = positions[i + 1];
      }
      let seq = word.slice(start, end).replace(/ /, '').toLowerCase();
      syllables.push(seq);
    }

    return syllables;
  }

  // eliminar acentos en una palabra
  eliminarAcentos(palabra) {
    let accentedVowels = ['á', 'é', 'í', 'ó', 'ú'];
    let vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let i in accentedVowels) {
      palabra = String(palabra).replace(accentedVowels[i], vowels[i]);
    }
    return palabra;
  }

  // esta función devuelve verdadero si el argumento es una vocal.
  esVocal(c) {
    var regex = /[aeiouáéíóú]/gi;
    return regex.test(c);
  }

  // encuentra la posición de la próxima vocal dentro de una palabra a partir de una posición.
  posicionProximaVocal(palabra, start = 0) {
    let length = palabra.length;

    for (let position = start; position < length; position++) {
      if (this.esVocal(palabra[position])) {
        return position;
      }
    }

    return length;
  }

  // encuentra la posición de la próxima consonante dentro de una palabra a partir de una posición.
  posicionProximaConsonante(palabra, start = 0) {
    var length = palabra.length;

    for (var position = start; position < length; position++) {
      if (!this.esVocal(palabra[position])) {
        return position;
      }
    }

    return length;
  }

  arreglarTerminacion(word, suffixes) {
    var matches = [];
    for (var i in suffixes) {
      if (this.ends(word, suffixes[i])) {
        matches.push(suffixes[i]);
      }
    }
    var longest = matches.sort(function(a, b) {
      return b.length - a.length;
    })[0];

    if (longest) {
      return longest;
    } else {
      return '';
    }
  }

  /*

    Obtener la raiz de la palabra, esta función fue tomada originalmente desde el paquete Lorca-master.zip bajo la licencia:

    The MIT License (MIT)

    Copyright (C) 2018 Domingo Martín Mancera

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

  */

  #raiz_palabra(data) {
    var length = data.length;

    data = String(data.toLowerCase());

    if (length < 2) {
      return this.eliminarAcentos(data);
    }

    var r1, r2, rv;
    r1 = length;
    r2 = length;
    rv = length;

    // R1 is the region after the first non-vowel following a vowel, or is the null region
    // at the end of the word if there is no such non-vowel.
    for (let i = 0; i < length - 1 && r1 === length; i++) {
      if (this.esVocal(data[i]) && !this.esVocal(data[i + 1])) {
        r1 = i + 2;
      }
    }

    // R2 is the region after the first non-vowel following a vowel in R1,
    // or is the null region at the end of the word if there is no such non-vowel.
    for (var i = r1; i < length - 1 && r2 === length; i++) {
      if (this.esVocal(data[i]) && !this.esVocal(data[i + 1])) {
        r2 = i + 2;
      }
    }

    if (length > 3) {
      if (!this.esVocal(data[1])) {
        rv = this.posicionProximaVocal(data, 2) + 1;
      } else if (this.esVocal(data[0]) && this.esVocal(data[1])) {
        rv = this.posicionProximaConsonante(data, 2) + 1;
      } else {
        rv = 3;
      }
    }

    var r1Text = data.slice(r1);
    var r2Text = data.slice(r2);
    var rvText = data.slice(rv);
    var originalWord = data;

    // Step 0: Attached pronoun
    var pronounsufijo = [
      'me',
      'te',
      'se',
      'sela',
      'selo',
      'selas',
      'selos',
      'la',
      'le',
      'lo',
      'las',
      'les',
      'los',
      'nos',
    ];
    var pronounsufijoPre1 = ['iéndo', 'ándo', 'ár', 'ér', 'ír'];
    var pronounsufijoPre2 = ['iendo', 'ando', 'ar', 'er', 'ir'];

    var sufijo = this.arreglarTerminacion(data, pronounsufijo);

    if (sufijo !== '') {
      var presufijo = this.arreglarTerminacion(
        rvText.slice(0, -sufijo.length),
        pronounsufijoPre1,
      );

      if (presufijo !== '') {
        data = this.eliminarAcentos(data.slice(0, -sufijo.length));
      } else {
        presufijo = this.arreglarTerminacion(
          rvText.slice(0, -sufijo.length),
          pronounsufijoPre2,
        );

        if (
          presufijo !== '' ||
          this.ends(data.slice(0, -sufijo.length), 'uyendo')
        ) {
          data = data.slice(0, -sufijo.length);
        }
      }
    }

    if (data !== originalWord) {
      r1Text = data.slice(r1);
      r2Text = data.slice(r2);
      rvText = data.slice(rv);
    }

    var wordAfter0 = data; // alert(word);

    if (
      (suf = this.arreglarTerminacion(r2Text, [
        'anza',
        'anzas',
        'ico',
        'ica',
        'icos',
        'icas',
        'ismo',
        'ismos',
        'able',
        'ables',
        'ible',
        'ibles',
        'ista',
        'istas',
        'oso',
        'osa',
        'osos',
        'osas',
        'amiento',
        'amientos',
        'imiento',
        'imientos',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if (
      (suf = this.arreglarTerminacion(r2Text, [
        'icadora',
        'icador',
        'icación',
        'icadoras',
        'icadores',
        'icaciones',
        'icante',
        'icantes',
        'icancia',
        'icancias',
        'adora',
        'ador',
        'ación',
        'adoras',
        'adores',
        'aciones',
        'ante',
        'antes',
        'ancia',
        'ancias',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if ((suf = this.arreglarTerminacion(r2Text, ['logía', 'logías'])) !== '') {
      data = data.slice(0, -suf.length) + 'log';
    } else if ((suf = this.arreglarTerminacion(r2Text, ['ución', 'uciones'])) !== '') {
      data = data.slice(0, -suf.length) + 'u';
    } else if ((suf = this.arreglarTerminacion(r2Text, ['encia', 'encias'])) !== '') {
      data = data.slice(0, -suf.length) + 'ente';
    } else if (
      (suf = this.arreglarTerminacion(r2Text, [
        'ativamente',
        'ivamente',
        'osamente',
        'icamente',
        'adamente',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if ((suf = this.arreglarTerminacion(r1Text, ['amente'])) !== '') {
      data = data.slice(0, -suf.length);
    } else if (
      (suf = this.arreglarTerminacion(r2Text, [
        'antemente',
        'ablemente',
        'iblemente',
        'mente',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if (
      (suf = this.arreglarTerminacion(r2Text, [
        'abilidad',
        'abilidades',
        'icidad',
        'icidades',
        'ividad',
        'ividades',
        'idad',
        'idades',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if (
      (suf = this.arreglarTerminacion(r2Text, [
        'ativa',
        'ativo',
        'ativas',
        'ativos',
        'iva',
        'ivo',
        'ivas',
        'ivos',
      ])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    }

    if (data !== wordAfter0) {
      r1Text = data.slice(r1);
      r2Text = data.slice(r2);
      rvText = data.slice(rv);
    }
    var wordAfter1 = data; // alert(word);

    if (wordAfter0 === wordAfter1) {
      // Do step 2a if no ending was removed by step 1.
      var suf = this.arreglarTerminacion(rvText, [
        'ya',
        'ye',
        'yan',
        'yen',
        'yeron',
        'yendo',
        'yo',
        'yó',
        'yas',
        'yes',
        'yais',
        'yamos',
      ]);

      if (suf !== '' && data.slice(-suf.length - 1, -suf.length) === 'u') {
        data = data.slice(0, -suf.length);
      }

      if (data !== wordAfter1) {
        r1Text = data.slice(r1);
        r2Text = data.slice(r2);
        rvText = data.slice(rv);
      }

      var wordAfter2a = data; // alert("llega");
      // Do Step 2b if step 2a was done, but failed to remove a sufijo.
      if (wordAfter2a === wordAfter1) {
        if (
          (suf = this.arreglarTerminacion(rvText, [
            'arían',
            'arías',
            'arán',
            'arás',
            'aríais',
            'aría',
            'aréis',
            'aríamos',
            'aremos',
            'ará',
            'aré',
            'erían',
            'erías',
            'erán',
            'erás',
            'eríais',
            'ería',
            'eréis',
            'eríamos',
            'eremos',
            'erá',
            'eré',
            'irían',
            'irías',
            'irán',
            'irás',
            'iríais',
            'iría',
            'iréis',
            'iríamos',
            'iremos',
            'irá',
            'iré',
            'aba',
            'ada',
            'ida',
            'ía',
            'ara',
            'iera',
            'ad',
            'ed',
            'id',
            'ase',
            'iese',
            'aste',
            'iste',
            'an',
            'aban',
            'ían',
            'aran',
            'ieran',
            'asen',
            'iesen',
            'aron',
            'ieron',
            'ado',
            'ido',
            'ando',
            'iendo',
            'ió',
            'ar',
            'er',
            'ir',
            'as',
            'abas',
            'adas',
            'idas',
            'ías',
            'aras',
            'ieras',
            'ases',
            'ieses',
            'ís',
            'áis',
            'abais',
            'íais',
            'arais',
            'ierais',
            '  aseis',
            'ieseis',
            'asteis',
            'isteis',
            'ados',
            'idos',
            'amos',
            'ábamos',
            'íamos',
            'imos',
            'áramos',
            'iéramos',
            'iésemos',
            'ásemos',
          ])) !== ''
        ) {
          data = data.slice(0, -suf.length);
        } else if (
          (suf = this.arreglarTerminacion(rvText, ['en', 'es', 'éis', 'emos'])) !== ''
        ) {
          data = data.slice(0, -suf.length);
          if (this.ends(data, 'gu')) {
            data = data.slice(0, -1);
          }
        } else {
          // Y por último chequear los modificativos
          if (
            (suf = this.arreglarTerminacion(data, [
              'ísimo',
              'ísima',
              'ito',
              'ita',
              'ezno',
              'ulón',
              'ulona',
              'ucón',
              'ucona',
              'ón',
              'ona',
            ])) !== ''
          ) {
            data = data.slice(0, -suf.length);
          }
        }
      }
    }

    r1Text = data.slice(r1);
    r2Text = data.slice(r2);
    rvText = data.slice(rv);

    if (
      (suf = this.arreglarTerminacion(rvText, ['os', 'a', 'o', 'á', 'í', 'ó'])) !== ''
    ) {
      data = data.slice(0, -suf.length);
    } else if (this.arreglarTerminacion(rvText, ['e', 'é']) !== '') {
      data = data.slice(0, -1);
      rvText = data.slice(rv);
      if (this.ends(rvText, 'u') && this.ends(data, 'gu')) {
        data = data.slice(0, -1);
      }
    }

    return this.eliminarAcentos(data);
  }

  constructor(word) {
    super(...arguments);
    this.palabra = String(word);
  }

  // Acceso al texto de la palabra

  get palabra() {
    return this._data;
  }

  set palabra(v) {
    this._data = String(v);
  }

  // Obtener el arreglo de sílabas de la palabra
  get silabas() {
    return this.#syllaber(this.data);
  }

  //

}






