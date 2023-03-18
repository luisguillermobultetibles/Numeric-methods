// wrapper for "class" Rectangle
import {Shape} from './Shape';


class Rectangle extends Shape {
  constructor(left, top, width, height) {
    super();
    this.left = left || 0;
    this.top = top || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
    this.type = 'rectangle';
  }

  set(left, top, /*optional*/ width = null, /*optional*/ height = null) {
    this.left = left;
    this.top = top;
    this.width = width || this.width;
    this.height = height || this.height;
    this.right = (this.left + this.width);
    this.bottom = (this.top + this.height);
  }

  within(r) {
    return (r.left <= this.left &&
      r.right >= this.right &&
      r.top <= this.top &&
      r.bottom >= this.bottom);
  }

  overlaps(r) {
    return (this.left < r.right &&
      r.left < this.right &&
      this.top < r.bottom &&
      r.top < this.bottom);
  }


}
