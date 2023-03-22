import {WebSystemObject} from './WebSystemObject';
import {Circle} from './Circle';
import {Segment} from './Segment';

// wrapper for "class" Rectangle
export class Shape extends WebSystemObject {
  constructor() {
    super();
  }

  // For avoid redundances here I've redirected
  // common (non specific) private collision methods

  // rectangle object: { x:, y:, width:, height: }
  // circle object: { x:, y:, radius: }
  // return true if the rectangle and circle are colliding
  RectCircleColliding(rect, circle) {
    let dx = Math.abs(circle.x - (rect.x + rect.width / 2));
    let dy = Math.abs(circle.y - (rect.y + rect.height / 2));

    if (dx > circle.radius + rect.width / 2) {
      return false;
    }
    if (dy > circle.radius + rect.height / 2) {
      return false;
    }

    if (dx <= rect.width) {
      return true;
    }
    if (dy <= rect.height) {
      return true;
    }

    dx = dx - rect.width;
    dy = dy - rect.height;
    return (dx * dx + dy * dy <= circle.radius * circle.radius);
  }


  CircleSegmentColliding(circle, s) {
    // [x0,y0] to [x1,y1] define a line segment
    // [cx,cy] is circle centerpoint, cr is circle radius
    function CircleSegmentColliding(x0, y0, x1, y1, cx, cy, cr) {

      // calc delta distance: source point to line start
      var dx = cx - x0;
      var dy = cy - y0;

      // calc delta distance: line start to end
      var dxx = x1 - x0;
      var dyy = y1 - y0;

      // Calc position on line normalized between 0.00 & 1.00
      // == dot product divided by delta line distances squared
      var t = (dx * dxx + dy * dyy) / (dxx * dxx + dyy * dyy);

      // calc nearest pt on line
      var x = x0 + dxx * t;
      var y = y0 + dyy * t;

      // clamp results to being on the segment
      if (t < 0) {
        x = x0;
        y = y0;
      }
      if (t > 1) {
        x = x1;
        y = y1;
      }

      return ((cx - x) * (cx - x) + (cy - y) * (cy - y) < cr * cr);
    }

    let p1, p2;
    if (s instanceof Array) {
      [p1, p2] = [s[0], s[1]];
    } else {
      [p1, p2] = [s.p0, s.p1];
    }
    return CircleSegmentColliding(p1.x, p1.y, p2.x, p2.y, circle.x, circle.y, circle.radius);
  }

  // var rect={x:,y:,width:,height:};
  // var line={x1:,y1:,x2:,y2:};
  // Get interseting point of line segment & rectangle (if any)
  SegmentRectCollide(segment, rect) {
    // top rect line
    let q = {x: rect.x, y: rect.y};
    let q2 = {x: rect.x + rect.width, y: rect.y};
    if (Segment.SegmentsColliding({p1: segment.p1, p2: segment.p2}, {
      p1: q,
      p2: q2,
    })) {
      return true;
    }
    // right rect line
    q = q2;
    q2 = {x: rect.x + rect.width, y: rect.y + rect.height};
    if (Segment.SegmentsColliding({p1: segment.p1, p2: segment.p2}, {
      p1: q,
      p2: q2,
    })) {
      return true;
    }
    // bottom rect line
    q = q2;
    q2 = {x: rect.x, y: rect.y + rect.height};
    if (Segment.SegmentsColliding({p1: segment.p1, p2: segment.p2}, {
      p1: q,
      p2: q2,
    })) {
      return true;
    }
    // left rect line
    q = q2;
    q2 = {x: rect.x, y: rect.y};
    if (Segment.SegmentsColliding({p1: segment.p1, p2: segment.p2}, {
      p1: q,
      p2: q2,
    })) {
      return true;
    }

    // not intersecting with any of the 4 rect sides
    return false;
  }


  // Colision con el objeto x con el y, o vs
  static #tbtCollationCheck(x, y) {
    if (x instanceof Circle) {
      if (y instanceof Circle) {
        return Circle.CirclesColliding(x, y);
      } else if (y instanceof Rectangle) {
        return this.RectCircleColliding(y, x);
      }
      if (y instanceof Segment) {
        return this.CircleSegmentColliding(x, y);
      }
    } else if (x instanceof Rectangle) {
      if (y instanceof Rectangle) {
        return Rectangle.RectsColliding(x, y);
      } else if (y instanceof Circle) {
        return this.RectCircleColliding(y, x);
      }
      if (y instanceof Segment) {
        return this.SegmentRectCollide(y, x);
      }
    } else if (x instanceof Segment) {
      if (y instanceof Segment) {
        return Segment.SegmentsColliding(x, y);
      } else if (y instanceof Rectangle) {
        return this.RectCircleColliding(y, x);
      } else if (y instanceof Circle) {
        return this.CircleSegmentColliding(y, x);
      }
    }
  }

  static collade(obj) {
    Shape.#tbtCollationCheck(this, obj);
  }

}
