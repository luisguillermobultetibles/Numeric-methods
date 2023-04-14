'use strict';
import {WebSystemObject} from './WebSystemObject';

// Generador de sonido puro... con algunas funciones de cálculo acústico.
// Copyright 2023 Bultet.
class Acustica extends WebSystemObject {
  static channels = [];

  constructor(numChannels = 16) {
    super();
    // Inicialización del mezclador
    var audioContext = new (typeof AudioContext !== 'undefined' && AudioContext !== null ? AudioContext : webkitAudioContext);
    for (let index = 0; index < numChannels; index++) {
      let ochet = {oscillator: null, analizer: null};
      ochet.oscillator = audioContext.createOscillator();
      ochet.oscillator.frequency.value = 0;
      ochet.oscillator.gain = audioContext.createGain();
      ochet.oscillator.gain.value = 1;
      ochet.analizer = audioContext.createAnalyser();
      ochet.analizer.fftSize = 1024;
      //conectamos los nodos
      ochet.oscillator.connect(ochet.oscillator.gain);
      ochet.oscillator.gain.connect(ochet.analizer);
      ochet.analizer.connect(audioContext.destination);
      ochet.oscillator.start(0);
      Acustica.channels.push(ochet);
    }
  }

  // Cálculo de nivel de sonoridad aproximado (en sonios)
  // isófona a una frecuencia clínica de 1000 Hz a una
  // intensidad constante 60 dB = 2 ^ [(NS - 40) / 20]
  // Fuente: Interpolación de la norma IEC 651/79 Nivel A
  // Copyright © abril, 4; 2023 Lic. Luis Guillermo Bultet Ibles ®
  // Todos los derechos reservados.
  sonoridad_A(freq) {
    function octave(f) { // aprox.
      return Math.log((f + 0.64710459283) / 7.9415) / 0.6909;
    }

    let i = 3 * octave(freq);
    let result = 0.0012 * Math.pow(i, 3) - 0.1933 * Math.pow(i, 2) + 7.1735 * i - 75.75;
    return result;
  }

  octava(f) {
    return Math.ln((f + 0.64710459283) / 7.9415) / 0.6909;
  }

  /**
   * Calcula el nivel de sonoridad aproximado (en sonios) isófona a una frecuencia clínica de 1000 Hz
   * a una intensidad constante 60 dB = 2 ^ [(NS - 40) / 20]
   * @param {number} frequency - La frecuencia en Hz
   * @returns {number} El nivel de sonoridad aproximado en sonios
   */
  calculateSonorityAtFrequency(frequency) {
    // Aproximación de la octava utilizando la ecuación logarítmica
    const octaveIndex = Math.log((frequency + 0.64710459283) / 7.9415) / 0.6909;

    // Cálculo de la sonoridad utilizando la aproximación de la norma IEC 651/79 Nivel A
    const sonority = 0.0012 * Math.pow(octaveIndex, 3) - 0.1933 * Math.pow(octaveIndex, 2) + 7.1735 * octaveIndex - 75.75;

    return sonority;
  }

  /**
 * Calcula el nivel de sonoridad aproximado (en sonios) isófona a una frecuencia clínica de 1000 Hz
 * a una intensidad constante 60 dB = 2 ^ [(NS - 40) / 20]
 * Utiliza la aproximación de la norma IEC 651/79 Nivel A y el coseno hiperbólico
 * @param {number} frequency - La frecuencia en Hz
 * @returns {number} El nivel de sonoridad aproximado en sonios
 */
calculateSonorityAtFrequencyWithCosH(frequency) {
  // Frecuencia de referencia
  const fRef = 1000;

  // Coeficientes de la aproximación de la sonoridad
  const a = 1.76;
  const b = -0.84;
  const c = -0.19;

  // Cálculo del factor de intensidad
  const intensityFactor = Math.pow(2, (-40 / 20));

  // Cálculo de la sonoridad utilizando la aproximación de la norma IEC 651/79 Nivel A y el coseno hiperbólico
  const sonority = 94.0 + a * Math.cosh(b * Math.log(frequency / fRef) + c) * intensityFactor;

  return sonority;
}


