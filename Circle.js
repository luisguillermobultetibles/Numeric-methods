import {Shape} from './Shape';

// wrapper for "class" Circle
export class Circle extends Shape {
  constructor(x, y, radius) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  // return true if the 2 circles are colliding
  // c1 and c2 are circles as defined above
  static CirclesColliding(c1, c2) {
    var dx = c2.x - c1.x;
    var dy = c2.y - c1.y;
    var rSum = c1.radius + c2.radius;
    return (dx * dx + dy * dy <= rSum * rSum);
  }

}
