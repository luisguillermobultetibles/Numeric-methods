import {Caja} from './Inventario.js';

class EstadoCuenta {
  constructor(monto) {
    this.monto = monto;
  }
}

class Concepto {
  constructor(nombre, monto) {
    this.nombre = nombre;
    this.monto = monto;
  }
}

class Empleado {
  constructor(nombre, apellido, salario, tipoContrato, estadoCuenta = {monto: 0}) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.salario = salario;
    this.tipoContrato = tipoContrato;
    this.estadoCuenta = estadoCuenta;
  }

  calcularPagoConcepto(concepto) {
    return concepto.monto;
  }
}

class Nomina {
  constructor(empleadoList) {
    this.empleados = empleadoList;
    this.pagos = [];
    this.fondoComunPago = new Caja(0);
  }

  pagarNomina(conceptos) {
    const totalPago = this.calcularTotalPago(conceptos);
    if (totalPago <= this.fondoComunPago.fondoComun) {
      this.fondoComunPago.retirarDeCaja(totalPago);
      const fechaPago = new Date();
      this.empleados.forEach((empleado) => {
        const pago = {
          empleado: empleado,
          fechaPago: fechaPago,
          conceptos: conceptos,
          totalPago: this.calcularPagoEmpleado(empleado, conceptos),
        };
        empleado.estadoCuenta.monto += pago.totalPago;
        this.pagos.push(pago);
      });
      console.log(`Se pagó la nómina por un total de ${totalPago}.`);
    } else {
      console.log(`No se puede realizar el pago de la nómina. Fondo común insuficiente.`);
    }
  }

  calcularTotalPago(conceptos) {
    let total = 0;
    this.empleados.forEach((empleado) => {
      total += this.calcularPagoEmpleado(empleado, conceptos);
    });
    return total;
  }

  calcularPagoEmpleado(empleado, conceptos) {
    let total = empleado.salario;
    conceptos.forEach((concepto) => {
      switch (concepto) {
        case 'seguro':
          total -= empleado.salario * 0.1;
          break;
        case 'formacion':
          total -= empleado.salario * 0.05;
          break;
        case 'penalizacion':
          total -= empleado.salario * 0.15;
          break;
        case 'pago-indebido':
          total -= empleado.salario * 0.25;
          break;
        case 'vacaciones':
          if (empleado.tipoContrato === 'fijo') {
            total -= empleado.salario * 0.090909;
          }
          break;
        default:
          break;
      }
    });
    return total;
  }

  generarReporteHtml() {
    let html = '<h1>Reporte de nómina</h1>';
    html += '<table>';
    html += '<thead>';
    html += '<tr>';
    html += '<th>Empleado</th>';
    html += '<th>Fecha de pago</th>';
    html += '<th>Conceptos</th>';
    html += '<th>Total pago</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    this.pagos.forEach((pago) => {
      html += '<tr>';
      html += `<td>${pago.empleado.nombre}</td>`;
      html += `<td>${pago.fechaPago.toLocaleDateString()}</td>`;
      html += '<td>';
      pago.conceptos.forEach((concepto) => {
        html += `${concepto}, `;
      });
      html = html.slice(0, -2);
      html += '</td>';
      html += `<td>${pago.totalPago}</td>`;
      html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    html += `<p>Total pagado: ${this.pagos.reduce((suma, pago) => suma + pago.totalPago, 0)}</p>`;
    html += '<p>Firma: ______________________</p>';
    return html;
  }

  generarReporteDetallado() {
    let html = '<h1>Reporte detallado de nómina</h1>';
    this.pagos.forEach((pago) => {
      html += '<hr>';
      html += `<h2>Empleado: ${pago.empleado.nombre}</h2>`;
      html += `<p>Fecha de pago: ${pago.fechaPago.toLocaleDateString()}</p>`;
      html += '<h3>Conceptos</h3>';
      html += '<ul>';
      pago.conceptos.forEach((concepto) => {
        html += `<li>${concepto}</li>`;
      });
      html += '</ul>';
      html += `<p>Total pago: ${pago.totalPago}</p>`;
      html += `<p>Estado de cuenta inicial: ${pago.empleado.estadoCuenta.monto - pago.totalPago}</p>`;
      html += `<p>Estado de cuenta final: ${pago.empleado.estadoCuenta.monto}</p>`;
    });
    html += '<hr>';
    html += `<p>Total pagado: ${this.pagos.reduce((suma, pago) => suma + pago.totalPago, 0)}</p>`;
    html += '<p>Firma: ______________________</p>';
    return html;
  }

