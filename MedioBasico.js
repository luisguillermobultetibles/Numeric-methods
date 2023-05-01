
// Clase para agrupar los medios básicos por grupos según el codificador nacional
class GrupoMediosBasicos {
  constructor(nombreGrupo) {
    this.nombreGrupo = nombreGrupo;
    this.mediosBasicos = [];
  }

  // Método para agregar un medio básico al grupo
  agregarMedioBasico(medioBasico) {
    this.mediosBasicos.push(medioBasico);
  }

  // Método para calcular la depreciación acumulada de todos los medios básicos del grupo en un año determinado
  depreciacionAcumulada(anio) {
    let depreciacionAcumuladaGrupo = 0;
    for (let i = 0; i < this.mediosBasicos.length; i++) {
      depreciacionAcumuladaGrupo += this.mediosBasicos[i].depreciacionAcumulada(anio);
    }
    return depreciacionAcumuladaGrupo;
  }

  // Método para calcular el valor en libros de todos los medios básicos del grupo en un año determinado
  valorEnLibros(anio) {
    let valorEnLibrosGrupo = 0;
    for (let i = 0; i < this.mediosBasicos.length; i++) {
      valorEnLibrosGrupo += this.mediosBasicos[i].valorEnLibros(anio);
    }
    return valorEnLibrosGrupo;
  }
}

class MedioBasico {
  constructor(nombre, descripcion, valor, fechaCompra, vidaUtil, codigo) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valor = valor;
    this.fechaCompra = fechaCompra;
    this.vidaUtil = vidaUtil;
    this.codigo = codigo;
    this.fechaUltimaAmortizacion = null;
    this.estado = 'Activo';
    this.historial = [];
    this.valorInicial = valor;
    this.cuentaActivo = 'Activo Fijo';
    this.cuentaDepreciacion = 'Depreciación Acumulada';

    this.grupo = grupo; // Grupo al que pertenece el medio básico según el codificador nacional
    this.valorInicial = valorInicial; // Valor inicial del medio básico
    this.aniosVidaUtil = aniosVidaUtil; // Años de vida útil del medio básico

