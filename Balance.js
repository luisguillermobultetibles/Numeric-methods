/*

Por terminar:








*/



// Privado y protegido para que no se pueda modifican on runtime
class Comprobante {
  constructor(cuentaT, fecha, autor, descripcion) {
    this.cuentaT = cuentaT;
    this.fecha = fecha;
    this.autor = autor;
    this.descripcion = descripcion;
  }
}

class Balance {
  cuentas = {
    COMPRAS: {
      code: '1000',
      description: 'Compras',
      acreedora: true,
      saldo: 0,
    },
    DEVOLUCIONES_DESCUENTOS: {
      code: '1100',
      description: 'Devoluciones y descuentos sobre compras',
      acreedora: true,
      saldo: 0,
    },
    GASTOS_COMPRAS: {
      code: '1200',
      description: 'Gastos de compras',
      acreedora: true,
      saldo: 0,
    },
    INVENTARIO_INICIAL: {
      code: '1300',
      description: 'Inventario inicial',
      acreedora: true,
      saldo: 0,
    },
    COMPRAS_NETAS: {
      code: '1400',
      description: 'Compras netas',
      acreedora: true,
      saldo: 0,
    },
    GASTOS_ALMACENAMIENTO: {
      code: '1500',
      description: 'Gastos de almacenamiento',
      acreedora: true,
      saldo: 0,
    },
    INVENTARIO_FINAL: {
      code: '1600',
      description: 'Inventario final',
      acreedora: true,
      saldo: 0,
    },
    // Cuentas de Nómina
    SALARIOS_SUELDOS: {
      code: '2000',
      description: 'Salarios y sueldos',
      acreedora: true,
      saldo: 0,
    },
    COMISIONES: {
      code: '2100',
      description: 'Comisiones',
      acreedora: true,
      saldo: 0,
    },
    SEGURIDAD_SOCIAL: {
      code: '2200',
      description: 'Seguridad social',
      acreedora: true,
      saldo: 0,
    },
    BENEFICIOS_LABORALES: {
      code: '2300',
      description: 'Beneficios laborales',
      acreedora: true,
      saldo: 0,
    },
    INDEMNIZACIONES_PRESTAMOS: {
      code: '2400',
      description: 'Indemnizaciones y prestaciones sociales',
      acreedora: true,
      saldo: 0,
    },
    // Cuentas de Caja y Bancos
    CAJA: {
      code: '3000',
      description: 'Caja',
      acreedora: true,
      saldo: 0,
    },
    BANCOS: {
      code: '3100',
      description: 'Bancos',
      acreedora: true,
      saldo: 0,
    },
    // Cuentas de Medios básicos
    MEDIOS_BASICOS: {
      code: '4000',
      description: 'Medios básicos (Activos fijos tangibles)',
      acreedora: true,
      subcuentas: {
        EDIFICIOS_CONSTRUCCIONES: {
          code: '4000.1',
          description: 'Edificios y construcciones',
          acreedora: true,
          saldo: 0,
        },
        MAQUINARIAS_EQUIPOS: {
          code: '4000.2',
          description: 'Maquinarias y equipos',
          acreedora: true,
          saldo: 0,
        },
        VEHICULOS: {
          code: '4000.3',
          description: 'Vehículos',
          acreedora: true,
          saldo: 0,
        },
        HERRAMIENTAS_UTENSILIOS: {
          code: '4000.4',
          description: 'Herramientas y utensilios',
          acreedora: true,
          saldo: 0,

        },
        MUEBLES_ENSERES: {
          code: '4000.5',
          description: 'Muebles y enseres',
          acreedora: true,
          saldo: 0,
        },
        EQUIPOS_INFORMATICOS_COMUNICACIONES: {
          code: '4000.5',
          description: 'Equipos de cómputo y comunicaciones',
          acreedora: true,
          saldo: 0,
        },
      },
    },
    DEPRECIACION_ACUMULADA: {
      code: '4100',
      description: 'Depreciación acumulada de medios básicos',
      acreedora: true,
      saldo: 0,
    },
    // Cuentas de efectivo en Banco
    EFECTIVO_BANCOS: {
      code: '5000',
      description: 'Efectivo en bancos',
      acreedora: true,
      saldo: 0,
    },
    // Otras cuentas
    GASTOS_GENERALES: {
      code: '6000',
      description: 'Gastos generales',
      acreedora: true,
      saldo: 0,
    },
    INGRESOS_VENTAS: {
      code: '7000',
      description: 'Ingresos por ventas',
      acreedora: false,
      subcuentas: {
        INGRESOS_VENTAS_PRODUCTOS: {
          code: '7000.1',
          description: 'Ventas de productos',
          acreedora: false,
          saldo: 0,
        },
        INGRESOS_VENTAS_SERVICIOS: {
          code: '7000.2',
          description: 'Ventas de servicios',
          acreedora: false,
          saldo: 0,
        },
      },
    },
    GASTOS_FINANCIEROS: {
      code: '8000',
      description: 'Gastos financieros',
      acreedora: true,
      saldo: 0,
    },
    INGRESOS_FINANCIEROS: {
      code: '9000',
      description: 'Ingresos financieros',
      acreedora: false,
      saldo: 0,
    },
  };

