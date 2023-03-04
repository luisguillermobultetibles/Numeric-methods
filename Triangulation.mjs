import {WebSystemObject} from './WebSystemObject.mjs';
// Clase mínima para construir y actualizar una nueva triangulación, a partir de algunos puntos dados...
// Convertir en un método del levantamiento (Topología)
// Para poder luego realizar el diagrama de Voronoi
// Terminar las interpolaciones, fourier, incorporar distancia sobre geoide alta presición
// Los puntos deben estar dados en un arreglo de [x, y], por ejemplo
// Copyright Luis Guillermo Bultet Ibles, basado en el Delaunator de Vladimir Agafonkin.

class Triangulacion extends WebSystemObject {

  constructor(points, integers = false) {
    super();
    this.EDGE_STACK = new Array(512);

    this.integers = integers;
    this.key = null;

    this.#from(points);
  }

  // Estructura que contiene los triángulos... (3 elementos por cada uno).
  get triangulos() {
    return this.triangles;
  }

  // Obtener el borde en un nuevo polígono
  get borde() {
    return this.hull;
  }

  // Los puntos con los que trabaja esta triangulación,
  // deben ser enteros, por eso se necesitan las siguientes funciones utilitarias.

  // hay algun punto fragmentado
  fragmented(points = [], eps = WebSystemObject.epsilon) {
    let valor;
    return points.some((element) => {
      return this.isFraction(element[0], eps) || this.isFraction(element[1], eps);
    });
  }

  // Si hay algún punto fragmentado, la serie de puntos debe ser cifrada antes de triangular
  // a continuación, el procedimiento y las funciones para cifrar y descifrar.

  // primero se genera una llave
  getKey(points) {
    let xgcd, xmin, xmax, ygcd, ymin, ymax;
    points.forEach((element, i) => {
      if (i === 0) {
        xgcd = element[0];
        xmin = element[0];
        xmax = element[0];
        ygcd = element[1];
        ymin = element[1];
        ymax = element[1];
      } else {
        xgcd = this.euclides(xgcd, element[0]); // x's
        xmin = Math.min(xmin, element[0]);
        xmax = Math.max(xmax, element[0]);
        ygcd = this.euclides(ygcd, element[1]); // y's
        ymin = Math.min(ymin, element[1]);
        ymax = Math.max(ymax, element[1]);
      }
    });
    return {xgcd, xmin, xmax, ygcd, ymin, ymax};
  }

  // obtener puntos con coordenadas enteras
  encodeOne(element, key) {
    return [(element[0] - key.xmin) / key.xgcd, (element[1] - key.ymin) / key.ygcd];
  }

  encode(puntos, key) {
    return puntos.map((element) => this.encodeOne(element, key));
  }

  // volver a obtener el punto original a partir del de coordenadas enteras y la llave.
  decodeOne(element, key) {
    return [key.xmin + element[0] * key.xgcd, key.ymin + element[1] * key.ygcd];
  }

  decode(puntos, key) {
    return puntos.map((element) => this.decodeOne(element, key));
  }

  // the classic

  #triangulate(coords) {
    let n = coords.length >> 1;
    if (n > 0 && typeof coords[0] !== 'number') {
      throw new Error('Expected coords to contain numbers.');
    }

    this.coords = coords;

    // arrays that will store the triangulation graph
    let maxTriangles = Math.max(2 * n - 5, 0);
    this._triangles = new Uint32Array(maxTriangles * 3);
    this._halfedges = new Int32Array(maxTriangles * 3);

    // temporary arrays for tracking the edges of the advancing convex hull
    this._hashSize = Math.ceil(Math.sqrt(n));
    this._hullPrev = new Uint32Array(n); // edge to prev edge
    this._hullNext = new Uint32Array(n); // edge to next edge
    this._hullTri = new Uint32Array(n); // edge to adjacent triangle
    this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash

    // temporary arrays for sorting points
    this._ids = new Uint32Array(n);
    this._dists = new Float64Array(n);

