class Comprobante {
  constructor(cuentaT, fecha, autor, descripcion) {
    this.cuentaT = cuentaT;
    this.fecha = fecha;
    this.autor = autor;
    this.descripcion = descripcion;
  }
}

class Cuenta {
  // El saldo puede aceptar un arreglo de subcuentas
  constructor(nombre, saldo = 0) {
    this.nombre = nombre;
    this._saldo = saldo;
  }

  get saldo() {
    let total = 0;
    if (!(this._saldo instanceof Cuenta)) {
      total = this._saldo;
    } else {
      for (let saldoKey in this._saldo) {
        total += this._saldo[saldoKey]; // el tigre
      }
    }
    return total;
  }
}


class Balance {
  constructor(mes, anio) {
    this.mes = mes;
    this.anio = anio;

    this.cuentas = {
      // Cuentas de Inventario
      '1000': new Cuenta('Compras'),
      '1100': new Cuenta('Devoluciones y descuentos sobre compras'),
      '1200': new Cuenta('Gastos de compras'),
      '1300': new Cuenta('Inventario inicial'),
      '1400': new Cuenta('Compras netas'),
      '1500': new Cuenta('Gastos de almacenamiento'),
      '1600': new Cuenta('Inventario final'),
      // Cuentas de Nómina
      '2000': new Cuenta('Salarios y sueldos'),
      '2100': new Cuenta('Comisiones'),
      '2200': new Cuenta('Seguridad social'),
      '2300': new Cuenta('Beneficios laborales'),
      '2400': new Cuenta('Indemnizaciones y prestaciones sociales'),
      // Cuentas de Caja y Bancos
      '3000': new Cuenta('Caja'),
      '3100': new Cuenta('Bancos'),
      // Cuentas de Medios Básicos
      '4000': new Cuenta('Medios básicos'),
      '4100': new Cuenta('Depreciación acumulada de medios básicos'),
      // Cuentas de Efectivo en Banco
      '5000': new Cuenta('Efectivo en bancos'),
      // Otras cuentas
      '6000': new Cuenta('Gastos generales'),
      '7000': new Cuenta('Ingresos por ventas', {
        '7000.1': new Cuenta('Ventas de productos'),
        '7000.2': new Cuenta('Ventas de servicios'),
      }),
      '8000': new Cuenta('Gastos financieros'),
      '9000': new Cuenta('Ingresos financieros'),
    };

    // Indicadores dados, (no calculados)
    this.indicadores = {
      comprasDiarias: 0,
      ventasDiarias: 0,

    };

    this.comprobantes = [];
  }

  // Ejemplo de setter para la cuenta '7000.1'
  set ventasProductos(valor) {
    this.cuentas['7000'].saldo['7000.1'].saldo = valor;
  }

  // Ejemplo de getter para la cuenta '7000.1'
  get ventasProductos() {
    return this.cuentas['7000'].saldo['7000.1'].saldo;
  }

  obtenerSaldo(cuenta) {
    return this.cuentas[cuenta].saldo;
  }

  // Método para acreditar una cuenta
  acreditar(cuenta, monto, descripcion) {
    this.cuentas[cuenta].saldo += monto;
    this.registrarMovimiento(cuenta, monto, descripcion, 'Crédito');
  }

  // Método para debitar una cuenta
  debitar(cuenta, monto, descripcion) {
    this.cuentas[cuenta].saldo -= monto;
    this.registrarMovimiento(cuenta, monto, descripcion, 'Débito');
  }

  // Método interno para registrar un movimiento en la cuenta
  registrarMovimiento(cuenta, monto, descripcion, tipo) {
    const fecha = new Date();
    const movimiento = `${fecha.toLocaleDateString()} - ${tipo}: ${descripcion} por ${monto}`;
    this.cuentas[cuenta][tipo] = this.cuentas[cuenta][tipo] || [];
    this.cuentas[cuenta][tipo].push(movimiento);
  }

