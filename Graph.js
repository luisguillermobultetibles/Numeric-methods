import {WebSystemObject} from './WebSystemObject.js';

export class Graph extends WebSystemObject {
  constructor(nodos, arcos = []) {
    super();
    this.nodos = nodos ? nodos : [];
    this.arcos = arcos;
  }

  // básico

  // Si fuese un polígono , coincide con el número de vértices
  get vertices() {
    return this.nodes.length;
  }

  // Número de vértices
  set vertices(l) {
    this.nodes.length = l;
    this.#integridad();
  }

  // Si fuese un polígono , coincide con el número de aristas
  get arcos() {
    return this.arcos.length;
  }

  set arcos(l) {
    this.arcos.length = l;
    this.#integridad();
  }

  get Ҳ() {
    let c = () => {
      let n = () => {
        return 1 / ((1 / this.arcos) + (1 / 6));
      };
      return 2 * this.arcos / n();
    };
    return this.vertices - this.arcos + c();
  }

  get genus() {
    let anomalía = () => { // ¿Será = curvatura ó = 1 - curvatura? Si es así... suprimir el método.
      let r = () => {
        let aristasIncidentes = 0;
        this.nodes.forEach((node) => {
          aristasIncidentes += this.valency(node);
        });
        return aristasIncidentes / this.vertices;
      };
      return (r() * this.vertices) / (2 * this.arcos); // or inverse?
    };
    return anomalía() * (this.Ҳ - 2) / -2;
  }

  dimmension() {
    // Para los cálculos, se utiliza el radio unitario
    // Se infiere del la fórmula del volumen V(n) = this.vertices = Math.(π, n/2) / Γ(1 + n/2)
  }

  curvature() {
    // Puede obtenerse de V = this.vertices = [ 2*Math.pow(Math.sqrt(π), n) / Γ(n/2) ] * [ Math.pow(n, Ω -1) ]
    // Donde n -> es la dimensión
    // y Ω, la curvatura entre 0 y 1; 0 es una superficie de una bola n + 1 dimensional, 1: una n-bola.
  }

  existNode(n) {
    return this.nodos.some((node) => node === n);
  }

  createNode(n) {
    if (!this.existNode(n)) {
      this.nodes.push(n);
      this.#integridad();
    }
  }

  destroyNode(n) {
    if (this.existNode(n)) {
      this.nodes = this.nodes.filter((node) => node !== n);
      this.#integridad();
    }
  }

  areConnected(a, b) {
    return this.arcos.some((arc) => (arc.origen === a && arc.destino === b) || ((arc.destino === b && arc.origen === a)));
  }

  existsArc(a, b) {
    return this.arcos.some((arc) => (arc.origen === a && arc.destino === b));
  }

  createArc(a, b) {
    if (!this.existsArc(a, b)) {
      this.arcos.push({origen: a, destino: b});
      this.#integridad();
    }
  }

  desctroyArc(a, b) {
    if (this.existsArc(a, b)) {
      this.arcos = this.arcos.filter((arc) => !(arc.origen === a && arc.destino === b));
      this.#integridad();
    }
  }

  disconnect(a, b) {
    if (this.areConnected(a, b)) {
      this.desctroyArc(a, b);
      this.desctroyArc(b, a);
    }
  }

  // medio
  arcosEntrantes(a) {
    return this.arcos.filter((arc) => arc.destino === a);
  }

  arcosSalientes(a) {
    return this.arcos.filter((arc) => arc.origen === a);
  }

  nodosPrecedentes(a) {
    return this.arcosEntrantes(a).map((arc) => arc.origen).filter((arc, Index, arr) => arr.indexOf(arc) === Index);
  }

  nodosConsecuentes(a) {
    return this.arcosSalientes(a).map((arc) => arc.destino).filter((arc, Index, arr) => arr.indexOf(arc) === Index);
  }

  valency(a) {
    return this.nodosPrecedentes(a).concat(this.nodosConsecuentes(a)).filter((nodo, Index, arr) => arr.indexOf(nodo) === Index);
  }

