class Comprobante {
  constructor(cuentaT, fecha, autor, descripcion) {
    this.cuentaT = cuentaT;
    this.fecha = fecha;
    this.autor = autor;
    this.descripcion = descripcion;
  }
}

class BalanceMensual {
  constructor(mes, anio) {
    this.mes = mes;
    this.anio = anio;
    this.cuentas = {
      // Cuentas de Inventario
      '1000': { nombre: 'Compras', saldo: 0 },
      '1100': { nombre: 'Devoluciones y descuentos sobre compras', saldo: 0 },
      '1200': { nombre: 'Gastos de compras', saldo: 0 },
      '1300': { nombre: 'Inventario inicial', saldo: 0 },
      '1400': { nombre: 'Compras netas', saldo: 0 },
      '1500': { nombre: 'Gastos de almacenamiento', saldo: 0 },
      '1600': { nombre: 'Inventario final', saldo: 0 },
      // Cuentas de Nómina
      '2000': { nombre: 'Salarios y sueldos', saldo: 0 },
      '2100': { nombre: 'Comisiones', saldo: 0 },
      '2200': { nombre: 'Seguridad social', saldo: 0 },
      '2300': { nombre: 'Beneficios laborales', saldo: 0 },
      '2400': { nombre: 'Indemnizaciones y prestaciones sociales', saldo: 0 },
      // Cuentas de Caja y Bancos
      '3000': { nombre: 'Caja', saldo: 0 },
      '3100': { nombre: 'Bancos', saldo: 0 },
      // Cuentas de Medios Básicos
      '4000': { nombre: 'Medios básicos', saldo: 0 },
      '4100': { nombre: 'Depreciación acumulada de medios básicos', saldo: 0 },
      // Cuentas de Efectivo en Banco
      '5000': { nombre: 'Efectivo en bancos', saldo: 0 },
      // Otras cuentas
      '6000': { nombre: 'Gastos generales', saldo: 0 },
      '7000': { nombre: 'Ingresos por ventas', saldo: 0 },
      '8000': { nombre: 'Gastos financieros', saldo: 0 },
      '9000': { nombre: 'Ingresos financieros', saldo: 0 },
    };
    this.comprobantes = [];
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

  

}