  // Plom y Levelt, versión conmutativa.
  /**
   * Calcula la disonancia entre dos notas musicales utilizando la fórmula de disonancia de Plomp y Levelt
   * @param {number} frequency1 - La frecuencia de la primera nota en Hz
   * @param {number} frequency2 - La frecuencia de la segunda nota en Hz
   * @param {number} volume1 - El volumen de la primera nota (opcional, valor predeterminado = 1)
   * @param {number} volume2 - El volumen de la segunda nota (opcional, valor predeterminado = 1)
   * @returns {number} La disonancia entre las dos notas
   */
  calculateDisonance = (frequency1, frequency2, volume1 = 1, volume2 = 1) => {
    if (frequency1 <= 0 || frequency2 <= 0) {
      throw new Error("Las frecuencias deben ser números positivos");
    }

    if (volume1 <= 0 || volume2 <= 0) {
      throw new Error("Los valores de volumen deben ser números positivos");
    }

    // Asegurarse de que la frecuencia menor sea f1
    if (frequency1 > frequency2) {
      [frequency1, frequency2, volume1, volume2] = [frequency2, frequency1, volume2, volume1];
    }

    const lambda = 0.24 / (0.021 * Math.min(frequency1, frequency2) * 19);
    const dissonance = volume1 * volume2 * (Math.exp(-3.5 * lambda * (frequency2 - frequency1)) - Math.exp(-5.75 * lambda * (frequency2 - frequency1)));

    return dissonance;
  }

  disonancia1(f1, f2) {
    /*
      Existe un criterio de disonancia que las clasifica teniendo en cuenta la diferencia (Δf) absoluta entre las mismas
      (Δf = |f2 - f1|) y pudiese expresarse por la función:
      CH ( f1, f2 ) = COS((f1 - f2)π/80) 	(en la ecuación se divide por 80 Hz, no 180°)
      Que se obtiene a partir de la observación de Helmholtz: (una diferencia aprox. entre < 30 y > 130 ya es disonante),
      este criterio y el anterior sugiere que existen familias de notas.
    */
    return Math.cos((f1 - f2) * Math.PI / 80);
  }

  clasificarFrecuencia(f) {
    let result = {frecuencia: f, octava: null, descripcion: 'Sin clasificar'};
    if (f > 1 && f < 16) {
      result.octava = 1;
      result.descripcion = 'Pulsación, imperceptible al oido.';
    } else if (f > 16 && f < 32) {
      result.octava = 1;
      result.descripcion = 'Tono grave, primera octava. (Casi imperceptible).';
    } else if (f >= 32 && f < 64) {
      result.octava = 2;
      result.descripcion = 'Tono grave, segunda octava (zumbido).';
    } else if (f >= 64 && f < 128) {
      result.octava = 3;
      result.descripcion = 'Tono grave medio (bajo).';
    } else if (f >= 128 && f < 256) {
      result.octava = 4;
      result.descripcion = 'Tonos grave medios (alto).';
    } else if (f >= 256 && f < 512) {
      result.octava = 5;
      result.descripcion = 'Tonos armónicos medios (bajos).';
    } else if (f >= 512 && f < 1024) {
      result.octava = 6;
      result.descripcion = 'Tonos armónicos medios (alto).';
    } else if (f >= 1024 && f < 2048) {
      result.octava = 7;
      result.descripcion = 'Tonos armónicos medio.';
      if (f >= 2000) { // 2000-4096
        result.octava = 8;
        result.descripcion = 'Tonos armónicos medio alto (de máxima sensibilidad).';
      }
    } else if (f >= 2048 && f < 4096) {
      result.octava = 9;
      result.descripcion = 'Tonos armónicos (agudo) muy alto.';
    } else if (f >= 4096 && f < 16384) {
      result.octava = 10;
      result.descripcion = 'Tonos agudos de alta frecuencia (chirrido desagradable, no se utilizan para hacer música).';
      if (f >= 12000) {
        result.octava = 7;
        result.descripcion = 'Tonos agudo de muy alta freceuncia (imperceptible).';
      }
    }
    return result;
  }


