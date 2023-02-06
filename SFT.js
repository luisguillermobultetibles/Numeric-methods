    // Extrapoación astronómica (Provisional ®Pipo '2023)
    function sFT(xvalues, yvalues, x) {
        let residuo = (x, y) => {
            return x - y * Math.floor(x / y);
        }

        function gcd(a, b) {
            let eps = 0.00000000000001;
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
            let eps = 0.00000000000001;
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
            if (m === 1) return 0;
            if (exp === 0) return 1;
            if (base === 0) return 0;
            if (((base < 10) && (exp < 10) && (m < 10)) || (exp < 1)) {
                return residuo(Math.pow(base, exp) , m);
            }

            let mcd = gcd(base, m);
            if (mcd > 1) { // this is another way, pack and leave.
                return mcd*modpow(base/mcd, exp, m/mcd);
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
                return modpow(Math.exp(1), exp*Math.log(base), m);
            }

            if (exp > 1000) {
                let r = Math.sqrt(exp);
                return modpow(modpow(base, r, m), r, m);
            }

            return residuo((base * modpow(base, exp - 1, m)) , m);
        }

        let mcd = arrayMcd(xvalues);
        let result = 0;
        yvalues.forEach((y, i) => {
            let algo = modpow(2, Math.abs(x - xvalues[i]) / mcd - 1, 2);
            result += y * Math.sin(Math.PI * algo);
        });
        return result;
    }
