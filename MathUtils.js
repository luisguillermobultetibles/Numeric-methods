class MathUtils extends Math { // Mathematic motor

  static Equation = class extends MathUtils {

    constructor(points, controlPoints) {
      super();
      this.points = points;
      this.controlPoints = controlPoints;
      this.n = points.length - 1; // grado de la ecuación
    }

    // Pipo Jueves 20 de abril 2023
    isPrime(x) {
      if (x <= 3) {
        return x > 1;
      } else if (x % 2 === 0 || x % 3 === 0) {
        return false;
      }

      let a = 2;
      let b = Math.atan2(a, a); // Arc tangent of a/a = pi/2
      let c = Math.atan2(x, a);

      // If arc tangent of x/a is not a divisor of pi, then x is prime
      let diff = Math.abs(c - b);
      if (diff > Math.PI / x) {
        return true;
      }

      // Otherwise, check if x is a perfect square
      let sq = Math.sqrt(x);
      if (Math.round(sq) * Math.round(sq) !== x) {
        return true;
      }

      return false;
    }

    calcularPi(cantidadDigitos) {
      // Pascal: SWAG SUPPORT TEAM

      let B, C, V, P1, S, K, N, I, J, Q, M, M1, X, R, D;
      let P = [];
      let A = [];
      let T = [];

      const F1 = 5;
      const F2 = 239;

      function divIDE(D) {
        R = 0;
        for (J = 0; J <= M; J++) {
          V = R * 10 + P[J];
          Q = Math.floor(V / D);
          R = V % D;
          P[J] = Q;
        }
      }

      function divIDEA(D) {
        R = 0;
        for (J = 0; J <= M; J++) {
          V = R * 10 + A[J];
          Q = Math.floor(V / D);
          R = V % D;
          A[J] = Q;
        }
      }

      function SUBT() {
        B = 0;
        for (J = M; J >= 0; J--) {
          if (T[J] >= A[J]) {
            T[J] = T[J] - A[J];
          } else {
            T[J] = 10 + T[J] - A[J];
            T[J - 1] = T[J - 1] - 1;
          }
        }
        for (J = 0; J <= M; J++) {
          A[J] = T[J];
        }
      }

      function SUBA() {
        for (J = M; J >= 0; J--) {
          if (P[J] >= A[J]) {
            P[J] = P[J] - A[J];
          } else {
            P[J] = 10 + P[J] - A[J];
            P[J - 1] = P[J - 1] - 1;
          }
        }
        for (J = M; J >= 0; J--) {
          A[J] = P[J];
        }
      }

      function CLEARP() {
        for (J = 0; J <= M; J++) {
          P[J] = 0;
        }
      }

      function ADJUST() {
        P[0] = 3;
        P[M] = 10;
        for (J = 1; J <= M - 1; J++) {
          P[J] = 9;
        }
      }

      function ADJUST2() {
        P[0] = 0;
        P[M] = 10;
        for (J = 1; J <= M - 1; J++) {
          P[J] = 9;
        }
      }

      function MULT4() {
        C = 0;
        for (J = M; J >= 0; J--) {
          P1 = 4 * A[J] + C;
          A[J] = P1 % 10;
          C = Math.floor(P1 / 10);
        }
      }

      function SAVEA() {
        for (J = 0; J <= M; J++) {
          T[J] = A[J];
        }
      }

      function TERM1() {
        I = M + M + 1;
        A[0] = 4;
        divIDEA(I * 25);
        while (I > 3) {
          I = I - 2;
          CLEARP();
          P[0] = 4;
          divIDE(I);
          SUBA();
          divIDEA(25);
        }
        CLEARP();
        ADJUST();
        SUBA();
        divIDEA(5);
        SAVEA();
      }

      function TERM2() {
        I = M + M + 1;
        A[0] = 1;
        divIDEA(I);
        divIDEA(239);
        divIDEA(239);
        while (I > 3) {
          I = I - 2;
          CLEARP();
          P[0] = 1;
          divIDE(I);
          SUBA();
          divIDEA(239);
          divIDEA(239);
        }
        CLEARP();
        ADJUST2();
        SUBA();
        divIDEA(239);
        SUBT();
      }

      M1 = cantidadDigitos;
      M = M1 + 4;

      for (J = 0; J <= M; J++) {
        A[J] = 0;
        T[J] = 0;
      }

      TERM1();
      TERM2();
      MULT4();

      let resultado = '3';

      for (J = 1; J <= M1; J++) {
        resultado += A[J];
      }

      return resultado;
    }


    interpolate(x) {
      let y = 0;
      let angle = 0;

      for (let i = 0; i <= this.n; i++) {
        let li = 1;
        let angle_i = 0;

        for (let j = 0; j <= this.n; j++) {
          if (j !== i) {
            li *= (x - this.points[j].x) / (this.points[i].x - this.points[j].x);
            angle_i += 1 / (this.controlPoints[i].x - this.controlPoints[j].x);
          }
        }

        y += li * this.points[i].y;
        angle += angle_i * li * this.points[i].y;
      }

      return {y, angle};
    }

    unitaryTest() {
      /*
          La clase Equation toma dos arreglos como argumentos en su constructor: points representa los puntos de la función a ser interpolados, y controlPoints representa los puntos de control que se utilizan para determinar el ángulo en cada punto interpolado.

          El método interpolate(x) toma como argumento un valor x y devuelve un objeto con dos propiedades: y que es el valor interpolado de la función en x, y angle que es el ángulo de la función en x.

          Para utilizar esta clase, puedes crear una instancia pasando los arreglos de puntos y puntos de control, y luego llamar al método interpolate(x) con el valor x que deseas interpolar. Por ejemplo:
       */

      // crear una instancia de la ecuación
      const equation = new MathUtils.Equation(
        [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 4}, {x: 3, y: 9}],
        [{x: 0, angle: 0}, {x: 1, angle: 1}, {x: 2, angle: 4}, {x: 3, angle: 9}],
      );

// interpolar el valor de la función y su ángulo en x=1.5
      const {y, angle} = equation.interpolate(1.5);

      console.log(`y = ${y}, angle = ${angle}`); // y = 2.25, angle = 4.5
    }

  };

  static _lut = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];
  static __proto__ = null;
  static DEG2RAD = Math.PI / 180;
  static RAD2DEG = 180 / Math.PI;

  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
  static generateUUID() {
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
    const uuid = MathUtils._lut[d0 & 0xff] + MathUtils._lut[d0 >> 8 & 0xff] + MathUtils._lut[d0 >> 16 & 0xff] + MathUtils._lut[d0 >> 24 & 0xff] + '-' + MathUtils._lut[d1 & 0xff] + MathUtils._lut[d1 >> 8 & 0xff] + '-' + MathUtils._lut[d1 >> 16 & 0x0f | 0x40] + MathUtils._lut[d1 >> 24 & 0xff] + '-' + MathUtils._lut[d2 & 0x3f | 0x80] + MathUtils._lut[d2 >> 8 & 0xff] + '-' + MathUtils._lut[d2 >> 16 & 0xff] + MathUtils._lut[d2 >> 24 & 0xff] + MathUtils._lut[d3 & 0xff] + MathUtils._lut[d3 >> 8 & 0xff] + MathUtils._lut[d3 >> 16 & 0xff] + MathUtils._lut[d3 >> 24 & 0xff];

    // .toLowerCase() here flattens concatenated strings to save heap memory space.
    return uuid.toLowerCase();
  }

  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // compute euclidean modulo of m % n
  // https://en.wikipedia.org/wiki/Modulo_operation
  static euclideanModulo(n, m) {
    return (n % m + m) % m;
  }

  // Linear mapping from range <a1, a2> to range <b1, b2>
  static mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
  }

  // https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
  static inverseLerp(x, y, value) {
    if (x !== y) {
      return (value - x) / (y - x);
    } else {
      return 0;
    }
  }

  // https://en.wikipedia.org/wiki/Linear_interpolation
  static lerp(x, y, t) {
    return (1 - t) * x + t * y;
  }

  // http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
  static damp(x, y, lambda, dt) {
    return lerp(x, y, 1 - Math.exp(-lambda * dt));
  }

  // https://www.desmos.com/calculator/vcsjnyz7x4
  static pingpong(x, length = 1) {
    return length - Math.abs(MathUtils.euclideanModulo(x, length * 2) - length);
  }

  // http://en.wikipedia.org/wiki/Smoothstep
  static smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  }

  static smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  // Random integer from <low, high> interval
  static randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
  }

  // Random float from <low, high> interval
  static randFloat(low, high) {
    return low + Math.random() * (high - low);
  }

  // Random float from <-range/2, range/2> interval
  static randFloatSpread(range) {
    return range * (0.5 - Math.random());
  }

  // Deterministic pseudo-random float in the interval [ 0, 1 ]
  seed = 1234567;

  static seededRandom(s) {
    if (s !== undefined) MathUtils._seed = s;

    // Mulberry32 generator

    let t = MathUtils._seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  static degToRad(degrees) {
    return degrees * MathUtils.DEG2RAD;
  }

  static radToDeg(radians) {
    return radians * MathUtils.RAD2DEG;
  }

  static isPowerOfTwo(value) {
    return (value & value - 1) === 0 && value !== 0;
  }

  static ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  }

  static floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
  }

  static setQuaternionFromProperEuler(q, a, b, c, order) {
    // Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles

    // rotations are applied to the axes in the order specified by 'order'
    // rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
    // angles are in radians

    const cos = Math.cos;
    const sin = Math.sin;
    const c2 = cos(b / 2);
    const s2 = sin(b / 2);
    const c13 = cos((a + c) / 2);
    const s13 = sin((a + c) / 2);
    const c1_3 = cos((a - c) / 2);
    const s1_3 = sin((a - c) / 2);
    const c3_1 = cos((c - a) / 2);
    const s3_1 = sin((c - a) / 2);
    switch (order) {
      case 'XYX':
        q.set(c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13);
        break;
      case 'YZY':
        q.set(s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13);
        break;
      case 'ZXZ':
        q.set(s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13);
        break;
      case 'XZX':
        q.set(c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13);
        break;
      case 'YXY':
        q.set(s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13);
        break;
      case 'ZYZ':
        q.set(s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13);
        break;
      default:
        console.warn('THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: ' + order);
    }
  }

  static denormalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint16Array:
        return value / 65535.0;
      case Uint8Array:
        return value / 255.0;
      case Int16Array:
        return Math.max(value / 32767.0, -1.0);
      case Int8Array:
        return Math.max(value / 127.0, -1.0);
      default:
        throw new Error('Invalid component type.');
    }
  }

  static normalize(value, array) {
    switch (array.constructor) {
      case Float32Array:
        return value;
      case Uint16Array:
        return Math.round(value * 65535.0);
      case Uint8Array:
        return Math.round(value * 255.0);
      case Int16Array:
        return Math.round(value * 32767.0);
      case Int8Array:
        return Math.round(value * 127.0);
      default:
        throw new Error('Invalid component type.');
    }
  }

  // Desarrolladasr por Luis Bultet Ibles & Sage

  // Funciones auxiliares matrices
  static sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    });
  }

  static dotProduct(x, y) {
    return x.map(function(elem, i) {
      return elem * y[i];
    }).reduce(function(a, b) {
      return a + b;
    });
  }

  static transpose(matrix) {
    return matrix[0].map(function(col, i) {
      return matrix.map(function(row) {
        return row[i];
      });
    });
  }

  static matrixMultiply(a, b) {
    const aNumRows = a.length;
    const aNumCols = a[0].length;
    // const bNumRows = b.length;
    const bNumCols = b[0].length;
    const m = new Array(aNumRows);
    for (let r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols);
      for (let c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;
        for (let i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

  static matrixInverse(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const identity = [];
    const inverse = [];
    let factor;
    for (let i = 0; i < rows; ++i) {
      identity[i] = [];
      inverse[i] = [];
      for (let j = 0; j < cols; ++j) {
        identity[i][j] = (i === j ? 1 : 0);
        inverse[i][j] = matrix[i][j];
      }
    }
    for (let j = 0; j < cols; ++j) {
      for (let i = 0; i < rows; ++i) {
        if (i !== j) {
          factor = inverse[i][j] / inverse[j][j];
          for (let k = 0; k < cols; ++k) {
            inverse[i][k] -= factor * inverse[j][k];
            identity[i][k] -= factor * identity[j][k];
          }
        }
      }
    }
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        identity[i][j] /= inverse[i][i];
      }
    }
    return identity;
  }

  // solo una
  static matrixVectorMultiply(matrix, vector) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }
    return result;
  }

  // La función fourierInterpolation recibe dos arreglos x e y que contienen los valores de entrada y salida de la función, respectivamente, y un punto Xo en el que se desea evaluar la función interpolada. La función devuelve el valor interpolado de la función en el punto Xo.

  // En la implementación, se utiliza la función dft para calcular la DFT de la función de entrada x y la función de salida y. Luego se rellenan con ceros los coeficientes de alta frecuencia para obtener una DFT de mayor longitud, utilizando el doble de puntos que la longitud original. A continuación, se utiliza la función idft para aplicar la inversa de la DFT y obtener una versión interpolada de la función. Finalmente, se evalúa la función interpolada en el punto deseado Xo, utilizando la técnica de la interpolación de Fourier.

  // Regresión lineal simple
  static linearRegression(x, y) {
    const n = x.length;
    const slope = (n * MathUtils.dotProduct(x, y) - MathUtils.sum(x) * MathUtils.sum(y)) / (n * MathUtils.dotProduct(x, x) - Math.pow(MathUtils.sum(x), 2));
    const intercept = (MathUtils.sum(y) - slope * MathUtils.sum(x)) / n;
    return {slope: slope, intercept: intercept};
  }

  // Regresión lineal múltiple
  static multipleRegression(X, y) {
    const Xt = MathUtils.transpose(X);
    const XtX = MathUtils.matrixMultiply(Xt, X);
    const XtXInv = MathUtils.matrixInverse(XtX);
    const XtY = MathUtils.matrixMultiply(Xt, y);
    const beta = MathUtils.matrixMultiply(XtXInv, XtY);
    return beta;
  }


  /**
   * Discrete Fourier Transform (DFT): time to frequencies.
   *
   * Time complexity: O(N^2)
   *
   * @param {number[]} inputAmplitudes - Input signal amplitudes over time (complex
   * numbers with real parts only).
   * @param {number} zeroThreshold - Threshold that is used to convert real and imaginary numbers
   * to zero in case if they are smaller then this.
   *
   * @return {ComplexNumber[]} - Array of complex number. Each of the number represents the frequency
   * or signal. All signals together will form input signal over discrete time periods. Each signal's
   * complex number has radius (amplitude) and phase (angle) in polar form that describes the signal.
   *
   * @see https://gist.github.com/anonymous/129d477ddb1c8025c9ac
   * @see https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
   */
  static CLOSE_TO_ZERO_THRESHOLD = 1e-10;

  static dft(inputAmplitudes, zeroThreshold = CLOSE_TO_ZERO_THRESHOLD) {
    const N = inputAmplitudes.length;
    const signals = [];

    // Go through every discrete frequency.
    for (let frequency = 0; frequency < N; frequency += 1) {
      // Compound signal at current frequency that will ultimately
      // take part in forming input amplitudes.
      let frequencySignal = {re: 0, im: 0};

      // Go through every discrete point in time.
      for (let timer = 0; timer < N; timer += 1) {
        const currentAmplitude = inputAmplitudes[timer];

        // Calculate rotation angle.
        const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

        // Remember that e^ix = cos(x) + i * sin(x);
        const dataPointContribution = {
          re: Math.cos(rotationAngle) * multiply(currentAmplitude),
          im: Math.sin(rotationAngle) * multiply(currentAmplitude),
        };

        // Add this data point's contribution.
        frequencySignal = {
          re: dataPointContribution.re + frequencySignal.re,
          im: dataPointContribution.im + frequencySignal.im,
        };
      }

      // Close to zero? You're zero.
      if (Math.abs(frequencySignal.re) < zeroThreshold) {
        frequencySignal.re = 0;
      }

      if (Math.abs(frequencySignal.im) < zeroThreshold) {
        frequencySignal.im = 0;
      }

      // Average contribution at this frequency.
      // The 1/N factor is usually moved to the reverse transform (going from frequencies
      // back to time). This is allowed, though it would be nice to have 1/N in the forward
      // transform since it gives the actual sizes for the time spikes.
      frequencySignal = {
        re: requencySignal.re / n, im: frequencySignal.im / n,
      };

      // Add current frequency signal to the list of compound signals.
      signals[frequency] = frequencySignal;
    }

    return signals;
  }

  static idft(X) {
    const N = X.length;
    const x = new Array(N);
    const w = Math.PI * 2 / N;
    for (let n = 0; n < N; ++n) {
      let re = 0;
      let im = 0;
      for (let k = 0; k < N; ++k) {
        const t = w * k * n;
        const cos_t = Math.cos(t);
        const sin_t = Math.sin(t);
        re += X[k].re * cos_t - X[k].im * sin_t;
        im += X[k].re * sin_t + X[k].im * cos_t;
      }
      x[n] = {re: re / N, im: im / N};
    }
    return x;
  }

  static fourierInterpolation(x, y, Xo) {
    const N = x.length;
    const X = dft(x);
    const Y = dft(y);
    const M = 2 * N;
    const X2 = new Array(M);
    const Y2 = new Array(M);
    for (let k = 0; k < N; ++k) {
      X2[k] = X[k];
      Y2[k] = Y[k];
      X2[M - k - 1] = X[k];
      Y2[M - k - 1] = Y[k];
    }
    const x2 = MathUtils.idft(X2);
    const y2 = MathUtils.idft(Y2);
    const y3 = new Array(M);
    for (let i = 0; i < M; ++i) {
      y3[i] = x2[i] === Xo ? y2[i] : y2[i] * Math.sin(Math.PI * (Xo - x2[i])) / (Math.PI * (Xo - x2[i]));
    }
    const Y3 = MathUtils.dft(y3);
    const index = Math.round(Xo * M / (x2[N - 1] - x2[0]));
    return Y3[index].re;
  }

  /*
      La transformada discreta de Fourier (DFT) se puede calcular para señales
      de cualquier longitud, pero para implementar la DFT de manera eficiente,
      la señal debe tener una longitud que sea una potencia de 2. Esto se debe
      a que muchos algoritmos de DFT utilizan una estrategia de división y
      conquista conocida como el algoritmo de Cooley-Tukey, que divide
      repetidamente la señal en subseñales de longitud N/2, donde N es la
      longitud de la señal. Si N no es una potencia de 2, el algoritmo no se
      puede dividir en subproblemas de igual tamaño, lo que dificulta la
      implementación eficiente.
      Sin embargo, es posible calcular la DFT de una señal de longitud
      arbitraria utilizando algoritmos de DFT que no requieren que la longitud
      sea una potencia de 2, como el algoritmo de Bluestein o el algoritmo de
      Rader. Estos algoritmos son menos comunes y pueden ser menos eficientes
      que el algoritmo de Cooley-Tukey para señales que tienen una longitud que
      es una potencia de 2.
      En resumen, la DFT puede ser calculada para señales de cualquier longitud,
       pero para la implementación eficiente de la DFT, es preferible que la
       longitud de la señal sea una potencia de 2. Si la longitud de la señal no
        es una potencia de 2, se pueden utilizar algoritmos de DFT alternativos
        que pueden ser menos eficientes.
  */
  dftEficiente(x) {
    const N = x.length;
    let M = N;
    while (M % 2 === 0) {
      M /= 2;
    }
    if (M !== 1) {
      throw new Error('La longitud de los datos debe ser una potencia de 2');
    }
    const X = new Array(N);
    const w = Math.PI * 2 / N;
    for (let k = 0; k < N; ++k) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < N; ++n) {
        const t = w * k * n;
        const cos_t = Math.cos(t);
        const sin_t = Math.sin(t);
        re += x[n].re * cos_t - x[n].im * sin_t;
        im += x[n].re * sin_t + x[n].im * cos_t;
      }
      X[k] = {re: re, im: im};
    }
    return X;
  }

  // Otras funciones complementarias

  // Convertir una cadena binaria a un BigInt
  binarioABigInt(binario) {
    return BigInt('0b' + binario);
  }

  // Convertir un BigInt a una cadena binaria
  bigIntABinario(n) {
    return n.toString(2);
  }


  /*
    La función esPrimo toma un número entero grande n y un número de iteraciones
     k (por defecto 20) como parámetros y devuelve true si n es probablemente
     primo y false si n es compuesto.

    La función comienza comprobando si n es un pequeño número primo, y si lo es,
     devuelve true. Luego, escribe n-1 como 2^r * d, donde d es impar, y realiza
      la prueba de Miller-Rabin k veces. En cada iteración, selecciona un número
       aleatorio a en el rango [2, n-2], calcula a^d mod n, y verifica si es
       congruente con 1 o n-1. Si no lo es, eleva x al cuadrado r-1 veces y
       verifica si es congruente con 1 modulo n. Si lo es, pasa a la siguiente
       iteración. Si no lo es, n es compuesto y la función devuelve false. Si
       todas las iteraciones pasan, n es probablemente primo y la función
       devuelve true.

    Ten en cuenta que la prueba de Miller-Rabin es un algoritmo probabilístico,
    lo que significa que puede producir resultados incorrectos en casos raros.
    Sin embargo, para valores de k suficientemente grandes (como 20 o más), la
    probabilidad de un falso positivo es extremadamente baja.
   */

  esPrimo(n, k = 20) {
    if (n <= 1n) {
      return false;
    }

    // Verificar si n es un pequeño número primo
    const pequeñosPrimos = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
    if (pequeñosPrimos.includes(n)) {
      return true;
    }

    // Escribir n-1 como 2^r * d
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
      d /= 2n;
      r++;
    }

    // Realizar la prueba de Miller-Rabin k veces
    for (let i = 0; i < k; i++) {
      // Seleccionar un número aleatorio a en el rango [2, n-2]
      const a = BigInt(Math.floor(Math.random() * (n - 3))) + 2n;

      // Calcular a^d mod n
      let x = a ** d % n;

      // Si x es 1 o n-1, pasar a la siguiente iteración
      if (x === 1n || x === n - 1n) {
        continue;
      }

      // Elevar x al cuadrado r veces y verificar
      // si es congruente con 1 modulo n
      let esPrimo = false;
      for (let j = 0n; j < r - 1n; j++) {
        x = x ** 2n % n;
        if (x === 1n) {
          return false;
        }
        if (x === n - 1n) {
          esPrimo = true;
          break;
        }
      }

      // Si x no es congruente con 1 o n-1, entonces n es compuesto
      if (!esPrimo) {
        return false;
      }
    }

    return true;
  }

  isPrime(n) {
    if (n === 2n) {
      return true;
    }
    if (!(n % 2n === 0) && (n > 2n)) {
      for (let i = 3n; i * i <= n; i += 2n) {
        if (n % i === 0n) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /*
    Por: 邓启凡 (Deng Qifan), www.stackoverfow.com Jun 7, 2017 at 9:14
    La función que has compartido es una implementación de un algoritmo para
    suavizar curvas o series de datos, conocido como "suavizado por cambio de
    pendiente" o "método del zig-zag". Esta técnica implica ajustar los valores
    de la serie de datos para que la diferencia de los valores consecutivos se
    mantenga dentro de ciertos límites definidos por un parámetro de entrada
    llamado "strength".

    A continuación, describo brevemente el funcionamiento de la función:

        La función toma un parámetro de entrada llamado "strength", que
        determina la cantidad máxima de cambio permitido entre dos valores
        consecutivos de la serie de datos.
        La función itera a través de la serie de datos de entrada utilizando un
        lazo for, y para cada par de valores consecutivos, calcula la distancia
        o diferencia entre ellos.
        La función mantiene una suma acumulativa de las distancias calculadas
        hasta el momento, y divide esta suma por el índice actual para obtener
        una distancia promedio.
        Si la distancia entre los valores actuales es mayor que la distancia
        promedio multiplicada por el "strength", entonces se aplica una
        corrección a este valor, ajustándolo para que se encuentre dentro del
        rango permitido. La corrección implica establecer el valor actual como
        el doble del valor anterior menos el valor previo al anterior.

    En general, este método puede ser útil para suavizar curvas o series de
    datos que contengan ruido o fluctuaciones no deseadas, y puede utilizarse en
    una variedad de aplicaciones, desde análisis de señales hasta visualización
    de datos. Sin embargo, es importante tener en cuenta que la técnica puede
    introducir artefactos o distorsiones en los datos originales, especialmente
    cuando se utilizan valores de "strength" muy bajos o muy altos.
    Por lo tanto, es recomendable experimentar con diferentes valores de
    "strength" y realizar pruebas exhaustivas antes de utilizar este método en
    cualquier proyecto de producción.

  */
  static suavizadoPorZigZag(items, strength = Math.max(...items) / 2) {
    const len = items.length;
    let disArg;
    let dis;
    let disSum = 0;
    for (let i = 0; i < len - 1; i++) {
      disSum += Math.abs((items[i + 1] - items[i]));
      disArg = disSum / i;
      dis = Math.abs(items[i + 1] - items[i]);
      if (dis / disArg > strength) {
        items[i + 1] = 2 * items[i] - items[i - 1];
      }
    }
    return items;
  };

  static calcularDesviacionEstandar(datos) {
    const media = datos.reduce((a, b) => a + b) / datos.length;
    const desviaciones = datos.map(x => Math.pow(x - media, 2));
    const varianza = desviaciones.reduce((a, b) => a + b) / datos.length;
    const desviacionEstandar = Math.sqrt(varianza);
    return desviacionEstandar;
  }

  static calcularMedia(datos) {
    const suma = datos.reduce((a, b) => a + b);
    const media = suma / datos.length;
    return media;
  }

  static calcularVarianza(datos) {
    const media = datos.reduce((a, b) => a + b) / datos.length;
    const desviaciones = datos.map(x => Math.pow(x - media, 2));
    const varianza = desviaciones.reduce((a, b) => a + b) / datos.length;
    return varianza;
  }

  /*
    El primer momento de Pearson ($M_1$) es cero para cualquier distribución simétrica. Si $M_1$ es diferente de cero, indica que la distribución es sesgada hacia la izquierda o hacia la derecha.
    El segundo momento de Pearson ($M_2$) es la varianza de la distribución. Es una medida de la dispersión de los datos alrededor de la media. Si $M_2$ es pequeño, indica que los datos están agrupados en torno a la media, mientras que si $M_2$ es grande, indica que los datos están más dispersos.
    El tercer momento de Pearson ($M_3$) es una medida de la asimetría de la distribución. Si $M_3$ es positivo, indica que la distribución tiene una cola larga hacia la derecha y está sesgada hacia la izquierda. Si $M_3$ es negativo, indica que la distribución tiene una cola larga hacia la izquierda y está sesgada hacia la derecha.
    El cuarto momento de Pearson ($M_4$) es una medida de la apuntamiento o curtosis de la distribución. Si $M_4$ es mayor que cero, indica que la distribución es más apuntada que la distribución normal (también llamada distribución de Gauss). Si $M_4$ es menor que cero, indica que la distribución es menos apuntada que la distribución normal.
  */
  static calcularMomentoPearson(datos, n) {
    const media = datos.reduce((a, b) => a + b) / datos.length;
    const desviaciones = datos.map(x => Math.pow(x - media, n));
    const momento = desviaciones.reduce((a, b) => a + b) / datos.length;
    return momento;
  }

  static calcularCantidadClases(datos) {
    const clases = {};
    for (let i = 0; i < datos.length; i++) {
      const clase = datos[i];
      if (!(clase in clases)) {
        clases[clase] = true;
      }
    }
    return Object.keys(clases).length;
  }

  static calcularEntropia(datos) {
    const n = datos.length;
    const clases = {};
    for (let i = 0; i < n; i++) {
      const clase = datos[i];
      if (clase in clases) {
        clases[clase]++;
      } else {
        clases[clase] = 1;
      }
    }
    let entropia = 0;
    for (let clase in clases) {
      const probabilidad = clases[clase] / n;
      entropia -= probabilidad * Math.log2(probabilidad);
    }
    return entropia;
  }


  static Fibonacci(n) {
    if (n <= 1) {
      return n;
    }
    return MathUtils.Fibonacci(n - 1) + MathUtils.Fibonacci(n - 2);
  }

  // Función para calcular el área de la superficie de una esfera n-dimensional
  static sphereSurfaceArea(n, r) {
    const pi = Math.PI;
    const gamma = (x) => {
      if (x === 0) {
        return Infinity;
      } else if (x <= 0.5) {
        return pi / (Math.sin(pi * x) * gamma(1 - x));
      } else {
        return (x - 1) * gamma(x - 1);
      }
    };
    const numerator = 2 * Math.pow(pi, n / 2) * Math.pow(r, n);
    const denominator = gamma(n / 2 + 1);
    return numerator / denominator;
  }

  // Función para calcular el volumen de una bola n-dimensional
  static ballVolume(n, r) {
    const pi = Math.PI;
    const gamma = (x) => {
      if (x === 0) {
        return Infinity;
      } else if (x <= 0.5) {
        return pi / (Math.sin(pi * x) * gamma(1 - x));
      } else {
        return (x - 1) * gamma(x - 1);
      }
    };
    const numerator = Math.pow(pi, n / 2) * Math.pow(r, n);
    const denominator = gamma(n / 2 + 1);
    return numerator / denominator;
  }

// Función para calcular la superficie de una esfera n-dimensional
  static sphereVolume(n, r) { // Verificar si se repite con sphereSurfaceArea
    const pi = Math.PI;
    const gamma = (x) => {
      if (x === 0) {
        return Infinity;
      } else if (x <= 0.5) {
        return pi / (Math.sin(pi * x) * gamma(1 - x));
      } else {
        return (x - 1) * gamma(x - 1);
      }
    };
    const numerator = Math.pow(pi, n / 2) * Math.pow(r, n);
    const denominator = gamma(n / 2 + 1);
    return numerator / denominator;
  }

  /*

  Para calcular el volumen de una variedad n-dimensional a partir del radio r, la dimensión n y la curvatura k, podemos utilizar la siguiente fórmula:

V = (R^n * A) / n

donde:

    R es el radio de curvatura de la variedad, dado por 1/√k para k>0.
    A es el área de la superficie de una esfera (n+1)-dimensional con radio r.
    n es la dimensión de la variedad.

Para calcular el área de la superficie de una esfera (n+1)-dimensional, podemos utilizar la siguiente fórmula:

A = 2 * π^(n/2) * r^(n+1) / Γ((n+2)/2)

donde:

    r es el radio de la variedad.
    Γ es la función gamma.

Aquí te proporciono el código en JavaScript para calcular el volumen de una variedad n-dimensional a partir del radio r, la dimensión n y la curvatura k:

// Función para calcular el volumen de una variedad n-dimensional
function volume(n, r, k) {
  const pi = Math.PI;
  const R = k > 0 ? 1 / Math.sqrt(k) : Infinity;
  const sphereArea = 2 * Math.pow(pi, (n+1)/2) * Math.pow(r, n+1) / gamma((n+2)/2);
  return Math.pow(R, n) * sphereArea / n;
}

// Función para calcular la función gamma
function gamma(x) {
  if (x <= 0) {
    throw new Error('Argumento inválido para la función gamma');
  }
  if (x < 0.5) {
    return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  }
  let y = x - 1;
  let result = Math.sqrt(2 * Math.PI / y) * Math.pow((y / Math.E), y) * (1 + 1/(12*y) + 1/(288*y*y) - 139/(51840*y*y*y) - 571/(2488320*y*y*y*y));
  return result;
}

La función volume toma tres argumentos: n, que es la dimensión de la variedad, r, que es el radio de la variedad, y k, que es la curvatura de la variedad. Utiliza la función gamma para calcular el área de la superficie de una esfera (n+1)-dimensional y devuelve el volumen de la variedad.

La función gamma es una implementación de la función gamma de Euler, que se utiliza para calcular el área de la superficie de una esfera (n+1)-dimensional.


La fórmula r²Ho/2, donde r es el radio de curvatura del espacio y Ho es la constante
de Hubble, se utiliza en cosmología para estimar la edad del universo. Esta fórmula
se deriva de las ecuaciones de Friedmann-Lemaître-Robertson-Walker (FLRW), que son
las ecuaciones fundamentales de la cosmología moderna.

La fórmula rHo²/2, por otro lado, se utiliza para estimar la densidad crítica del
universo, que es una medida de la densidad de materia que se necesitaría para que
el universo se expanda indefinidamente sin colapsar sobre sí mismo.

Ambas fórmulas están relacionadas con la estructura y evolución del universo, pero
 se utilizan para diferentes propósitos. Mientras que r²Ho/2 se utiliza para estimar
 la edad del universo, rHo²/2 se utiliza para estimar la densidad crítica del universo.


  */


  constructor() {
    super(...arguments);
  }


  // Implementaciones para enteros grandes

  sin(x) {
    let result;
    if (x instanceof BigInt) {
      if (x >= BigInt(Number.MIN_SAFE_INTEGER) && x <= BigInt(Number.MAX_SAFE_INTEGER)) {
        result = this.sin(Number(x));
      } else if (x % 2n === 0n) {
        result = 2 * this.sin(x / 2n) * this.cos(x / 2n);
      } else {
        result = this.sin(x - 1n) * this.cos(1n) + this.sin(1n) * this.cos(x - 1n);
      }
    } else {
      result = super.sin(Number(x));
    }
    return result;
  }

  cos(x) {
    let result;
    if (x instanceof BigInt) {
      if (x >= BigInt(Number.MIN_SAFE_INTEGER) && x <= BigInt(Number.MAX_SAFE_INTEGER)) {
        result = this.cos(Number(x));
      } else if (x % 2n === 0n) {
        result = this.pow(this.cos(x / 2n, 2n), 2n) - this.pow(this.sin(x / 2n, 2n), 2n);
      } else {
        result = this.cos(x - 1n) * this.cos(1n) - this.sin(1n) * this.sin(x - 1n);
      }
    } else {
      result = super.cos(Number(x));
    }
    return result;
  }

  log2(x) {
    const iLog2 = (x) => {
      if (x <= 0n) {
        throw new Error('log2() argument must be a positive integer');
      } else if (x === 1n) {
        return 0;
      } else {
        return 1 + this.log2(x / 2n);
      }
    };

    let result;
    if (x instanceof BigInt) {
      if (x >= BigInt(Number.MIN_SAFE_INTEGER) && x <= BigInt(Number.MAX_SAFE_INTEGER)) {
        result = this.log2(Number(x));
      } else {
        result = iLog2(x);
      }
    } else {
      result = super.log2(Number(x));
    }
    return result;
  }

  multiplyBigIntByReal(bigIntNum, realNum) {
    const precision = 18; // precisión arbitraria
    const realBigInt = BigInt(Math.floor(realNum * 10 ** precision));
    const bigIntPart = bigIntNum * realBigInt / 10n ** BigInt(precision);
    return BigInt(bigIntPart);
  }

  divideBigIntByReal(bigIntNum, realNum) {
    const precision = 18; // precisión arbitraria
    const realBigInt = BigInt(Math.floor(realNum * 10 ** precision));
    const bigIntPart = bigIntNum / realBigInt;
    return BigInt(bigIntPart);
  }

  pow(base, exponent) {
    const isSafeIntegerPower = (base, exponent) => {
      const maxSafeIntegerPower = super.log2(Number.MAX_SAFE_INTEGER) / this.log2(base);
      const minSafeIntegerPower = super.log2(Number.MIN_SAFE_INTEGER) / this.log2(base);
      return exponent >= minSafeIntegerPower && exponent <= maxSafeIntegerPower;
    };

    const iPow = (base, exponent) => {
      let result = 1n;
      while (exponent > 0n) {
        if (exponent % 2n === 1n) {
          result *= base;
        }
        base *= base;
        exponent /= 2n;
      }
      return result;
    };

    let result;
    if (isSafeIntegerPower(base, exponent)) {
      result = super.pow(Number(base), Number(exponent));
    } else {
      result = iPow(base, exponent);
    }
    return result;
  }


}

class Natural extends MathUtils {
  // Clase de enteros grandes, debes declarar las siguientes librerías en la cabecera del html: jsbi.mjs y BigInteger.min.js
  #DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
  #MAX_INT = String(9007199254740992);

  constructor(v = 0) {
    super();
    this.value = String(v).trim();
  }

  get value() {
    return this._value;
  }

  set value(n) {
    this._value = String(n);
  }

  toString(base = 10) {
    let result = "";
    let tmp = new Natural(this._value);
    while (tmp.desigual_o_diferenteA("0")) {
      result = this.#DEFAULT_ALPHABET[tmp.modulo(base)] + result;
      tmp.dividir(base);
    }
    return result;
  }

  procesable(x) {
    let myLen = String(x).length;
    try {
      return (myLen < this.#MAX_INT.length || (myLen === this.#MAX_INT.length && Number(x) <= Number(this.#MAX_INT)));
    } catch (e) {
      return false;
    }
  }

  esProcesable() {
    return this.procesable(this.value);
  }

  // Convertir o traer el número a otra base...
  toBase(radix, alfabeto) { // ok
    return bigInt(String(this.value)).toString(radix, alfabeto);
  }

  fromBase(value, radix, alfabeto) { // revisar ///////////////////////////////////////////////
    this.value = bigInt(value, radix, alfabeto).toString(10);
  }

  esIgualA(b) {
    var _a = this.value;
    var _b = String(b);
    return _a === _b;
  }

  desigual_o_diferenteA(b) {
    return !this.esIgualA(this.value, b);
  }

  // I hope so... optimize.
  menorQue(b) {
    var _a = this.value;
    var _b = String(b);
    return ((_a.length < _b.length) || ((_a.length === _b.length) && (_a < _b)));
  }

  mayorQue(b) {
    var _a = this.value;
    var _b = String(b);
    return ((_a.length > _b.length) || ((_a.length === _b.length) && (_a > _b)));
  }

  // I hope so... optimize.
  menorOIgualQue(b) {
    var _a = this.value;
    var _b = String(b);
    return (this.esIgualA(_a, _b) || this.menorQue(_a, _b));
  }

  mayorOIgualQue(b) {
    var _a = this.value;
    var _b = String(b);
    return (this.esIgualA(_a, _b) || this.mayorQue(_a, _b));
  }

  // Little endian in New York, privates

  // Add two long integer number's
  #coreSum(str1, str2) {
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
  #coreIsSmaller(str1, str2) {
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
  #coreSubtract(str1, str2) {
    // just work with strings
    let longString1 = String(str1);
    let longString2 = String(str2);

    // Before proceeding further,
    // make sure str1
    // is not smaller
    if (this.#coreIsSmaller(longString1, longString2)) {
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
  #coreMultiply(str1, str2) {
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
  #coreDivision(str1, str2) {
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
  #coreRoot(root, value) {
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
  #coreAddOne(digits) {
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

  // Function to compute num (mod a)
  #coreMod(str1, str2) {
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

  #corePow(str1, str2) {
    // just work with strings
    let base = new Natural(str1);
    let exponent = new Natural(str2);
    if (exponent.value === Zero) {
      if (base.value === Zero) {
        return "undefined";
      } else {
        return One;
      }
    } else if (exponent.value === One) {
      return base.value;
    } else {
      // Legendre alg.
      if (exponent.#coreMod(exponent.balue, Two) === Zero) {
        let tmp = this.#corePow(base.value, this.division(exponent.value, Two));
        tmp = this.#corePow(tmp, Two);
      }
    }
  }

  // to public below, validate optimize here overrides the above

  suma(a, b) {
    return this.#coreSum(a, b);
  }

  sumar(b) {
    this.value = this.suma(this.value, b);
    return this.value; // avoid insolvence risk
  }

  sucesor() {
    return this.#coreAddOne(this.value);
  }

  suceder() {
    this.value = this.sucesor();
    return this;
  }

  predecesor() {
    return this.restar(One);
  }

  preceder() {
    this.value = this.restar(One);
    return this;
  }

  resta(a, b) {
    if (this.mayorQue(b, a)) {
      throw new Error(`No puede restarle al número natural (${a}), una cantidad mayor (${b}).`);
    }
    return this.#coreSubtract(a, b);
  }

  restar(b) {
    this.value = this.resta(this.value, b);
    return this;
  }

  diferencia(b) {
    if (this.mayorQue(b)) {
      return this.restar(b);
    } else {
      return (new Natural(b)).restar(this.value);
    }
  }

  producto(a, b) {
    return this.#coreMultiply(a, b);
  }

  multiplicar(b) {
    this.value = this.producto(this.value, b);
    return this;
  }

  division(a, b) {
    if ((new Natural(b)).value === Zero) {
      if ((new Natural(a)).value !== Zero) {
        return "Infinity";
      } else {
        return "Undefined";
      }
    }
    return this.#coreDivision(a, b);
  }

  dividir(b) {
    this.value = this.division(this.value, b);
    return this.value;
  }

  // Raíz enésima del valor
  root(root, value) {
    return this.#coreRoot(root, value);
  }

  // Mi raíz enésima
  rootMe(root) {
    this.value = this.root(root, this.value);
    return this.value;
  }

  raizCuadrada(a) {
    return this.root(2, a);
  }

  // devolver la suma de los dígitos del número, útil para divisibilidad por 3
  sumaDigitos(a) {
    let result = 0;
    for (let sdi = 0; sdi < a.length; sdi++) {
      result += Number(String(a).charAt(sdi));
    }
    return String(result);
  }

  sumarDigitos() {
    this.value = this.sumarDigitos(this.value);
  }

  // devolver el último dígito, útil para divisiblidad por 2 y por 5
  ultimoDigito() {
    var _a = this.value;
    if (!_a) {
      return Zero;
    }
    return String(_a).charAt(_a.length - 1);
  }

  modulo(b) {
    var num = this.value;
    var a = String(b);
    return this.#coreMod(num, a);
  }

  par() {
    return (this.modulo(2) === Zero);
  }

  impar() {
    return (!this.par());
  }

  // se pueden incluir las optimizaciones de Legendre, además, no exponencia para reales...
  exponenciar(b) {
    var _a = this.value;
    var _b = String(b);
    return String(JSBI.exponentiate(JSBI.BigInt(String(_a)), JSBI.BigInt(String(_b))));
  }

  // es un método muy malo que descarta muchos valores superfluos...
  esDescartableComoPrimo() { // usar aquel cuando sea procesable, sino este co profundidad razonable...
    let x = String(this.value);
    if ((x == Zero) || (x == One)) {
      return false;
    }

    if (x == Two) {
      return true;
    } else if (big_DivisiblePor(x, Two)) {
      return false;
    }

    if (x == Three) {
      return true;
    } else if (big_DivisiblePor(x, Three)) {
      return false;
    }

    if (x == Five) {
      return true;
    } else if (big_DivisiblePor(x, Five)) {
      return false;
    }

    // Dice la criba general de los números que ningún número compuesto tiene divisores primos mayores que su raiz.
    let raiz2 = big_raizCuadrada(x);
    if (big_DivisiblePor(raiz2, Two)) {
      raiz2 = big_Sumar(raiz2, One);
    }

    // Agregamos que, si es compuesto, debe tener al menos un divisor por encima de la raiz cúbica.
    let raiz3 = big_raizEnesima(x, Three);
    if (big_DivisiblePor(raiz3, Two)) {
      raiz3 = big_Sumar(raiz3, One);
    }

    var deep = 100;

    var counter = 0;

    let posibleDivisor = raiz2;
    while (big_mayorOIgualQue(posibleDivisor, raiz3)) {
      if (big_gcd(x, posibleDivisor) !== One) {
        return false;
      }

      // sección de prueba aleatoria
      let pd = big_gcd(x, this.random(raiz3, raiz2)); // puede usarse el MCD, o el MOD
      if ((pd !== One) && (this.esDivisiblePor(pd))) {
        return false;
      }
      // trato de divivir por un número al azar....

      posibleDivisor = big_Restar(posibleDivisor, Two); // puede usarse el MCD, o el MOD
      if ((++counter) >= (deep)) {
        break;
      }
      // console.log(counter + " hasta " + deep);
    }
    return true;
  }

  esPrimo() {
    // Trial check
    if (!this.esDescartableComoPrimo()) {
      return false;
    }
    // Strict check
    return bigInt(String(this.value)).isPrime(false);
  }


  /*
                                                                                                                                                  Revisar, existe un problema de llamada a procedimiento o métodos de la clase bigInt, que es
                                                                                                                                                  donde están implementados los test de primalidad...

                                                                                                                                                  esUnPrimoBasico() {
                                                                                                                                                      let n = bigInt(this.value);
                                                                                                                                                      if (n.isUnit()) return false;
                                                                                                                                                      if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
                                                                                                                                                      if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
                                                                                                                                                      if (n.lesser(49)) return true;
                                                                                                                                                      // we don't know if it's prime: let the other functions figure it out
                                                                                                                                                  }

                                                                                                                                                  millerRabinTest(n, a) {
                                                                                                                                                      n = bigInt(n);
                                                                                                                                                      a = bigInt(a);
                                                                                                                                                      var nPrev = n.prev(),
                                                                                                                                                          b = nPrev,
                                                                                                                                                          r = 0,
                                                                                                                                                          d, t, i, x;
                                                                                                                                                      while (b.isEven()) b = b.divide(2), r++;
                                                                                                                                                      next: for (i = 0; i < a.length; i++) {
                                                                                                                                                          if (n.lesser(a[i])) continue;
                                                                                                                                                          x = bigInt(a[i]).modPow(b, n);
                                                                                                                                                          if (x.isUnit() || x.equals(nPrev)) continue;
                                                                                                                                                          for (d = r - 1; d != 0; d--) {
                                                                                                                                                              x = x.square().mod(n);
                                                                                                                                                              if (x.isUnit()) return false;
                                                                                                                                                              if (x.equals(nPrev)) continue next;
                                                                                                                                                          }
                                                                                                                                                          return false;
                                                                                                                                                      }
                                                                                                                                                      return true;
                                                                                                                                                  }

                                                                                                                                                  esProbablementePrimo() {
                                                                                                                                                      var isPrime = this.esUnPrimoBasico();
                                                                                                                                                      if (isPrime !== undefined) return isPrime;
                                                                                                                                                      var n = this.abs();
                                                                                                                                                      var t = iterations === undefined ? 5 : iterations;
                                                                                                                                                      for (var a = [], i = 0; i < t; i++) {
                                                                                                                                                          a.push(bigInt.randBetween(2, n.minus(2), rng));
                                                                                                                                                      }
                                                                                                                                                      return millerRabinTest(n, a);
                                                                                                                                                  }
                                                                                                                                  */

  // this^b mod c
  modPow(b, c) {
    var _a = this.value;
    let base = bigInt(String(_a));
    return base.modPow(String(b), String(c)).toString();
  }

  _modPow(a, b, c) {
    let base = bigInt(String(a));
    return base.modPow(String(b), String(c)).toString();
  }

  // Esta... cosa me da (this^b-c) mod d, con menos.
  moduleABmenosCD(b, c, d) {
    var _a = this.value;
    let r1 = this._modPow(_a, b, d);
    if (this.mayor(c, r1)) {
      r1 = this.resta(r1, c);
    } else {
      while (this.mayor(c, r1)) {
        r1 = this.resta(this.suma(r1, d), c);
      }
    }
    r1 = this.suma(r1, this.resto(this.resta(this.producto(c, d), d), d));
    return this.resto(r1, d);
  } // revisar

  // Esta... cosa me da (this^b+c) mod d, con más.
  moduleABsumCD(b, c, d) {
    var _a = this.value;
    let r1 = big_modPow(_a, b, d);
    r1 = big_Sumar(r1, c);
    return big_Modulo(r1, d);
  } // ok

  esDivisiblePor(b) {
    // Aquí no van los criterios de divisibilidad, van en el cálculo de módulo...
    return (this.esIgualA(this.modulo(b), Zero));
  }

  // Máximo común divisor
  MCD(a, b) {
    return bigInt.gcd(bigInt(String(a)), bigInt(String(b))).toString();
  }

  // mínimo común múltiplo
  MCM(a, b) {
    return bigInt.lcm(bigInt(String(a)), bigInt(String(b))).toString();
  }

  power(b) {
    return this.exponenciar(b);
  }

  // Genera un número al azar entre esos dos...
  random(leftLimit, rightLimit) {
    return bigInt.randBetween(leftLimit, rightLimit).toString();
  }

  mayor(a, b) {
    return bigInt.max(a, b).toString();
  }

  menor(a, b) {
    return bigInt.min(a, b).toString();
  }

  isMercedesBenz() {
    // Ve a ser si eso es primo...
    if (this.esDescartableComoPrimo()) {
      return false;
    }

    var n = new Natural(Zero);
    var s = new Natural(Zero);
    var i = new Natural(Zero);

    if (this.esIgualA(Two)) {
      s = new Natural(Zero);
    } else {
      s = new natural(Four);
    }

    n = (new Natural((new Natural(Two).exponenciar(this.value)))).restar(One);

    for (i = new Natural(One); i.menorOIgualQue(this.diferencia(Two)); i.suceder()) {
      // Original Lucas-Lehmer fórmula s <- (s^2 - 2) mod (2^n - 1), target: operar con las formas potenciales...
      s = s.moduleABmenosCD(Two, Two, n);
      // s = (s.potencia(2).menos(DOS())).modulo(DOS().potencia(this.intValue()).menos(UNO()));
      if (s.esIgualA(Zero)) return true;
    }

    return false;

  } // esNumeroDeMersenne

}

// Los enteros están compuestos por los naturales, sus opuestos y el cero.
class Entero extends Natural {
  constructor(v) {
    // Se construye como un natural con un campo dedicado al signo.
    super(mv);
    let mv = String(mv).trim();
    this._signo = "+";
    if ((mv[0] === "-")) {
      this._signo = "-";
      mv = mv.substring(1).trim();
    } else if (mv[0] === "+") {
      mv = mv.substring(1).trim();
    }
    this.value = mv;
  }

  get abs() {
    return this.value;
  }

  set abs(n) {
    if (this.value === Zero) {
      this.signo = "+";
    }
    this.value = String(n);
  }

  get signo() {
    if (this.value === Zero) {
      this.signo = "+";
    } // just for check...
    return this._signo;
  }

  set signo(s) {
    this._signo = String(s);
  }

  get esNegativo() {
    return this.signo === "-";
  }

  set esNegativo(e) {
    if (e) {
      this.signo = "-";
    } else {
      this.signo = "+";
    }
  }

  get esPositivo() {
    return this.signo === "+";
  }

  set esPositivo(e) {
    if (e) {
      this.signo = "+";
    } else {
      this.signo = "-";
    }
  }

  esIgualA(b) {
    return ((this.value == x.value) && (this.signo = x.signo));
  }

  desigual_o_diferenteA(b) {
    return !this.esIgualA(this.value, b);
  }

  // I hope so... optimize.
  menorQue(b) {
    b = new Entero(b);
    if ((this.signo == "-") && (b.signo == "+")) {
      return true;
    } else if ((this.signo == "+") && (b.signo == "-")) {
      return false;
    } else if ((this.signo == "+") && (b.signo == "+")) {
      return this.super(b);
    } else { // ambos signos negativos
      return !this.super(b);
    }
  }

  mayorQue(b) {
    return (!this.menorQue(b) && this.desigual_o_diferenteA(b));
  }

  // I hope so... optimize.
  menorOIgualQue(b) {
    return (this.esIgualA(b) || this.menorQue(b));
  }

  mayorOIgualQue(b) {
    return (this.esIgualA(b) || this.mayorQue(b));
  }

  mayor(x, y) {
    let xav = new Natural(x.abs);
    let yav = new Natural(y.abs);
    if (xav.mayorOIgualQue(yav)) {
      return x;
    }
    return y;
  }

  menor(x, y) {
    let xav = new Natural(x.abs);
    let yav = new Natural(y.abs);
    if (xav.menorOIgualQue(yav)) {
      return x;
    }
    return y;
  }

  // // // // hacaer el trabajo de sumar y poner el signo del mayor // // // //
  suma(a, b) {
    a = new Entero(a);
    b = new Entero(b);
    let sig = "+";

    if (a.signo === b.signo) {
      let sum = String(JSBI.add(JSBI.BigInt(String(a.abs)), JSBI.BigInt(String(b.abs))));
      sig = a.signo;
      return sig + sum;
    } else {
      let may = this.mayor(a, b);
      sig = may.signo;
      let men = this.menor(a, b);
      let res = String(JSBI.subtract(JSBI.BigInt(String(may.abs)), JSBI.BigInt(String(men.abs))));
      return sig + res;
    }

  }

  sumar(b) {
    a = this;
    b = String(b);
    this.value = this.suma(a, b);
    return this.value;
  }

  // obtener el opuesto
  oponer() {
    if (this.signo === "+") {
      this.signo = "-";
    } else {
      this.signo = "+";
    }// just for check...
  }

  // Sin complicaciones, restar es sumar el opuesto (la implementación de la resta debe estar allá...)
  resta(a, b) {
    b = new Entero(b);
    b.oponer();
    return this.suma(a, b.value);
  }

  restar(b) {
    a = this.value;
    this.value = this.resta(a, b);
    return this.value;
  }

  producto(a, b) {
    a = new Entero(a);
    b = new Entero(b);
    let sig = "+";
    if (a.signo !== b.signo) {
      sig = "-";
    }
    return sig + String(JSBI.multiply(JSBI.BigInt(a.abs), JSBI.BigInt(b.abs)));
  }

  multiplicar(b) {
    a = this.value;
    this.value = this.producto(a, b);
    return this.value;
  }

  division(a, b) {
    a = new Entero(a);
    b = new Entero(b);
    let sig = "+";
    if (a.signo !== b.signo) {
      sig = "-";
    }
    return sig + String(JSBI.divide(JSBI.BigInt(a.abs), JSBI.BigInt(b.abs)));
  }

  dividir(b) {
    a = this.value;
    b = String(b);
    this.value = this.division(a, b);
    return this.value;
  }

  // ported to Google Bigint by Luis Guillermo Bultet Ibles 15/05/2021. 10:31AM (Solo enteros)
  #root(base, argument) {
    argument = String(argument);

    // added optimization, Number root of Number
    if (procesable(argument)) {
      if ((argument == Two) && (procesable(base))) {
        return Math.trunc(Math.sqrt(Number(base)));
      }
      let resultado = Math.pow(base, 1 / Math.abs(Number(argument)));
      return String(Math.trunc(resultado));
    }

    // and this is. original code of big to big
    let s = this.sumar(base, 1);
    let k1 = this.restar(argument, 1);
    let u = String(base); // bigint is a natural string
    while (this.menorQue(u, s)) {
      s = u;
      u = this.dividir(this.sumar(this.multiplicar(u, k1), this.dividir(base, this.exponenciar(u, k1))), argument);
    }
    return s;
  }

  raizCuadrada(a) {
    // Prepáralo para bigint, solamente está para lo que venga
    return this.raizEnesima(a, 2);
  }

  // devolver la suma de los dígitos del número, útil para divisibilidad por 3
  sumaDigitos(a) {
    let result = 0;
    for (let sdi = 0; sdi < a.length; sdi++) {
      result += Number(String(a).charAt(sdi));
    }
    return String(result);
  }

  sumarDigitos() {
    this.value = this.sumarDigitos(this.value);
  }

  // devocler el último dígito, útil para divisiblidad por 2 y por 5
  ultimoDigito() {
    a = this.value;
    if (!a) {
      return Zero;
    }
    return String(a).charAt(a.length - 1);
  }

  // Observación, es aquí donde debes adaptar las optimizaciones de divisibilidad, encajan.
  modulo(b) {
    a = this.value;
    b = String(b);

    if ((a == b) || (a == Zero) || (b == One)) {
      return Zero;
    }

    if (a == One) {
      if (b == One) {
        return Zero;
      } else {
        return One;
      }
    }

    if (this.mayorQue(b, a)) {
      return a;
    }

    if ((a.length > 1) && ((b == Two) || (b == Five))) {
      let ld = this.ultimoDigito(a);
      return this.modulo(ld, b);
    }

    if ((a.length > 20) && (b == Three)) {
      let sd = this.sumaDeDigitos(a);
      return this.modulo(sd, b);
    }

    // Analizar los otros criterios, a ver si se pueden incluir en el cálculo modular
    // ...

    return String(JSBI.remainder(JSBI.BigInt(String(a)), JSBI.BigInt(String(b))));
  }

  resto(a, b) {
    return (new Natural(a)).modulo(b).value;
  }

  par() {
    a = this.value;
    return (this.modulo(a, 2) === 0);
  }

  impar() {
    a = this.value;
    return (!this.par(a));
  }

  // se pueden incluir las optimizaciones de Legendre, además, no exponencia para reales...
  exponenciar(b) {
    a = this.value;
    b = String(b);
    return String(JSBI.exponentiate(JSBI.BigInt(String(a)), JSBI.BigInt(String(b))));
  }

  esPrimo() {
    return bigInt(String(this.value)).isPrime();
  }

  esProbablementePrimo() {
    return bigInt(String(this.value)).isProbablePrime();
  }

  // this^b mod c
  modPow(b, c) {
    a = this.value;
    let base = bigInt(String(a));
    return base.modPow(String(b), String(c)).toString();
  }

  // Esta... cosa me da (this^b-c) mod d, con menos.
  moduleABmenosCD(b, c, d) {
    a = this.value;
    let r1 = big_modPow(a, b, d);
    if (big_mayorQue(c, r1)) {
      r1 = big_Restar(r1, c);
    } else {
      while (big_mayorQue(c, r1)) {
        r1 = big_Restar(big_Sumar(r1, d), c);
      }
    }
    r1 = big_Sumar(r1, big_Modulo(big_Restar(big_Multiplicar(c, d), d), d));
    return big_Modulo(r1, d);
  } // revisar

  // Esta... cosa me da (this^b+c) mod d, con más.
  moduleABsumCD(b, c, d) {
    a = this.value;
    let r1 = big_modPow(a, b, d);
    r1 = big_Sumar(r1, c);
    return big_Modulo(r1, d);
  } // ok

  gcd(b) {
    a = this.value;
    return bigInt.gcd(bigInt(String(a)), bigInt(String(b))).toString();
  }

  power(b) {
    a = this.value;
    return bigInt(a).pow(b).toString();
  }

}

// Los racionales Q son números de la forma p/q donde p y q son enteros
// Puede utilizarse el trabajo de Robert Eisele Copyright (c) 2017 para jsfractions...

class Racionales extends Entero {
  // Se utiliza la misma arquitectura que Natural con un numerador y un denominados,
  // acepta las formas: new Rational("a/b");     // donde a, b y c son naturales
  //                  : new Rational("a b/c");   // Fracciones mixtas, un entero y una fracción propia lo mismo que (a*c + b)/c
  //                  : new Rational("0.14159"); // Decimal fraccionario
  // TODO:            : incluir los periodos entre paréntesis
  constructor(numerador, denominador) {
    super(numerador);
    if ((!denominador) && (numerador instanceof String)) {
      this.denominador = One;
      let posicionBarra = (String(numerador).indexOf('/'));
      if (posicionBarra > 0) {
        this.numerador = new Entero(String(numerador).substring(0, posicionBarra - 1));
        this.denominador = new Entero(String(numerador).substring(posicionBarra + 1, String(numerador).length));
      }
      let posicionComa = (String(numerador).indexOf(','));
      if (posicionComa === -1) {
        posicionComa = (String(numerador).indexOf('.'));
      }

      if (posicionComa > 0) {
        numerador = String(numerador);
        let parteEntera = new Entero(numerador.substring(0, posicionComa - 1));
        let parteDecimal = numerador.substring(posicionComa + 1, numerador.length);
        let precision = 0;
        while ((parteDecimal.length > 1) && (parteDecimal.substr(0) === '0')) {
          precision++;
          parteDecimal = parteDecimal.substr(1);
        }
        if (parteDecimal !== '0') {
          let base = (new Entero('10')).power(precision);
          let aSumar = new Racionales(parteDecimal, base);
          this.sumar(aSumar);
        }
      }
    }
    this.simplificar();
  }

  get numerador() {
    return value;
  }

  set numerador(v) {
    let signo = "+";
    if (v instanceof Natural) {
      this.numerador = new Entero(v.value);
    } else if (v instanceof Entero) { // <- Todos debieran entrar por aquí...
      this.value = v.abs;
      signo = v.signo;
      if (signo !== this.denominador.signo) {
        signo = "-";
      }
    } else {
      this.numerador = new Entero(v); // recoursive
    }
    this.denominador += signo + this.denominador;
    this.simplificar();
  }

  // Almacena un objeto de tipo natural...
  get denominador() {
    return this._denominador;
  }

  set denominador(v) {
    this._denominador = v;
  }

  evaluacion() {
    // Por el momento solamente resuelve para numeradores y denominadores pequeños
    if (procesable(this.numerador) && procesable(this.denominador)) {
      return Number(this.numerador) / Number(this.denominador);
    } // implementar ...
  }

  simplificar() {
    // Recuerda, el signo lo almaceno en el denominador, que es un Entero para poder usar la
    // misma arquitectura de naturales para el numerador
    let _mcd = new Entero(this.MCD(this.numerador, this.denominador));
    if (this.mayor(_mcd, One)) {
      this.denominador = this.division(this.denominador, _mcd);
      this.numerador = this.division(this.numerador, _mcd);
    }
    // De todas formas, lo que quiero en el numerador es un Natural
    this.numerador.signo;
  }

  esIgualA(b) {
    b = new Racionales(b);
    return (this.numerador === b.numerador) && (this.denominador === b.denominador);
  }

  desigual_o_diferenteA(b) {
    b = new Racionales(b);
    return !this.esIgualA(b);
  }

  // I hope so... optimize.
  menorQue(b) {
    b = new Racionales(b);
    return (this.menor(this.numerador, b.numerador)) && (this.menor(this.denominador, b.denominador));
  }

  mayorQue(b) {
    b = new Racionales(b);
    return (!this.menorQue(b) && this.desigual_o_diferenteA(b));
  }

  // I hope so... optimize.
  menorOIgualQue(b) {
    b = new Racionales(b);
    return (this.esIgualA(b) || this.menorQue(b));
  }

  mayorOIgualQue(b) {
    b = new Racionales(b);
    return (this.esIgualA(b) || this.mayorQue(b));
  }

  mayor(x, y) {
    let xav = new Natural(x.abs);
    let yav = new Natural(y.abs);
    if (xav.mayorOIgualQue(yav)) {
      return x;
    }
    return y;
  }

  menor(x, y) {
    let xav = new Natural(x.abs);
    let yav = new Natural(y.abs);
    if (xav.menorOIgualQue(yav)) {
      return x;
    }
    return y;
  }

  suma(a, b) {
    let ff = (new Entero(a.numerador)).multiplicar((new Entero(b.denominador)));
    let sf = (new Entero(b.numerador)).multiplicar((new Entero(a.denominador)));
    let nn = this.suma(ff, sf);
    let nd = (new Entero(a.denominador)).multiplicar(b.denominador);
    return new Racionales(nn, nd);
  }

  sumar(s) {
    return this.suma(this, s);
  }

  resta(a, b) {
    let ff = (new Entero(a.numerador)).multiplicar((new Entero(b.denominador)));
    let sf = (new Entero(b.numerador)).multiplicar((new Entero(a.denominador)));
    let nn = this.resta(ff, sf);
    let nd = (new Entero(a.denominador)).multiplicar(b.denominador);
    return new Racionales(nn, nd);
  }

  restar(s) {
    return this.resta(this, s);
  }

  producto(a, b) {
    let nn = (new Entero(a.numerador)).multiplicar((new Entero(b.numerador)));
    let nd = (new Entero(a.denominador)).multiplicar((new Entero(b.denominador)));
    return new Racionales(nn, nd);
  }

  multiplicar(a) {
    a = new Racionales(a);
    return this.multiplicar(a);
  }

  reciproco() {
    return new Racionales(this.denominador, this.numerador);
  }

  division(a, b) {
    return (new Racionales(a)).multiplicar((new Racionales(b).reciproco()));
  }

  dividir(b) {
    b = new Racionales(b);
    return this.division(this, b);
  }


}

class Reales extends Racionales {
}

class Complejos extends Racionales {
}