  // Sonido aparente de dos frecuencias (la suma menos la armónica)
  /**
   * Calcula el sonido aparente de dos frecuencias utilizando la sonoridad de cada frecuencia como un peso
   * @param {number} frequency1 - La frecuencia de la primera nota en Hz
   * @param {number} frequency2 - La frecuencia de la segunda nota en Hz
   * @param {number} intensity1 - La intensidad de la primera nota (opcional, valor predeterminado = 1)
   * @param {number} intensity2 - La intensidad de la segunda nota (opcional, valor predeterminado = 1)
   * @returns {number} El sonido aparente de las dos notas
   */
  calculateApparentSound(frequency1, frequency2, intensity1 = 1, intensity2 = 1) {
    const sonority1 = sonoridad_A(frequency1);
    const sonority2 = sonoridad_A(frequency2);

    const weightedFrequency1 = frequency1 * sonority1;
    const weightedFrequency2 = frequency2 * sonority2;

    const numerator = (intensity1 * weightedFrequency1) + (intensity2 * weightedFrequency2) - (2 * intensity1 * weightedFrequency1 * intensity2 * weightedFrequency2 / ((intensity1 * weightedFrequency1) + (intensity2 * weightedFrequency2)));
    const denominator = intensity1 + intensity2;

    return numerator / denominator;
  }

  // Clasifica un par de frecuencias puras (terminar, pueden tener proporciones consonantes en clasificaciones disonantes).
  // Análiss armónico simple
  clasificarArmonia(frecuencia1, frecuencia2) {

    function helmholtz(f1, f2) {
      return 1 - Math.cos((f1 - f2) * Math.PI / 80) / 2;
    }

    function plomptlevelt(f1, f2, v1 = 1, v2 = 1) {
      if (f1 > f2) {
        [f1, f2, v1, v2] = [f2, f1, v2, v1];
      }
      let lambda = 0.24 / (0.021 * Math.min(f1, f2) * 19);
      return 1 - v1 * v2 * (Math.exp(-3.5 * lambda * (f2 - f1)) - Math.exp(-5.75 * lambda * (f2 - f1)));
    }

    let result = {
      frecuencia1: this.clasificarFrecuencia(frecuencia1),
      frecuencia2: this.clasificarFrecuencia(frecuencia2),
      consonanciaHelmotz: helmholtz(frecuencia1, frecuencia2),
      consonanciaPlompt: plomptlevelt(frecuencia1, frecuencia2),
      tono: null,
      descripcion: '',
    };

    let fraction = Math.min(frecuencia1, frecuencia2) / Math.max(frecuencia1, frecuencia2);
    let nombres = [
      'Primera, al unísono',
      'Primera menor aumentada, o segunda (menor) disminuida)',
      'Segunda menor',
      'Segunda menor aumentada, o tercera (menor) disminuida)',
      'Tecera menor',
      'Cuarta menor',
      'Cuarta menor aumentada, o quinta (menor) disminuida',
      'Quinta menor',
      'Quinta menor aumentada, o sexta (menor) disminuida',
      'Sexta menor',
      'Sexta menor aumentada, o séptima (menor) disminuida',
      'Séptima menor',
      'Primera octava',
      'Primera mayor aumentada, o segunda (mayor) disminuida)',
      'Segunda mayor',
      'Segunda mayor aumentada, o tercera (mayor) disminuida)',
      'Tecera mayor',
      'Cuarta mayor',
      'Cuarta mayor aumentada, o quinta (mayor) disminuida',
      'Quinta mayor',
      'Quinta menor aumentada, o sexta (mayor) disminuida',
      'Sexta mayor',
      'Sexta mayor aumentada, o séptima (mayor) disminuida',
      'Séptima mayor'];
    let posicion = 12 * -Math.log2(fraction);
    console.log(`La fracción es ${fraction} y la posición (log 2) es ${posicion} debe dar.`);
    result.descripcion = nombres[Math.round(posicion)];
    /*
      Consonancias perfectas: los intervalos de 4ª, 5ª y 8ª cuando son justas.
      Consonancias imperfectas: los intervalos de 3ª y 6ª cuando son mayores o menores.
      Disonancias absolutas: los intervalos de 2ª y 7ª mayores y menores.
      Disonancias condicionales: todos los intervalos aumentados y disminuidos, excepto la 4ª aumentada y la 5ª disminuida.
      Semiconsonancias: la 4ª aumentada y la 5ª disminuida.
    */
    if (fraction === 1 || fraction === 1 / 2 || fraction === 1 / 4 || fraction === 1 / 5 || fraction === 1 / 6) {
      result.descripcion += ' CONSONANCIA PERFECTA';
    } else if (result.tono === 4 || result.tono === 9 || result.tono === 16 || result.tono === 21) {
      result.descripcion += ' CONSONANCIA IMPERFECTA';
    } else if (result.tono === 2 || result.tono === 11 || result.tono === 14 || result.tono === 23) {
      result.descripcion += ' DISONANCIA ABSOLUTA';
    } else if (result.tono === 6 || result.tono === 8 || result.tono === 18 || result.tono === 20) {
      result.descripcion += ' SEMICONSONANCIA';
    } else {
      result.descripcion += ' DISONANCIA CONDICIONAL';
    }

    // Cómo suenan juntas las dos frecuencias
    result.juntas = this.calculateApparentSound(frecuencia1, frecuencia2);
    result.juntasDescripcion = this.clasificarFrecuencia(result.juntas);


    return result;
  }

