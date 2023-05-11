
class Contrato {
  constructor(titulo, partes, objeto, duracion) {
    this.titulo = titulo;
    this.partes = partes;
    this.objeto = objeto;
    this.duracion = duracion;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración de ${this.duracion}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

/////////////////////////////////////// Business to Business B2B
class ContratoCompraVenta extends Contrato {
  constructor(vendedor, comprador, objeto, precio, fecha, duracion) {
    const titulo = "Contrato de compraventa";
    const partes = `${vendedor}, en adelante "el vendedor", y ${comprador}, en adelante "el comprador"`;
    const objetoContrato = `El vendedor vende al comprador ${objeto}. El precio de venta es de ${precio}. El comprador se compromete a pagar el precio en la fecha de ${fecha}.`;
    super(titulo, partes, objetoContrato, duracion);
  }
}

class ContratoDistribucion extends Contrato {
  constructor(distribuidor, fabricante, territorio, exclusividad, duracion) {
    const titulo = "Contrato de distribución";
    const partes = `${distribuidor}, en adelante "el distribuidor", y ${fabricante}, en adelante "el fabricante"`;
    const objetoContrato = `El fabricante autoriza al distribuidor a distribuir los productos del fabricante en el territorio de ${territorio}. El fabricante otorga al distribuidor el derecho exclusivo de distribuir los productos del fabricante en el territorio de ${territorio}.`;
    super(titulo, partes, objetoContrato, duracion);
    this.exclusividad = exclusividad;
  }

  generarHTML() {
    return `
      ${super.generarHTML()}
      <h2>Exclusividad</h2>
      <p>${this.exclusividad}</p>
    `;
  }
}

class ContratoConfidencialidad extends Contrato {
  constructor(receptor, divulgador, informacion, duracion) {
    const titulo = "Contrato de confidencialidad";
    const partes = `${receptor}, en adelante "el receptor", y ${divulgador}, en adelante "el divulgador"`;
    const objetoContrato = `El divulgador divulgará información confidencial al receptor, en adelante "la Información", relacionada con el negocio del divulgador.`;
    super(titulo, partes, objetoContrato, duracion);
    this.informacion = informacion;
  }

  generarHTML() {
    return `
      ${super.generarHTML()}
      <h2>Confidencialidad</h2>
      <p>El receptor se compromete a mantener en secreto la Información y a no divulgarla a terceros sin el consentimiento previo y por escrito del divulgador.</p>
    `;
  }
}

// Ejemplo de uso
const contratoCompraVenta = new ContratoCompraVenta(
  "Juan Pérez",
  "Pedro García",
  "un coche usado",
  "10.000 euros",
  "1 de junio de 2023",
  "2 años"
);

const contratoDistribucion = new ContratoDistribucion(
  "ABC Distribuidora",
  "XYZ Fabricante",
  "América Latina",
  "exclusividad territorial",
  "5 años"
);

const contratoConfidencialidad = new ContratoConfidencialidad(
  "ABC Receptor",
  "XYZ Divulgador",
  "información confidencial",
  "2 años"
);

const htmlCompraVenta = contratoCompraVenta.generarHTML();
console.log(htmlCompraVenta);

const htmlDistribucion = contratoDistribucion.generarHTML();
console.log(htmlDistribucion);

const htmlConfidencialidad = contratoConfidencialidad.generarHTML();
console.log(htmlConfidencialidad);

// Ejemplo de uso
const contratoConfidencialidad = new ContratoConfidencialidad(
  "ABC Receptor",
  "XYZ Divulgador",
  "información confidencial",
  "2 años"
);

const htmlConfidencialidad = contratoConfidencialidad.generarHTML();
console.log(htmlConfidencialidad);

/////////////////

class ContratoAgencia extends Contrato {
  constructor(agente, principal, territorio, duracion) {
    const titulo = "Contrato de agencia";
    const partes = `${agente}, en adelante "el agente", y ${principal}, en adelante "el principal"`;
    const objetoContrato = `El agente se compromete a promover los productos o servicios del principal en el territorio de ${territorio}.`;
    super(titulo, partes, objetoContrato, duracion);
  }

  generarHTML() {
    return `
      ${super.generarHTML()}
      <h2>Obligaciones del agente</h2>
      <p>El agente se compromete a promover los productos o servicios del principal en el territorio de ${this.territorio} y a actuar con la diligencia y lealtad propias de un buen comerciante.</p>
      <h2>Obligaciones del principal</h2>
      <p>El principal se compromete a suministrar al agente los productos o servicios objeto del contrato y a pagarle las comisiones correspondientes.</p>
    `;
  }
}

// Ejemplo de uso
const contratoAgencia = new ContratoAgencia(
  "ABC Agente",
  "XYZ Principal",
  "Europa",
  "3 años"
);

const htmlAgencia = contratoAgencia.generarHTML();
console.log(htmlAgencia);

//////////////////////////////

class ContratoFranquicia extends Contrato {
  constructor(franquiciador, franquiciado, territorio, duracion) {
    const titulo = "Contrato de franquicia";
    const partes = `${franquiciador}, en adelante "el franquiciador", y ${franquiciado}, en adelante "el franquiciado"`;
    const objetoContrato = `El franquiciador autoriza al franquiciado a utilizar su marca, know-how y otros elementos de su propiedad para la explotación de un negocio en el territorio de ${territorio}.`;
    super(titulo, partes, objetoContrato, duracion);
  }

  generarHTML() {
    return `
      ${super.generarHTML()}
      <h2>Obligaciones del franquiciador</h2>
      <p>El franquiciador se compromete a suministrar al franquiciado la tecnología, el know-how y los elementos de su propiedad necesarios para la explotación del negocio, así como a prestarle asistencia técnica y comercial.</p>
      <h2>Obligaciones del franquiciado</h2>
      <p>El franquiciado se compromete a utilizar la marca, el know-how y los otros elementos de propiedad del franquiciador para la explotación del negocio en el territorio de ${this.territorio} y a pagarle las regalías correspondientes.</p>
    `;
  }
}

// Ejemplo de uso
const contratoFranquicia = new ContratoFranquicia(
  "ABC Franquiciador",
  "XYZ Franquiciado",
  "América del Norte",
  "5 años"
);

const htmlFranquicia = contratoFranquicia.generarHTML();
console.log(htmlFranquicia);

////////////////////////////////////

class ContratoSuministro extends Contrato {
  constructor(suministrador, comprador, objeto, cantidad, precio, fechaEntrega, duracion) {
    const titulo = "Contrato de suministro";
    const partes = `${suministrador}, en adelante "el suministrador", y ${comprador}, en adelante "el comprador"`;
    const objetoContrato = `El suministrador se compromete a suministrar al comprador ${cantidad} unidades de ${objeto} a un precio de ${precio} por unidad. El suministrador entregará las unidades en la fecha de ${fechaEntrega}.`;
    super(titulo, partes, objetoContrato, duracion);
  }

  generarHTML() {
    return `
      ${super.generarHTML()}
      <h2>Obligaciones del suministrador</h2>
      <p>El suministrador se compromete a suministrar al comprador el objeto del contrato en las condiciones y plazos convenidos.</p>
      <h2>Obligaciones del comprador</h2>
      <p>El comprador se compromete a aceptar y pagar el objeto del contrato en las condiciones y plazos convenidos.</p>
    `;
  }
}

// Ejemplo de uso
const contratoSuministro = new ContratoSuministro(
  "ABC Suministrador",
  "XYZ Comprador",
  "materiales de construcción",
  "1.000",
  "10 euros",
  "1 de julio de 2023",
  "2 años"
);

const htmlSuministro = contratoSuministro.generarHTML();
console.log(htmlSuministro);

/////////////////////////////////////// Business to person B2P

///////////////////////////////// Tipos de contrato DE ESTUDIO

class ContratoTrabajoIndefinido extends Contrato {
  constructor(trabajador, empleador, salario, duracion, lugarTrabajo, jornadaLaboral, fechaInicio) {
    const titulo = "Contrato de trabajo indefinido";
    const partes = `${trabajador}, en adelante "el trabajador", y ${empleador}, en adelante "el empleador"`;
    const objetoContrato = `El empleador contrata al trabajador para prestar servicios con un salario de ${salario} en ${lugarTrabajo}. La jornada laboral será de ${jornadaLaboral}. Este contrato inicia el ${fechaInicio}.`;
    super(titulo, partes, objetoContrato, duracion);
    this.lugarTrabajo = lugarTrabajo;
    this.jornadaLaboral = jornadaLaboral;
    this.fechaInicio = fechaInicio;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración de ${this.duracion}.</p>
      <h2>Lugar de trabajo</h2>
      <p>El lugar de trabajo será ${this.lugarTrabajo}.</p>
      <h2>Jornada laboral</h2>
      <p>La jornada laboral será de ${this.jornadaLaboral}.</p>
      <h2>Fecha de inicio</h2>
      <p>Este contrato iniciará el ${this.fechaInicio}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoTrabajoPlazoFijo extends Contrato {
  constructor(trabajador, empleador, salario, fechaInicio, fechaFin, lugarTrabajo, jornadaLaboral, cargo) {
    const titulo = "Contrato de trabajo a plazo fijo";
    const partes = `${trabajador}, en adelante "el trabajador", y ${empleador}, en adelante "el empleador"`;
    const objetoContrato = `El empleador contrata al trabajador para prestar servicios con un salario de ${salario} desde el ${fechaInicio} hasta el ${fechaFin}, en ${lugarTrabajo} y desempeñando el cargo de ${cargo}. La jornada laboral será de ${jornadaLaboral}.`;
    const duracion = `hasta el ${fechaFin}`;
    super(titulo, partes, objetoContrato, duracion);
    this.lugarTrabajo = lugarTrabajo;
    this.jornadaLaboral = jornadaLaboral;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.cargo = cargo;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración de ${this.duracion}.</p>
      <h2>Lugar de trabajo</h2>
      <p>El lugar de trabajo será ${this.lugarTrabajo}.</p>
      <h2>Jornada laboral</h2>
      <p>La jornada laboral será de ${this.jornadaLaboral}.</p>
      <h2>Cargo</h2>
      <p>El trabajador desempeñará el cargo de ${this.cargo}.</p>
      <h2>Fecha de inicio</h2>
      <p>Este contrato iniciará el ${this.fechaInicio}.</p>
      <h2>Fecha de finalización</h2>
      <p>Este contrato finalizará el ${this.fechaFin}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoTrabajoObraServicio extends Contrato {
  constructor(trabajador, empleador, obraServicio, duracion, lugarTrabajo, salario, fechaInicio) {
    const titulo = "Contrato de trabajo por obra o servicio determinado";
    const partes = `${trabajador}, en adelante "el trabajador", y ${empleador}, en adelante "el empleador"`;
    const objetoContrato = `El empleador contrata al trabajador para prestar servicios en relación con ${obraServicio}, con un salario de ${salario} en ${lugarTrabajo}. Este contrato inicia el ${fechaInicio} y tendrá una duración de ${duracion}.`;
    super(titulo, partes, objetoContrato, duracion);
    this.lugarTrabajo = lugarTrabajo;
    this.salario = salario;
    this.fechaInicio = fechaInicio;
    this.obraServicio = obraServicio;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración de ${this.duracion}.</p>
      <h2>Lugar de trabajo</h2>
      <p>El lugar de trabajo será ${this.lugarTrabajo}.</p>
      <h2>Salario</h2>
      <p>El trabajador percibirá un salario de ${this.salario}.</p>
      <h2>Fecha de inicio</h2>
      <p>Este contrato iniciará el ${this.fechaInicio}.</p>
      <h2>Obra o servicio</h2>
      <p>El trabajador prestará servicios en relación con ${this.obraServicio}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoTrabajoTemporada extends Contrato {
  constructor(trabajador, empleador, salario, temporada, lugarTrabajo, fechaInicio, fechaFin) {
    const titulo = "Contrato de trabajo por temporada";
    const partes = `${trabajador}, en adelante "el trabajador", y ${empleador}, en adelante "el empleador"`;
    const objetoContrato = `El empleador contrata al trabajador para prestar servicios con un salario de ${salario} durante la temporada de ${temporada}, en ${lugarTrabajo}. Este contrato inicia el ${fechaInicio} y finaliza el ${fechaFin}.`;
    super(titulo, partes, objetoContrato, `durante la temporada de ${temporada}`);
    this.lugarTrabajo = lugarTrabajo;
    this.salario = salario;
    this.temporada = temporada;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      <h2>Lugar de trabajo</h2>
      <p>El lugar de trabajo será ${this.lugarTrabajo}.</p>
      <h2>Salario</h2>
      <p>El trabajador percibirá un salario de ${this.salario}.</p>
      <h2>Temporada</h2>
      <p>Este contrato se realizará durante la temporada de ${this.temporada}.</p>
      <h2>Fecha de inicio</h2>
      <p>Este contrato iniciará el ${this.fechaInicio}.</p>
      <h2>Fecha de finalización</h2>
      <p>Este contrato finalizará el ${this.fechaFin}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoTrabajoTiempoParcial extends Contrato {
  constructor(trabajador, empleador, salario, horasSemanales, lugarTrabajo, fechaInicio, fechaFin) {
    const titulo = "Contrato de trabajo por horas semanales";
    const partes = `${trabajador}, en adelante "el trabajador", y ${empleador}, en adelante "el empleador"`;
    const objetoContrato = `El empleador contrata al trabajador para prestar servicios con un salario de ${salario} durante la temporada de ${horasSemanales}, en ${lugarTrabajo}. Este contrato inicia el ${fechaInicio} y finaliza el ${fechaFin}.`;
    super(titulo, partes, objetoContrato, `durante ${horasSemanales} horas semanales`);
    this.lugarTrabajo = lugarTrabajo;
    this.salario = salario;
    this.horasSemanales = horasSemanales;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      <h2>Lugar de trabajo</h2>
      <p>El lugar de trabajo será ${this.lugarTrabajo}.</p>
      <h2>Salario</h2>
      <p>El trabajador percibirá un salario de ${this.salario}.</p>
      <h2>Temporada</h2>
      <p>Este contrato se realizará durante ${this.horasSemanales} horas semanales.</p>
      <h2>Fecha de inicio</h2>
      <p>Este contrato iniciará el ${this.fechaInicio}.</p>
      <h2>Fecha de finalización</h2>
      <p>Este contrato finalizará el ${this.fechaFin}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

///////////////////////////////// Tipos de contrato APLICABLES EN CUBA

class ContratoTrabajoTiempoIndeterminado extends Contrato {
  constructor(nombreEmpleador, cargoEmpleador, entidadEmpleador, autoridadNombramiento, nombreTrabajador, carnetTrabajador, direccionTrabajador, cargoTrabajador, lugarTrabajo, horario, jornada, regimenTrabajo, condicionesSeguridad, salarioEscala, pagosAdicionales, periodicidadPago) {
    const titulo = "Contrato de trabajo por tiempo indefinido";
    const partes = `DE UNA PARTE:${nombreEmpleador} ${cargoEmpleador} en representación de ${entidadEmpleador} facultado(a), por Resolución No: ${autoridadNombramiento} que a los efectos del presente contrato, se denomina el EMPLEADOR, con domicilio en ${entidadEmpleador}. Y DE OTRA PARTE: ${nombreTrabajador}, quien concurre por su propio derecho y cuyos datos personales son: No. Carné de Identidad: ${carnetTrabajador}, Dirección: ${direccionTrabajador} el que en lo sucesivo y a los efectos del presente documento se denomina el TRABAJADOR.`;
    const objetoContrato = `El Trabajador prestará sus servicios a la entidad bajo las condiciones siguientes: a) Desempeñará la ocupación o cargo denominado: ${cargoTrabajador} cuyo contenido de trabajo aparece en ANEXO. b) El lugar de trabajo será en: ${lugarTrabajo}, con un horario de ${horario}, una jornada de ${jornada} y un régimen de trabajo y descanso de: ${regimenTrabajo} c) El puesto de trabajo tiene las condiciones de seguridad y salud en el trabajo, en correspondencia con el cargo o labor son las siguientes: ${condicionesSeguridad} e) Se exige una idoneidad demostrada basada en lo dispuesto en el Artículo 36 del Código de Trabajo y el Convenio Colectivo de Trabajo. Cuarto: El trabajador se compromete a cumplir con el contenido de trabajo que aparece descrito en este contrato, a mantener la idoneidad demostrada requerida, a obedecer las órdenes impartidas por los superiores y a acatar el Convenio Colectivo de Trabajo y el Reglamento Disciplinario Interno de la entidad, así como las demás disposiciones vigentes que rigen las materias de organización del trabajo y seguridad y salud en el trabajo.`;
    const duracion = "";
    super(titulo, partes, objetoContrato, duracion);
    this.salarioEscala = salarioEscala;
    this.pagosAdicionales = pagosAdicionales;
    this.periodicidadPago = periodicidadPago;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Al efecto de suscribir el presente contrato de trabajo, el que tiene toda la fuerza legal que en derecho se requiere, comparecen:</p>
      <p>${this.partes}</p>
      <p><strong>CONDICIONES</strong></p>
      <p>${this.objeto}</p>
      <p><strong>REMUNERACIÓN</strong></p>
      <p>La cuantía de la remuneración es de: ${this.salarioEscala}, desglosada de la siguiente manera: Salario escala: ${this.salarioEscala}, Pagos adicionales siguientes: ${this.pagosAdicionales}. El pago se realiza con una periodicidad de ${this.periodicidadPago} los días correspondientes.</p>
      <p><strong>RESOLUCIÓN DE CONFLICTOS</strong></p>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoTrabajoTiempoDeterminado extends Contrato {
  constructor(nombreEmpleador, cargoEmpleador, entidadEmpleador, autoridadNombramiento, nombreTrabajador, carnetTrabajador, direccionTrabajador, cargoTrabajador, lugarTrabajo, horario, jornada, regimenTrabajo, condicionesSeguridad, salario, duracion, fechaInicio, fechaFin, causaTerminacion) {
    const titulo = "Contrato de trabajo por tiempo determinado";
    const partes = `DE UNA PARTE:${nombreEmpleador} ${cargoEmpleador} en representación de ${entidadEmpleador} facultado(a), por Resolución No: ${autoridadNombramiento} que a los efectos del presente contrato, se denomina el EMPLEADOR, con domicilio en ${entidadEmpleador}. Y DE OTRA PARTE: ${nombreTrabajador}, quien concurre por su propio derecho y cuyos datos personales son: No. Carné de Identidad: ${carnetTrabajador}, Dirección: ${direccionTrabajador} el que en lo sucesivo y a los efectos del presente documento se denomina el TRABAJADOR.`;
    const objetoContrato = `El Trabajador prestará sus servicios a la entidad bajo las condiciones siguientes: a) Desempeñará la ocupación o cargo denominado: ${cargoTrabajador} cuyo contenido de trabajo aparece en ANEXO. b) El lugar de trabajo será en: ${lugarTrabajo}, con un horario de ${horario}, una jornada de ${jornada} y un régimen de trabajo y descanso de: ${regimenTrabajo} c) El puesto de trabajo tiene las condiciones de seguridad y salud en el trabajo, en correspondencia con el cargo o labor son las siguientes: ${condicionesSeguridad} e) Se exige una idoneidad demostrada basada en lo dispuesto en el Artículo 36 del Código de Trabajo y el Convenio Colectivo de Trabajo. Cuarto: El trabajador se compromete a cumplir con el contenido de trabajo que aparece descrito en este contrato, a mantener la idoneidad demostrada requerida, a obedecer las órdenes impartidas por los superiores y a acatar el Convenio Colectivo de Trabajo y el Reglamento Disciplinario Interno de la entidad, así como las demás disposiciones vigentes que rigen las materias de organización del trabajo y seguridad y salud en el trabajo.`;
    super(titulo, partes, objetoContrato, duracion);
    this.salario = salario;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.causaTerminacion = causaTerminacion;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Al efecto de suscribir el presente contrato de trabajo, el que tiene toda la fuerza legal que en derecho se requiere, comparecen:</p>
      <p>${this.partes}</p>
      <p><strong>CONDICIONES</strong></p>
      <p>${this.objeto}</p>
      <p><strong>REMUNERACIÓN</strong></p>
      <p>La cuantía de la remuneración es de: ${this.salario}, y se pagará durante la duración del contrato. El pago se realizará ${this.periodicidadPago} los días correspondientes.</p>
      <p><strong>PLAZO DEL CONTRATO</strong></p>
      <p>El presente contrato tiene una duración de ${this.duracion} a partir del día ${this.fechaInicio} y hasta el día ${this.fechaFin}.</p>
      <p><strong>TERMINACIÓN DEL CONTRATO</strong></p>
      <p>El contrato podrá ser terminado por las causas y en la forma previstas en el Código de Trabajo o en el Convenio Colectivo de Trabajo aplicable. En caso de terminación del contrato, se procederá conforme a la normativa aplicable.</p>
    `;
  }
}

/////////////////////////////////////// Business to person B2P
// (Algunos no aplican en Cuba directamente, pueden cotejarse o legalizarse)

class ContratoTrueque extends Contrato {
  constructor(participante1, participante2, objeto1, objeto2, valor1, valor2, aceptaDineroPorEncima) {
    const titulo = "Contrato de trueque";
    const partes = `${participante1}, en adelante "Participante 1", y ${participante2}, en adelante "Participante 2"`;
    const objetoContrato = `Participante 1 se compromete a entregar a Participante 2 ${objeto1} con un valor estimado de ${valor1}. A cambio, Participante 2 se compromete a entregar a Participante 1 ${objeto2} con un valor estimado de ${valor2}.`;
    let clausulaDineroPorEncima = "";
    if (aceptaDineroPorEncima) {
      clausulaDineroPorEncima = `En caso de que alguno de los objetos tenga un valor estimado superior al otro, la parte que recibe el objeto de menor valor podrá compensar la diferencia entregando la cantidad de dinero necesaria para igualar el valor de los objetos intercambiados.`;
    }
    const duracion = "definitiva e irreversible";
    super(titulo, partes, objetoContrato, duracion);
    this.aceptaDineroPorEncima = aceptaDineroPorEncima;
    this.clasulaDineroPorEncima = clausulaDineroPorEncima;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      ${this.aceptaDineroPorEncima ? "<h2>Claúsula de dinero por encima</h2><p>" + this.clasulaDineroPorEncima + "</p>" : ""}
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoAlquiler extends Contrato {
  constructor(arrendador, arrendatario, propiedad, fechaInicio, fechaFin, precioMensual) {
    const titulo = "Contrato de alquiler";
    const partes = `${arrendador}, en adelante "el arrendador", y ${arrendatario}, en adelante "el arrendatario"`;
    const objetoContrato = `El arrendador alquila al arrendatario la propiedad ubicada en ${propiedad} desde el ${fechaInicio} hasta el ${fechaFin}. El precio mensual del alquiler es de ${precioMensual}.`;
    const duracion = `desde el ${fechaInicio} hasta el ${fechaFin}`;
    super(titulo, partes, objetoContrato, duracion);
    this.precioMensual = precioMensual;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      <h2>Precio del alquiler</h2>
      <p>El precio mensual del alquiler es de ${this.precioMensual}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoSubasta extends Contrato {
  constructor(subastador, bien, fechaInicio, fechaFin, precioInicial) {
    const titulo = "Contrato de subasta";
    const partes = `${subastador}, en adelante "el subastador"`;
    const objetoContrato = `El subastador subasta el bien ${bien}. La subasta se llevará a cabo desde el ${fechaInicio} hasta el ${fechaFin}. El precio inicial de la subasta es de ${precioInicial}.`;
    const duracion = `desde el ${fechaInicio} hasta el ${fechaFin}`;
    super(titulo, partes, objetoContrato, duracion);
    this.bien = bien;
    this.precioInicial = precioInicial;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      <h2>Bien subastado</h2>
      <p>El bien subastado es ${this.bien}.</p>
      <h2>Precio inicial</h2>
      <p>El precio inicial de la subasta es de ${this.precioInicial}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}

class ContratoApuesta extends Contrato {
  constructor(apostador1, apostador2, suceso, fechaLimite, monto) {
    const titulo = "Contrato de apuesta";
    const partes = `${apostador1}, en adelante "apostador 1", y ${apostador2}, en adelante "apostador 2"`;
    const objetoContrato = `Los apostadores apuestan sobre el suceso "${suceso}". La apuesta vence el ${fechaLimite}. El monto apostado es de ${monto}.`;
    const duracion = `hasta el ${fechaLimite}`;
    super(titulo, partes, objetoContrato, duracion);
    this.suceso = suceso;
    this.fechaLimite = fechaLimite;
    this.monto = monto;
  }

  generarHTML() {
    return `
      <h1>${this.titulo}</h1>
      <p>Entre ${this.partes}, se acuerda lo siguiente:</p>
      <h2>Objeto del contrato</h2>
      <p>${this.objeto}</p>
      <h2>Duración</h2>
      <p>Este contrato tendrá una duración ${this.duracion}.</p>
      <h2>Suceso</h2>
      <p>Los apostadores apuestan sobre el suceso "${this.suceso}".</p>
      <h2>Fecha límite</h2>
      <p>La apuesta vence el ${this.fechaLimite}.</p>
      <h2>Monto</h2>
      <p>El monto apostado es de ${this.monto}.</p>
      <h2>Resolución de conflictos</h2>
      <p>Cualquier controversia derivada de este contrato se resolverá mediante arbitraje conforme a la normativa aplicable.</p>
    `;
  }
}
