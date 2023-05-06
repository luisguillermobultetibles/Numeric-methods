class Inventario {
  constructor(materiaPrima) {
    this.materiaPrima = materiaPrima;
    this.cantidad = 0;
  }

  async llegada() {
    // lógica para simular la llegada de la materia prima al inventario
    this.cantidad += Math.floor(Math.random() * 100); // ejemplo aleatorio de incremento de la cantidad de materia prima
  }

  async uso(cantidad) {
    if (this.cantidad < cantidad) {
      throw new Error("No hay suficiente materia prima en el inventario");
    }
    // lógica para simular el uso de la materia prima del inventario
    this.cantidad -= cantidad;
  }
}

class Equipo {
  constructor(nombre, energiaPorUnidad, costePorHora) {
    this.nombre = nombre;
    this.energiaPorUnidad = energiaPorUnidad;
    this.costePorHora = costePorHora;
    this.encendido = false;
  }

  async puestaEnMarcha() {
    // lógica para simular la puesta en marcha del equipo
    this.encendido = true;
  }

  async apagado() {
    // lógica para simular el apagado del equipo
    this.encendido = false;
  }

  getCoste(tiempo) {
    // calcular el coste de uso del equipo durante el tiempo especificado
    return this.costePorHora * tiempo;
  }

  getConsumoEnergia(tiempo) {
    // calcular el consumo de energía del equipo durante el tiempo especificado
    return this.energiaPorUnidad * tiempo;
  }
}

class Proceso {
  constructor(nombre, costo, tiempo, recursos, tipo) {
    this.nombre = nombre;
    this.costo = costo;
    this.tiempo = tiempo;
    this.recursos = recursos;
    this.tipo = tipo; // tipo de proceso: productivo o defectuoso
    this.estado = "en espera";
    this.progress = 0;
    this.materiaPrima = null;
    this.equipo = null;
    this.consumoEnergia = 0;
    this.salarios = 0;
    this.roturas = 0;
  }

  setMateriaPrima(materiaPrima) {
    this.materiaPrima = materiaPrima;
  }

  setEquipo(equipo) {
    this.equipo = equipo;
  }

  async ejecutar() {
    if (this.materiaPrima && this.equipo) {
      this.estado = "en ejecución";
      // simular la llegada de la materia prima desde el inventario
      await this.materiaPrima.uso(this.recursos.materiaPrima);
      // simular la orden de puesta en marcha del equipo o línea de producción
      await this.equipo.puestaEnMarcha();
      // simular la ejecución del proceso y actualizar su progreso
      this.progress = Math.random();
      this.estado = "completado";
      // actualizar los costes asociados al proceso
      this.consumoEnergia = this.equipo.getConsumoEnergia(this.tiempo);
      this.salarios = this.recursos.trabajadores * this.tiempo * this.recursos.salario;
      this.roturas = Math.floor(Math.random() * 10); // ejemplo aleatorio de roturas
    } else {
      throw new Error("Falta materia prima o equipo para ejecutar el proceso");
    }
  }

  getEstado() {
    return this.estado;
  }

  getProgreso() {
    return this.progress;
  }

  getProduccion() {
    // calcular la producción en función del tipo de proceso
    if (this.tipo === "productivo") {
      return Math.floor(this.recursos.productividad * this.tiempo);
    } else if (this.tipo === "defectuoso") {
      return Math.floor(this.recursos.productividad * this.tiempo * (1 - this.recursos.calidad / 100));
    }
  }

  getProduccionDefectuosa() {
    // calcular la producción defectuosa en función del tipo de proceso
    if (this.tipo === "productivo") {
      return 0;
    } else if (this.tipo === "defectuoso") {
      return Math.floor(this.recursos.productividad * this.tiempo * this.recursos.calidad / 100);
    }
  }

  getCosteTotal() {
    // calcular el coste total del proceso
    return this.costo + this.equipo.getCoste(this.tiempo) + this.consumoEnergia + this.salarios + this.roturas;
  }
}

class CentroCosto {
  constructor(nombre) {
    this.nombre = nombre;
    this.procesos = [];
    this.inventario = null;
    this.equipo = null;
    this.gastosIndirectos = 0;
    this.tasaDepreciacion = 0;
  }

  setInventario(inventario) {
    this.inventario = inventario;
  }

  setEquipo(equipo) {
    this.equipo = equipo;
  }

  async ejecutarProceso(proceso) {
    if (!this.inventario) {
      throw new Error("No se ha asignado un inventario al centro de costos");
    }
    if (!this.equipo) {
      throw new Error("No se ha asignado un equipo al centro de costos");
    }
    proceso.setMateriaPrima(this.inventario);
    proceso.setEquipo(this.equipo);
    await proceso.ejecutar();
  }

