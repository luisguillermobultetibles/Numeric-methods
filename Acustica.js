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

  // Plompt y Levelt, versión conmutativa.
  disonancia(f1, f2, v1 = 1, v2 = 1) {
    if (f1 > f2) {
      [f1, f2, v1, v2] = [f2, f1, v2, v1];
    }
    let lambda = 0.24 / (0.021 * Math.min(f1, f2) * 19);
    return v1 * v2 * (Math.exp(-3.5 * lambda * (f2 - f1)) - Math.exp(-5.75 * lambda * (f2 - f1)));
  }

  disonancia1(f1, f2) {
    /*
      Existe un criterio de disonancia que las clasifica teniendo en cuenta la diferencia (Δf) absoluta entre las mismas
      (Δf = |f2 - f1|) y pudiese expresarse por la función:
      CH ( f1, f2 ) = COS((f1 - f2)π/80) 	(en la ecuación se divide por 80 Hz, no 180°)
      Que se obtiene a partir de la observación de Helmholtz: (una diferencia aprox. entre 30 y 130 ya suena disonante),
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

  // Clasifica un par de frecuencias puras (terminar, pueden tener proporciones consonantes en clasificaciones disonantes).
  // Análiiss armónico simple
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


    // Cómo suenan juntas las dos frecuencias (OJO LAMER QUE ES LA ARMÓNICA NO EL PROMEDIO...)
    result.juntas = (frecuencia1 * frecuencia2) / (frecuencia1 + frecuencia2);
    result.juntasDescripcion = this.clasificarFrecuencia(result.juntas);


    return result;
  }

  // Old
  // return frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava * Math.pow(2, octava - 1) * Math.pow(2, (tono - 1) / 12);

  // Se toma como base nota La, seis blancas a la derecha del Do central en la octava 4.
  // tono de 0-11, octava 0-11 (El tono 9 de la octava 4 es un La de 440 Hz).
  frecuencia(tono = 1, octava = 4) {
    const LA4_Freq = 440;
    return LA4_Freq * Math.pow(2, octava - 4) * Math.pow(2, (tono - 9) / 12);
  }

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
    this.sound(this.frecuencia(...argumentos), canal);
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
    this.sound(this.frecuencia(a), 0);
    this.sound(this.frecuencia(b), 1);
  }

  terminarPrueba() {
    this.sound(0, 0);
    this.sound(0, 1);
  }

  // Lista acordes
  listaAcordes() {
    let doInicial = this.frecuencia();
    let resultado = [];
    for (var i = 1; i < 25; i++) {
      resultado.push(this.disonancia(doInicial, this.frecuencia(i)));
    }
    return resultado;
  }

}

