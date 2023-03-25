import {Point} from './Point';
import {Color} from './Color';

export class Pixel extends Point {
  constructor(coord, color) {
    super(...coord);
    this.color = color;
  }


  // Avanzar un pixel desde la posición actual en la dirección del punto 2
  advance(pixel2) {
    let address = pixel2.coords.subtraction(this.coords).normalize();
    this.dimmensions = this.dimmensions.map((d, i) => Math.round(d + address[i]));
  }

  // some useful effects

  invert() {
    this.color.r = 255 - this.color.r;
    this.color.g = 255 - this.color.g;
    this.color.b = 255 - this.color.b;
  }

  contrast(factor) {
    this.color.r = factor * (this.color.r - 128) + 128;
    this.color.g = factor * (this.color.g - 128) + 128;
    this.color.b = factor * (this.color.b - 128) + 128;
  }

  grayScale() {
    let avg = (this.color.r + this.color.g + this.color.b) / 3;
    this.color.r = avg;
    this.color.g = avg;
    this.color.b = avg;
  }

  sepia() {
    this.color.r = 255 - this.color.r;
    this.color.g = 255 - this.color.g;
    this.color.b = 255 - this.color.b;

    this.color.r = (this.color.r * .393) + (this.color.r * .769) + (this.color.r * .189);
    this.color.g = (this.color.g * .349) + (this.color.g * .686) + (this.color.g * .168);
    this.color.b = (this.color.b * .272) + (this.color.b * .534) + (this.color.b * .131);
  }

  distanciaObjetiva(pixel2) {
    return Math.sqrt(Math.pow(this.x - pixel2.x, 2)
      + Math.pow(this.x - pixel2.y, 2)
      + Math.pow(this.color.r - pixel2.color.r, 2)
      + Math.pow(this.color.g - pixel2.color.g, 2)
      + Math.pow(this.color.b - pixel2.color.b, 2)
      + Math.pow(this.color.a - pixel2.color.a, 2));
  }

  distanciaSubjetiva(pixel2) {
    return this.coords.distance(pixel2.coords);
  }

  // Incluir el imagedata del canvas en un objeto


}