  // Old
  // return frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava * Math.pow(2, octava - 1) * Math.pow(2, (tono - 1) / 12);

  // Se toma como base nota La, seis blancas a la derecha del Do central en la octava 4.
  // tono de 0-11, octava 0-11 (El tono 9 de la octava 4 es un La de 440 Hz).
  /**
   * Calcula la frecuencia de una nota musical en función del tono y la octava, tomando como referencia el tono La en 440 Hz
   * @param {number} tono - El tono de la nota (0-11, donde 0 es Do, 1 es Do# o Re♭, 2 es Re, etc.)
   * @param {number} octava - La octava de la nota (0-11, donde 4 es la octava central de un piano)
   * @returns {number} La frecuencia de la nota en Hz
   */
  calculateFrequency(tono = 1, octava = 4) {
    const A4_Freq = 440; // Frecuencia de referencia para el tono La

    // Calibración de la octava
    const octaveFactor = (octave < 4) ? Math.pow(2, 4 - octave) : (1 / Math.pow(2, octave - 4));

    // Cálculo de la frecuencia
    const frequency = A4_Freq * Math.pow(2, (tono - 9) / 12) * octaveFactor;

    return frequency;
  }

  /**
   * Calcula el ancho de banda de un tercio de octava en función de la frecuencia central y la octava
   * @param {number} frequency - La frecuencia central del tercio de octava
   * @param {number} octave - La octava de la frecuencia central
   * @param {function} sonorityFunction - La función de sonoridad para ajustar el ancho de banda (opcional, valor predeterminado = sonoridad_A)
   * @returns {number} El ancho de banda del tercio de octava en Hz
   */
  calculateThirdOctaveBandwidth(frequency, octave, sonorityFunction = this.calculateSonorityAtFrequency) {
    const bandwidthFactor = this.sonorityFunction(frequency) / this.sonorityFunction(1000); // Factor de ajuste de ancho de banda

    let lowerFrequency, upperFrequency; // Frecuencias límite del tercio de octava

    if (octave < 4) {
      lowerFrequency = (frequency / Math.pow(2, 1 / 6)) * Math.pow(2, -1 / 6 * (4 - octave)) * bandwidthFactor;
      upperFrequency = (frequency * Math.pow(2, 1 / 6)) * Math.pow(2, -1 / 6 * (4 - octave)) * bandwidthFactor;
    } else {
      lowerFrequency = (frequency / Math.pow(2, 1 / 6)) * Math.pow(2, 1 / 6 * (octave - 4)) * bandwidthFactor;
      upperFrequency = (frequency * Math.pow(2, 1 / 6)) * Math.pow(2, 1 / 6 * (octave - 4)) * bandwidthFactor;
    }

    const bandwidth = upperFrequency - lowerFrequency;

    return bandwidth;
  }

