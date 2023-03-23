// wrapper for "class" Rectangle
import {Vector} from './Vector';

export class Point extends Vector {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  DistancePointLine(px, py, x1, y1, x2, y2) {

    //========================================================
    //
    //  Credits:
    //
    //  Adapted from:
    //
    //  Theory by Paul Bourke http://local.wasp.uwa.edu.au/~pbourke/geometry/pointline/
    //
    //  Based in part on C code by Damian Coventry Tuesday, 16 July 2002
    //
    //  Based on VBA code by Brandon Crosby 9-6-05 (2 dimensions)
    //
    //  with grateful thanks for answering my need!
    //
    //--------------------------------------------------------
    //
    //  This Pascal (Delphi v7) implementation by Graham O'Brien 2007-10-13
    //  Errors are all mine.
    //
    //========================================================

    function SqLineMagnitude(x1, y1, x2, y2) {
      //
      //  Returns the square of the magnitude of the line
      //    to cut down on unnecessary Sqrt when in many cases
      //    DistancePointLine() squares the result
      //
      return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    }

    //  px, py is the point to test.
    //  x1, y1, x2, y2 is the line to check distance.
    //
    //  Returns distance from the line, or if the intersecting point on the line nearest
    //    the point tested is outside the endpoints of the line, the distance to the
    //    nearest endpoint.
    //
    //  Returns -1 on zero-valued denominator conditions to return an illegal distance. (
    //    modification of Brandon Crosby's VBA code)

    var
      SqLineMag,              // square of line's magnitude (see note in function LineMagnitude)
      u,                      // see Paul Bourke's original article(s)
      ix,                     // intersecting point X
      iy;                     // intersecting point Y


    SqLineMag = SqLineMagnitude(x1, y1, x2, y2);
    if (SqLineMag < EPSEPS) {
      result = -1.0;
      return result;
    }

    u = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / SqLineMag;

    if ((u < EPS) || (u > 1)) {
      //  Closest point does not fall within the line segment,
      //    take the shorter distance to an endpoint
      ix = SqLineMagnitude(px, py, x1, y1);
      iy = SqLineMagnitude(px, py, x2, y2);
      result = Math.min(ix, iy);
    } //  if (u < EPS) or (u > 1)
    else {
      //  Intersecting point is on the line, use the formula
      ix = x1 + u * (x2 - x1);
      iy = y1 + u * (y2 - y1);
      result = SqLineMagnitude(px, py, ix, iy);
    }
    ; //  else NOT (u < EPS) or (u > 1)

    // finally convert to actual distance not its square

    result = Math.sqrt(result);
    return result;
  };

  // Está el punto en el arco cerrado (corte transversal del toro)
  // var arc={
  //     cx:150, cy:150,
  //     innerRadius:75, outerRadius:100,
  //     startAngle:0, endAngle:Math.PI
  // }
  isPointInArc(x, y, arc) {
    var dx = x - arc.cx;
    var dy = y - arc.cy;
    var dxy = dx * dx + dy * dy;
    var rrOuter = arc.outerRadius * arc.outerRadius;
    var rrInner = arc.innerRadius * arc.innerRadius;
    if (dxy < rrInner || dxy > rrOuter) {
      return (false);
    }
    var angle = (Math.atan2(dy, dx) + PI2) % PI2;
    return (angle >= arc.startAngle && angle <= arc.endAngle);
  }

  // Está el punto en la cuña...
  // var wedge={
  //     cx:150, cy:150,  // centerpoint
  //     radius:100,
  //     startAngle:0, endAngle:Math.PI
  // }
  // Return true if the x,y point is inside the closed wedge

  isPointInWedge(x, y, wedge) {
    var PI2 = Math.PI * 2;
    var dx = x - wedge.cx;
    var dy = y - wedge.cy;
    var rr = wedge.radius * wedge.radius;
    if (dx * dx + dy * dy > rr) {
      return (false);
    }
    var angle = (Math.atan2(dy, dx) + PI2) % PI2;
    return (angle >= wedge.startAngle && angle <= wedge.endAngle);
  }

  // Está el punto en el círculo
  // circle objects: {cx:,cy:,radius:,startAngle:,endAngle:}
  // var circle={
  //     cx:150, cy:150,  // centerpoint
  //     radius:100,
  // }
  // Return true if the x,y point is inside the circle

  isPointInCircle(x, y, circle) {
    var dx = x - circle.cx;
    var dy = y - circle.cy;
    return (dx * dx + dy * dy < circle.radius * circle.radius);
  }

  // Estará el punto en un rectángulo
  // rectangle objects: {x:, y:, width:, height: }
  // var rect={x:10, y:15, width:25, height:20}
  // Return true if the x,y point is inside the rectangle

  isPointInRectangle(x, y, rect) {
    return (x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height);
  }
}