    this.gastosMantenimiento = 0;
  }

  comprar(fechaCompra, valor, cuenta) {
    this.valor = valor;
    this.fechaCompra = fechaCompra;
    this.estado = 'Activo';
    this.historial.push({
      fecha: fechaCompra,
      evento: 'Compra',
      valor: valor,
      descripcion: 'Compra del activo fijo tangible',
      cuenta: cuenta,
    });
  }

  transferir(fechaTransferencia, nuevoCodigo, cuenta) {
    this.codigo = nuevoCodigo;
    this.historial.push({
      fecha: fechaTransferencia,
      evento: 'Transferencia',
      valor: 0,
      descripcion: `Transferencia del activo fijo tangible al código ${nuevoCodigo}`,
      cuenta: cuenta,
    });
  }

  mover(fechaMovimiento, nuevaDescripcion, cuenta) {
    this.descripcion = nuevaDescripcion;
    this.historial.push({
      fecha: fechaMovimiento,
      evento: 'Movimiento interno',
      valor: 0,
      descripcion: 'Movimiento interno del activo fijo tangible',
      cuenta: cuenta,
    });
  }


  // Método para calcular el valor en libros de un medio básico en un año determinado
  valorEnLibros(anio) {
    let depreciacionAcumulada = this.depreciacionAcumulada(anio);
    let valorEnLibros = this.valorInicial - depreciacionAcumulada;
    return valorEnLibros;
  }

  amortizar(fechaAmortizacion, metodoDepreciacion, cuenta) {
    if (this.fechaUltimaAmortizacion === null) {
      this.fechaUltimaAmortizacion = this.fechaCompra;
    }
    let montoAmortizacion = 0;
    let descripcion = '';
    switch (metodoDepreciacion) {
      case 'Linea Recta':
        montoAmortizacion = (this.valor - this.valorResidual) / this.vidaUtil;
        descripcion = 'Amortización del activo fijo tangible por método de línea recta';
        break;
      case 'Suma de los Dígitos de Años':
        const sumaDigitos = (this.vidaUtil * (this.vidaUtil + 1)) / 2;
        const añosTranscurridos = ((fechaAmortizacion - this.fechaCompra) / (365 * 24 * 60 * 60 * 1000));
        montoAmortizacion = (this.valor - this.valorResidual) * ((this.vidaUtil - añosTranscurridos + 1) / sumaDigitos);
        descripcion = 'Amortización del activo fijo tangible por método de suma de los dígitos de años';
        break;
      case 'Unidades de Producción':
        const unidadesProducidas = 1000; // Supongamos que el activo tiene una vida útil de 10,000 unidades producidas
        montoAmortizacion = (this.valor - this.valorResidual) * (unidadesProducidas / this.vidaUtil);
        descripcion = 'Amortización del activo fijo tangible por método de unidades de producción';
        break;
      case 'Porcentaje Fijo sobre Saldo':
        const porcentaje = 20; // Supongamos que el porcentaje de depreciación es del 20%
        montoAmortizacion = (this.valor - this.valorResidual) * (porcentaje / 100);
        descripcion = 'Amortización del activo fijo tangible por método de porcentaje fijo sobre saldo';
        break;
      default:
        throw new Error(`El método de depreciación ${metodoDepreciacion} no es válido.`);
    }
    this.valor = this.valor - montoAmortizacion;
    this.fechaUltimaAmortizacion = fechaAmortizacion;
    this.historial.push({
      fecha: fechaAmortizacion,
      evento: 'Amortización',
      valor: montoAmortizacion,
      descripcion: descripcion,
      cuenta: cuenta,
    });
  }

  vender(fechaVenta, valorVenta, cuenta) {
    this.estado = 'Vendido';
    this.valor = valorVenta;
    this.historial.push({
      fecha: fechaVenta,
      evento: 'Venta',
      valor: valorVenta,
      descripcion: 'Venta del activo fijo tangible',
      cuenta: cuenta,
    });
  }

  get valorResidual() {
    // Supongamos que el valor residual es del 10% del valor inicial
    return this.valorInicial * 0.1;
  }

  reparar(fechaReparacion, descripcion, cuenta) {
    this.historial.push({
      fecha: fechaReparacion,
      evento: 'Reparación',
      valor: 0,
      descripcion: descripcion,
      cuenta: cuenta,
    });
  }

  sustituir(fechaSustitucion, descripcion, nuevoCodigo, cuenta) {
    this.codigo = nuevoCodigo;
    this.descripcion = descripcion;
    this.historial.push({
      fecha: fechaSustitucion,
      evento: 'Sustitución',
      valor: 0,
      descripcion: 'Sustitución del activo fijo tangible',
      cuenta: cuenta,
    });
  }

  darDeBajaPorDepreciacion(fechaBaja, cuenta) { // // incluir cuenta
    this.estado = 'De baja por depreciación';
    this.historial.push({
      fecha: fechaBaja,
      evento: 'Baja por depreciación',
      valor: 0,
      descripcion: 'Baja del activo fijo tangible por depreciación',
      cuenta: cuenta,
    });
  }

  darDeBajaPorPerdida(fechaBaja, descripcion, cuenta) {
    this.estado = 'De baja por pérdida';
    this.historial.push({
      fecha: fechaBaja,
      evento: 'Baja por pérdida',
      valor: 0,
      descripcion: descripcion,
      cuenta: cuenta,
    });
  }

  registrarDeterioro(fechaDeterioro, descripcion, cuenta) {
    this.historial.push({
      fecha: fechaDeterioro,
      evento: 'Deterioro',
      valor: 0,
      descripcion: descripcion,
      cuenta: cuenta,
    });
  }

  // Hacer coherente con lo de arriba
  calcularDepreciacionAcumulada(fecha) {
    if (this.fechaUltimaAmortizacion === null) {
      return 0;
    }
    const tiempoTranscurrido = (fecha - this.fechaUltimaAmortizacion) / (365 * 24 * 60 * 60 * 1000);
    switch (this.metodoDepreciacion) {
      case 'Linea Recta':
        return ((this.valorInicial - this.valorResidual) / this.vidaUtil) * (tiempoTranscurrido / 12);
      case 'Suma de los Dígitos de Años':
        const sumaDigitos = (this.vidaUtil * (this.vidaUtil + 1)) / 2;
        const añosTranscurridos = ((fecha - this.fechaCompra) / (365 * 24 * 60 * 60 * 1000)) / 12;
        const montoTotalAmortizacion = (this.valorInicial - this.valorResidual);
        const montoAmortizado = montoTotalAmortizacion * ((sumaDigitos - añosTranscurridos + 1) / sumaDigitos);
        return montoTotalAmortizacion - montoAmortizado;
      case 'Unidades de Producción':
        const unidadesProducidas = this.unidadesProduccion * tiempoTranscurrido;
        return (this.valorInicial - this.valorResidual) * (unidadesProducidas / this.unidadesProduccion);
      default:
        throw new Error("Método de depreciación no válido");
    }
  }