  agregarProceso(proceso) {
    this.procesos.push(proceso);
  }

  getProduccionTotal() {
    // calcular la producción total de todos los procesos del centro de costos
    return this.procesos.reduce((total, proceso) => total + proceso.getProduccion(), 0);
  }

  getProduccionDefectuosaTotal() {
    // calcular la producción defectuosa total de todos los procesos del centro de costos
    return this.procesos.reduce((total, proceso) => total + proceso.getProduccionDefectuosa(), 0);
  }

  getCosteTotal() {
    // calcular el coste total de todos los procesos del centro de costos
    return this.procesos.reduce((total, proceso) => total + proceso.getCosteTotal(), 0) + this.gastosIndirectos;
  }

  getDepreciacion() {
    // calcular la depreciación del equipo del centro de costos
    return this.equipo.costePorHora * this.tasaDepreciacion;
  }

  getCosteUnitario() {
    // calcular el coste unitario de producción del centro de costos
    const produccionTotal = this.getProduccionTotal();
    if (produccionTotal === 0) {
      return 0;
    }
    return this.getCosteTotal() / produccionTotal;
  }
}

class Costos {
  constructor(nombre) {
    this.nombre = nombre;
    this.centrosCostos = [];
  }

  agregarCentroCosto(centroCosto) {
    this.centrosCostos.push(centroCosto);
  }

  async ejecutarProcesos() {
    // ejecutar todos los procesos de todos los centros de costos
    await Promise.all(this.centrosCostos.map(centroCosto => centroCosto.procesos.map(proceso => centroCosto.ejecutarProceso(proceso))));
  }

  getProduccionTotal() {
    // calcular la producción total de todos los centros de costos
    return this.centrosCostos.reduce((total, centroCosto) => total + centroCosto.getProduccionTotal(), 0);
  }

  getProduccionDefectuosaTotal() {
    // calcular la producción defectuosa total de todos los centros de costos
    return this.centrosCostos.reduce((total, centroCosto) => total + centroCosto.getProduccionDefectuosaTotal(), 0);
  }

  getCosteTotal() {
    // calcular el coste total de todos los centros de costos
    return this.centrosCostos.reduce((total, centroCosto) => total + centroCosto.getCosteTotal(), 0);
  }

  getDepreciacionTotal() {
    // calcular la depreciación total de todos los equipos de todos los centros de costos
    return this.centrosCostos.reduce((total, centroCosto) => total + centroCosto.getDepreciacion(), 0);
  }

  getCosteUnitario() {
    // calcular el coste unitario de producción de toda la fábrica
    const produccionTotal = this.getProduccionTotal();
    if (produccionTotal === 0) {
      return 0;
    }
    return this.getCosteTotal() / produccionTotal;
  }
}

class FichaCosto {
  /* Copyright Luis Guillermo Bultet Ibles using Sage/ChatGPT Character, following recommends:
     Empresa Provincial de Farmacias y Ópticas de Guantánamo. (2012).
     Fichas de costos. Recuperado de https://www.eumed.net/cursecon/ecolat/cu/2012a/empresa-provincial-farmacias-opticas-guantanamo.pdf
  */
  constructor(nombreProducto, costoUnitario, cantidadProduccion, porcentajeGastoIndirecto) {
    this.nombreProducto = nombreProducto;
    this.costoUnitario = costoUnitario;
    this.cantidadProduccion = cantidadProduccion;
    this.porcentajeGastoIndirecto = porcentajeGastoIndirecto;
  }

  // Calcula el costo de producción total
  get costoProduccionTotal() {
    return this.costoUnitario * this.cantidadProduccion;
  }

  // Calcula el gasto indirecto
  get gastoIndirecto() {
    return this.costoProduccionTotal * (this.porcentajeGastoIndirecto / 100);
  }

  // Calcula el costo de producción unitario
  get costoProduccionUnitario() {
    return this.costoUnitario + (this.gastoIndirecto / this.cantidadProduccion);
  }

  // Calcula el precio de venta sugerido
  get precioVentaSugerido() {
    const precioVenta = this.costoProduccionUnitario * 2; // Se utiliza un factor de 2 para obtener una ganancia del 100%
    return Math.round(precioVenta * 100) / 100; // Se redondea a dos decimales
  }
  unitaryTest() {
    const fichaCosto = new FichaCosto('Producto A', 10, 1000, 20);
    console.log(fichaCosto.costoProduccionTotal); // 10000
    console.log(fichaCosto.gastoIndirecto); // 2000
    console.log(fichaCosto.costoProduccionUnitario); // 12
    console.log(fichaCosto.precioVentaSugerido); // 24
  }
}
