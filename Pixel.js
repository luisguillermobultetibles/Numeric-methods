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



}