// Método para calcular la depreciación acumulada de un medio básico en un año determinado
  depreciacionAcumulada(anio) {
    let aniosTranscurridos = anio - 1;
    let valorDepreciado = this.valorInicial / this.aniosVidaUtil;
    let depreciacionAcumulada = valorDepreciado * aniosTranscurridos;
    return depreciacionAcumulada;
  }

  // Método para registrar gastos de mantenimiento del medio básico
  registrarGastosMantenimiento(gastos) {
    this.gastosMantenimiento += gastos;
  }

  // Método para calcular el costo total de un medio básico, incluyendo el valor inicial y los gastos de mantenimiento registrados
  costoTotal() {
    let costoTotal = this.valorInicial + this.gastosMantenimiento;
    return costoTotal;
  }

  // Método para obtener la clasificación contable del medio básico según su tipo
  clasificacionContable() {
    let clasificacion = "";
    switch (this.tipoMedio) {
      case "Edificios y construcciones":
        clasificacion = "Activo inmovilizado";
        break;
      case "Maquinarias y equipos":
        clasificacion = "Activo fijo";
        break;
      case "Vehículos":
        clasificacion = "Activo fijo";
        break;
      case "Herramientas y utensilios":
        clasificacion = "Activo fijo";
        break;
      case "Muebles y enseres":
        clasificacion = "Activo fijo";
        break;
      case "Equipos de cómputo y comunicaciones":
        clasificacion = "Activo fijo";
        break;
      default:
        clasificacion = "Tipo de medio básico no definido";
        break;
    }
    return clasificacion;
  }

}


// Actualizar la arriba con los métodos

