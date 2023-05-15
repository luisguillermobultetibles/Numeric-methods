import {WebSystemObject} from './WebSystemObject.js';

export class Graph extends WebSystemObject {
  constructor(nodos = [], arcos = []) {
    super();
    if (!Array.isArray(nodos)) {
      throw new TypeError('nodos debe ser un arreglo');
    }
    if (!Array.isArray(arcos) || !arcos.every((arc) => typeof arc.origen !== 'undefined' && typeof arc.destino !== 'undefined')) {
      throw new TypeError('arcos debe ser un arreglo de objetos con las propiedades \'origen\' y \'destino\' definidas en términos de nodos.');
    }
    this._nodos = [...nodos];
    this._arcos = [...arcos];
  }


  // básico

  // Si fuese un polígono , coincide con el número de vértices
  get nodos() {
    return this._nodos;
  }

  // Número de vértices
  set nodos(l) {
    this._nodos.length = l;
    this.#integridad();
  }

  // Si fuese un polígono , coincide con el número de aristas
  get arcos() {
    return this._arcos.length;
  }

  set arcos(l) {
    this._arcos.length = l;
    this.#integridad();
  }

  get Ҳ() {
    let c = () => {
      let n = () => {
        return 1 / ((1 / this.arcos) + (1 / 6));
      };
      return 2 * this.arcos / n();
    };
    return this.nodos - this.arcos + c();
  }

  get genus() {
    let anomalía = () => { // ¿Será = curvatura ó = 1 - curvatura? Si es así... suprimir el método.
      let r = () => {
        let aristasIncidentes = 0;
        this.nodos.forEach((node) => {
          aristasIncidentes += this.valency(node);
        });
        return aristasIncidentes / this.nodos;
      };
      return (r() * this.nodos) / (2 * this.arcos); // or inverse?
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
      this.nodos.push(n);
      this.#integridad();
    }
  }

  destroyNode(n) {
    if (this.existNode(n)) {
      this.nodos = this.nodos.filter((node) => node !== n);
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
    return this.verticesPrecedentes(a).concat(this.verticesConsecuentes(a)).filter((nodo, Index, arr) => arr.indexOf(nodo) === Index);
  }

  // absurdo
  #integridad() {
    this._nodos = this._nodos.filter((nodo) => this._arcos.some((arc) => arc.origen === nodo || arc.destino === nodo));
    this._arcos.forEach((arc) => {
      let origen = this._nodos.indexOf(arc.origen);
      if (origen === -1) this._nodos.push(arc.origen);
      let destino = this._nodos.indexOf(arc.destino);
      if (destino === -1) this._nodos.push(arc.destino);
    });
  }

  // Encontrar el isomorfismo entre dos grafos, si lo hay sino devuelve falso.
  // Una correspondencia en la que a cada arco de g1, le hace corresponder un arco de g2.
  static isomorfismo(g1, g2) {
    let permutaciones = (arr) => {
      if (arr.length === 0) {
        return [[]];
      }
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        let rest = arr.slice(0, i).concat(arr.slice(i + 1));
        let restPerms = permutaciones(rest);
        for (let j = 0; j < restPerms.length; j++) {
          let perm = [arr[i]].concat(restPerms[j]);
          result.push(perm);
        }
      }
      return result;
    };

    // Verificamos si los grafos tienen la misma cantidad de nodos y arcos
    if (g1.nodos.length !== g2.nodos.length || g1.arcos !== g2.arcos) {
      return false;
    }

    // Creamos todas las posibles asignaciones de nodos
    const asignaciones = permutaciones(g2.nodos);

    // Probamos cada asignación
    for (let i = 0; i < asignaciones.length; i++) {
      const asignacion = asignaciones[i];
      let mapeo = {};
      let isomorfismo = true;

      // Verificamos si la asignación preserva las conexiones de los arcos
      for (let j = 0; j < g1.arcos.length; j++) {
        const arco1 = g1.arcos[j];
        const nodo1a = arco1.origen;
        const nodo1b = arco1.destino;

        const nodo2a = asignacion[g1.nodos.indexOf(nodo1a)];
        const nodo2b = asignacion[g1.nodos.indexOf(nodo1b)];

        const arco2existe = g2.arcos.some((arco) => (arco.origen === nodo2a &&
          arco.destino === nodo2b) || (arco.origen === nodo2b && arco.destino === nodo2a));
        if (!arco2existe) {
          isomorfismo = false;
          break;
        }
        mapeo[nodo1a] = nodo2a;
        mapeo[nodo1b] = nodo2b;
      }

      if (isomorfismo) {
        // Si encontramos una asignación que funciona, devolvemos verdadero
        return mapeo;
      }
    }

