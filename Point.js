// wrapper for "class" Rectangle
import {Shape} from './Shape';

export class Point extends Shape {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

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