  constructor(mes, anio) {
    this.mes = mes;
    this.anio = anio;

    for (const cuenta in enumClasificadorCuentas) {
      const {code, description, acreedora} = enumClasificadorCuentas[cuenta];
      this.cuentas[code] = new Cuenta(code, description, acreedora);
    }

    // Indicadores dados, (no calculados)
    this.indicadores = {
      comprasDiarias: 0,
      ventasDiarias: 0,

    };

    this.comprobantes = [];
  }

  // Ejemplo de setter para la cuenta '7000.1'
  set ventasProductos(valor) {
    this.cuentas.INGRESOS_VENTAS.subcuentas.INGRESOS_VENTAS_PRODUCTOS.saldo = valor;
  }

  // Ejemplo de getter para la cuenta '7000.1'
  get ventasProductos() {
    return this.cuentas.INGRESOS_VENTAS.subcuentas.INGRESOS_VENTAS_SERVICIOS.saldo;
  }

  cuenta(nombre) {
    for (const account in this.enumClasificadorCuentas) {
      if (this.enumClasificadorCuentas[account].code === nombre) {
        return this.enumClasificadorCuentas[account];
      }
    }
    if (!Object.values(this.enumClasificadorCuentas).some((account) => account.code === nombre)) {
      throw new Error(`La cuenta ${nombre} no es válida.`);
    }
    return this.enumClasificadorCuentas[nombre];
  }

  obtenerSaldo(objCuenta) {
    let total = 0;
    if (objCuenta.saldo) {
      total = objCuenta.saldo;
    } else {
      for (const saldoKey in objCuenta.subcuentas) {
        total += this.obtenerSaldo(this.saldo[saldoKey]); // el tigre
      }
    }
    return total;
  }

