    // Para representar números enteros extremadamente grandes.
    class SuperScalar {

        // this privates inheritances for polymorphic internal use only...
        ScalarZero = class extends SuperScalar {
            Constructor() {
                super();
            }

            toString() {
                return "0";
            }
        }

        ScalarPrime = class extends SuperScalar {
            Constructor(index) {
                super({index});
            }

            toString() {
                return this.#pi_value(this.stru.index).toString();
            }
        }

        ScalarFactor = class extends SuperScalar { // 1 is considered
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

        ScalarProduct = class extends SuperScalar {
            // Arreglo de factores, el índice del primero es absoluto, los demás...
            Constructor(factors) {
                super(...factors);
            }

            toString() {
                let product = "1";
                this.stru.factors.forEach((fac) => {
                    product = this.strMultiply(product, (new SuperScalar(fac)));
                })
                return product;
            }
        }

        constructor(definition) {
            if (definition) {
                if (definition instanceof SuperScalar) {
                    this.stru = definition.stru; // Acepta un Number, BigInteger o objeto Scalar.
                } else if (definition instanceof Number || definition instanceof BigInt) {
                    if (definition === 0) {
                        this = new this.ScalarZero();
                    } else if (this.isPrime(definition)) {
                        let primeIndex = this.primeIndex(definition);
                        this = new this.ScalarPrime(primeIndex);
                    } else if (this.isFactor(definition)) {
                        let factorFields = this.factorsFields(definition)
                        this = new this.ScalarFactor(factorFields);
                    } else {
                        let factors = this.getFactors(definition);
                        this = new this.ScalarProduct(factors);
                    }
                } else if (definition instanceof String || typeof definition === "string") {
                    if (this.potable(definition)) {


                        this = new SuperScalar(Number(definition));
                    } else if (definition instanceof BigInt) {
                        this = new SuperScalar(BigInt(definition));
                    }
                } else {
                    throw new Error(`We cannot construct, this: ¿ ->${definition.toString()}<- Number?.`);
                }
            } else {
                this = new ScalarZero();
            }
        }

        // Primitives

        isZero(definition) {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof this.ScalarZero;
        }

        isPrime(definition) { // 2 is considered prime number 0
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof this.ScalarPrime;
        }

        // Euler's Pi function optimize later (Test it please)
        primeIndex(definition) {
            let result = BigInt(definition.toString()); // brutal for now
            let count = 0n;
            while (result > 0n) {
                while (result > 0n && !this.reallyisprime(result)) {
                    result--;
                }
                if (result === 0n) {
                    break;
                }
                count++;
            }
            return count;
        }

        // optimize later
        reallyisprime(big) {
            let asbigi = BigInt(big.toString());
            if (asbigi === BigInt(0) || asbigi === BigInt(1)) {
                return false;
            } else if (asbigi === 2n || asbigi === 3n || asbigi === 5n) {
                return true;
            } else if (asbigi % 2n === 0n || asbigi % 3n === 0n || asbigi % 5n === 0n) {
                return false;
            }
            let root = BigInt(this.strRoot(asbigi.toString(), "2"));
            console.warn('Test it please');
            for (let i = 2n; i < root; i++) {
                if (asbigi % i === 0n) {
                    return false;
                }
            }
            return true;
        }

        // Prime serie's function optimize later (Test it please)
        primeValue(index) {
            let result = 0n; // brutal for now
            let value = 2n;
            while (result < BigInt(index)) {
                result++;
                while (!this.reallyisprime(value)) {
                    value++;
                }
            }
            return value;
        }

        isFactor() {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof this.ScalarFactor;
        }

        factorsFields(number) {

        }

        getFactors(number) {

        }

        isFactor() {
            let likeMe = definition instanceof SuperScalar ? definition : new SuperScalar(definition);
            return likeMe instanceof this.ScalarProduct;
        }


        potable(definition = "") {
            let MAX_INT = String(9007199254740992);
            let myLen = definition.toString().length;
            try {
                return myLen > 0 && (myLen < MAX_INT.length || (myLen === MAX_INT.length && BigInt(definition) <= BigInt(MAX_INT)));
            } catch (e) {
                return false;
            }
        }

        equals(def1, def2) {
            return def1.toString() === def2.toString();
        }

        // All core function below developed by their respective author's from geeks geeks.

        // Add two long integer number's
        strSum(str1, str2) {
            // just work with strings
            let longString1 = String(str1);
            let longString2 = String(str2);

            // Before proceeding further, make
            // sure length of str2 is larger.
            if (longString1.length > longString2.length) {
                let t = longString1;
                longString1 = longString2;
                longString2 = t;
            }

            // Take an empty String for storing result
            let str = "";

            // Calculate length of both String
            let n1 = longString1.length, n2 = longString2.length;

            // Reverse both of Strings
            longString1 = longString1.split("").reverse().join("");
            longString2 = longString2.split("").reverse().join("");

            let carry = 0;
            for (let i = 0; i < n1; i++) {

                // Do school mathematics, compute sum of
                // current digits and carry
                let sum = ((longString1[i].charCodeAt(0) -
                        '0'.charCodeAt(0)) +
                    (longString2[i].charCodeAt(0) -
                        '0'.charCodeAt(0)) + carry);
                str += String.fromCharCode(sum % 10 +
                    '0'.charCodeAt(0));

                // Calculate carry for next step
                carry = Math.floor(sum / 10);
            }

            // Add remaining digits of larger number
            for (let i = n1; i < n2; i++) {
                let sum = ((longString2[i].charCodeAt(0) -
                    '0'.charCodeAt(0)) + carry);
                str += String.fromCharCode(sum % 10 +
                    '0'.charCodeAt(0));
                carry = Math.floor(sum / 10);
            }

            // Add remaining carry
            if (carry > 0)
                str += String.fromCharCode(carry +
                    '0'.charCodeAt(0));

            // reverse resultant String
            str = str.split("").reverse().join("");

            return str;
        }

        // es menor que ...
        strIsSmaller(str1, str2) {
            // just work with strings
            let longString1 = String(str1);
            let longString2 = String(str2);
            // Calculate lengths of both string
            let n1 = longString1.length, n2 = longString2.length;
            if (n1 < n2)
                return true;
            if (n2 < n1)
                return false;

            for (let i = 0; i < n1; i++)
                if (longString1[i] < longString2[i])
                    return true;
                else if (longString1[i] > longString2[i])
                    return false;

            return false;
        }

        // Function for find difference
        // of larger numbers
        strSubtract(str1, str2) {
            // just work with strings
            let longString1 = String(str1);
            let longString2 = String(str2);

            // Before proceeding further,
            // make sure str1
            // is not smaller
            if (this.strIsSmaller(longString1, longString2)) {
                let t = longString1;
                longString1 = longString2;
                longString2 = t;
            }

            // Take an empty string for storing result
            let str = "";

            // Calculate length of both string
            let n1 = longString1.length, n2 = longString2.length;

            // Reverse both of strings
            longString1 = String(longString1).split("").reverse().join("");
            longString2 = String(longString2).split("").reverse().join("");

            let carry = 0;

            // Run loop till small string length
            // and subtract digit of str1 to str2
            for (let i = 0; i < n2; i++) {
                // Do school mathematics,
                // compute difference of
                // current digits
                let sub
                    = ((longString1[i].charCodeAt(0) -
                        '0'.charCodeAt(0))
                    - (longString2[i].charCodeAt(0) -
                        '0'.charCodeAt(0)) - carry);

                // If subtraction is less than zero
                // we add then we add 10 into sub and
                // take carry as 1 for calculating next step
                if (sub < 0) {
                    sub = sub + 10;
                    carry = 1;
                } else
                    carry = 0;

                str += String.fromCharCode(sub +
                    '0'.charCodeAt(0));
            }

            // subtract remaining digits of larger number
            for (let i = n2; i < n1; i++) {
                let sub = ((longString1[i].charCodeAt(0) -
                    '0'.charCodeAt(0)) - carry);

                // if the sub value is -ve, then make it
                // positive
                if (sub < 0) {
                    sub = sub + 10;
                    carry = 1;
                } else
                    carry = 0;

                str += String.fromCharCode(sub +
                    '0'.charCodeAt(0));
            }

            // reverse resultant string
            return str.split("").reverse().join("");
        }

        // Multiplies str1 and str2, and prints result.
        strMultiply(str1, str2) {
            // just work with strings
            let longString1 = String(str1);
            let longString2 = String(str2);

            let n1 = longString1.length;
            let n2 = longString2.length;
            if (n1 == 0 || n2 == 0)
                return "0";

            // will keep the result number in vector
            // in reverse order
            let result = new Array(n1 + n2);
            for (let i = 0; i < result.length; i++) {
                result[i] = 0;
            }
            // Below two indexes are used to find positions
            // in result.
            let i_n1 = 0;
            let i_n2 = 0;

            // Go from right to left in num1
            for (let i = n1 - 1; i >= 0; i--) {
                let carry = 0;
                let n_1 = longString1[i].charCodeAt(0) - '0'.charCodeAt(0);

                // To shift position to left after every
                // multiplication of a digit in num2
                i_n2 = 0;

                // Go from right to left in num2
                for (let j = n2 - 1; j >= 0; j--) {

                    // Take current digit of second number
                    let n_2 = longString2[j].charCodeAt(0) - '0'.charCodeAt(0);

                    // Multiply with current digit of first number
                    // and add result to previously stored result
                    // at current position.
                    let sum = n_1 * n_2 + result[i_n1 + i_n2] + carry;

                    // Carry for next iteration
                    carry = Math.floor(sum / 10);

                    // Store result
                    result[i_n1 + i_n2] = sum % 10;

                    i_n2++;
                }

                // store carry in next cell
                if (carry > 0)
                    result[i_n1 + i_n2] += carry;

                // To shift position to left after every
                // multiplication of a digit in num1.
                i_n1++;
            }

            // ignore '0's from the right
            let i = result.length - 1;
            while (i >= 0 && result[i] == 0)
                i--;

            // If all were '0's - means either both or
            // one of num1 or num2 were '0'
            if (i == -1)
                return "0";

            // generate the result string
            let s = "";
            while (i >= 0)
                s += (result[i--]).toString();

            return s;
        }

        // function to implement division with large number (str1 by str2)
        strDivision(str1, str2) {
            // just work with strings
            let number = String(str1);
            let divisor = String(str2);

            // As result can be very
            // large store it in string
            // but since we need to modify
            // it very often so using
            // string builder
            let ans = "";

            // We will be iterating
            // the dividend so converting
            // it to char array

            // Initially the carry
            // would be zero
            let idx = 0;
            let temp = number[idx] - '0';
            while (temp < divisor) {
                temp = (temp * 10 +
                    (number[idx + 1]).charCodeAt(0) -
                    ('0').charCodeAt(0));
                idx += 1;
            }
            idx += 1;

            while (number.length > idx) {
                // Store result in answer i.e. temp / divisor
                ans += String.fromCharCode
                (Math.floor(temp / divisor) +
                    ('0').charCodeAt(0));

                // Take next digit of number
                temp = ((temp % divisor) * 10 +
                    (number[idx]).charCodeAt(0) -
                    ('0').charCodeAt(0));
                idx += 1;
            }

            ans += String.fromCharCode
            (Math.floor(temp / divisor) +
                ('0').charCodeAt(0));

            //If divisor is greater than number
            if (ans.length == 0)
                return "0";
            //else return ans
            return ans;
        }

        // ported to Google Bigint by Luis Guillermo Bultet Ibles 15/05/2021. 10:31AM (Solo enteros) from
        // from stackoverflow, raiz enésima
        // https://stackoverflow.com/questions/64190185/how-do-i-extract-the-nth-root-of-a-bigint-in-javascript
        strRoot(root, value) {
            root = String(root);
            // added optimization, Number root of Number
            if (procesable(root)) {
                if ((root == Two) && (procesable(value))) {
                    return Math.trunc(Math.sqrt(Number(value)));
                }
                let resultado = Math.pow(value, 1 / Math.abs(Number(root)));
                return String(Math.trunc(resultado));
            }
            // and this is. original code of big to big
            let s = this.sumar(value, 1);
            let k1 = this.restar(root, 1);
            let u = String(value); // bigint is a natural string
            while (this.menorQue(u, s)) {
                s = u;
                u = this.dividir(this.sumar(this.multiplicar(u, k1), this.dividir(value, this.exponenciar(u, k1))), root);
            }
            return s;
        }

        // function for adding one to number
        strAddOne(digits) {
            // initialize an index (digit of units)
            let index = digits.length - 1;

            // while the index is valid and the value at [index] ==
            // 9 set it as 0
            while (index >= 0 && digits[index] == 9)
                digits[index--] = 0;

            // if index < 0 (if all digits were 9)
            if (index < 0)
                // insert an one at the beginning of the vector
                digits.insert(digits.begin(), 1, 1);

            // else increment the value at [index]
            else
                digits[index]++;

            return digits;
        }

        // Function to compute num (mod a) DUDOSO TODO
        strMod(str1, str2) {
            // just work with strings
            let num = String(str1);
            let a = String(str2);

            //
            if ((num == a) || (num == Zero) || (a == One)) {
                return Zero;
            }

            if (num == One) {
                if (a == One) {
                    return Zero;
                } else {
                    return One;
                }
            }
            if (this.mayorQue(a, num)) {
                return num;
            }
            // es aquí donde debes adaptar las optimizaciones de divisibilidad, encajan.
            // Divisibilidad por 2 y por 5 (Último dígito)
            if ((num.length > 1) && ((a == Two) || (a == Five))) {
                let ld = this.ultimoDigito(num);
                return this.modulo(ld, a);
            }
            if (!this.procesable(num) && (a == Three)) {
                let sd = this.sumaDeDigitos(num);
                return this.modulo(sd, a);
            }
            // Y en última instancia
            // Initialize result
            let res = 0;
            // One by one process
            // all digits of 'num'
            for (let i = 0; i < num.length; i++)
                res = (res * 10 +
                    parseInt(num[i])) % a;
            return res;

        }

        strPow(str1, str2) {
            // just work with strings
            let base = BigInt(str1);
            let exponent = BigInt(exponent);
            fori

        }
    }
