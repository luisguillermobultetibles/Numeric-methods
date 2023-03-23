import {Point} from './Point';
import {Color} from './Color';

export class Pixel extends Point {
  constructor(x, y, color = new Color(0, 0, 0)) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
  }

  // Avanzar un pixel desde la posición actual en la dirección del punto 2
  advance(pixel2) {
    let address = pixel2.subtraction(this); // vector director
    address.normalize(); // normalizado a un pixel en la dirección dominante
    this.dimmensions = this.dimmensions.map((d, i) => Math.round(d + address[i]));
  }

  // some useful effects

  invert() {
    this.color.r = 255 - this.color.r; // red
    this.color.g = 255 - this.color.g; // green
    this.color.b = 255 - this.color.b; // blue
    let tmp = Color.makeRGB(this.color.r, this.color.g, this.color.b);
    [this.h, this.s, this.l] = [tmp.r, tmp.g, tmp.b];
  }

  contrast(factor) {
    this.color.r = factor * (this.color.r - 128) + 128; // red
    this.color.g = factor * (this.color.r - 128) + 128; // green
    this.color.b = factor * (this.color.r - 128) + 128; // blue
    let tmp = Color.makeRGB(this.color.r, this.color.g, this.color.b);
    [this.h, this.s, this.l] = [tmp.r, tmp.g, tmp.b];
  }

  grayScale() {
    let avg = (this.color.r + this.color.g + this.color.b) / 3;
    this.color.r = avg; // red
    this.color.g = avg; // green
    this.color.b = avg; // blue
    let tmp = Color.makeRGB(this.color.r, this.color.g, this.color.b);
    [this.h, this.s, this.l] = [tmp.r, tmp.g, tmp.b];
  }

  sepia() {
    this.color.r = 255 - this.color.r;
    this.color.g = 255 - this.color.g;
    this.color.b = 255 - this.color.b;

    this.color.r = (this.r * .393) + (this.g * .769) + (this.b * .189);
    this.color.g = (this.r * .349) + (this.g * .686) + (this.b * .168);
    this.color.b = (this.r * .272) + (this.g * .534) + (this.b * .131);
  }

  // distancia subjetiva entre píxeles de un cuadro, valores entre 0 y 1.
  distanciaSubjetiva(width, height, pixel2) { // Mover hacia clase pixels
    let v1 = new Vector(this.x / width, this.y / height, this.color.r, this.color.g, this.color.b, this.color.a);
    let v2 = new Vector(pixel2.x / width, pixel2.y / height, pixel2.color.r, pixel2.color.g, pixel2.color.b, pixel2.color.a);
    return v1.distance(v2);
  }

  // Incluir el imagedata del canvas en un objeto


}
