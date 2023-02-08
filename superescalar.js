// Para representar números enteros extremadamente grandes (naturales no negativos).
class SuperScalar {

        // this privates inheritances for polymorphic internal use only...
        static #ScalarZero = class extends SuperScalar {
            constructor() {
                super(null, true);
            }

            toString() {
                return "0";
            }
        }

        static #ScalarPrime = class extends SuperScalar {
            constructor(index) {
                super({index}, true);
            }

            toString() {
                return this.primeValue(this.stru.index).toString();
            }
        }

        static #ScalarFactor = class extends SuperScalar { // 1 is considered
            constructor({base, exponent}) {

                let baseLikeMe = base instanceof SuperScalar ? base : new SuperScalar(base);
                let exponentLikeMe = exponent instanceof SuperScalar ? exponent : new SuperScalar(exponent);

                if (baseLikeMe instanceof SuperScalar.ScalarZero) {
                    new SuperScalar.ScalarZero();
                } else { // incluir lo que pasa cuando la base es 1... o es un número primo de exponente 1, se crean dos cosas diferentes...
                    super({base: baseLikeMe, exponent: exponentLikeMe});
                }
            }

            toString() {
                return this.strPow(this.primeValue(this.stru.base), this.stru.exponent).toString();
            }
        }

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
                // se asume que todas las potencias comienzan en 2...
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
        }

        static #ScalarInfinity = class extends SuperScalar.#ScalarProduct {
            constructor() {
                super([]);
            }

            toString() {
                return "∞";
            }
        }

        static #ScalarUndefined = class extends SuperScalar {
            constructor() {
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
                        new SuperScalar.#ScalarZero();
                    } else if (this.reallyisprime(definition)) {
                        let primeIndex = this.primeIndex(definition);
                        new SuperScalar.#ScalarPrime(primeIndex);
                    } else if (this.#reallyisfactor(definition)) {
                        let factorFields = this.factorsFields(definition)
                        new SuperScalar.#ScalarFactor(factorFields);
                    } else {
                        let factors = this.primeFactors(definition);
                        new SuperScalar.#ScalarProduct(...factors);
                    }
                } else if (definition instanceof String || typeof definition === "string") {
                    if (definition[0] = "+") { // supress preceding sign & reconstruct all again
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

        // Algunos valores para función pi de Euler en los valores 2^i (i=1 to 76)
        // from: http://sweet.ua.pt/tos/hobbies.html (c) 2012-2016, Tomás Oliveira e Silva
        static piOfTwoPowers_1_to_76 = ['1','2','4','6','11','18','31','54','97','172','309','564','1028','1900','3512',
            '6542','12251','23000','43390','82025','155611','295947','564163','1077871','2063689','3957809','7603553',
            '14630843','28192750','54400028','105097565','203280221','393615806','762939111','1480206279','2874398515',
            '5586502348','10866266172','21151907950','41203088796','80316571436','156661034233','305761713237',
            '597116381732','1166746786182','2280998753949','4461632979717','8731188863470','17094432576778',
            '33483379603407','65612899915304','128625503610475','252252704148404','494890204904784','971269945245201',
            '1906879381028850','3745011184713964','7357400267843990','14458792895301660','28423094496953330',
            '55890484045084135','109932807585469973','216289611853439384','425656284035217743','837903145466607212',
            '1649819700464785589','3249254387052557215','6400771597544937806','12611864618760352880',
            '24855455363362685793','48995571600129458363','96601075195075186855','190499823401327905601',
            '375744164937699609596','741263521140740113483','1462626667154509638735'];

        // Euler's Pi function optimize later (test it please)
        primeIndex(to, from = 0n) {
            let deep = BigInt(to.toString());
            let point = BigInt(from.toString());
            let count = 0n;
            let step = from <= to ? 1n : -1n;
            while (point <= deep) {
                if (this.reallyisprime(point)) {
                    count = count + 1n;
                }
                point = point + step;
            }
            return count;
        }

        reallyisprime(n) { // ok
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
                while (!this.reallyisprime(value)) {
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
            return this.#group(facs).map((elements, index, arr) => {
                return {factor: new SuperScalar(index), exponent: new SuperScalar(arr.length)}
            });
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
            deep = BigInt(this.strRoot(2, deep)); // tentative limit
            while (deep > 2n) {
                if (deep % divisor === 0n) {
                    factors.push(divisor);
                    deep = deep / divisor;
                } else {
                    divisor++
                }
                i++;
            }
            return factors;
        }

        isProduct() {
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
            let result = 1n;
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