  establecerSaldo(objCuenta, valor) {
    const result = objCuenta;
    if (objCuenta.saldo) {
      result.saldo = valor;
    } else {
      throw new Error(`No se puede establecer el saldo directamente, la cuenta ${objCuenta.code}, tiene subcuentas.`);
    }
    return result;
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
        cuenta.movimientos.forEach((movimiento) => {
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

  // Implementación de los indicadores (razones financieras) ver anexo

  /*
  Las razones financieras son herramientas que se utilizan para evaluar la salud financiera de una empresa. A continuación, describiré algunos de los principales tipos de razones financieras:

    Razón corriente: La razón corriente mide la capacidad de una empresa para pagar sus obligaciones a corto plazo utilizando sus activos corrientes, que son aquellos que se pueden convertir en efectivo en un plazo de un año o menos. La razón corriente se calcula dividiendo los activos corrientes de la empresa entre sus pasivos corrientes. Una razón corriente de 1 o superior se considera adecuada, ya que indica que la empresa tiene suficientes activos corrientes para pagar sus obligaciones a corto plazo.

  Razón rápida: La razón rápida, también conocida como razón ácida, es similar a la razón corriente, pero excluye el inventario de los activos corrientes, ya que el inventario puede ser difícil de vender rápidamente en caso de necesidad de liquidez. La razón rápida se calcula dividiendo los activos corrientes menos el inventario entre los pasivos corrientes. Una razón rápida de 1 o superior se considera adecuada.

  Razón deuda total: La razón deuda total mide la cantidad de deuda que utiliza una empresa para financiar sus activos. La razón deuda total se calcula dividiendo la deuda total de la empresa entre sus activos totales. Una razón deuda total alta puede indicar que la empresa tiene un alto nivel de apalancamiento y, por lo tanto, un mayor riesgo financiero.

  Razón deuda de capital: La razón deuda de capital mide la proporción de la financiación de una empresa que proviene de deuda en comparación con la financiación que proviene de capital propio. La razón deuda de capital se calcula dividiendo la deuda total de la empresa entre su capital contable. Una razón deuda de capital alta puede indicar que la empresa depende en gran medida de la deuda para financiar sus operaciones.

  Razón de cobertura de intereses: La razón de cobertura de intereses mide la capacidad de una empresa para hacer frente a sus gastos de intereses utilizando sus ganancias. La razón de cobertura de intereses se calcula dividiendo las ganancias antes de intereses e impuestos entre los gastos de intereses de la empresa. Una razón de cobertura de intereses alta indica que la empresa tiene suficientes ganancias para cubrir sus gastos de intereses y, por lo tanto, es menos vulnerable a los cambios en las tasas de interés.

  */
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

  // Anexo

  /*

  Los activos y pasivos corrientes son aquellos que se espera que se conviertan en efectivo o se liquiden en un plazo de un año o menos. Estos activos y pasivos son importantes porque proporcionan información sobre la capacidad de una empresa para cumplir con sus obligaciones a corto plazo, como pagar deudas y proveedores, y financiar su ciclo operativo.

Los activos corrientes típicos incluyen efectivo, cuentas por cobrar, inventarios y otros activos que se espera que se conviertan en efectivo en un plazo de un año o menos. Por otro lado, los pasivos corrientes típicos incluyen cuentas por pagar, préstamos a corto plazo, impuestos por pagar y otros pasivos que se espera que se liquiden en un plazo de un año o menos.

Para obtener los activos y pasivos corrientes del balance, se deben buscar las cuentas que se clasifican como corrientes. Por lo general, estas cuentas se presentan en primer lugar en el balance, ya que representan los activos y pasivos más líquidos de la empresa.

Los activos corrientes se presentan en la sección superior del balance, y las cuentas típicas que se incluyen son:

    Efectivo y equivalentes de efectivo
    Cuentas por cobrar
    Inventarios
    Activos por impuestos diferidos
    Otros activos corrientes

Los pasivos corrientes se presentan en la sección inferior del balance, y las cuentas típicas que se incluyen son:

    Cuentas por pagar a proveedores
    Préstamos a corto plazo
    Impuestos por pagar
    Salarios y otros gastos por pagar
    Otras cuentas por pagar

Es importante tener en cuenta que la clasificación de los activos y pasivos como corrientes o no corrientes puede variar según la empresa y la normativa contable aplicable. Por lo tanto, es recomendable revisar cualquier nota explicativa adjunta al balance para comprender mejor la clasificación de los activos y pasivos de una empresa.

  */


  // Fin de anexo

  /*
  Los periodos de cobro y pago se refieren a la cantidad promedio de días que una empresa tarda en cobrar sus cuentas por cobrar y en pagar sus cuentas por pagar, respectivamente. Para calcular los periodos de cobro y pago, se pueden utilizar las siguientes fórmulas:

Periodo de cobro = (Cuentas por cobrar promedio / Ventas diarias)

Periodo de pago = (Cuentas por pagar promedio / Compras diarias)

Donde:

    Cuentas por cobrar promedio: Es la suma de las cuentas por cobrar iniciales y finales de un período dividida entre 2. Esto se puede expresar como (Cuentas por cobrar inicial + Cuentas por cobrar final) / 2.

    Ventas diarias: Es el total de ventas de la empresa en un período dividido por el número de días en ese período. Esto se puede expresar como Ventas / Número de días en el período.

    Cuentas por pagar promedio: Es la suma de las cuentas por pagar iniciales y finales de un período dividida entre 2. Esto se puede expresar como (Cuentas por pagar inicial + Cuentas por pagar final) / 2.

    Compras diarias: Es el total de compras de la empresa en un período dividido por el número de días en ese período. Esto se puede expresar como Compras / Número de días en el período.

Una vez que se tienen los valores de cuentas por cobrar promedio, ventas diarias, cuentas por pagar promedio y compras diarias, se pueden calcular los periodos de cobro y pago utilizando las fórmulas anteriores. El resultado será el número promedio de días que la empresa tarda en cobrar sus cuentas por cobrar y en pagar sus cuentas por pagar.

Es importante tener en cuenta que los periodos de cobro y pago pueden variar de una empresa a otra y de un sector a otro. Por lo tanto, es necesario comparar los periodos de cobro y pago de una empresa con empresas similares en la misma industria para tener una idea más precisa de cómo se está desempeñando la empresa en términos de gestión de cuentas por cobrar y cuentas por pagar. También es importante monitorear los periodos de cobro y pago con el tiempo para detectar tendencias y tomar medidas para mejorar la gestión del capital de trabajo si es necesario.
  * */

  periodoCobro() {
    return (this.cuentas['1.3'].saldo / (0.01 + this.indicadores.ventasDiarias)) * 365;
  }

  periodoPago() {
    return (this.cuentas['2.2'].saldo / (0.01 + this.indicadores.comprasDiarias)) * 365;
  }

  /*
  El periodo de almacenamiento se refiere a la cantidad promedio de días que los inventarios de una empresa permanecen en su almacén antes de ser vendidos. Para calcular el periodo de almacenamiento, se puede utilizar la siguiente fórmula:

Periodo de almacenamiento = (Inventario promedio / Costo de ventas diario)

Donde:

    Inventario promedio: Es la suma de los inventarios iniciales y finales de un período, dividida entre 2. Esto se puede expresar como (Inventario inicial + Inventario final) / 2.

    Costo de ventas diario: Es el costo de los bienes vendidos en un período dividido por el número de días en ese período. Esto se puede expresar como Costo de ventas / Número de días en el período.

Una vez que se tiene el inventario promedio y el costo de ventas diario, se puede calcular el periodo de almacenamiento dividiendo el inventario promedio entre el costo de ventas diario. El resultado será el número promedio de días que los inventarios permanecen en el almacén antes de ser vendidos.

Es importante tener en cuenta que el periodo de almacenamiento puede variar de una empresa a otra y de un sector a otro. Por lo tanto, es necesario comparar el periodo de almacenamiento de una empresa con empresas similares en la misma industria para tener una idea más precisa de cómo se está desempeñando la empresa en términos de gestión de inventarios. También es importante monitorear el periodo de almacenamiento con el tiempo para detectar tendencias y tomar medidas para mejorar la gestión de inventarios si es necesario.
  */
  periodoAlmacenamiento() {
    return (this.cuentas['inventario promedio'].saldo / this.cuentas['costo de ventas diario'].saldo) * 365;
  }

  /*
  El ciclo de efectivo es el periodo promedio de tiempo que una empresa tarda en convertir sus recursos en efectivo, incluyendo los días que tarda en cobrar las cuentas por cobrar, los días que tarda en vender el inventario y los días que tarda en pagar las cuentas por pagar.

El ciclo de efectivo se puede calcular utilizando la siguiente fórmula:

Ciclo de efectivo = Periodo de cobro + Periodo de almacenamiento - Periodo de pago

Donde:

    Periodo de cobro: Es la cantidad promedio de días que tarda la empresa en cobrar sus cuentas por cobrar. Este período se puede calcular utilizando la fórmula: (Cuentas por cobrar promedio / Ventas diarias)

    Periodo de almacenamiento: Es la cantidad promedio de días que los inventarios de la empresa permanecen en su almacén antes de ser vendidos. Este período se puede calcular utilizando la fórmula que mencioné en mi respuesta anterior: (Inventario promedio / Costo de ventas diario)

    Periodo de pago: Es la cantidad promedio de días que tarda la empresa en pagar sus cuentas por pagar. Este período se puede calcular utilizando la fórmula: (Cuentas por pagar promedio / Compras diarias)

Una vez que se han calculado los periodos de cobro, almacenamiento y pago, se puede calcular el ciclo de efectivo sumando el período de cobro y el período de almacenamiento y luego restando el período de pago.

Un ciclo de efectivo más corto indica que la empresa es capaz de convertir sus recursos en efectivo en menos tiempo, lo que puede indicar una gestión más eficiente del capital de trabajo. Por otro lado, un ciclo de efectivo más largo indica que la empresa tarda más tiempo en convertir sus recursos en efectivo, lo que puede indicar una gestión ineficiente del capital de trabajo y una necesidad de mejorar la gestión de inventarios, cuentas por cobrar y cuentas por pagar.
  * */
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


class Cuenta {
  // El saldo puede aceptar un arreglo de subcuentas
  constructor(nombre, descripcion, acreedora = true, saldo = 0) {
    this.nombre = nombre;
    this.description = description;
    this.acreedora = acreedora;
    this.subcuentas = {};
    if (saldo instanceof Cuenta) {
      this.subcuentas = saldo;
    } else {
      this.saldo = saldo;
    }
  }

  static crearSubcuenta(subcode, description, saldo = 0) {
    this.subcuentas[subcode] = new Cuenta(`${this.code}.${subcode}`, description, this.acreedora, saldo);
    return this.subcuentas[subcode];
  }

  get saldo() {
    let total = 0;
    if (!(this.saldo instanceof Cuenta)) {
      total = this.saldo;
    } else {
      for (const saldoKey in this.saldo) {
        total += this.saldo[saldoKey].saldo; // el tigre
      }
    }
    return total;
  }

  static cuenta(valor) {
    for (const account in this.enumClasificadorCuentas) {
      if (this.enumClasificadorCuentas[account].code === valor) {
        return this.enumClasificadorCuentas[account];
      }
    }
    if (!Object.values(this.enumClasificadorCuentas).some((account) => account.code === valor)) {
      throw new Error(`La cuenta ${valor} no es válida.`);
    }
    return this.enumClasificadorCuentas[valor];
  }

  set saldo(v) {
    const total = 0;
    if (!(this.saldo instanceof Cuenta)) {
      this.saldo = v;
    } else {
      throw new Error('Debe acreditar o debitar las sub-cuentas por separado.');
    }
    return total;
  }

  acreditar(c) {
    this.saldo += c;
    return this.saldo;
  }

  debitar(d) {
    this.saldo -= d;
    return this.saldo;
  }
}
