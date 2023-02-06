    // Para representar números enteros extremadamente grandes (naturales no negativos).
    class SuperScalar {

        // this privates inheritances for polymorphic internal use only...
        static #ScalarZero = class extends SuperScalar {
            Constructor() {
                super();
            }

            toString() {
                return "0";
            }
        }

        static #ScalarPrime = class extends SuperScalar {
            Constructor(index) {
                super({index});
            }

            toString() {
                return this.#pi_value(this.stru.index).toString();
            }
        }

        static #ScalarFactor = class extends SuperScalar { // 1 is considered
            Constructor({base, exponent}) {

                let baseLikeMe = base instanceof SuperScalar ? base : new SuperScalar(base);
                let exponentLikeMe = exponent instanceof SuperScalar ? exponent : new SuperScalar(exponent);

                if (baseLikeMe instanceof SuperScalar.ScalarZero) {
                    this = new SuperScalar.ScalarZero();
                } else { // incluir lo que pasa cuando la base es 1... o es un número primo de exponente 1, se crean dos cosas diferentes...
                    super({base: baseLikeMe, exponent: exponentLikeMe});
                }
            }

            toString() {
                return this.strPow(this.prime(this.stru.index).toString(), this.stru.exponent.toString());
            }
        }

        static #ScalarProduct = class extends SuperScalar {
            // Arreglo de factores, el índice del primero es absoluto, los demás...
            Constructor(factors) {
                super(...factors);
                // Lo anterior guarda la estructura de factores en stru, 
                // el próximo paso es optimizar, recuerda el primer índice es absoluto
                // y el siguiente es relativo al primero...
                // el 1 (uno), se representa 2^0 normal
                // el dos se representa 2^1 normal
                // y así sucesivamente...
                // Pero eso solamente lo utilizamos para el dos, para los otros primos 
                // internamente le sumamos 1 a los exponentes para no redundar...
            }

            toString() {
                let product = "1";
                this.stru.factors.forEach((fac) => {
                    product = this.strMultiply(product, (new SuperScalar(fac)).toString());
                })
                return product;
            }
        }

        static #ScalarInfinity = class extends SuperScalar.#ScalarProduct {
            Constructor() {
                super([]);
            }

            toString() {
                return "∞";
            }
        }

        static #ScalarUndefined = class extends SuperScalar {
            Constructor() {
                super();
            }

            toString() {
                return "undefined";
            }
        }

        // Pueden crearse clases auxiliares para representar números en forma de sumas, diferencias o
        // factoriales sin evaluar... especialmente cuando se dificulte la factorización.

        constructor(definition) {
            if (definition) {
                if (definition instanceof SuperScalar) {
                    this.stru = definition.stru; // Acepta un Number, BigInteger o objeto Scalar.
                } else if (definition instanceof Number || definition instanceof BigInt) {
                    if (definition === 0) {
                        this = new SuperScalar.#ScalarZero();
                    } else if (this.#reallyisprime(definition)) {
                        let primeIndex = this.primeIndex(definition);
                        this = new SuperScalar.#ScalarPrime(primeIndex);
                    } else if (this.#reallyisfactor(definition)) {
                        let factorFields = this.factorsFields(definition)
                        this = new SuperScalar.#ScalarFactor(factorFields);
                    } else {
                        let factors = this.primeFactors(definition);
                        this = new SuperScalar.#ScalarProduct(...factors);
                    }
                } else if (definition instanceof String || typeof definition === "string") {
                    if (definition[0] = "+") { // supress preceding sign & reconstruct all again
                        new SuperScalar(definition.substr(1).trim);
                    }
                    if (this.potable(definition).success) {
                        this = new SuperScalar(Number(definition));
                    } else if (definition instanceof BigInt) {
                        this = new SuperScalar(BigInt(definition));
                    } else if (definition.trim() === "∞" || definition.trim() === "Infinity") {
                        this = new SuperScalar.#ScalarInfinity();
                    }
                }
            } else {
                this = new ScalarZero();
            }
        }

        // Primitives

        isZero(definition) {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarZero;
        }

        isPrime(definition) { // 2 is considered prime number 0
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarPrime;
        }

        isProduct(definition) { // Todos excepto 0, 1, y los números primos (∞ siempre se considera).
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarProduct;
        }

        isInfinity(definition) { // 2 is considered prime number 0
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarInfinity;
        }

        // Euler's Pi function optimize later (Test it please)
        primeIndex(definition) {
            let deep = BigInt(definition.toString()); // brutal for now
            let count = 0n;
            while (deep > 0n) {
                while (deep > 0n && !this.#reallyisprime(deep)) {
                    deep--;
                }
                if (deep === 0n) {
                    break;
                }
                count++;
            }
            return count;
        }

        #reallyisprime(n) { // ok
            let deep = BigInt(n.toString());
            if (deep < 2n) return false;
            if (deep === 2n || deep === 3n || deep === 5n) {
                return true;
            }
            if (deep % 2n === 0n || deep % 3n === 0n || deep % 5n === 0n) {
                return false;
            }
            for (let i = 2n; i < BigInt(this.strRoot(deep.toString(), 2n)); i++) {
                if (deep % i === 0n) {
                    return false;
                }
            }
            return true;
        }

        #group(factors) {
            const groupedResult = factors.reduce((previous, current) => {
                if (!previous[current]) {
                    previous[current] = [];
                }
                previous[current].push(current);
                return previous;
            }, {});
            return groupedResult;
        }

        #reallyisfactor(n) {
            let deep = BigInt(n.toString());
            return this.#group(this.primeFactors(deep)).length === 1;
        }

        primeValue(index) {
            let deep = BigInt(index.toString());
            let result = 0n; // brutal for now
            let value = 2n;
            while (result < deep) {
                result++;
                while (!this.#reallyisprime(value)) {
                    value++;
                }
            }
            return value;
        }

        isFactor() {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarFactor;
        }

        factorsFields(n) { // lets go
            let deep = BigInt(n.toString);
            let facs = this.primeFactors(deep).sort((a, b) => a - b);
            return this.#group(facs).map((elements, index, arr) => {return {factor: new SuperScalar(index), exponent: new SuperScalar(arr.length)}});            
        }

        primeFactors(n) { // ok
            let deep = BigInt(n.toString());
            const factors = [];
            if (deep === 0n) {
                return [];
            } else if (deep <= 2n) {
                return [2];
            }
            let divisor = 2n;
            let i = 0n
            let deep = BigInt(this.strRoot(2, deep)); // tentative limit
            while (deep > 2n) {
                if (deep % divisor == 0n) {
                    factors.push(divisor);
                    deep = deep / divisor;
                } else {
                    divisor++
                }
                i++;
            }
            return factors;
        }

        isFactor() {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof SuperScalar.#ScalarProduct;
        }

        potable(definition = "") {
            let deep = definition.toString();
            let MAX_INT = String(9007199254740992);
            let myLen = deep.toString().length;
            let result = {success: true, value: undefined};
            try {
                result.value = Number(deep);
                result.success = myLen > 0 && (myLen < MAX_INT.length || (myLen === MAX_INT.length && BigInt(result.value) <= BigInt(MAX_INT))) && (result.value > 0n);
            } catch (e) {
                result.success = false;
            }
            result.success = result.success && (String(deep).trim() === String(result.value).trim());
            return result;
        }

        // Multiplies str1 and str2, and prints result.
        strMultiply(str1, str2) {
            return (BigInt(str1) * BigInt(str2)).toString();
        }

        // function to implement division with large number (str1 by str2)
        strDivide(str1, str2) {
            return (BigInt(str1) / BigInt(str2)).toString();
        }

        // ported to Google Bigint by Luis Guillermo Bultet Ibles 15/05/2021. 10:31AM (Solo enteros) from
        // from stackoverflow, raiz enésima
        // https://stackoverflow.com/questions/64190185/how-do-i-extract-the-nth-root-of-a-bigint-in-javascript
        strRoot(root, value) {
            if (a = this.potable(str1).success && b = this.potable(str2).success) {
                return String(Math.pow(a.value, 1 / b.value));
            }
            let base = BigInt(value);
            let r = BigInt(root);
            let s = base + 1n;
            let k1 = r - 1n;
            let u = base;
            while (u < s) {
                s = u;
                u = ((u * k1) + base / BigInt(this.strPow(u.toString(), k1.toString()))) / r;
            }
            return s.toString();
        }


        strPow(str1, str2) {
            if (a = this.potable(str1).success && b = this.potable(str2).success) {
                return String(Math.pow(a.value, b.value));
            }
            // just work with strings
            let base = BigInt(str1);
            let exponent = BigInt(str2);
            let result = 1n;
            if (base === 0n) {
                return "0";
            }
            if (exponent === 1n) {
                return base.toString();
            }
            while (exponent > 2n && exponent % 2n === 0n) { // Legendre
                base = base * base;
                exponent = exponent / 2n;
            }
            return (base * BigInt(this.strPow(base.toString(), (exponent - 1n).toString()))).toString();
        }

    }