  generarNominaHtmlA4() {
    const pagosPorPagina = 10;
    let html = '<html>';
    html += '<head>';
    html += '<style>';
    html += '@page { size: A4 landscape; }';
    html += 'table { border-collapse: collapse; width: 100%; }';
    html += 'th, td { text-align: left; padding: 8px; }';
    html += 'th { background-color: #4CAF50; color: white; }';
    html += 'tr:nth-child(even) { background-color: #f2f2f2; }';
    html += '</style>';
    html += '</head>';
    html += '<body>';
    html += '<h1>Nómina</h1>';
    html += '<table>';
    html += '<tr><th>Empleado</th><th>Fecha de Pago</th><th>Conceptos</th><th>Total Pago</th><th>Firma</th></tr>';
    let paginaActual = 1;
    let pagosEnPaginaActual = 0;
    let totalPorPagina = 0;
    this.pagos.forEach((pago) => {
      if (pagosEnPaginaActual === 0) {
        html += `<div style="page-break-after: always;"></div>`;
        html += `<h2>Página ${paginaActual}</h2>`;
        html += '<table>';
        html += '<tr><th>Empleado</th><th>Fecha de Pago</th><th>Conceptos</th><th>Total Pago</th><th>Firma</th></tr>';
      }
      html += '<tr>';
      html += `<td>${pago.empleado.nombre} ${pago.empleado.apellido}</td>`;
      html += `<td>${pago.fechaPago.toLocaleDateString()}</td>`;
      html += '<td>';
      pago.conceptos.forEach((concepto) => {
        html += `<li>${concepto}</li>`;
      });
      html += '</td>';
      html += `<td>$${pago.totalPago.toFixed(2)}</td>`;
      html += `<td><input type="text" size="30"></td>`; // Espacio para firma
      html += '</tr>';
      pagosEnPaginaActual++;
      totalPorPagina += pago.totalPago;
      if (pagosEnPaginaActual === pagosPorPagina) {
        html += `<tr><td colspan="3" style="text-align: right;">Total:</td><td>$${totalPorPagina.toFixed(2)}</td><td></td></tr>`;
        html += '</table>';
        paginaActual++;
        pagosEnPaginaActual = 0;
        totalPorPagina = 0;
      }
    });
    if (pagosEnPaginaActual > 0) {
      html += `<tr><td colspan="3" style="text-align: right;">Total:</td><td>$${totalPorPagina.toFixed(2)}</td><td></td></tr>`;
      html += '</table>';
    }
    html += '</body>';
    html += '</html>';
    return html;
  }

  // Revisar los siguiente métodos

  pagarNomina(conceptos) {
    const totalPago = this.calcularTotalPago(conceptos);
    if (totalPago <= this.fondoComunPago.fondoComun) {
      this.fondoComunPago.retirarDeCaja(totalPago);
      const fechaPago = new Date();
      this.empleados.forEach((empleado) => {
        const pago = {
          empleado: empleado,
          fechaPago: fechaPago,
          conceptos: conceptos,
          totalPago: this.calcularPagoEmpleado(empleado, conceptos),
          firmado: false, // Bandera para indicar si el pago ha sido firmado
        };
        empleado.estadoCuenta.monto += pago.totalPago;
        this.pagos.push(pago);
      });
      console.log(`Se pagó la nómina por un total de ${totalPago}.`);
    } else {
      console.log(`No se puede realizar el pago de la nómina. Fondo común insuficiente.`);
    }
  }

  reintegrarEnCaja() {
    const totalPagado = this.pagos.reduce((total, pago) => total + pago.totalPago, 0);
    this.fondoComunPago.agregarACaja(totalPagado);
    console.log(`Se reintegró $${totalPagado} a la caja. Fondo común actual: $${this.fondoComunPago.fondoComun}.`);
    this.pagos = [];
    this.empleados.forEach((empleado) => {
      empleado.estadoCuenta.monto = 0;
    });
  }

