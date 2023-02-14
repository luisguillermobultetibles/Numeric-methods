        // Clase para representar números enteros extremadamente grandes (naturales no negativos),
    // implementación del Teorema fundamental de la aritmética, en lenguaje OOP de Javascript.
    class SuperScalar {

        // this privates inheritances for polymorphic internal use only...
        static #ScalarZero = class extends SuperScalar {
            constructor() {
                super(null, true);
            }

            toString() {
                return "0";
            }
        };

        static #ScalarPrime = class extends SuperScalar {
            constructor(index) {
                super({ index }, true);
            }

            toString() {
                return this.primeValue(this.stru.index).toString();
            }
        };

        static #ScalarFactor = class extends SuperScalar { // 1 is considered
            constructor({ base, exponent }) {

                let baseLikeMe = base instanceof SuperScalar ? base : new SuperScalar(base);
                let exponentLikeMe = exponent instanceof SuperScalar ? exponent : new SuperScalar(exponent);

                if (baseLikeMe instanceof SuperScalar.#ScalarZero) {
                    new SuperScalar.#ScalarZero();
                } else { // incluir lo que pasa cuando la base es 1... o es un número primo de exponente 1, se crean dos cosas diferentes...
                    super({ base: baseLikeMe, exponent: exponentLikeMe });
                }
            }

            toString() {
                return this.strPow(this.primeValue(this.stru.base), this.stru.exponent).toString();
            }
        };

        static #ScalarProduct = class extends SuperScalar {
            // Arreglo de factores, el índice del primero es absoluto, los demás...
            constructor(factors) {
                super(...factors);
                // Lo anterior guarda la estructura de factores en stru,
                // el próximo paso es optimizar, recuerda el primer índice es absoluto
                // y los consecuentes, relativos a los precedentes
                // el 1 (uno), normalmente se representa 2^0, y
                // el dos se representa 2^1 (ambos se expresan como potencias de dos)
                // pero eso solamente lo utilizamos para el dos, para los otros números
                // primos, desactivamos esta posibilidad, con el fin de evitar redundancias
                // se asume que todas las potencias comienzan en 1...
                // al optimizarse, solamente el primer número es el índice de un número
                // primo, los subsiguientes ni siquiera son índices de ellos (primos) sino
                // que constituyen diferencias relativas, donde 0, desde luego significa
                // el siguiente número primo de la criba, pd ds.
                // Esto es solamente para las bases, los exponentes de cada factor se
                // codifican normalmente y no se les aplica tal relativización.
            }

            toString() {
                let product = "1";
                let previousPrimeIndex = 0n;
                this.stru.factors.forEach((fac) => {
                    product = this.strMultiply(product, this.strPow(this.primeValue(this.strAdd(previousPrimeIndex, fac.base)), fac.exponent));
                    previousPrimeIndex = this.strSubtract(fac.base, previousPrimeIndex);
                });
                return product;
            }
        };

        static #ScalarInfinity = class extends SuperScalar.#ScalarProduct {
            constructor() {
                super([]);
            }

            toString() {
                return "∞";
            }
        };

        static #ScalarUndefined = class extends SuperScalar {
            constructor() {
                super();
            }

            toString() {
                return "undefined";
            }
        };

        // https://oeis.org/A007053/b007053.txt
        static mersennesPrimesIndexes = ["1", "2", "4", "6", "11", "18", "31", "54", "97", "172", "309", "564", "1028", "1900", "3512", "6542", "12251", "23000", "43390", "82025", "155611", "295947", "564163", "1077871", "2063689", "3957809", "7603553", "14630843", "28192750", "54400028", "105097565", "203280221", "393615806", "762939111", "1480206279", "2874398515", "5586502348", "10866266172", "21151907950", "41203088796", "80316571436", "156661034233", "305761713237", "597116381732", "1166746786182", "2280998753949", "4461632979717", "8731188863470", "17094432576778", "33483379603407", "65612899915304", "128625503610475", "252252704148404", "494890204904784", "971269945245201", "1906879381028850", "3745011184713964", "7357400267843990", "14458792895301660", "28423094496953330", "55890484045084135", "109932807585469973", "216289611853439384", "425656284035217743", "837903145466607212", "1649819700464785589", "3249254387052557215", "6400771597544937806", "12611864618760352880", "24855455363362685793", "48995571600129458363", "96601075195075186855", "190499823401327905601", "375744164937699609596", "741263521140740113483", "1462626667154509638735", "2886507381056867953916", "5697549648954257752872", "11248065615133675809379", "22209558889635384205844", "43860397052947409356492", "86631124695994360074872", "171136408646923240987028", "338124238545210097236684", "668150111666935905701562", "1320486952377516565496055", "2610087356951889016077639", "5159830247726102115466054", "10201730804263125133012340", "20172933541156002700963336", "39895115987049029184882256", "78908656317357166866404346"];

        // some Mersenne numbers (the two exponent) from 1 to 50
        static mersennes = ["2", "3", "5", "7", "13", "17", "19", "31", "61", "89", "107", "127", "521", "607", "1279", "2203", "2281", "3217", "4253", "4423", "9689", "9941", "11213", "19937", "21701", "23209", "44497", "86243", "110503", "132049", "216091", "756839", "859433", "1257787", "1398269", "2976221", "3021377", "6972593", "13466917", "20996011", "24036583", "25964951", "30402457", "32582657", "37156667", "42643801", "43112609", "57885161", "74207281", "77232917"];

        constructor(definition) {
            if (definition) {
                if (definition instanceof SuperScalar) {
                    this.stru = definition.stru; // Acepta un Number, BigInteger o objeto Scalar.
                } else if (definition instanceof Number || definition instanceof BigInt) {
                    if (BigInt(definition) === 0n) {
                        new SuperScalar.#ScalarZero();
                    } else if (this.primality(definition)) {
                        let primeIndex = this.primeIndex(definition);
                        new SuperScalar.#ScalarPrime(primeIndex);
                    } else {
                        let factorFields = this.group(this.primeFactors(definition));
                        if (factorFields.length === 1) {
                            new SuperScalar.#ScalarFactor(factorFields[0]);
                        } else {
                            new SuperScalar.#ScalarProduct(factorFields);
                        }
                    }
                } else if (definition instanceof String || typeof definition === "string") {
                    if (definition[0] === "+") { // supress preceding sign & reconstruct all again
                        new SuperScalar(definition.substr(1).trim);
                    }
                    if (this.potable(definition).success) {
                        new SuperScalar(Number(definition));
                    } else if (definition instanceof BigInt) {
                        new SuperScalar(BigInt(definition));
                    } else if (definition.trim() === "∞" || definition.trim() === "Infinity") {
                        new SuperScalar.#ScalarInfinity();
                    }
                } else if (definition.toString() === "0") {
                    new SuperScalar.#ScalarZero();
                }
            }
        }

        isZero(definition) {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarZero;
        }

        isPrime(definition) { // 2 is considered prime number 0
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarPrime;
        }

        // Pueden crearse clases auxiliares para representar números en forma de sumas, diferencias o
        // factoriales sin evaluar... especialmente cuando se dificulte la factorización.

        isProduct(definition) { // Todos excepto 0, 1, y los números primos (∞ siempre se considera).
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarProduct;
        }

        // Primitives

        isInfinity(definition) { // 2 is considered prime number 0
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarInfinity;
        }

        // Euler's Pi function optimize later (test it please)
        #subPrimeIndex(to, from = 0n) {
            let deep = BigInt(to.toString());
            let point = BigInt(from.toString());
            let count = 0n;
            let step = from <= to ? 1n : -1n;
            while (step > 0 ? point <= deep : point >= deep) {
                if (this.primality(point)) {
                    count = count + 1n;
                }
                point = point + step;
            }
            return step * count;
        }
        primeIndex(value) {


            let deep = BigInt(value);

            // Distancia que podemos recorrar localizando un primo desde uno conocido
            const carrier = 10000;

            let result;

            if (deep < carrier) {
                result = this.#subPrimeIndex(deep);
            } else {
                // Tratar de encontrar el índice por cercanía,
                // si no está lo suficientemente cerca, utiliza la función Li,
                // o lo mejor que tengas, no hay de otra.
                result = this.#subPrimeIndex(0, deep.value);
            }
            return result;
        }

        // modpow
        #modpow(baseP, expP, mP) {
            let base = BigInt(baseP);
            let exp = BigInt(expP);
            let m = BigInt(mP);

            if (m === 1n) return 0n;
            if (exp === 0n) return 1n;
            if (base === 0n) return 0n;
            if (((base < 10n) && (exp < 10n) && (m < 10n)) || (exp < 1n)) {
                return BigInt(this.strPow(base, exp)) % m;
            }

            while (exp >= 2n && exp % 2n === 0n) {
                exp /= 2n;
                base = BigInt(this.strPow(base, 2n));
            }
            while (exp >= 3n && exp % 3n === 0n) {
                exp /= 3n;
                base = BigInt(this.strPow(base, 3n));
            }
            while (exp >= 5n && exp % 5n === 0n) {
                exp /= 5n;
                base = BigInt(this.strPow(base, 5n));
            }

            if (exp > 1000n) {
                let r = BigInt(this.strRoot(2n, exp));
                return this.#modpow(this.#modpow(base, r, m), r, m);
            }

            return ((base * this.#modpow(base, exp - 1n, m))) % m;
        }

        // Función gamma (recursiva sin optimizar).
        #gamma(n) {
            let x = BigInt(n);
            switch (x) {
                case 0n:
                    return 1n;
                case 1n:
                    return 1n;
                case 2n:
                    return 1n;
                default:
                    return (x - 1n) * this.#gamma(x - 2n);
            }
        }

        // Función "resto" de la división [(base^exp) ± d] mod m
        #modpowplus(base, exp, d, m) {
            return (m + this.#modpow(base, exp, m) + d % m) % m; // m added to > 0 results.
        }

        gcd(aP, bP) {
            function min(x, y) {
                if (x < y) return x; else return y;
            }

            function max(x, y) {
                if (x > y) return x; else return y;
            }

            let a = BigInt(aP);
            let b = BigInt(bP);
            let result;
            let [minFactor, maxFactor] = [BigInt(min(a, b)), BigInt(max(a, b))];
            // this trivial checks avoids div. by zero.
            if (minFactor === 0n) {
                if (maxFactor === 0n) {
                    result = Infinity;
                } else {
                    result = maxFactor;
                }
            } else if (maxFactor === 0n) {
                if (minFactor === 0n) {
                    result = Infinity;
                } else {
                    result = minFactor;
                }
            } else {
                result = maxFactor;
                while (minFactor !== 0n) {
                    maxFactor = result;
                    result = minFactor;
                    minFactor = maxFactor % minFactor;
                }
            }
            return result;
        }

        // Hipótesis china
        hch(n) {
            return this.#modpow(2n, n, n) === 2n;
        }

        // Pequeño teorema de Fermat
        ptf(n) {
            return this.#modpow(2n, n - 1n, n) === 1n;
        }

        // Teorema de Wilson (is BigInt, pls use 0n, 2n, 3n,... instead of 0, 1, 2, 3).
        tw(n) {
            return this.#gamma(n) % n === 1n;
        }

        primality(n) { // ok
            let deep = BigInt(n.toString());
            if (deep < 2n) return false;
            if (deep === 2n || deep === 3n || deep === 5n) {
                return true;
            }
            if (deep % 2n === 0n || deep % 3n === 0n || deep % 5n === 0n) {
                return false;
            }
            for (let i = 7n; i < BigInt(this.strRoot(2n, deep.toString())); i = i + 1n) {
                if (deep % i === 0n) {
                    return false;
                }
            }
            return true;
        }

        primeValue(index) {
            let deep = BigInt(index.toString());
            let result = 0n; // brutal for now
            let value = 2n;
            while (result < deep) {
                result++;
                while (!this.primality(value)) {
                    value++;
                }
            }
            return value;
        }

        isFactor(definition) {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarFactor;
        }

        // fix
        factorsFields(n, previousIndex = 0) { // lets go
            let deep = BigInt(String(n));
            let facs = this.group(this.primeFactors(deep));
            let previous = 0;
            return facs.map((element, index, arr) => {
                let newIndex = this.strSubtract(this.primeIndex(element.factor), previous);
                previous = newIndex;
                return { factor: new SuperScalar.#ScalarPrime(newIndex), exponent: new SuperScalar(element.exponent) };
            });
        }

        group(array) {
            let groupedResult = array.reduce((previous, current) => {
                if (!previous[current]) previous[current] = [];
                previous[current].push(current);
                return previous;
            }, []);
            groupedResult = groupedResult.sort((a, b) => a - b).filter((defined) => defined);
            groupedResult = groupedResult.map((factors) => {
                return { factor: factors[0], exponent: factors.length };
            });
            return groupedResult;
        }

        primeFactors(n) { // ok
            let deep = BigInt(n.toString());
            let factors = [];
            if (deep === 0n) {
                return [];
            } else if (deep === 1n) {
                return [2n];
            } else if (deep === 2n || deep === 3n || deep === 5n) {
                return [deep];
            }
            let divisor = 2n;
            let root = BigInt(this.strRoot(2, deep)) + 2n; // tentative limit
            while (divisor < root) {
                while (deep % divisor === 0n) {
                    factors.push(divisor);
                    deep = deep / divisor;
                }
                divisor++;
            }
            if (factors.length === 0) {
                factors.push(deep);
            }
            return factors;
        }

        potable(definition = "") {
            let deep = definition.toString();
            let MAX_INT = String(9007199254740992);
            let myLen = deep.toString().length;
            let result = { success: true, value: undefined };
            try {
                result.value = Number(deep);
                result.success = myLen > 0 && (myLen < MAX_INT.length || (myLen === MAX_INT.length && BigInt(result.value) <= BigInt(MAX_INT))) && (result.value > 0n);
            } catch (e) {
                result.success = false;
            }
            result.success = result.success && (String(deep).trim() === String(result.value).trim());
            return result;
        }

        strAdd(str1, str2) {
            return (BigInt(str1.toString()) + BigInt(str2.toString())).toString();
        }

        strSubtract(str1, str2) {
            return (BigInt(str1.toString()) - BigInt(str2.toString())).toString();
        }

        // Multiplies two stringifisable factors whatever they are, and return result.
        strMultiply(str1, str2) {
            return (BigInt(str1.toString()) * BigInt(str2.toString())).toString();
        }

        // By the way (str1 by str2)
        strDivide(str1, str2) {
            return (BigInt(str1.toString()) / BigInt(str2.toString())).toString();
        }

        // Enesimal root of value
        strRoot(root, value) {
            let result;
            let a = this.potable(root.toString());
            let b = this.potable(value.toString());
            if (a.success && b.success) {
                result = Math.trunc(Math.pow(b.value, 1 / a.value));
            } else {
                let base = BigInt(value.toString());
                let r = BigInt(root.toString());
                let s = base + 1n;
                let k1 = r - 1n;
                let u = base;
                while (u < s) {
                    s = u;
                    u = ((u * k1) + base / BigInt(this.strPow(u, k1))) / r;
                }
                result = s;
            }
            return result.toString();
        }

        // Raise the base at the power of exponent
        strPow(base, exponent) {
            // just work with strings (again)
            let bigBase = BigInt(String(base));
            let bigExponent = BigInt(String(exponent));
            let result;
            if (bigBase === 0n) {
                result = "0";
            } else if (bigExponent === 1n) {
                result = bigBase;
            } else if (bigExponent === 0n) {
                result = "1";
            } else {
                while (bigExponent > 2n && bigExponent % 2n === 0n) { // Legendre alg.
                    bigBase = bigBase * bigBase;
                    bigExponent = bigExponent / 2n;
                }
                result = (bigBase * BigInt(this.strPow(bigBase, (bigExponent - 1n))));
            }
            return String(result);
        }
    }
