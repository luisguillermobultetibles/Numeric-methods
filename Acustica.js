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

  toneFreq(tono = 1, octava = 1, frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava = 440) {
    return frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava * Math.pow(2, octava - 1) * Math.pow(2, (tono - 1) / 12);
  }

  // Pieza para Macro lenguaje: "CDEFGABR" "OL" "<>" (up down octave) "+#" Sostenido "-Bemol"
  play(channel, tono = 1, octava = 1, frecuencia_LA_POR_ENCIMA_DEL_DO_CENTRAL_primera_octava = 440) {
    let argumentos = args;
    let canal = argumentos.shift();
    this.sound(this.toneFreq(...argumentos), canal);
  }

  // Generador de sonido (suénalo)
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
    this.sound(frecuencia(a), 0);
    this.sound(frecuencia(b), 1);
  }

  terminarPrueba() {
    this.sound(0, 0);
    this.sound(0, 1);
  }

  // Lista acordes
  listaAcordes() {
    let doInicial = this.toneFreq();
    let resultado = [];
    for (var i = 1; i < 25; i++) {
      resultado.push(disonancia(doInicial, frecuencia(i)));
    }
    return resultado;
  }

}