  // Método para cerrar el balance del mes y generar comprobantes de ajuste si es necesario
  cierre() {
    // Revisión de las cuentas
    let discrepancias = false;
    for (const cuenta in this.cuentas) {
      const saldo = this.cuentas[cuenta].saldo;
      if (saldo !== 0) {
        discrepancias = true;
        const cuentaT = new Comprobante(cuenta, new Date(), 'Contador', `Ajuste por discrepancia en la cuenta ${cuenta}`);
        if (saldo > 0) {
          this.debitar(cuenta, saldo, `Ajuste por discrepancia en la cuenta ${cuenta}`);
          this.acreditar(cuentaT, saldo, `Ajuste por discrepancia en la cuenta ${cuenta}`);
        } else {
          this.acreditar(cuenta, -saldo, `Ajuste por discrepancia en la cuenta ${cuenta}`);
          this.debitar(cuentaT, -saldo, `Ajuste por discrepancia en la cuenta ${cuenta}`);
        }
        this.comprobantes.push(cuentaT);
      }
    }
    if (!discrepancias) {
      console.log(`El balance del mes de ${this.mes} de ${this.anio} está cuadrado`);
    } else {
      console.log(`Se han generado ${this.comprobantes.length} comprobante(s) de ajuste`);
    }
  }

  // Método para imprimir el balance mensual
  imprimir() {
    console.log(`Balance mensual - ${this.mes}/${this.anio}`);
    console.log('-------------------------------------------');
    for (const codigo in this.cuentas) {
      const cuenta = this.cuentas[codigo];
      console.log(`${codigo} - ${cuenta.nombre}: ${cuenta.saldo}`);
      if (cuenta.movimientos) {
        console.log(`  Movimientos:`);
        cuenta.movimientos.forEach(movimiento => {
          console.log(`    ${movimiento.fecha} ${movimiento.tipo} ${movimiento.descripcion} ${movimiento.monto}`);
        });
      }
    }
  }

  // Método para obtener el saldo total del balance
  obtenerSaldoTotal() {
    let saldoTotal = 0;
    for (const codigo in this.cuentas) {
      saldoTotal += this.cuentas[codigo].saldo;
    }
    return saldoTotal;
  }

  // Método para obtener una cuenta por su nombre
  obtenerCuentaPorNombre(nombre) {
    for (const codigo in this.cuentas) {
      if (this.cuentas[codigo].nombre === nombre) {
        return this.cuentas[codigo];
      }
    }
    return null;
  }

  // Método para obtener una cuenta por su código
  obtenerCuentaPorCodigo(codigo) {
    return this.cuentas[codigo];
  }

  // Método para obtener el código de una cuenta por su nombre
  obtenerCodigoDeCuenta(nombre) {
    for (const codigo in this.cuentas) {
      if (this.cuentas[codigo].nombre === nombre) {
        return codigo;
      }
    }
    return null;
  }

  // Método para obtener el nombre de una cuenta por su código
  obtenerNombreDeCuenta(codigo) {
    return this.cuentas[codigo].nombre;
  }

  // Método para generar un nuevo código de cuenta
  generarCodigoDeCuenta() {
    let codigo = 1000;
    while (this.cuentas[codigo]) {
      codigo++;
    }
    return codigo.toString();
  }

  // Indicadores

  obtenerIngresosTotales() {
    return this.obtenerSaldo('4000') - this.obtenerSaldo('4100') + this.obtenerSaldo('4200') + this.obtenerSaldo('4300');
  }

  obtenerGastosTotales() {
    return this.obtenerSaldo('1200') + this.obtenerSaldo('1500') + this.obtenerSaldo('2000') + this.obtenerSaldo('2100') + this.obtenerSaldo('2200') + this.obtenerSaldo('2300') + this.obtenerSaldo('2400') + this.obtenerSaldo('2500') + this.obtenerSaldo('2600') + this.obtenerSaldo('3000') + this.obtenerSaldo('3100') + this.obtenerSaldo('3200');
  }

  obtenerUtilidadNeta() {
    return this.obtenerIngresosTotales() - this.obtenerGastosTotales();
  }