  volverAExtraer() {
    this.reintegrarEnCaja();
    // Volver a iniciar el proceso de pago
    console.log('Se puede volver a iniciar el proceso de pago.');
  }

  reintegrarDejadoDePagar() {
    const totalDejadoDePagar = this.empleados.reduce((total, empleado) => total + empleado.estadoCuenta.monto, 0);
    this.fondoComunPago.agregarACaja(totalDejadoDePagar);
    console.log(`Se reintegró $${totalDejadoDePagar} a la caja. Fondo común actual: $${this.fondoComunPago.fondoComun}.`);
    this.empleados.forEach((empleado) => {
      empleado.estadoCuenta.monto = 0;
    });
  }

  calcularTotalPago(conceptos) {
    let totalPago = 0;
    this.empleados.forEach((empleado) => {
      totalPago += this.calcularPagoEmpleado(empleado, conceptos);
    });
    return totalPago;
  }

  calcularPagoEmpleado(empleado, conceptos) {
    let totalPago = 0;
    conceptos.forEach((concepto) => {
      totalPago += empleado.calcularPagoConcepto(concepto);
    });
    return totalPago;
  }

  unitaryTest() {
    const empleado1 = new Empleado('Juan', 'Pérez', 1000, 'fijo');
    const empleado2 = new Empleado('María', 'García', 1500, 'temporal');
    const empleado3 = new Empleado('Pedro', 'Rodríguez', 2000, 'fijo');
    const empleadoList = [empleado1, empleado2, empleado3];

    const nomina = new Nomina(empleadoList);
    nomina.fondoComunPago.depositarEnCaja(6000);
    nomina.pagarNomina(['seguro', 'formacion', 'vacaciones']);
    const reporteHtml = nomina.generarNominaHtmlA4();
    console.log(reporteHtml);

    //
    const conceptoDescuento = new Concepto('Descuento', (empleado) => {
      return empleado.estadoCuenta.monto * 0.1; // Descuento del 10% del monto en el estado de cuenta del empleado
    });
    const conceptos = [conceptoSalario, conceptoBono, conceptoDescuento];
    nomina.pagarNomina(conceptos);

  }


}


// Tomar esta como modelo con la anterior
class Nomina2 {
  constructor(empleadoList) {
    this.empleados = empleadoList;
    this.pagos = [];
    this.fondoComunPago = new Caja(0);
  }

  pagarNomina(conceptos) {
    const totalPago = this.calcularTotalPago(conceptos);
    if (totalPago <= this.fondoComunPago.fondoComun) {
      this.fondoComunPago.retirarDeCaja(totalPago);
      const fechaPago = new Date();
      this.empleados.forEach((empleado) => {
        const pago = {
          empleado: empleado,
          fechaPago: fechaPago,
          conceptos: conceptos,
          totalPago: this.calcularPagoEmpleado(empleado, conceptos),
          firmado: false, // Bandera para indicar si el pago ha sido firmado
        };
        empleado.estadoCuenta.monto += pago.totalPago;
        this.pagos.push(pago);
      });
      console.log(`Se pagó la nómina por un total de $${totalPago.toFixed(2)}.`);
    } else {
      console.log(`No hay suficientes fondos en la caja para pagar la nómina. El fondo común tiene $${this.fondoComunPago.fondoComun.toFixed(2)} y se necesita $${totalPago.toFixed(2)}.`);
    }
  }

  calcularPagoEmpleado(empleado, conceptos) {
    let total = empleado.salario;
    conceptos.forEach((concepto) => {
      total += concepto.calcularMonto(empleado);
    });
    return total;
  }

  calcularTotalPago(conceptos) {
    let total = 0;
    this.empleados.forEach((empleado) => {
      total += this.calcularPagoEmpleado(empleado, conceptos);
    });
    return total;
  }