  // absurdo
  #integridad() {
    this.nodos = this.nodos.filter((nodo) => this.arcos.some((arc) => arc.origen === nodo || arc.destino === nodo));
    this.arcos.forEach((arc) => {
      let origen = this.nodos.indexOf(arc.origen);
      if (origen === -1) this.nodos.push(arc.origen);
      let destino = this.nodos.indexOf(arc.destino);
      if (destino === -1) this.nodos.push(arc.destino);
    });
  }

  ordenamientoTopologico(tasks) {
    function topologicalSort(tasks) {
      function depVis(task1, task2) {
        if (!task1 || !task2 || task1.name > task2.name) return -1;
        if (tasks.some((element) => element.name === task1.name && element.dependencies.indexOf(task2.name) !== -1)) {
          return 1;
        } else {
          return task1.dependencies.some((element) => {
            let it = tasks.find((el) => element === el.name);
            return depVis(task1, it) === 1 && depVis(it, task2) === 1;
          }) ? 1 : -1;
        }
      }

      return tasks.sort((a, b) => a.name < b.name ? 1 : -1).sort((task1, task2) => -depVis(task1, task2)).reverse();
    }

    return this.nodes.map((node) => {
      return {name: node, dependencies: this.nodosConsecuentes(node)};
    });
  }
}


// Clase para representar un grafo con nudos y lazos, revisar
class KnotAndLoopGraph extends Graph {
  static Knot = class {
    constructor(id) {
      this.id = id;
      this.incidentLoops = [];
    }

    addIncidentLoop(loop) {
      this.incidentLoops.push(loop);
    }

    removeIncidentLoop(loop) {
      const index = this.incidentLoops.indexOf(loop);
      if (index !== -1) {
        this.incidentLoops.splice(index, 1);
      }
    }

    getIncidentLoops() {
      return this.incidentLoops;
    }

    determineKnotType(knot = this) {
      const numTurns = knot.incidentLoops.length;
      if (numTurns === 1) {
        return 'Lazo';
      } else if (numTurns === 2) {
        return 'Nudo simple';
      } else if (numTurns === 3) {
        return 'Trébol';
      } else if (numTurns === 4) {
        return 'Cuadrifolio';
      } else {
        return 'Nudo con más de 4 vueltas';
      }
    }

  };

  static  Loop = class {
    constructor(id, startNode, endNode) {
      this.id = id;
      this.startNode = startNode;
      this.endNode = endNode;
      startNode.addIncidentLoop(this);
      endNode.addIncidentLoop(this);
    }

    getStartNode() {
      return this.startNode;
    }

    getEndNode() {
      return this.endNode;
    }
  };

  constructor(nodos, arcos = [], loops = []) {
    super(nodos, arcos);
    this.knots = [];
    this.loops = loops;
  }

  addKnot(knot) {
    if (!this.existNode(knot)) {
      this.createNode(knot);
      this.knots.push(new KnotAndLoopGraph.Knot(knot));
    }
  }

  removeKnot(knot) {
    if (this.existNode(knot)) {
      const index = this.knots.findIndex(k => k.id === knot);
      const knotToRemove = this.knots[index];
      const incidentLoops = knotToRemove.getIncidentLoops();
      incidentLoops.forEach(loop => this.removeLoop(loop.id));
      super.destroyNode(knot);
      this.knots.splice(index, 1);
    }
  }

  addLoop(id, startNode, endNode) {
    if (this.existNode(startNode) && this.existNode(endNode)) {
      const loop = new KnotAndLoopGraph.Loop(id, startNode, endNode);
      this.loops.push(loop);
      super.createArc(startNode, endNode);
    }
  }

  removeLoop(id) {
    const index = this.loops.findIndex(loop => loop.id === id);
    if (index !== -1) {
      const loopToRemove = this.loops[index];
      const startNode = loopToRemove.getStartNode();
      const endNode = loopToRemove.getEndNode();
      startNode.removeIncidentLoop(loopToRemove);
      endNode.removeIncidentLoop(loopToRemove);
      super.desctroyArc(startNode.id, endNode.id);
      this.loops.splice(index, 1);
    }
  }
}


