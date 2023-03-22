import {WebSystemObject} from './WebSystemObject';
import {Circle} from './Circle';
import {Segment} from './Segment';

// wrapper for "class" Rectangle
export class Polygon extends Shape {
  constructor(vertexs) {
    super();
    this.coords = vertexs; // array of Point
  }

  // polygon objects are an array of vertices forming the polygon
  //     var polygon1=[{x:100,y:100},{x:150,y:150},{x:50,y:150},...];
  // THE POLYGONS MUST BE CONVEX
  // return true if the 2 polygons are colliding
  static convexPolygonsColliding(a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

      // for each polygon, look at each edge of the polygon, and determine if it separates
      // the two shapes
      var polygon = polygons[i];
      for (i1 = 0; i1 < polygon.length; i1++) {

        // grab 2 vertices to create an edge
        var i2 = (i1 + 1) % polygon.length;
        var p1 = polygon[i1];
        var p2 = polygon[i2];

        // find the line perpendicular to this edge
        var normal = {x: p2.y - p1.y, y: p1.x - p2.x};

        minA = maxA = undefined;
        // for each vertex in the first shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        for (j = 0; j < a.length; j++) {
          projected = normal.x * a[j].x + normal.y * a[j].y;
          if (minA == undefined || projected < minA) {
            minA = projected;
          }
          if (maxA == undefined || projected > maxA) {
            maxA = projected;
          }
        }

        // for each vertex in the second shape, project it onto the line perpendicular to the edge
        // and keep track of the min and max of these values
        minB = maxB = undefined;
        for (j = 0; j < b.length; j++) {
          projected = normal.x * b[j].x + normal.y * b[j].y;
          if (minB == undefined || projected < minB) {
            minB = projected;
          }
          if (maxB == undefined || projected > maxB) {
            maxB = projected;
          }
        }

        // if there is no overlap between the projects, the edge we are looking at separates the two
        // polygons, and we know there is no overlap
        if (maxA < minB || maxB < minA) {
          return false;
        }
      }
    }
    return true;
  }; // Pls use array of Vector

  // polygon objects are an array of vertices forming the polygon
  //     var polygon1=[{x:100,y:100},{x:150,y:150},{x:50,y:150},...];
  // The polygons can be both concave and convex
  // return true if the 2 polygons are colliding
  static AnyKindConcaveOrConvexePolygonsColliding(p1, p2) {
    // turn vertices into line points
    var lines1 = verticesToLinePoints(p1);
    var lines2 = verticesToLinePoints(p2);
    // test each poly1 side vs each poly2 side for intersections
    for (let i = 0; i < lines1.length; i++) {
      for (let j = 0; j < lines2.length; j++) {
        // test if sides intersect
        var p0 = lines1[i][0];
        var p1 = lines1[i][1];
        var p2 = lines2[j][0];
        var p3 = lines2[j][1];
        // found an intersection -- polys do collide
        if (Segment.SegmentsColliding({p0, p1}, {p2, p3})) {
          return (true);
        }
      }
    }
    // none of the sides intersect
    return (false);
  }

}