    this.#update();
  };

  #from(points, getX, getY) {
    if (!this.integers && this.fragmented(points)) {
      this.key = this.getKey(points);
    }

    if (getX === void 0) getX = this.#defaultGetX;
    if (getY === void 0) getY = this.#defaultGetY;

    let n = points.length;
    let coords = new Float64Array(n * 2);

    for (let i = 0; i < n; i++) {
      let p = points[i];
      coords[2 * i] = getX(p);
      coords[2 * i + 1] = getY(p);
    }

    return this.#triangulate(coords);
  };

  #update() {

    let ref = this;
    let coords = ref.coords;
    let hullPrev = ref._hullPrev;
    let hullNext = ref._hullNext;
    let hullTri = ref._hullTri;
    let hullHash = ref._hullHash;
    let n = coords.length >> 1;

    // populate an array of point indices; calculate input data bbox
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < n; i++) {
      let x = coords[2 * i];
      let y = coords[2 * i + 1];
      if (x < minX) {
        minX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
      this._ids[i] = i;
    }
    let cx = (minX + maxX) / 2;
    let cy = (minY + maxY) / 2;

    let minDist = Infinity;
    let i0, i1, i2;

    // pick a seed point close to the center
    for (let i$1 = 0; i$1 < n; i$1++) {
      let d = this.#dist(cx, cy, coords[2 * i$1], coords[2 * i$1 + 1]);
      if (d < minDist) {
        i0 = i$1;
        minDist = d;
      }
    }
    let i0x = coords[2 * i0];
    let i0y = coords[2 * i0 + 1];

    minDist = Infinity;

    // find the point closest to the seed
    for (let i$2 = 0; i$2 < n; i$2++) {
      if (i$2 === i0) {
        continue;
      }
      let d$1 = this.#dist(i0x, i0y, coords[2 * i$2], coords[2 * i$2 + 1]);
      if (d$1 < minDist && d$1 > 0) {
        i1 = i$2;
        minDist = d$1;
      }
    }
    let i1x = coords[2 * i1];
    let i1y = coords[2 * i1 + 1];

    let minRadius = Infinity;

    // find the third point which forms the smallest circumcircle with the first two
    for (let i$3 = 0; i$3 < n; i$3++) {
      if (i$3 === i0 || i$3 === i1) {
        continue;
      }
      let r = this.#circumradius(i0x, i0y, i1x, i1y, coords[2 * i$3], coords[2 * i$3 + 1]);
      if (r < minRadius) {
        i2 = i$3;
        minRadius = r;
      }
    }
    let i2x = coords[2 * i2];
    let i2y = coords[2 * i2 + 1];

    if (minRadius === Infinity) {
      // order collinear points by dx (or dy if all x are identical)
      // and return the list as a hull
      for (let i$4 = 0; i$4 < n; i$4++) {
        this._dists[i$4] = (coords[2 * i$4] - coords[0]) || (coords[2 * i$4 + 1] - coords[1]);
      }
      this.#quicksort(this._ids, this._dists, 0, n - 1);
      let hull = new Uint32Array(n);
      let j = 0;
      for (let i$5 = 0, d0 = -Infinity; i$5 < n; i$5++) {
        let id = this._ids[i$5];
        if (this._dists[id] > d0) {
          hull[j++] = id;
          d0 = this._dists[id];
        }
      }
      this.hull = hull.subarray(0, j);
      this.triangles = new Uint32Array(0);
      this.halfedges = new Uint32Array(0);
      return;
    }

    // swap the order of the seed points for counter-clockwise orientation
    if (this.#orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
      let i$6 = i1;
      let x$1 = i1x;
      let y$1 = i1y;
      i1 = i2;
      i1x = i2x;
      i1y = i2y;
      i2 = i$6;
      i2x = x$1;
      i2y = y$1;
    }

    let center = this.#circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
    this._cx = center.x;
    this._cy = center.y;

    for (let i$7 = 0; i$7 < n; i$7++) {
      this._dists[i$7] = this.#dist(coords[2 * i$7], coords[2 * i$7 + 1], center.x, center.y);
    }

    // sort the points by distance from the seed triangle circumcenter
    this.#quicksort(this._ids, this._dists, 0, n - 1);

    // set up the seed triangle as the starting hull
    this._hullStart = i0;
    let hullSize = 3;

    hullNext[i0] = hullPrev[i2] = i1;
    hullNext[i1] = hullPrev[i0] = i2;
    hullNext[i2] = hullPrev[i1] = i0;

    hullTri[i0] = 0;
    hullTri[i1] = 1;
    hullTri[i2] = 2;

    this._hullHash.fill(-1);
    this._hullHash[this.#_hashKey(i0x, i0y)] = i0;
    this._hullHash[this.#_hashKey(i1x, i1y)] = i1;
    this._hullHash[this.#_hashKey(i2x, i2y)] = i2;

    this.trianglesLen = 0;
    this.#_addTriangle(i0, i1, i2, -1, -1, -1);

    for (let k = 0, xp = (void 0), yp = (void 0); k < this._ids.length; k++) {
      let i$8 = this._ids[k];
      let x$2 = coords[2 * i$8];
      let y$2 = coords[2 * i$8 + 1];

      // skip near-duplicate points
      if (k > 0 && Math.abs(x$2 - xp) <= WebSystemObject.epsilon && Math.abs(y$2 - yp) <= WebSystemObject.epsilon) {
        continue;
      }
      xp = x$2;
      yp = y$2;

      // skip seed triangle points
      if (i$8 === i0 || i$8 === i1 || i$8 === i2) {
        continue;
      }

      // find a visible edge on the convex hull using edge hash
      let start = 0;
      for (let j$1 = 0, key = this.#_hashKey(x$2, y$2); j$1 < this._hashSize; j$1++) {
        start = hullHash[(key + j$1) % this._hashSize];
        if (start !== -1 && start !== hullNext[start]) {
          break;
        }
      }

      start = hullPrev[start];
      let e = start, q = (void 0);
      while (q = hullNext[e], !this.#orient(x$2, y$2, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
        e = q;
        if (e === start) {
          e = -1;
          break;
        }
      }
      if (e === -1) {
        continue;
      } // likely a near-duplicate point; skip it

      // add the first triangle from the point
      let t = this.#_addTriangle(e, i$8, hullNext[e], -1, -1, hullTri[e]);

      // recursively flip triangles from the point until they satisfy the Delaunay condition
      hullTri[i$8] = this.#_legalize(t + 2);
      hullTri[e] = t; // keep track of boundary triangles on the hull
      hullSize++;

      // walk forward through the hull, adding more triangles and flipping recursively
      let n$1 = hullNext[e];
      while (q = hullNext[n$1], this.#orient(x$2, y$2, coords[2 * n$1], coords[2 * n$1 + 1], coords[2 * q], coords[2 * q + 1])) {
        t = this.#_addTriangle(n$1, i$8, q, hullTri[i$8], -1, hullTri[n$1]);
        hullTri[i$8] = this.#_legalize(t + 2);
        hullNext[n$1] = n$1; // mark as removed
        hullSize--;
        n$1 = q;
      }

      // walk backward from the other side, adding more triangles and flipping
      if (e === start) {
        while (q = hullPrev[e], this.#orient(x$2, y$2, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
          t = this.#_addTriangle(q, i$8, e, -1, hullTri[e], hullTri[q]);
          this.#_legalize(t + 2);
          hullTri[q] = t;
          hullNext[e] = e; // mark as removed
          hullSize--;
          e = q;
        }
      }

      // update the hull indices
      this._hullStart = hullPrev[i$8] = e;
      hullNext[e] = hullPrev[n$1] = i$8;
      hullNext[i$8] = n$1;

      // save the two new edges in the hash table
      hullHash[this.#_hashKey(x$2, y$2)] = i$8;
      hullHash[this.#_hashKey(coords[2 * e], coords[2 * e + 1])] = e;
    }

    this.hull = new Uint32Array(hullSize);
    for (let i$9 = 0, e$1 = this._hullStart; i$9 < hullSize; i$9++) {
      this.hull[i$9] = e$1;
      e$1 = hullNext[e$1];
    }

    // trim typed triangle mesh arrays
    this.triangles = this._triangles.subarray(0, this.trianglesLen);
    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
  };

  #_hashKey(x, y) {
    return Math.floor(this.#pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
  };

  #_legalize(a) {
    let ref = this;
    let triangles = ref._triangles;
    let halfedges = ref._halfedges;
    let coords = ref.coords;

    let i = 0;
    let ar = 0;

    // recursion eliminated with a fixed-size stack
    while (true) {
      let b = halfedges[a];

      /* if the pair of triangles doesn't satisfy the Delaunay condition
       * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
       * then do the same check/flip recursively for the new pair of triangles
       *
       *       pl                pl
       *      /||\              /  \
       *   al/ || \bl        al/    \a
       *    /  ||  \          /      \
       *   /  a||b  \  flip  /___ar___\
       * p0\   ||   /p1=>  p0\---bl---/p1
       *    \  ||  /          \      /
       *   ar\ || /br         b\    /br
       *      \||/              \  /
       *       pr                pr
       */
      let a0 = a - a % 3;
      ar = a0 + (a + 2) % 3;

      if (b === -1) { // convex hull edge
        if (i === 0) {
          break;
        }
        a = this.EDGE_STACK[--i];
        continue;
      }

      let b0 = b - b % 3;
      let al = a0 + (a + 1) % 3;
      let bl = b0 + (b + 2) % 3;

      let p0 = triangles[ar];
      let pr = triangles[a];
      let pl = triangles[al];
      let p1 = triangles[bl];

      let illegal = this.#inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);

      if (illegal) {
        triangles[a] = p1;
        triangles[b] = p0;

        let hbl = halfedges[bl];

        // edge swapped on the other side of the hull (rare); fix the halfedge reference
        if (hbl === -1) {
          let e = this._hullStart;
          do {
            if (this._hullTri[e] === bl) {
              this._hullTri[e] = a;
              break;
            }
            e = this._hullPrev[e];
          } while (e !== this._hullStart);
        }
        this._link(a, hbl);
        this._link(b, halfedges[ar]);
        this._link(ar, bl);

        let br = b0 + (b + 1) % 3;

        // don't worry about hitting the cap: it can only happen on extremely degenerate input
        if (i < this.EDGE_STACK.length) {
          this.EDGE_STACK[i++] = br;
        }
      } else {
        if (i === 0) {
          break;
        }
        a = this.EDGE_STACK[--i];
      }
    }

    return ar;
  };

  _link(a, b) {
    this._halfedges[a] = b;
    if (b !== -1) {
      this._halfedges[b] = a;
    }
  };

  // add a new triangle given vertex indices and adjacent half-edge ids
  #_addTriangle = function _addTriangle(i0, i1, i2, a, b, c) {
    let t = this.trianglesLen;

    this._triangles[t] = i0;
    this._triangles[t + 1] = i1;
    this._triangles[t + 2] = i2;

    this._link(t, a);
    this._link(t + 1, b);
    this._link(t + 2, c);

    this.trianglesLen += 3;

    return t;
  };

  // monotonically increases with real angle, but doesn't need expensive trigonometry
  #pseudoAngle(dx, dy) {
    let p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
  }

  #dist(ax, ay, bx, by) {
    let dx = ax - bx;
    let dy = ay - by;
    return dx * dx + dy * dy;
  }

  // return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
  #orientIfSure(px, py, rx, ry, qx, qy) {
    let l = (ry - py) * (qx - px);
    let r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
  }

  /*
      Substituir por y chequear

      // return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
      function orientIfSure(px, py, rx, ry, qx, qy) {
          var l = (ry - py) * (qx - px);
          var r = (rx - px) * (qy - py);
          return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
      }
      var sign = orientIfSure(px, py, rx, ry, qx, qy) ||
          orientIfSure(rx, ry, qx, qy, px, py) ||
          orientIfSure(qx, qy, px, py, rx, ry);
      return sign < 0;

  */

  // a more robust orientation test that's stable in a given triangle (to fix robustness issues)
  #orient(rx, ry, qx, qy, px, py) {
    let sign = this.#orientIfSure(px, py, rx, ry, qx, qy) || this.#orientIfSure(rx, ry, qx, qy, px, py) || this.#orientIfSure(qx, qy, px, py, rx, ry);
    return sign < 0;
  }

  #inCircle(ax, ay, bx, by, cx, cy, px, py) {
    let dx = ax - px;
    let dy = ay - py;
    let ex = bx - px;
    let ey = by - py;
    let fx = cx - px;
    let fy = cy - py;

    let ap = dx * dx + dy * dy;
    let bp = ex * ex + ey * ey;
    let cp = fx * fx + fy * fy;

    return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
  }

  #circumradius(ax, ay, bx, by, cx, cy) {
    let dx = bx - ax;
    let dy = by - ay;
    let ex = cx - ax;
    let ey = cy - ay;

    let bl = dx * dx + dy * dy;
    let cl = ex * ex + ey * ey;
    let d = 0.5 / (dx * ey - dy * ex);

    let x = (ey * bl - dy * cl) * d;
    let y = (dx * cl - ex * bl) * d;

    return x * x + y * y;
  }

  #circumcenter(ax, ay, bx, by, cx, cy) {
    let dx = bx - ax;
    let dy = by - ay;
    let ex = cx - ax;
    let ey = cy - ay;

    let bl = dx * dx + dy * dy;
    let cl = ex * ex + ey * ey;
    let d = 0.5 / (dx * ey - dy * ex);

    let x = ax + (ey * bl - dy * cl) * d;
    let y = ay + (dx * cl - ex * bl) * d;

    return {x: x, y: y};
  }

  #quicksort(ids, dists, left, right) {
    if (right - left <= 20) {
      for (let i = left + 1; i <= right; i++) {
        let temp = ids[i];
        let tempDist = dists[temp];
        let j = i - 1;
        while (j >= left && dists[ids[j]] > tempDist) {
          ids[j + 1] = ids[j--];
        }
        ids[j + 1] = temp;
      }
    } else {
      let median = (left + right) >> 1;
      let i$1 = left + 1;
      let j$1 = right;
      [ids[median], ids[i$1]] = [ids[i$1], ids[median]];
      if (dists[ids[left]] > dists[ids[right]]) {
        [ids[left], ids[right]] = [ids[right], ids[left]];
      }
      if (dists[ids[i$1]] > dists[ids[right]]) {
        [ids[i$1], ids[right]] = [ids[right], ids[i$1]];
      }
      if (dists[ids[left]] > dists[ids[i$1]]) {
        [ids[i$1], ids[left]] = [ids[left], ids[i$1]];
      }

      let temp$1 = ids[i$1];
      let tempDist$1 = dists[temp$1];
      while (true) {
        do {
          i$1++;
        } while (dists[ids[i$1]] < tempDist$1);
        do {
          j$1--;
        } while (dists[ids[j$1]] > tempDist$1);
        if (j$1 < i$1) {
          break;
        }
        [ids[i$1], ids[j$1]] = [ids[j$1], ids[i$1]]; // was a swap, can run now ?
      }
      ids[left + 1] = ids[j$1];
      ids[j$1] = temp$1;

      if (right - i$1 + 1 >= j$1 - left) {
        this.#quicksort(ids, dists, i$1, right);
        this.#quicksort(ids, dists, left, j$1 - 1);
      } else {
        this.#quicksort(ids, dists, left, j$1 - 1);
        this.#quicksort(ids, dists, i$1, right);
      }
    }
  }

  #defaultGetX(p) {
    // if (!this.key) {
    return p[0];
    // } else {
    //     return this.decodeOne(p, this.key)[0];
    // }
  }

  #defaultGetY(p) {
    // if (!this.key) {
    return p[1];
    // } else {
    //     return this.decodeOne(p, this.key)[1];
    // }
  }

  // Cantidad de triángulos
  totalTriangulos() {
    return this.triangulos.length;
  }

  // Actualizar todos los puntos desde una nueva fuente.
  actualizarPuntos(points) {
    this.#from(points);
  }

  // Devuelve un triángulo en específico...
  triangulo(i) {
    return {
      p0: [this.triangulos[i][0], this.triangulos[i][1]],
      p1: [this.triangulos[i + 1][0], this.triangulos[i + 1][1]],
      p2: [this.triangulos[i + 2][0], this.triangulos[i + 2][1]],
    };
  }

  // Utiles
  nextHalfedge(e) {
    return (e % 3 === 2) ? e - 2 : e + 1;
  }

  prevHalfedge(e) {
    return (e % 3 === 0) ? e + 2 : e - 1;
  }

  edgesAroundPoint(start) {
    const result = [];
    let incoming = start;
    do {
      result.push(incoming);
      const outgoing = this.nextHalfedge(incoming);
      incoming = this.halfedges[outgoing];
    } while (incoming !== -1 && incoming !== start);
    return result;
  }

  forEachTriangleEdge(points, callback) {
    for (let e = 0; e < this.triangles.length; e++) {
      if (e > this.halfedges[e]) {
        const p = points[this.triangles[e]];
        const q = points[this.triangles[this.nextHalfedge(e)]];
        callback(e, p, q);
      }
    }
  }

  edgesOfTriangle(t) {
    return [3 * t, 3 * t + 1, 3 * t + 2];
  }

  pointsOfTriangle(t) {
    return this.edgesOfTriangle(t)
      .map(e => this.triangles[e]);
  }

  forEachTriangle(points, callback) {
    for (let t = 0; t < this.triangles.length / 3; t++) {
      callback(t, this.pointsOfTriangle(this, t).map(p => points[p]));
    }
  }

  triangleOfEdge(e) {
    return Math.floor(e / 3);
  }

  trianglesAdjacentToTriangle(t) {
    const adjacentTriangles = [];
    for (const e of this.edgesOfTriangle(t)) {
      const opposite = this.halfedges[e];
      if (opposite >= 0) {
        adjacentTriangles.push(this.triangleOfEdge(opposite));
      }
    }
    return adjacentTriangles;
  }

  circumcenter(a, b, c) {
    const ad = a[0] * a[0] + a[1] * a[1];
    const bd = b[0] * b[0] + b[1] * b[1];
    const cd = c[0] * c[0] + c[1] * c[1];
    const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    return [1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])), 1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0]))];
  }

  triangleCenter(points, t) {
    const vertices = this.pointsOfTriangle(this, t).map(p => points[p]);
    return this.circumcenter(vertices[0], vertices[1], vertices[2]);
  }



}