  /*
       Esta ecuación puede hacerse invariante si tuviese en cuenta la sonoridad
      de las frecuencias, en esos casos, resolviera igual en los armómicos y
      además en las bajas y altas.

  */

  /*
    When the MIDI device sends the message about the note being played, it sends
    the note identifier called the MIDI number. The C4 note has the number 60 and
    for every semitone higher you just add 1 to this number. To shift by an octave
    you just have to add 12.
    To be able to play the proper sound generated by a MIDI key, we need to convert
    the MIDI number to the proper frequency. Fortunately, there’s a quite handy
    equation for such conversion:
   */
  midi_number(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  // ASMR Rose spectrum

  // El número de octavas entre dos frecuencias arbitrarias puede calcularse aproximadamente por
  // Las octavas que se alejan de la zona central del teclado son algo más amplias para compensar la falta de linealidad del oído humano respecto de la percepción de intervalos musicales
  cantidadOctavas(f1 = 20, f2 = 20000) {
    return Math.log(f1 / f2); // de lo que resulta 9.965
  }

  clasificarFrecuencia(f) {
    let result = {frecuencia: f, octava: null, descripcion: 'Sin clasificar'};
    if (f > 1 && f < 16) {
      result.octava = 1;
      result.descripcion = 'Pulsación, imperceptible al oido.';
    } else if (f > 16 && f < 32) {
      result.octava = 1;
      result.descripcion = 'Tono grave, primera octava. (Casi imperceptible).';
    } else if (f >= 32 && f < 64) {
      result.octava = 2;
      result.descripcion = 'Tono grave, segunda octava (zumbido).';
    } else if (f >= 64 && f < 128) {
      result.octava = 3;
      result.descripcion = 'Tono grave medio (bajo).';
    } else if (f >= 128 && f < 256) {
      result.octava = 4;
      result.descripcion = 'Tonos grave medios (alto).';
    } else if (f >= 256 && f < 512) {
      result.octava = 5;
      result.descripcion = 'Tonos armónicos medios (bajos).';
    } else if (f >= 512 && f < 1024) {
      result.octava = 6;
      result.descripcion = 'Tonos armónicos medios (alto).';
    } else if (f >= 1024 && f < 2048) {
      result.octava = 7;
      result.descripcion = 'Tonos armónicos medios.';
      if (f >= 2000) { // 2000-4096
        result.octava = 8;
        result.descripcion = 'Tonos armónicos medios (de máxima sensibilidad).';
      }
    } else if (f >= 2048 && f < 4096) {
      result.octava = 9;
      result.descripcion = 'Tonos armónicos altos (de máxima sensibilidad).';
    } else if (f >= 4096 && f < 8192) {
      result.octava = 10;
      result.descripcion = 'Tonos agudos de altos.';
    } else if (f >= 8192) {
      result.octava = 10;
      result.descripcion = 'Tonos agudos de alta frecuencia (chirrido desagradable, no se utilizan para hacer música).';
      if (f >= 12000) {
        result.octava = 7;
        result.descripcion = 'Tonos agudo de muy alta freceuncia (imperceptible).';
      }
    }
    return result;
  }

  // Pieza para Macro lenguaje: "CDEFGABR" "OL" "<>" (up down octave) "+#" Sostenido "-Bemol"
  // Lo más difícil es programar el instrumento "In" para seleccionar uno, de acuerdo a una tabla
  // de ondas, que debe especificar las intensidades de las frecuencias fundamentales y envolventes.
  // (Ver WaveTable).
  play(channel, tono = 1, octava = 1, frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava = 440) {
    let argumentos = args;
    let canal = argumentos.shift();
    this.sound(this.calculateFrequency(...argumentos), canal);
  }

  // Generador de sonido puro fundamental (suénalo).
  sound(freq, channel = 0, vol = Acustica.channels[channel].oscillator.gain.gain.value) {
    Acustica.channels[channel].oscillator.frequency.value = freq;
    Acustica.channels[channel].oscillator.gain.gain.value = vol;
  }

  // apagar el sonido de un canal
  nosound(channel = 0) {
    Acustica.channels[channel].oscillator.frequency.value = 0;
  }

  // cambiar volumen del canal, probar 0.1 0.5, 0.1
  volume(vol, channel = 0) {
    Acustica.channels[channel].oscillator.gain.gain.value = vol;
  }

  // Test area

  // Es cuestión de apreciación probar todos contra todos del uno al 12 y ordenarlos
  probarAcorde(a, b) {
    this.sound(this.calculateFrequency(a), 0);
    this.sound(this.calculateFrequency(b), 1);
  }

  terminarPrueba() {
    this.sound(0, 0);
    this.sound(0, 1);
  }

  // Lista acordes
  listaAcordes() {
    let doInicial = this.calculateFrequency();
    let resultado = [];
    for (var i = 1; i < 25; i++) {
      resultado.push(this.disonancia(doInicial, this.calculateFrequency(i)));
    }
    return resultado;
  }

  /*   Tradicionalmente se ha utilizado el término grado conjunto para denominar al
    grado inmediatamente anterior o posterior a la nota que se toma como referencia.
    Por lo tanto es sinónimo de intervalo de segunda. Por el contrario, el grado no
    adyacente a la nota que se toma como referencia se ha llamado grado disjunto. */

  static grados = [
    {no: 'I', note: 'C', name: 'Tónica'},
    {no: 'I', note: 'D', name: 'Supertónica'},
    {no: 'II', note: 'E', name: 'Mediante'},
    {no: 'IV', note: 'F', name: 'Subdominante'},
    {no: 'V', note: 'G', name: 'Dominante'},
    {no: 'VI', note: 'A', name: 'Superdominante (submediante)'}, //
    {no: 'VII', note: 'B', name: 'Sensible'},
  ];

  // El acorde o combinación de dos o más notas tiene un efecto psicológico.
  // En este sistema (también hay grados intermedios, se incorporan luego).
  static consonancias = [
    {value: +3 / 3, name: 'Sublime'},
    {value: +2 / 3, name: 'Concerto'},
    {value: +1 / 3, name: 'Pianíssimo'},
    {value: 0 / 3, name: 'Piano'},
    {value: -1 / 3, name: 'Absorto'},
    {value: -2 / 3, name: 'Desconcerto'},
    {value: -3 / 3, name: 'Ridículo'},
  ];

  // Orden de consonancia tónica según la fórmula de Plompt y levelt.
  static #conso = [
    {
      "grado": 1,
      "nombre": "Unísono",
      "nota_anglosajona": "C",
      "relacion_frecuencia": 1
    },
    {
      "grado": 2,
      "nombre": "Octava",
      "nota_anglosajona": "C",
      "relacion_frecuencia": 2
    },
    {
      "grado": 3,
      "nombre": "Quinta justa",
      "nota_anglosajona": "G",
      "relacion_frecuencia": 3/2
    },
    {
      "grado": 4,
      "nombre": "Cuarta justa",
      "nota_anglosajona": "F",
      "relacion_frecuencia": 4/3
    },
    {
      "grado": 5,
      "nombre": "Tercera mayor",
      "nota_anglosajona": "E",
      "relacion_frecuencia": 5/4
    },
    {
      "grado": 6,
      "nombre": "Sexta mayor",
      "nota_anglosajona": "A",
      "relacion_frecuencia": 5/3
    },
    {
      "grado": 7,
      "nombre": "Segunda mayor",
      "nota_anglosajona": "D",
      "relacion_frecuencia": 9/8
    },
    {
      "grado": 8,
      "nombre": "Séptima menor",
      "nota_anglosajona": "B",
      "relacion_frecuencia": 16/15
    },
    {
      "grado": 9,
      "nombre": "Sexta menor",
      "nota_anglosajona": "Ab",
      "relacion_frecuencia": 6/5
    },
    {
      "grado": 10,
      "nombre": "Quinta disminuida",
      "nota_anglosajona": "Gb",
      "relacion_frecuencia": 7/5
    },
    {
      "grado": 11,
      "nombre": "Cuarta aumentada / Quinta disminuida",
      "nota_anglosajona": "F# / Gb",
      "relacion_frecuencia": 25/18
    },
    {
      "grado": 12,
      "nombre": "Tercera menor",
      "nota_anglosajona": "Eb",
      "relacion_frecuencia": 6/5
    },
    {
      "grado": 13,
      "nombre": "Segunda menor",
      "nota_anglosajona": "Db",
      "relacion_frecuencia": 256/225
    },
    {
      "grado": 14,
      "nombre": "Séptima mayor / Octava menor",
      "nota_anglosajona": "Bb",
      "relacion_frecuencia": 15/8
    },
    {
      "grado": 15,
      "nombre": "Sexta mayor / Séptima menor",
      "nota_anglosajona": "A# / Bb",
      "relacion_frecuencia": 27/16
    },
    {
      "grado": 16,
      "nombre": "Quinta mayor",
      "nota_anglosajona": "G",
      "relacion_frecuencia": 3/2
    },
    {
      "grado": 17,
      "nombre": "Cuarta aumentada / Quinta disminuida",
      "nota_anglosajona": "F# / Gb",
      "relacion_frecuencia": 25/18
    },
    {
      "grado": 18,
      "nombre": "Tercera menor",
      "nota_anglosajona": "F",
      "relacion_frecuencia": 16/11
    },
    {
      "grado": 19,
      "nombre": "Segunda menor",
      "nota_anglosajona": "E",
      "relacion_frecuencia": 10/9
    },
    {
      "grado": 20,
      "nombre": "Séptima mayor / Octava menor",
      "nota_anglosajona": "D",
      "relacion_frecuencia": 9/5
    },
    {
      "grado": 21,
      "nombre": "Sexta mayor / Séptima menor",
      "nota_anglosajona": "D# / Eb",
      "relacion_frecuencia": 16/9
    },
    {
      "grado": 22,
      "nombre": "Quinta aumentada / Sexta disminuida",
      "nota_anglosajona": "E# / F",
      "relacion_frecuencia": 45/32
    },
    {
      "grado": 23,
      "nombre": "Cuarta aumentada",
      "nota_anglosajona": "F#",
      "relacion_frecuencia": 64/45
    },
    {
      "grado": 24,
      "nombre": "Tritono",
      "nota_anglosajona": "G# / Ab",
      "relacion_frecuencia": 729/512
    }
  ]