  // Los que aparezcan aquí abajo repetidos los comentas
  // Getters y setters para las cuentas y subcuentas necesarias
  set ventasProductos(valor) {
    this.cuentas['7000.1'].saldo = valor;
  }

  get ventasProductos() {
    return this.cuentas['7000.1'].saldo;
  }

  // Implementación de los indicadores
  razonCorriente() {
    return this.cuentas['1.0'].saldo / this.cuentas['2.0'].saldo;
  }

  razonRapida() {
    return (this.cuentas['1.0'].saldo - this.cuentas['1.3'].saldo - this.cuentas['1.4'].saldo) / this.cuentas['2.0'].saldo;
  }

  razonDeudaTotal() {
    return (this.cuentas['2.0'].saldo + this.cuentas['2.1'].saldo) / (this.cuentas['1.0'].saldo + this.cuentas['3.0'].saldo);
  }

  razonDeudaCapital() {
    return (this.cuentas['2.0'].saldo + this.cuentas['2.1'].saldo) / this.cuentas['4.0'].saldo;
  }

  razonCoberturaIntereses() {
    return this.cuentas['EBIT'].saldo / this.cuentas['8.0'].saldo;
  }

  rotacionInventarios() {
    return this.cuentas['5.0'].saldo / this.cuentas['1.6'].saldo;
  }

  periodoCobro() {
    return (this.cuentas['1.3'].saldo / (0.01 + this.indicadores.ventasDiarias)) * 365;
  }

  periodoPago() {
    return (this.cuentas['2.2'].saldo / (0.01 + this.indicadores.comprasDiarias)) * 365;
  }

  periodoAlmacenamiento() {
    return (this.cuentas['1.6'].saldo / this.cuentas['5.0'].saldo) * 365;
  }

  cicloEfectivo() {
    return this.periodoAlmacenamiento() + this.periodoCobro() - this.periodoPago();
  }

  // REVISAR

// Calcula el ratio de liquidez rápida restando el inventario del total de activos y dividiendo el resultado entre el total de pasivos.
  ratio_liquidez_rapida() {
    const activo_total = this.cuentas['3000'].saldo + this.cuentas['3100'].saldo - this.cuentas['1600'].saldo;
    const pasivo_total = this.cuentas['2000'].saldo + this.cuentas['2200'].saldo + this.cuentas['2400'].saldo;
    return activo_total / pasivo_total;
  }

  // Calcula el ratio de liquidez de caja dividiendo el equivalente en efectivo de la empresa entre el total de pasivos.
  ratio_liquidez_caja() {
    const caja_equiv_efectivo = this.cuentas['3000'].saldo;
    const pasivo_total = this.cuentas['2000'].saldo + this.cuentas['2200'].saldo + this.cuentas['2400'].saldo;
    return caja_equiv_efectivo / pasivo_total;
  }

  // Calcula el margen de beneficio bruto dividiendo la ganancia bruta entre los ingresos totales.
  margen_beneficio_bruto() {
    const ganancia_bruta = this.cuentas['7000']['7000.1'].saldo - this.cuentas['1000'].saldo - this.cuentas['1100'].saldo - this.cuentas['1200'].saldo - this.cuentas['1500'].saldo;
    const ingresos_totales = this.cuentas['7000'].saldo;
    return ganancia_bruta / ingresos_totales;
  }

  // Calcula el margen de beneficio neto dividiendo la ganancia neta entre los ingresos totales.
  margen_beneficio_neto() {
    const ganancia_neta = this.cuentas['7000'].saldo - this.cuentas['6000'].saldo - this.cuentas['8000'].saldo + this.cuentas['9000'].saldo;
    const ingresos_totales = this.cuentas['7000'].saldo;
    return ganancia_neta / ingresos_totales;
  }

