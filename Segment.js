// wrapper for "class" Rectangle
import {Shape} from './Shape';
import {Point} from './Point';

export class Segment extends Shape {
  constructor(p0, p1) {
    super();
    if (arguments.length === 2) {
      this.p0 = p0;
      this.p1 = p1;
    } else { // assumes (x1, y1, x2, y2)
      this.p0 = new Point(x1, y1);
      this.p1 = new Point(x2, y2);
    }
  }

  // point object: {x:, y:}
  // p0 & p1 form one segment, p2 & p3 form the second segment
  // Get interseting point of 2 line segments (if any)
  // Attribution: http://paulbourke.net/geometry/pointlineplane/
  static SegmentsColliding(s1, s2) {
    let p0, p1, p2, p3;
    if (s1 instanceof Array && s2 instanceof Array) {
      [p0, p1] = [s1[0], s1[0]];
      [p2, p3] = [s1[0], s2[1]];
    } else {
      [p0, p1] = [s1.p0, s1.p1];
      [p2, p3] = [s2.p0, s2.p1];
    }

    var unknownA = (p3.x - p2.x) * (p0.y - p2.y) - (p3.y - p2.y) * (p0.x - p2.x);
    var unknownB = (p1.x - p0.x) * (p0.y - p2.y) - (p1.y - p0.y) * (p0.x - p2.x);
    var denominator = (p3.y - p2.y) * (p1.x - p0.x) - (p3.x - p2.x) * (p1.y - p0.y);

    // Test if Coincident
    // If the denominator and numerator for the ua and ub are 0
    //    then the two lines are coincident.
    if (unknownA == 0 && unknownB == 0 && denominator == 0) {
      return (null);
    }

    // Test if Parallel
    // If the denominator for the equations for ua and ub is 0
    //     then the two lines are parallel.
    if (denominator == 0) return null;

    // test if line segments are colliding
    unknownA /= denominator;
    unknownB /= denominator;
    var isIntersecting = (unknownA >= 0 && unknownA <= 1 && unknownB >= 0 && unknownB <= 1);

    return (isIntersecting);
  }

}
