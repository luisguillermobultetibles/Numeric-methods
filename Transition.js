import {Clock} from './Clock';

class Transition extends Clock {

  static #effectsList;
  static #architect = function() {
    Transition.#effectsList = [];

    // Transitions (to use with timers)

    // ecuaciones de transición de @author: Robert Penners.
    // t: elapsed time inside duration (currentTime-startTime),
    // b: beginning value,
    // c: total change from beginning value (endingValue-startingValue),
    // d: total duration
    Transition.#effectsList.push({
      nombre: 'InQuad', effect: (t, b, c, d) => {
        return c * (t /= d) * t + b;
      }, defaults: [.25, .46, .45, .94],
    });

    Transition.#effectsList.push({
      nombre: 'OutQuad', effect: (t, b, c, d) => {
        return -c * (t /= d) * (t - 2) + b;
      },
    });

    Transition.#effectsList.push({
      nombre: 'InOutQuad', effect: (t, b, c, d) => {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }, defaults: [.455, .03, .515, .955],
    });

    Transition.#effectsList.push({
      nombre: 'InCubic', effect: (t, b, c, d) => {
        return c * (t /= d) * t * t + b;
      }, defaults: [.55, .055, .675, .19],
    });

    Transition.#effectsList.push({
      nombre: 'OutCubic', effect: (t, b, c, d) => {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      }, defaults: [.215, .61, .355, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutCubic', effect: (t, b, c, d) => {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }, defaults: [.645, .045, .355, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InQuart', effect: (t, b, c, d) => {
        return c * (t /= d) * t * t * t + b;
      }, defaults: [.895, .03, .685, .22],
    });

    Transition.#effectsList.push({
      nombre: 'OutQuart', effect: (t, b, c, d) => {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      }, defaults: [.165, .84, .44, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutQuart', effect: (t, b, c, d) => {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }, defaults: [.77, 0, .175, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InQuint', effect: (t, b, c, d) => {
        return c * (t /= d) * t * t * t * t + b;
      }, defaults: [.755, .05, .855, .06],
    });

    Transition.#effectsList.push({
      nombre: 'OutQuint', effect: (t, b, c, d) => {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      }, defaults: [.23, 1, .32, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutQuint', effect: (t, b, c, d) => {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }, defaults: [.86, 0, .07, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InSine', effect: (t, b, c, d) => {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      }, defaults: [.47, 0, .745, .715],
    });

    Transition.#effectsList.push({
      nombre: 'OutSine', effect: (t, b, c, d) => {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      }, defaults: [.39, .575, .565, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutSine', effect: (t, b, c, d) => {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      }, defaults: [.445, .05, .55, .95],
    });

    Transition.#effectsList.push({
      nombre: 'InExpo', effect: (t, b, c, d) => {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      }, defaults: [.95, .05, .795, .035],
    });

    Transition.#effectsList.push({
      nombre: 'OutExpo', effect: (t, b, c, d) => {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      }, defaults: [.19, 1, .22, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutExpo', effect: (t, b, c, d) => {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }, defaults: [1, 0, 0, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InCirc', effect: (t, b, c, d) => {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      }, defaults: [.6, .04, .98, .335],
    });

    Transition.#effectsList.push({
      nombre: 'OutCirc', effect: (t, b, c, d) => {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      }, defaults: [.075, .82, .165, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutCirc', effect: (t, b, c, d) => {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }, defaults: [.785, .135, .15, .86],
    });

    Transition.#effectsList.push({
      nombre: 'InElastic', effect: (t, b, c, d) => {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else {
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      }, defaults: [.42, 0, 1, 1],
    });

    Transition.#effectsList.push({
      nombre: 'OutElastic', effect: (t, b, c, d) => {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else {
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      }, defaults: [0, 0, .58, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutElastic', effect: (t, b, c, d) => {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        } else {
          var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }, defaults: [.42, 0, .58, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InBack', effect: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      }, defaults: [.42, 0, 1, 1],
    });

    Transition.#effectsList.push({
      nombre: 'OutBack', effect: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      }, defaults: [0, 0, .58, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutBack', effect: (t, b, c, d, s) => {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      }, defaults: [.42, 0, .58, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InBounce', effect: (t, b, c, d) => {
        return c - this.easeOutBounce(d - t, 0, c, d) + b;
      }, defaults: [.42, 0, 1, 1],
    });

    Transition.#effectsList.push({
      nombre: 'OutBounce', effect: (t, b, c, d) => {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      }, defaults: [0, 0, .58, 1],
    });

    Transition.#effectsList.push({
      nombre: 'InOutBounce', effect: (t, b, c, d) => {
        if (t < d / 2) return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
        return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }, defaults: [.42, 0, .58, 1],
    });
  }('just run before constructor...');

  constructor(obj, property, endValue, startValue = obj[property], method, elapsingTime = 1000, latency = 30) {
    super(Math.round(1000 / (2 * latency)), null, false); // Por ejemplo 1 segundo a 30 cuadros por seg.
    delete Transition.#architect;

    this.obj = obj;
    this.startValue = startValue;
    this.endValue = endValue;

    this.oninterval = this.update;

    this.method = method instanceof String ? Transition.#effectsList.findIndex(effect => effect.nombre.lowercase() === method.lowercase()) : method;
    console.log(`We are using the method: ${this.method}`);
    this.effect = Transition.#effectsList [this.method]; // optimize

    this.#b = Number(new Date());
    this.#c = Math.abs(this.endValue - this.startValue);
    this.#d = elapsingTime;
    this.#t = 0;

    this.active = active;
  }

  update() {
    this.#t = Number(new Date());
    if (this.#t > (this.#b + this.#d)) {
      this.obj[this.property] = this.endValue;
      this.free();
    } else {
      this.obj[this.property] = this.effect(this.#t, this.#b, this.#c, this.#d);
    }
  }

}