class MedioBasico1 {
  constructor(nombre, descripcion, valor, fechaCompra, vidaUtil, codigo) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valor = valor;
    this.fechaCompra = fechaCompra;
    this.vidaUtil = vidaUtil;
    this.codigo = codigo;
    this.fechaUltimaAmortizacion = null;
    this.estado = 'Activo';
    this.historial = [];
    this.valorInicial = valor;
    this.cuentaActivo = 'Activo Fijo';
    this.cuentaDepreciacion = 'Depreciación Acumulada';
  }

  comprar(fechaCompra, valor, cuenta) {
    this.valor = valor;
    this.fechaCompra = fechaCompra;
    this.estado = 'Activo';
    this.historial.push({
      fecha: fechaCompra,
      evento: 'Compra',
      valor: valor,
      descripcion: 'Compra del activo fijo tangible',
      cuenta: cuenta,
    });
  }

  transferir(fechaTransferencia, nuevoCodigo, cuenta) {
    this.codigo = nuevoCodigo;
    this.historial.push({
      fecha: fechaTransferencia,
      evento: 'Transferencia',
      valor: 0,
      descripcion: `Transferencia del activo fijo tangible al código ${nuevoCodigo}`,
      cuenta: cuenta,
    });
  }

  mover(fechaMovimiento, nuevaDescripcion, cuenta) {
    this.descripcion = nuevaDescripcion;
    this.historial.push({
      fecha: fechaMovimiento,
      evento: 'Movimiento interno',
      valor: 0,
      descripcion: 'Movimiento interno del activo fijo tangible',
      cuenta: cuenta,
    });
  }

  amortizar(fechaAmortizacion, metodoDepreciacion, cuenta) {
    if (this.fechaUltimaAmortizacion === null) {
      this.fechaUltimaAmortizacion = this.fechaCompra;
    }
    let montoAmortizacion = 0;
    let descripcion = '';
    switch (metodoDepreciacion) {
      case 'Linea Recta':
        montoAmortizacion = (this.valor - this.valorResidual) / this.vidaUtil;
        descripcion = 'Amortización del activo fijo tangible por método de línea recta';
        break;
      case 'Suma de los Dígitos de Años':
        const sumaDigitos = (this.vidaUtil * (this.vidaUtil + 1)) / 2;
        const añosTranscurridos = ((fechaAmortizacion - this.fechaCompra) / (365 * 24 * 60 * 60 * 1000)) / 12;
        montoAmortizacion = ((this.valor - this.valorResidual) * (this.vidaUtil - añosTranscurridos + 1)) / sumaDigitos;
        descripcion = 'Amortización del activo fijo tangible por método de suma de los dígitos de años';
        break;
      case 'Unidades de Producción':
        montoAmortizacion = (this.valor - this.valorResidual) / this.unidadesProduccion;
        descripcion = 'Amortización del activo fijo tangible por método de unidades de producción';
        break;
      default:
        throw new Error("Método de depreciación no válido");
    }
    this.valor -= montoAmortizacion;
    this.fechaUltimaAmortizacion = fechaAmortizacion;
    const evento = {
      fecha: fechaAmortizacion,
      evento: 'Amortización',
      valor: montoAmortizacion,
      descripcion: descripcion,
      cuenta: cuenta,
    };
    this.historial.push(evento);
  }

  calcularDepreciacionAcumulada(fecha) {
    if (this.fechaUltimaAmortizacion === null) {
      return 0;
    }
    const tiempoTranscurrido = (fecha - this.fechaUltimaAmortizacion) / (365 * 24 * 60 * 60 * 1000);
    switch (this.metodoDepreciacion) {
      case 'Linea Recta':
        return ((this.valorInicial - this.valorResidual) / this.vidaUtil) * (tiempoTranscurrido / 12);
      case 'Suma de los Dígitos de Años':
        const sumaDigitos = (this.vidaUtil * (this.vidaUtil + 1)) / 2;
        const añosTranscurridos = ((fecha - this.fechaCompra) / (365 * 24 * 60 * 60 * 1000)) / 12;
        const montoTotalAmortizacion = (this.valorInicial - this.valorResidual);
        const montoAmortizado = montoTotalAmortizacion * ((sumaDigitos - añosTranscurridos + 1) / sumaDigitos);
        return montoTotalAmortizacion - montoAmortizado;
      case 'Unidades de Producción':
        const unidadesProducidas = this.unidadesProduccion * tiempoTranscurrido;
        return (this.valorInicial - this.valorResidual) * (unidadesProducidas / this.unidadesProduccion);
      default:
        throw new Error("Método de depreciación no válido");
    }
  }

  calcularValorEnLibros(fecha) {
    return this.valorInicial - this.calcularDepreciacionAcumulada(fecha);
  }
}
