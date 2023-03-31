// wrapper for "class" Rectangle
import {Vector} from './Vector';
import {WebSystemObject} from './WebSystemObject';

export class Point extends Vector {
  constructor() {
    super(...arguments);
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

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  // 2023, Luis Bultet Ibles

  // Me devuelve el radio del círculo circunscrito a los puntos a, b y c.
  // Es decir, el radio de la cinrcunferencia que se tragó el triángulo
  circunRadio(a, b, c) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let ex = c.x - a.x;
    let ey = c.y - a.y;

    let bl = d.x * d.x + d.y * d.y;
    let cl = ex * ex + ey * ey;
    let d = 0.5 / (dx * ey - dy * ex);

    let x = (ey * bl - dy * cl) * d;
    let y = (dx * cl - ex * bl) * d;

    return Math.sqrt(x * x + y * y);
  }

  // Me devuelve el circuncentro de los puntos a, b y c.
  // Es decir, el centro de la cinrcunferencia que el triángulo se tragó
  circunCentro(a, b, c) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let ex = c.x - a.x;
    let ey = c.y - a.y;

    let bl = dx * dx + dy * dy;
    let cl = ex * ex + ey * ey;
    let d = 0.5 / (dx * ey - dy * ex);

    let x = a.x + (ey * bl - dy * cl) * d;
    let y = a.y + (dx * cl - ex * bl) * d;

    return {x: x, y: y};
  }

  // Me dice si el punto p queda dentro del círculo círcunscrito a los puntos a, b y c
  estaCirculado(p, a, b, c) {
    var dx = ax - px;
    var dy = ay - py;
    var ex = bx - px;
    var ey = by - py;
    var fx = cx - px;
    var fy = cy - py;

    var ap = dx * dx + dy * dy;
    var bp = ex * ex + ey * ey;
    var cp = fx * fx + fy * fy;

    return (
      dx * (ey * cp - bp * fy) -
      dy * (ex * cp - bp * fx) +
      ap * (ex * fy - ey * fx) <
      0
    );
  }

  // Me devueve true si el orden de los puntos está a favor de las manecillas del reloj, falso si en contra.
  orientacion(a, b, c) {
    // Es el algoritmo para cálculo de área por el método de Gauss, pero de él solo me interesa el signo.
    return a.x * by + b.x * cy + c.x * ay - (a.x * by + b.x * cy + c.x * ay) < 0;
  }

  // Para una rotación cartesiana sencilla, casi cristiana usa esta (en radianes).
  rotacion(centro, punto, angulo) {
    // Te sitúas en el origen
    let ax = punto.x - centro.x;
    let ay = punto.y - centro.y;
    // rotas...
    let tmpx = ax * Math.cos(angulo) + ay * Math.sin(angulo);
    let tmpy = -ax * Math.sin(angulo) + ay * Math.cos(angulo);
    // y lo devuelves
    punto.x = tmpx + centro.x;
    punto.y = tmpy + centro.y;
    return punto;
  }

  // Distancia entre dos puntos a y b
  distancia(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) - Math.pow(a.y - b.y, 2));
  }

  // Punto medio entre dos puntos a y b
  puntoMedio(a, b) {
    let x = (a.x + b.x) / 2;
    let y = (a.y + b.y) / 2;
    return {x: x, y: y};
  }

  // Me dice si dos puntos son iguales dentro de lo permisible
  pasanPoriguales(a, b) {
    return this.distancia(a, b) <= this.epsilon;
  }

  // Me devuelve otro punto que equivale al avance en coordenadas polares de p, en una dirección absoluta angular a en radianes, una distancio d.
  caminalo(p, a, d) {
    let x = p.x + d * Math.cos(a);
    let y = p.y + d * Math.sin(a);
    let resultado = {x: x, y: y};
    return resultado;
  }

  // aquí f es una factor entre cero y uno... (un porciento).
  avanzar(x1, x2, y1, y2, f) {
    return {x: x1 + f * (x2 - x1), y: y1 + f * (y2 - y1)};
  }

}