  // Calcula el retorno de inversión dividiendo la ganancia neta entre el total de activos.
  retorno_inversion() {
    const ganancia_neta = this.cuentas['7000'].saldo - this.cuentas['6000'].saldo - this.cuentas['8000'].saldo + this.cuentas['9000'].saldo;
    const activo_total = this.cuentas['1000'].saldo + this.cuentas['1300'].saldo + this.cuentas['1400'].saldo + this.cuentas['1600'].saldo + this.cuentas['2000'].saldo + this.cuentas['2100'].saldo + this.cuentas['2200'].saldo + this.cuentas['2300'].saldo + this.cuentas['2400'].saldo + this.cuentas['3000'].saldo + this.cuentas['3100'].saldo + this.cuentas['4000'].saldo - this.cuentas['4100'].saldo + this.cuentas['5000'].saldo;
    return ganancia_neta / activo_total;
  }

  // Calcula el ratio de endeudamiento dividiendo el total de pasivos entre la diferencia entre el total de activos y el total de pasivos.
  ratio_endeudamiento() {
    const pasivo_total = this.cuentas['2000'].saldo + this.cuentas['2200'].saldo + this.cuentas['2400'].saldo;
    const activo_total = this.cuentas['1000'].saldo + this.cuentas['1300'].saldo + this.cuentas['1400'].saldo + this.cuentas['1600'].saldo + this.cuentas['2000'].saldo + this.cuentas['2100'].saldo + this.cuentas['2200'].saldo + this.cuentas['2300'].saldo + this.cuentas['2400'].saldo + this.cuentas['3000'].saldo + this.cuentas['3100'].saldo + this.cuentas['4000'].saldo - this.cuentas['4100'].saldo + this.cuentas['5000'].saldo;
    return pasivo_total / (activo_total - pasivo_total);
  }

  // Calcula el ratio de cobertura de intereses dividiendo la ganancia bruta entre los gastos de intereses.
  ratio_cobertura_intereses() {
    const ganancia_bruta = this.cuentas['7000']['7000.1'].saldo - this.cuentas['1000'].saldo - this.cuentas['1100'].saldo - this.cuentas['1200'].saldo - this.cuentas['1500'].saldo;
    const gastos_intereses = this.cuentas['8000'].saldo;
    return ganancia_bruta / gastos_intereses;
  }

// Calcula el ratio de rotación de inventario dividiendo el costo de ventas entre el promedio del inventario actual y el inventario anterior.
  // Calcula el ratio de rotación de inventario dividiendo el costo de ventas entre el promedio del inventario actual y el inventario anterior.
  ratio_rotacion_inventario() {
    const promedio_inventario = (this.cuentas['1300'].saldo + this.cuentas['1600'].saldo) / 2; // Promedio del inventario actual y el inventario anterior
    return this.cuentas['1400'].saldo / promedio_inventario; // Costo de ventas / Promedio del inventario
  }

  // Calcula el ratio de rotación de cuentas por cobrar dividiendo los ingresos totales entre el promedio de las cuentas por cobrar actuales y las cuentas por cobrar del periodo anterior.
  ratio_rotacion_cuentas_cobrar() {
    const promedio_cuentas_cobrar = (this.cuentas['1300'].saldo + this.cuentas['1301'].saldo) / 2; // Promedio de las cuentas por cobrar actuales y del periodo anterior
    return this.cuentas['7000'].saldo / promedio_cuentas_cobrar; // Ingresos totales / Promedio de las cuentas por cobrar
  }

  // Calcula la tasa de crecimiento de los ingresos restando los ingresos totales del periodo anterior de los ingresos totales actuales y dividiendo el resultado entre los ingresos totales del periodo anterior.
  tasa_crecimiento_ingresos() {
    return (this.cuentas['7000'].saldo - this.cuentas['7000_anterior'].saldo) / this.cuentas['7000_anterior'].saldo;
  }

  // Calcula la tasa de crecimiento de las ganancias restando la ganancia neta del periodo anterior de la ganancia neta actual y dividiendo el resultado entre la ganancia neta del periodo anterior.
  tasa_crecimiento_ganancias() {
    return (this.cuentas['6900'].saldo - this.cuentas['6900_anterior'].saldo) / this.cuentas['6900_anterior'].saldo;
  }


}
