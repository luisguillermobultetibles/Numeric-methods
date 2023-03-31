import {WebSystemObject} from './WebSystemObject.js';
import {Concepto} from './Concepto.js';

// Alias
export const Arreglo = Concepto.ConceptoGeneral.Arreglo;
export const Conjunto = Concepto.ConceptoGeneral.Conjunto;
export const Distribucion = Concepto.ConceptoGeneral.Distribucion;
export const Poblacion = Concepto.ConceptoGeneral.Poblacion;

// Samples

// Población de personas
export const PoblacionPersonas = class extends Concepto.ConceptoGeneral.Poblacion {

  // Datos estadísticos y funciones especulativas...

  // Población mundial: cantidad de personas en función del tiempo.
  static _poblacionMundial = [
    {x: -10000, y: 1000000},
    {x: -8000, y: 8000000},
    {x: -1000, y: 50000000},
    {x: -500, y: 100000000},
    {x: 1, y: 200000000},
    {x: 1000, y: 310000000},
    {x: 1750, y: 791000000},
    {x: 1800, y: 978000000},
    {x: 1850, y: 1262000000},
    {x: 1900, y: 1650000000},
    {x: 1950, y: 2518630000},
    {x: 1955, y: 2755823000},
    {x: 1960, y: 2982142000},
    {x: 1965, y: 3334874000},
    {x: 1970, y: 3692492000},
    {x: 1975, y: 4068109000},
    {x: 1980, y: 4434682000},
    {x: 1985, y: 4830978000},
    {x: 1990, y: 5263593000},
    {x: 1995, y: 5674328000},
    {x: 2000, y: 6070581000},
    {x: 2005, y: 6453628000},
    {x: 2008, y: 6709132764},
    {x: 2010, y: 6863879342},
    {x: 2011, y: 7082354087},
    {x: 2017, y: 7722727000},
  ];

  // Porcientos por parto
  static _pppGemelar = 1 / 80;
  static _pppTrillizos = 1 / 7600;
  static _pppCuatrillizos = 1 / 670000;
  static _pppQuintillizos = 1 / 54000000;

  // Esperanza de vida al nacer por años, desde la antigüedad
  static _esperanzaDeVidaAlNacer = [
    {x: -10000, y: 33},
    {x: -8000, y: 15},
    {x: -1000, y: 35},
    {x: -500, y: 28},
    {x: 1, y: 28},
    {x: 1000, y: 28},
    {x: 1750, y: 28},
    {x: 1800, y: 29},
    {x: 1850, y: 29},
    {x: 1900, y: 30},
    {x: 2015, y: 71},
    {x: 2023, y: 73},
  ];

  // Datos mortalidad
  static _mortalidad = [
    {
      causa: 'cardiopatía isquémica',
      fallecimientosEstimados: 1000000 * 7.2,
      porcientoDelTotal: 12.2,
    },
    {
      causa: 'afección cerebrovascular',
      fallecimientosEstimados: 1000000 * 5.7,
      porcientoDelTotal: 9.7,
    },
    {
      causa: 'infecciones de las vías respiratorias inferiores (tracto respiratorio bajo: neumonía, absceso pulmonar y bronquitis aguda)',
      fallecimientosEstimados: 1000000 * 4.2,
      porcientoDelTotal: 7.1,
    },
    {
      causa: 'enfermedad pulmonar obstructiva crónica',
      fallecimientosEstimados: 1000000 * 3.0,
      porcientoDelTotal: 5.1,
    },
    {
      causa: 'enfermedades diarréicas',
      fallecimientosEstimados: 1000000 * 2.2,
      porcientoDelTotal: 3.7,
    },
    {
      causa: 'VIH/sida',
      fallecimientosEstimados: 1000000 * 2.0,
      porcientoDelTotal: 3.5,
    },
    {
      causa: 'tuberculosis',
      fallecimientosEstimados: 1000000 * 1.5,
      porcientoDelTotal: 2.5,
    },
    {
      causa: 'cáncer de tráquea, de bronquios o de pulmón',
      fallecimientosEstimados: 1000000 * 1.3,
      porcientoDelTotal: 2.3,
    },
    {
      causa: 'traumatismos por accidentes de tráfico',
      fallecimientosEstimados: 1000000 * 1.3,
      porcientoDelTotal: 2.2,
    },
    {
      causa: 'paludismo',
      fallecimientosEstimados: 1000000 * 1.3,
      porcientoDelTotal: 2.2,
    },
    {
      causa: 'nacimientos prematuros y de bajo peso',
      fallecimientosEstimados: 1000000 * 1.2,
      porcientoDelTotal: 2.0,
    },
    {
      causa: 'infecciones neonatales',
      fallecimientosEstimados: 1000000 * 1.1,
      porcientoDelTotal: 1.9,
    },
    {
      causa: 'asfixia por sumersión accidental (ahogamientos)',
      fallecimientosEstimados: 1000000 * 0.5,
      porcientoDelTotal: 0.7,
    },
  ];

  // Funciones especulativas fix
  static poblacionEnMomento(momento = new Date()) {
    let data1 = PoblacionPersonas._poblacionMundial.map(o => {
      return {x: o.x};
    });
    let data2 = PoblacionPersonas._poblacionMundial.map(o => {
      return {y: o.y};
    });
    return Arreglo.interpolation([data1, data2], (Number(momento) - WebSystemObject.lapso(2000)) / WebSystemObject.lapso(1));
  }

  // fix
  static esperanzaDeVidaEnMomento(momento = new Date()) {
    let data1 = PoblacionPersonas._esperanzaDeVidaAlNacer.map(o => {
      return {x: o.x};
    });
    let data2 = PoblacionPersonas._esperanzaDeVidaAlNacer.map(o => {
      return {y: o.y};
    });
    return Arreglo.interpolation([data1, data2], (Number(momento) - WebSystemObject.lapso(2000)) / WebSystemObject.lapso(1));
  }

  constructor() {
    super(...arguments);
  }

  // Unidad de tiempo (análisis mensual)
  get ut() {
    return WebSystemObject.lapso(0, 1);
  }

  // Unidad de área (metros cuadrados)
  get ua() {
    return 1;
  }

  ////////////////////////////////////////////////////////////////////////////

  // VARIABLE MORTALIDAD (Muertes por unidad de tiempo), Alta si > 30‰, Moderada % entre 15 y 30‰, Baja menor del 15%
  get mortalidad() {
    let result;
    if (this.hasOwnProperty('_muertes')) {
      result = this._muertes / this.ut;
      this._mortalidad = result;
    } else if (this.hasOwnProperty('_mortalidad')) {
      result = this._mortalidad;
    } else {
      throw new Error('El sistema no tiene forma de obtener la variable: mortalidad.');
    }
    return result;
  }

  // Decesos en el periodo y el lugar que se analiza.
  // En el mundo cada año mueren 372 millones de personas, combinado todas las causas de muerte
  // En 2006, más de 215 millones de personas, murieron por causas relacionadas a la desnutrición crónica y acceso al agua potable.
  get muertes() {
    return this._muertes;
  }

  set muertes(v) {
    this._muertes = v;
    this._natalidad = v / this.ut();
  }

  ////////////////////////////////////////////////////////////////////////////

  // VARIABLE NATALIDAD
  get natalidad() {
    let result;
    if (this.hasOwnProperty('_nacimientos')) {
      result = this._nacimientos / this.ut;
      this._natalidad = result;
    } else if (this.hasOwnProperty('_natalidad')) {
      result = this._natalidad;
    } else {
      throw new Error('El sistema no tiene forma de obtener la variable: natalidad.');
    }
    return result;
  }

  // Nacimientos al cierre del periodo que se analiza
  get nacimientos() {
    return this._nacimientos;
  }

  set nacimientos(v) {
    this._nacimientos = v;
    this._natalidad = v / this.ut();
  }

  ////////////////////////////////////////////////////////////////////////////

  // VARIABLE INMIGRACIÓN
  get inmigracion() {
    let result;
    if (this.hasOwnProperty('_inmigrados')) {
      result = this._inmigrados / this.ut;
      this._inmigracion = result;
    } else if (this.hasOwnProperty('_inmigracion')) {
      result = this._inmigracion;
    } else {
      throw new Error('El sistema no tiene forma de obtener la variable: inmigración.');
    }
    return result;
  }

  // Nuevos ingresos al cierre del periodo que se analiza
  get ingresos() {
    return this._inmigrados;
  }

  set ingresos(v) {
    this._inmigracion = v;
    this._inmigrados = v * this.ut;
  }

  ////////////////////////////////////////////////////////////////////////////

  // VARIABLE EMIGRACIÓN
  get emigracion() {
    let result;
    if (this.hasOwnProperty('_emigrados')) {
      result = this._emigrados / this.ut;
      this._emigracion = result;
    } else if (this.hasOwnProperty('_emigracion')) {
      result = this._emigracion;
    } else {
      throw new Error('El sistema no tiene forma de obtener la variable: emigración.');
    }
    return result;
  }

  // Nuevos ingresos al cierre del periodo que se analiza
  get emigrados() {
    return this._emigrados;
  }

  set emigrados(v) {
    this._emigracion = v;
    this._emigrados = v * this.ut;
  }

  ////////////////////////////////////////////////////////////////////////////

  // VARIABLE INDIVIDUOS
  get densidad() {
    let result;
    if (this.hasOwnProperty('_individuos') && this.hasOwnProperty('_area')) {
      result = this._individuos / this._area;
      this._densidad = result;
    } else if (this.hasOwnProperty('_densidad')) {
      result = this._densidad;
    } else {
      throw new Error('El sistema no tiene forma de obtener la variable: densidad.');
    }
    return result;
  }

  get individuos() {
    return this._individuos;
  }

  set individuos(v) {
    this._individuos = v;
  }

  get area() {
    return this._area;
  }

  set area(v) {
    this._area = v;
  }

  //////////////////////////////////////////////////////////////////////////////
  /*

    Una distribución es una generalización del concepto de función, generalmente se
  hace referencia a un grupo de funciones que tienen alguna propiedad en común y se
  representan en un gráfico formando un grupo, desde el punto de vista de la estádistica
  de poblaciones d eorganizmos, existen tres tipos:

  1.- Distribución al azar.- Una de sus causas es la poca tendencia a la agregación
      de sus individuos y se distribuyen de manera irregular. Se presenta cuando el
      medio es homogéneo, con recursos disponibles regularmente en toda su área.

  2.- Distribución uniforme.- Puede presentarse donde la dispersión de recursos es
      escasa, o donde los miembros de la población obtienen alguna ventaja de su
      espacio regular.

  3.- Distribución aglomerada.- Es la forma de distribución de los individuos de la
      población más frecuente en la naturaleza y obedece fundamentalmente a la
      dispersión heterogénea de los recursos en el medio y a la tendencia social de
      ciertas especies a agruparse, con lo que obedece una mayor protección contra el
      ataque de los depredadores, pero también desventajas como un incremento en
      la competencia por la obtención de recursos en el medio.

  */

  get dist() {
    return 'normal';
  }

};

export const DistribucionNormal = class extends Grupo.Distribucion {
  constructor(media, desviacionTipica) {
    super();
    // Dados
    this.media = media;
    this.desviacionTipica = desviacionTipica;
    // Se publica la
    this.funcion = (x) => {
      return (1 / (this.desviacionTipica * Math.sqrt(2 * Math.PI))) * Math.exp(-(Math.pow((x - this.media) / this.desviacionTipica, 2) / 2));
    };
  }
};