    // Si no encontramos ninguna asignación que funcione, devolvemos falso
    return false;

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

    return this.nodos.map((node) => {
      return {name: node, dependencies: this.verticesConsecuentes(node)};
    });
  }

  prim() {
    const visited = new Set(); // nodos visitados
    const tree = new Graph([], []); // árbol de recubrimiento mínimo
    const distances = {}; // distancias de los nodos al árbol
    const parents = {}; // nodos padres en el árbol

    // Inicializar distancias a infinito y padres a null
    for (const node of this.nodos) {
      distances[node] = Infinity;
      parents[node] = null;
    }

    // Comenzar desde un nodo arbitrario
    const initialNode = this.nodos[0];
    distances[initialNode] = 0;

    while (visited.size < this.nodos.length) {
      // Encontrar el nodo más cercano al árbol
      const currentNode = Object.keys(distances).reduce((a, b) => distances[a] < distances[b] ? a : b);
      visited.add(currentNode);

      // Agregar nodo y arco al árbol
      if (parents[currentNode] !== null) {
        tree.createArc(currentNode, parents[currentNode]);
      }

      // Actualizar distancias y padres
      for (const arc of this._arcos) {
        const neighbor = arc.origen === currentNode ? arc.destino : arc.origen;
        if (!visited.has(neighbor) && arc.peso < distances[neighbor]) {
          distances[neighbor] = arc.peso;
          parents[neighbor] = currentNode;
        }
      }
    }

    return tree;
  }

  kruskal() {
    // Ordenar aristas por peso ascendente
    const sortedArcs = this._arcos.slice().sort((a, b) => a.peso - b.peso);

    // Inicializar componentes
    const components = {};
    for (const node of this.nodos) {
      components[node] = new Set([node]);
    }

    // Conjunto de aristas seleccionadas
    const selectedArcs = [];

    // Recorrer aristas en orden ascendente de peso
    for (const arc of sortedArcs) {
      const component1 = components[arc.origen];
      const component2 = components[arc.destino];
      if (component1 !== component2) {
        // Agregar arista al conjunto seleccionado
        selectedArcs.push(arc);

        // Fusionar componentes
        for (const node of component2) {
          components[node] = component1;
          component1.add(node);
        }
      }
    }

    return selectedArcs;
  }

  dijkstra(nodo1, nodo2) {
    // Inicializar distancias y nodos previos
    const distances = {};
    const prevNodes = {};
    for (const node of this.nodos) {
      distances[node] = node === nodo1 ? 0 : Infinity;
      prevNodes[node] = null;
    }

    // Conjunto de nodos sin visitar
    const unvisitedNodes = new Set(this.nodos);

    while (unvisitedNodes.size > 0) {
      // Encontrar el nodo sin visitar con la menor distancia
      const currentNode = Array.from(unvisitedNodes).reduce((a, b) => distances[a] < distances[b] ? a : b);
      unvisitedNodes.delete(currentNode);

      // Si llegamos al nodo objetivo, terminar
      if (currentNode === nodo2) {
        // Reconstruir la ruta mínima
        const path = [];
        let current = nodo2;
        while (prevNodes[current] !== null) {
          path.unshift(current);
          current = prevNodes[current];
        }
        path.unshift(current);

        return {ruta: path, distancia: distances[nodo2]};
      }

      // Actualizar distancias y nodos previos de los nodos vecinos
      for (const arc of this._arcos) {
        if (arc.origen === currentNode) {
          const neighbor = arc.destino;
          const tentativeDistance = distances[currentNode] + arc.peso;
          if (tentativeDistance < distances[neighbor]) {
            distances[neighbor] = tentativeDistance;
            prevNodes[neighbor] = currentNode;
          }
        } else if (arc.destino === currentNode) {
          const neighbor = arc.origen;
          const tentativeDistance = distances[currentNode] + arc.peso;
          if (tentativeDistance < distances[neighbor]) {
            distances[neighbor] = tentativeDistance;
            prevNodes[neighbor] = currentNode;
          }
        }
      }
    }

    // Si no se pudo llegar al nodo objetivo, devuelve null
    return null;
  }


  /*
      El algoritmo de Ford-Fulkerson es un algoritmo para encontrar el flujo máximo
      en una red de flujo. Aquí te dejo una posible implementación en JavaScript
      del algoritmo de Ford-Fulkerson en la clase Grafo, utilizando el algoritmo
      de Edmonds-Karp para encontrar caminos aumentantes:

      Este método toma como argumentos el nodo fuente y el nodo sumidero de la red
      de flujo, y devuelve el flujo máximo que se puede enviar desde la fuente al
      sumidero. En cada iteración del ciclo principal, se encuentra un camino
      aumentante utilizando el algoritmo de Edmonds-Karp, y se actualizan el
      flujo y las capacidades residuales de las aristas en el camino. El algoritmo
      termina cuando no hay más caminos aumentantes en la red de flujo.

      La función findPath utiliza el algoritmo de búsqueda en anchura (BFS) para encontrar
      un camino aumentante en la red de flujo, y devuelve el camino y el flujo máximo que
      se puede enviar por el camino. La función utiliza un objeto visited para llevar
      registro de los nodos visitados durante la búsqueda y una cola para encolar los
      nodos que se van visitando.

  */

  findPath(source, sink) {
    // Inicializar el camino y el flujo a cero
    const path = [];
    const visited = {[source]: true};
    const queue = [{node: source, flow: Infinity}];

    // Encontrar un camino aumentante usando BFS
    while (queue.length > 0) {
      const {node, flow} = queue.shift();
      path.push(node);
      if (node === sink) {
        // Se encontró un camino aumentante
        return {path, flow};
      }
      for (const arc of this.getArcs(node)) {
        const residual = arc.capacidadResidual;
        if (!visited[arc.destino] && residual > 0) {
          visited[arc.destino] = true;
          const newFlow = Math.min(flow, residual);
          queue.push({node: arc.destino, flow: newFlow});
        }
      }
    }

    // No se encontró un camino aumentante
    return {path: null, flow: 0};
  };

  getArcs(node) {
    const arcs = [];
    for (const arc of this.arcos) {
      if (arc.origen === node) {
        arcs.push(arc);
      }
    }
    return arcs;
  }

  findArc(node1, node2) {
    for (const arc of this.getArcs(node1)) {
      if (arc.destino === node2) {
        return arc;
      }
    }
    return null;
  }

  fordFulkerson(source, sink) {
    // Inicializar el flujo a cero
    let maxFlow = 0;


    // Mientras haya un camino aumentante
    while (true) {
      const {path, flow} = this.findPath(source, sink);
      if (!path) {
        // No hay camino aumentante, terminar
        break;
      }

      // Actualizar el flujo y las capacidades residuales
      maxFlow += flow;
      for (let i = 0; i < path.length - 1; i++) {
        const arc = this.findArc(path[i], path[i + 1]);
        arc.flujo += flow;
        arc.capacidadResidual -= flow;
        const reverseArc = this.findArc(path[i + 1], path[i]);
        reverseArc.capacidadResidual += flow;
      }
    }

    return maxFlow;
  }

  getFlujoMinimo(source, sink) {
    // Inicializar el flujo a cero
    let minFlow = Infinity;

    let myfindPath = (source, sink, condition) => {
      const visited = new Set([source]);
      const queue = [{node: source, path: [], flow: Infinity}];

      while (queue.length > 0) {
        const {node, path, flow} = queue.shift();

        if (node === sink) {
          return {path, flow};
        }

        for (const arc of this.getArcs(node)) {
          if (!visited.has(arc.destino) && condition(arc)) {
            visited.add(arc.destino);
            const newPath = [...path, arc.destino];
            const newFlow = Math.min(flow, arc.capacidadResidual);
            queue.push({node: arc.destino, path: newPath, flow: newFlow});
          }
        }
      }

      return {path: null, flow: 0};
    };

    // Encontrar el camino aumentante de capacidad mínima
    let {
      path,
      flow,
    } = myfindPath(source, sink, (arc) => arc.capacidadResidual > 0);
    while (path) {
      // Actualizar el flujo mínimo
      minFlow = Math.min(minFlow, flow);

      // Actualizar las capacidades residuales
      for (let i = 0; i < path.length - 1; i++) {
        const arc = this.findArc(path[i], path[i + 1]);
        arc.capacidadResidual -= minFlow;
        const reverseArc = this.findArc(path[i + 1], path[i]);
        reverseArc.capacidadResidual += minFlow;
      }

      // Encontrar el siguiente camino aumentante de capacidad mínima
      const {
        path: nextPath,
        flow: nextFlow,
      } = this.findPath(source, sink, (arc) => arc.capacidadResidual > 0);
      path = nextPath;
      flow = nextFlow;
    }

    return minFlow;
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