  /* Acordes

  Cada grado de una escala o acorde recibe tradicionalmente los siguientes nombres.[2]

    I Tónica
    II Supertónica
    III Mediante
    IV Subdominante
    V Dominante
    VI Superdominante o submediante
    VII Sensible (en la escala diatónica mayor) o subtónica (en la diatónica menor)

    Valores de consonancia armónica para los acordes que se forman con los 24 tonos comprendidos por dos octavas consecutivas de la escala cromática.
    (disonante < 0, irrelevante = 0 y consonante > 0)

    Aquí les muestro las relaciones de las notas con respecto al do (entonces debería llamarse: "tónica", soy matemático no músico).

    May you reorder or complete complete this for me please? Consonance tonic order (sin mucho vino por favor).

                                            Tonos enteros               | Tonos semienteros               | Tonos enteros                  | Tonos semienteros
     Valor          Nombre                  Menores Nota                | Menores  Nota                   | Mayores   Nota                 | Mayores  Nota
   + 3/3 = + 1      Consonancia perfecta    8 G     SOL (quinta menor)  |                                 |  18 F     FA  (cuarta mayor)   |
   + 2/3 = + 0.(6)  Consonancia imperfecta  6 F     FA  (cuarta menor)  |                                 |  20 G     SOL (quinta mayor)   |
   + 1/3 = + 0.(3)  Semi consonancia        3 E     MI  (tercera menor) |                                 |  22 A     LA  (sexta mayor)    |
     0/3 =   0      Insípido                1 C     DO  (al unísono)    |  5  F#    FA  (4t aum o 5ta dis)|  13 C     DO  (octava)         |
   - 1/3 = - 0.(3)  Semi disonancia        10 A     LA  (sexta menor)   |                                 |  17 E     MI  (tercera mayor)  |
   - 2/3 = - 0.(6)  Disonancia suave       12 B     SI  (séptima menor) | 11  A#    SI  (bemol)           |  15 D     RE  (segunda mayor)  |
   - 3/3 = - 1      Disonancia fuerte       2 D     RE  (segunda menor) |                                 |  24 B     SI  (séptima mayor)  |

  let arreglar = [
    {no: 1, code: 'C', name: 'Primera al unísono', acorde: 'Insípido'},
    {no: 2, code: 'C#', name: '', acorde: ''},
    {no: 3, code: 'D', name: 'Segunda menor', acorde: 'Disonancia fuerte'},
    {no: 4, code: 'D#', name: '', acorde: ''},
    {no: 5, code: 'E', name: 'Tercera menor', acorde: 'Consonancia imperfecta'},
    {no: 6, code: 'F', name: 'Cuarta menor', acorde: 'Semi consonancia'},
    {no: 7, code: 'F#', name: '', acorde: ''},
    {no: 8, code: 'G', name: 'Quinta menor', acorde: 'Consonancia perfecta'},
    {no: 9, code: 'G#', name: '', acorde: ''},
    {no: 10, code: 'A', name: 'Sexta menor', acorde: 'Semi disonancia'},
    {no: 11, code: 'A#', name: '', acorde: ''},
    {no: 12, code: 'B',  name: 'Séptima menor', acorde: 'Disonancia suave'},

    {no: 13, code: 'C', name: 'Primera octava', acorde: 'Insípido'},
    {no: 14, code: 'C#', name: '', acorde: ''},
    {no: 15, code: 'D', name: 'Segunda mayor', acorde: ''},
    {no: 16, code: 'D#', name: '', acorde: ''},
    {no: 17, code: 'E', name: 'Tercera mayor', acorde: 'Semi disonancia'},
    {no: 18, code: 'F', name: 'Cuarta menor', acorde: ''},
    {no: 19, code: 'F#', name: '', acorde: ''},
    {no: 20, code: 'G', name: 'Quinta mayor', acorde: ''},
    {no: 21, code: 'G#', name: '', acorde: ''},
    {no: 22, code: 'A', name: 'Sexta mayor', acorde: ''},
    {no: 23, code: 'A#', name: '', acorde: 'Disonancia fuerte'},
    {no: 24, code: 'B', name: 'Séptima mayor', acorde: 'Disonancia fuerte'}];

}

     */


}