  reintegros() {
    let totalReintegros = 0;
    this.pagos.forEach((pago) => {
      if (pago.firmado === true) {
        totalReintegros += pago.totalPago;
      }
    });
    console.log(`El total de reintegros pendientes es de $${totalReintegros.toFixed(2)}.`);
    return totalReintegros;
  }

  dejadoDePagar() {
    let totalDejadoDePagar = 0;
    this.empleados.forEach((empleado) => {
      if (empleado.estadoCuenta.monto < empleado.salario) {
        totalDejadoDePagar += empleado.salario - empleado.estadoCuenta.monto;
      }
    });
    console.log(`El total dejado de pagar a los empleados es de $${totalDejadoDePagar.toFixed(2)}.`);
    return totalDejadoDePagar;
  }

  generarReporteHtml() {
    let reporte = '<h1>Reporte de Nómina</h1><br><br>';
    this.pagos.forEach((pago) => {
      reporte += `<h2>Empleado: ${pago.empleado.nombre} ${pago.empleado.apellido}</h2>\n`;
      reporte += `<p>Fecha de pago: ${pago.fechaPago.toDateString()}</p>\n`;
      reporte += '<ul>';
      pago.conceptos.forEach((concepto) => {
        reporte += `<li>${concepto.tipo}: ${concepto.porcentaje * 100}%</li>\n`;
      });
      reporte += '</ul>';
      reporte += `<p>Total a pagar: $${pago.totalPago.toFixed(2)}</p>\n`;
      reporte += `<p>Firmado: ${pago.firmado ? 'Sí' : 'No'}</p><br><br>\n`;
    });
    return reporte;
  }

  generarReporteDetallado() {
    let reporte = '';
    this.empleados.forEach((empleado) => {
      reporte += `<h2>Empleado: ${empleado.nombre} ${empleado.apellido}</h2>\n`;
      reporte += `<p>Salario: $${empleado.salario.toFixed(2)}</p>\n`;
      reporte += `<p>Estado de cuenta: $${empleado.estadoCuenta.monto.toFixed(2)}</p>\n`;
      reporte += '<ul>';
      empleado.estadoCuenta.conceptos.forEach((concepto) => {
        reporte += `<li>${concepto.tipo}: ${concepto.porcentaje * 100}%</li>\n`;
      });
      reporte += '</ul><br><br>';
    });
    return reporte;
  }

  firmarPago(empleado, fechaPago) {
    const pago = this.pagos.find((pago) => pago.empleado === empleado && pago.fechaPago.getTime() === fechaPago.getTime());
    if (pago) {
      pago.firmado = true;
      empleado.estadoCuenta.monto -= pago.totalPago;
      console.log(`El pago a ${empleado.nombre} ${empleado.apellido} ha sido firmado.`);
    } else {
      console.log(`No se encontró ningún pago para ${empleado.nombre} ${empleado.apellido} en la fecha ${fechaPago.toDateString()}.`);
    }
  }

  unitaryTest() {
    // Prueba unitaria básica
    const empleado1 = new Empleado('Juan', 'Pérez', 5000, 'fijo');
    const empleado2 = new Empleado('María', 'García', 6000, 'temporal');
    const empleado3 = new Empleado('Pedro', 'Martínez', 7000, 'fijo');

    const nomina = new Nomina([empleado1, empleado2, empleado3]);

    const conceptoSalario = new Concepto('salario', 1);
    const conceptoBono = new Concepto('bono', 0.1);
    const conceptoSeguro = new Concepto('seguro', 0.1);
    const conceptoFormacion = new Concepto('formacion', 0.05);
    const conceptoPenalizacion = new Concepto('penalizacion', 0.15);
    const conceptoPagoIndebido = new Concepto('pago-indebido', 0.25);
    const conceptoVacaciones = new Concepto('vacaciones', 0.090909);

    nomina.pagarNomina([conceptoSalario, conceptoBono, conceptoSeguro, conceptoFormacion, conceptoPenalizacion, conceptoPagoIndebido, conceptoVacaciones]);

    console.log(nomina.generarReporteHtml());
    console.log(nomina.generarReporteDetallado());

    nomina.firmarPago(empleado1, new Date());
    console.log(nomina.reintegros());
    console.log(nomina.dejadoDePagar());
  }
}

