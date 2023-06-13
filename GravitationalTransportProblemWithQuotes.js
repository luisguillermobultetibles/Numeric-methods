/**
 * Clase que representa un problema de transporte.
 * y la resuelve teniendo en cuenta la distancia gravitacional y el tamaño de cuotas compatibles.
 *
 * Copyright (C) Lic. Luis Guillermo Bultet Ibles 2023.
 * (All rights reserved, please notify if you pretend comercial use;
 *  no money for this, is free; just for responsibility delegation).
 *
 */
class GravitationalTransportProblemWithQuotes {
  /**
   * Construye una instancia del problema de transporte con los suministros,
   * consumos y costos especificados.
   * @param {number[]} supply - Los suministros disponibles.
   * @param {number[]} demand - Los consumos requeridos.
   * @param {number[][]} costs - Los costos de transportar una unidad desde
   *   cada suministro a cada consumo.
   */
  constructor(supply, demand, costs) {
    this.supply = supply;
    this.demand = demand;
    this.costs = costs;
    this.numSupply = supply.length;
    this.numDemand = demand.length;
  }

  /**
   * Resuelve el problema de transporte y devuelve la solución óptima.
   * @return {Object} - Un objeto con dos propiedades: 'x' es una matriz
   *   que indica la cantidad a transportar desde cada suministro a cada
   *   consumo, y 'totalCost' es el costo total de la solución óptima.
   */
  solve() {
    // Calcular el mínimo común múltiplo de los demandas
    const mcd = this.demand.reduce((a, b) => {
      const r = a % b;
      return r === 0 ? b : this.mcd(b, r);
    });

    // Calcular la ponderación de distancias para cada par de suministro-consumo
    const ponderacion = [];
    for (let i = 0; i < this.numSupply; i++) {
      ponderacion[i] = [];
      for (let j = 0; j < this.numDemand; j++) {
        if (this.supply[i] === this.demand[j]) {
          // Si el suministro y el consumo son iguales, establecer la distancia en 1
          ponderacion[i][j] = 1;
        } else {
          const distancia = this.costs[i][j] / Math.cosh(this.distancia(this.supply[i], this.demand[j]));
          const enrarecimiento = 1 - Math.sin(Math.PI * (this.supply[j] % mcd) / mcd); // revisar, creoq ue está bien, ayudara montar un demo en html.
          ponderacion[i][j] = distancia * enrarecimiento;
        }
      }
    }

    // Resolver el problema de transporte
    const x = [];
    for (let i = 0; i < this.numSupply; i++) {
      x[i] = [];
      for (let j = 0; j < this.numDemand; j++) {
        x[i][j] = 0;
      }
    }
    let totalCost = 0;
    while (true) {
      // Encontrar la celda óptima para asignar
      let maxPonderacion = 0;
      let maxI = -1;
      let maxJ = -1;
      for (let i = 0; i < this.numSupply; i++) {
        for (let j = 0; j < this.numDemand; j++) {
          if (this.supply[i] > 0 && this.demand[j] > 0 && ponderacion[i][j] > maxPonderacion) {
            maxPonderacion = ponderacion[i][j];
            maxI = i;
            maxJ = j;
          }
        }
      }
      if (maxI === -1) {
        // No quedan celdas por asignar
        break;
      }

      // Asignar la cantidad óptima en la celda
      const cantidad = Math.min(this.supply[maxI], this.demand[maxJ]);
      x[maxI][maxJ] = cantidad;
      this.supply[maxI] -= cantidad;
      this.demand[maxJ] -= cantidad;
      totalCost += cantidad * this.costs[maxI][maxJ];
    }

    return {x, totalCost};
  }

  /**
   * Devuelve las asignaciones de la solución óptima como un array de objetos
   * que indican la cantidad asignada, el suministro y el consumo correspondientes.
   * @return {Object[]} - Un array de objetos con tres propiedades: 'cantidad'
   *   indica la cantidad asignada, 'suministro' indica el índice del suministro
   *   correspondiente (empezando por 0) y 'consumo' indica el índice del consumo
   *   correspondiente (empezando por 0).
   */
  getAsignaciones() {
    const solution = this.solve();
    const asignaciones = [];
    for (let i = 0; i < this.numSupply; i++) {
      for (let j = 0; j < this.numDemand; j++) {
        if (solution.x[i][j] > 0) {
          asignaciones.push({
            cantidad: solution.x[i][j],
            suministro: i,
            consumo: j,
          });
        }
      }
    }
    return asignaciones;
  }

  /**
   * Calcula la distancia entre dos valores.
   * @param {number} a - El primer valor.
   * @param {number} b - El segundo valor.
   * @return {number} - La distancia entre los valores (la diferencia absoluta).
   */
  distancia(a, b) {
    return Math.abs(a - b);
  }

  /**
   * Calcula el máximo común divisor de dos números usando el algoritmo de Euclides.
   * @param {number} a - El primer número.
   * @param {number} b - El segundo número.
   * @return {number} - El máximo común divisor de los dos números.
   */
  mcd(a, b) {
    const r = a % b;
    return r === 0 ? b : this.mcd(b, r);
  }

  // just call me like this: GravitationalTransportProblemWithQuotes.unitaryTest();
  static unitaryTest() {
    const supply = [10, 20, 30];
    const demand = [15, 25, 20, 10];
    const costs = [
      [2, 4, 5, 3],
      [3, 1, 2, 6],
      [4, 3, 6, 2],
    ];

    const problem = new GravitationalTransportProblemWithQuotes(supply, demand, costs);
    const asignaciones = problem.getAsignaciones();

    console.log('Asignaciones:');
    asignaciones.forEach(({cantidad, suministro, consumo}) => {
      console.log(`  ${cantidad} desde suministro ${suministro} a consumo ${consumo}`);
    });
  }
}
