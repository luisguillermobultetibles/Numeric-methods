import {Point} from './Point';
import {Color} from './Color';

export class Pixel extends Point {
  constructor(x, y, r, g, b) {
    super(...arguments);
  }

  get color() {
    return new Color(this.dimmensions[2], this.dimmensions[3], this.dimmensions[4], this.dimmensions[5]);
  }

  set color(c) {
    [this.dimmensions[2], this.dimmensions[3], this.dimmensions[4], this.dimmensions[5]] = [c.r, c.g, c.b, c.a];
  }

  // Avanzar un pixel desde la posición actual en la dirección del punto 2
  advance(pixel2) {
    let address = pixel2.subtraction(this).normalize();
    this.dimmensions = this.dimmensions.map((d, i) => Math.round(d + address[i]));
  }

  // some useful effects

  invert() {
    this.dimmensions[2] = 255 - this.dimmensions[2];
    this.dimmensions[3] = 255 - this.dimmensions[3];
    this.dimmensions[4] = 255 - this.dimmensions[4];
  }

  contrast(factor) {
    this.dimmensions[2] = factor * (this.dimmensions[2] - 128) + 128;
    this.dimmensions[3] = factor * (this.dimmensions[2] - 128) + 128;
    this.dimmensions[4] = factor * (this.dimmensions[2] - 128) + 128;
  }

  grayScale() {
    let avg = (this.dimmensions[2] + this.dimmensions[3] + this.dimmensions[4]) / 3;
    this.dimmensions[2] = avg;
    this.dimmensions[3] = avg;
    this.dimmensions[4] = avg;
  }

  sepia() {
    this.dimmensions[2] = 255 - this.dimmensions[2];
    this.dimmensions[3] = 255 - this.dimmensions[3];
    this.dimmensions[4] = 255 - this.dimmensions[4];

    this.dimmensions[2] = (this.dimmensions[2] * .393) + (this.dimmensions[3] * .769) + (this.dimmensions[4] * .189);
    this.dimmensions[3] = (this.dimmensions[2] * .349) + (this.dimmensions[3] * .686) + (this.dimmensions[4] * .168);
    this.dimmensions[4] = (this.dimmensions[2] * .272) + (this.dimmensions[3] * .534) + (this.dimmensions[4] * .131);
  }

  distanciaObjetiva(pixel2) {
    return Math.sqrt(Math.pow(this.x - pixel2.x, 2) + Math.pow(this.y - pixel2.y, 2));
  }

  distanciaSubjetiva(pixel2) {
    return this.distance(pixel2);
  }

  // Incluir el imagedata del canvas en un objeto


}
