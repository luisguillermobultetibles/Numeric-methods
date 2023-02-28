    class Grafo {
        constructor(nodos, arcos = []) {
            this.nodos = nodos ? nodos : [];
            this.arcos = arcos;
        }

        // básico

        // Si fuese un polígono , coincide con el número de vértices
        get vertices() {
            return this.nodes.length
        }

        // Número de vértices
        set vertices(l) {
            this.nodes.length = l;
            this.#integridad();
        }

        // Si fuese un polígono , coincide con el número de aristas
        get arcos() {
            return this.arcos.length
        }

        set arcos(l) {
            this.arcos.length = l;
            this.#integridad();
        }

        get Ҳ() {
            let c = () => {
                let n = () => {
                    return 1 / ((1 / this.arcos) + (1 / 6));
                }
                return 2 * this.arcos / this.n;
            }
            return this.vertices - this.arcos + c();
        }

        get genus() {
            let anomalía = () => { // ¿Será = curvatura ó = 1 - curvatura? Si es así... suprimir el método.
                let r = () => {
                    let aristasIncidentes = 0;
                    this.nodes.forEach((node) => {
                        aristasIncidentes += this.valencia(node);
                    })
                    return aristasIncidentes / this.vertices;
                }
                return (r() * this.vertices) / (2 * this.arcos); // or inverse?
            }
            return anomalía() * (this.Ҳ - 2) / -2;
        }
        
        dimension() {
            // Para los cálculos, se utiliza el radio unitario
            // Se infiere del la fórmula del volumen V(n) = 1 = Math.(π, n/2) / Γ(1 + n/2)
        }

        curvatura() {
            // Puede obtenerse de V = [ 2*Math.pow(Math.sqrt(π), n) / Γ(n/2) ] * [ Math.pow(n, Ω -1) ]
            // Donde n -> es la dimensión 
            // y Ω, la curvatura entre 0 y 1; 0 es una superficie de una bola n + 1 dimensional, 1: una n-bola.
        }

        existeNodo(n) {
            return this.nodos.some((node) => node === n);
        }

        crearNodo(n) {
            if (!this.existeNodo(n)) {
                this.nodes.push(n);
                this.#integridad();
            }
        }

        destruirNodo(n) {
            if (this.existeNodo(n)) {
                this.nodes = this.nodes.filter((node) => node !== n);
                this.#integridad();
            }
        }

        estanConectados(a, b) {
            return this.arcos.some((arc) => (arc.origen === a && arc.destino === b) || ((arc.destino === b && arc.origen === a)));
        }

        existeArco(a, b) {
            return this.arcos.some((arc) => (arc.origen === a && arc.destino === b));
        }

        crearArco(a, b) {
            if (!this.existeArco(a, b)) {
                this.arcos.push({origen: a, destino: b});
                this.#integridad();
            }
        }

        destruirArco(a, b) {
            if (this.existeArco(a, b)) {
                this.arcos = this.arcos.filter((arc) => !(arc.origen === a && arc.destino === b));
                this.#integridad();
            }
        }

        desconectar(a, b) {
            if (this.estanConectados(a, b)) {
                this.destruirArco(a, b);
                this.destruirArco(b, a);
            }
        }

        // medio
        arcosEntrantes(a) {
            return this.arcos.filter((arc) => arc.destino === a);
        }

        arcosSalientes(a) {
            return this.arcos.filter((arc) => arc.origen === a);
        }

        nodosEntrantes(a) {
            return this.arcosEntrantes(a).map((arc) => arc.origen).filter((arc, Index, arr) => arr.indexOf(arc) === Index);
            ;
        }

        nodosSalientes(a) {
            return this.arcosSalientes(a).map((arc) => arc.destino).filter((arc, Index, arr) => arr.indexOf(arc) === Index);
            ;
        }

        valencia(a) {
            return this.nodosEntrantes(a).concat(this.this.nodosSalientes(a)).filter((nodo, Index, arr) => arr.indexOf(nodo) === Index);
        }

        // absurdo
        #integridad() {
            this.nodos = this.nodos.filter((nodo) => this.arcos.some((arc) => arc.origen === nodo || arc.destino === nodo));
            this.arcos.forEach((arc) => {
                let origen = this.nodos.indexOf(arc.origen);
                if (origen === -1) this.nodos.push(arc.origen)
                let destino = this.nodos.indexOf(arc.destino);
                if (destino === -1) this.nodos.push(arc.destino)
            });
        }

        ordenamientoTopologico(tasks) {
            function topologicalSort(tasks) {
                function depVis(task1, task2) {
                    if (!task1 || !task2 || task1.name > task2.name) return -1;
                    if (tasks.some((element) => element.name === task1.name && element.dependencies.indexOf(task2.name) !== -1)) return 1;
                    else return task1.dependencies.some((element) => {
                        let it = tasks.find((el) => element === el.name);
                        return depVis(task1, it) === 1 && depVis(it, task2) === 1;
                    }) ? 1 : -1;
                }

                return tasks.sort((a, b) => a.name < b.name ? 1 : -1).sort((task1, task2) => -depVis(task1, task2)).reverse();
            }

            return this.nodes.map((node) => {
                return {name = node, dependencies: this.arcosEntrantes(node)}
            });
        }

    }
