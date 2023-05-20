export class Recorder {
  constructor(options = {}) {
    // Opciones por defecto
    const defaultOptions = {
      numChannels: 1, // Mono por defecto
      sampleRate: 44100,
      bufferSize: 4096,
      playbackRate: 1,
      channels: [0], // Grabar desde el canal izquierdo por defecto
      duration: null, // Grabar hasta que se llame al método stop() por defecto
      ondata: null, // Callback para recibir los datos grabados
    };

    this.options = {...defaultOptions, ...options};

    this.audioContext = new AudioContext();
    this.recording = false;
    this.audioData = {};
  }

  async start() {
    try {
      // Pedir permiso para acceder al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});

      // Crear un nodo de fuente de audio a partir del micrófono
      const sourceNode = this.audioContext.createMediaStreamSource(stream);

      // Crear unnodo de grabación de audio
      const recorderNode = this.audioContext.createScriptProcessor(this.options.bufferSize, this.options.numChannels, this.options.numChannels);

      // Configurar el nodo de grabación
      recorderNode.onaudioprocess = (event) => {
        const channelData = [];
        for (let i = 0; i < this.options.numChannels; i++) {
          const channel = this.options.channels[i];
          channelData.push(event.inputBuffer.getChannelData(channel));
        }
        this.audioData.left.push(...channelData[0]);
        if (this.options.numChannels === 2) {
          this.audioData.right.push(...channelData[1]);
        }
        if (typeof this.options.ondata === 'function') {
          this.options.ondata(channelData);
        }
        if (this.options.duration !== null && this.audioContext.currentTime >= this.options.duration) {
          this.stop();
        }
      };

      // Conectar los nodos de fuente y grabación
      sourceNode.connect(recorderNode);
      recorderNode.connect(this.audioContext.destination);

      // Iniciar la grabación
      this.recording = true;
      this.audioData.left = [];
      if (this.options.numChannels === 2) {
        this.audioData.right = [];
      }
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
    }
  }

  stop() {
    this.recording = false;
    this.audioContext.close();
  }

  play() {
    const duration = Math.max(this.audioData.left.length, this.audioData.right?.length ?? 0) / this.options.sampleRate;
    const audioBuffer = this.audioContext.createBuffer(this.options.numChannels, duration * this.options.sampleRate, this.options.sampleRate);
    const channelDataLeft = audioBuffer.getChannelData(0);
    const channelDataRight = this.options.numChannels === 2 ? audioBuffer.getChannelData(1) : null;

    for (let i = 0; i < channelDataLeft.length; i++) {
      const index = Math.floor(i / this.options.playbackRate);
      channelDataLeft[i] = this.audioData.left[index] ?? 0;
      if (this.options.numChannels === 2) {
        channelDataRight[i] = this.audioData.right[index] ?? 0;
      }
    }

    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.audioContext.destination);
    sourceNode.start();
  }

  getAudioData() {
    return this.audioData;
  }

  unitaryTest() {
    const sampler = new Recorder({
      numChannels: 2, // Grabar en estéreo
      sampleRate: 48000,
      bufferSize: 2048,
      playbackRate: 1.5,
      channels: [0, 1], // Grabar desde los canales izquierdo y derecho
      duration: 10, // Grabar durante 10 segundos
      ondata: (channelData) => {
        // Hacer algo con los datos grabados (opcional)
        console.log('Datos grabados:', channelData);
      },
    });

    sampler.start();

    setTimeout(() => {
      sampler.stop();
      sampler.play();
    }, 10000); // Detener la grabación y reproducir el audio después de 10 segundos
  }
}

export class AMModernReceiver {
  /*
      ¿Cómo decodificar una señal AM tomando solamente un segmento de la señal S
      recibida (suponiéndola en un arreglo) a una frecuencia inferior dada F,
      determina la longitud de la muestra? por favor implementa una clase en
      oop js sin dependencias.
      Para decodificar una señal AM, primero es necesario demodular la señal
      para recuperar la señal de audio original. La demodulación se puede hacer
      utilizando un detector de envolvente, que extrae la envolvente de la señal
      modulada y la convierte en la señal de audio original.
      Para implementar esta funcionalidad en una clase en JavaScript, podemos
      crear una clase llamada "AMReceiver" con los siguientes métodos:

  */

  constructor(sampleRate) {
    this.sampleRate = sampleRate;
  }

  demodulate(signal, frequency) {
    const carrier = this.generateCarrier(frequency, signal.length);
    const envelope = this.extractEnvelope(signal, carrier);
    const audio = this.lowPassFilter(envelope, frequency);
    return audio;
  }

  generateCarrier(frequency, length) {
    const carrier = new Float32Array(length);
    const period = this.sampleRate / frequency;
    for (let i = 0; i < length; i++) {
      carrier[i] = Math.sin(2 * Math.PI * (i / period));
    }
    return carrier;
  }

  extractEnvelope(signal, carrier) {
    const envelope = new Float32Array(signal.length);
    for (let i = 0; i < signal.length; i++) {
      envelope[i] = Math.abs(signal[i] * carrier[i]);
    }
    return envelope;
  }

  lowPassFilter(signal, cutoffFrequency) {
    const alpha = 2 * Math.PI * cutoffFrequency / this.sampleRate;
    const a = 1 - Math.exp(-alpha);
    const filtered = new Float32Array(signal.length);
    let prev = 0;
    for (let i = 0; i < signal.length; i++) {
      filtered[i] = prev + a * (signal[i] - prev);
      prev = filtered[i];
    }
    return filtered;
  }

  /*
    La clase AMReceiver tiene un constructor que toma la tasa de muestreo como
    parámetro y tres métodos: demodulate(), generateCarrier() y
    extractEnvelope(), y lowPassFilter().
    El método generateCarrier() genera la señal de la portadora sinusoidal con
    la frecuencia dada utilizando una función sinusoidal.
    El método extractEnvelope() extrae la envolvente de la señal modulada
    multiplicándola por la señal de la portadora y luego tomando
    el valor absoluto. El método lowPassFilter() aplica un filtro de paso
    bajo a la señal de audio para eliminar cualquier frecuencia por encima de
    la frecuencia de corte. El método demodulate() utiliza los tres métodos
    anteriores para demodular la señal y devolver la señal de audio original.
    Para determinar la longitud de la muestra, se puede utilizar lafórmula:
  */
  sampleLength() {
    return Math.round(sampleRate / frequency);
  }

  /*
    donde "sampleRate" es la tasa de muestreo de la señal y "frequency" es
    la frecuencia de la portadora. Esto da la longitud de la muestra necesaria
    para capturar un ciclo completo de la señal de la portadora.
    A continuación, se muestra un ejemplo de cómo se puede utilizar
    la clase AMReceiver para demodular una señal AM:
  */
  unitaryTest() {
    // Crear un objeto AMReceiver con una tasa de muestreo de 44100 Hz
    const receiver = new AMReceiver(44100);

    // Supongamos que tenemos una señal AM en un arreglo llamado "signal"
    const signal = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

    // Determinar la longitud de la muestra
    const frequency = 1000; // Frecuencia de la portadora en Hz
    const length = Math.round(receiver.sampleRate / frequency);

    // Tomar un segmento de la señal de// longitud "length" a partir del índice 0
    const segment = signal.slice(0, length);

    // Demodular el segmento de la señal
    const audio = receiver.demodulate(segment, frequency);

    // El arreglo "audio" ahora contiene la señal de audio original
    console.log(audio);
  }

  /*
      En este ejemplo, se crea un objeto AMReceiver con una tasa de muestreo de
      44100 Hz y se define una señal AM de ejemplo en un arreglo
      llamado "signal". Luego, se determina la longitud de la muestra utilizando
      la fórmula mencionada anteriormente y se toma un segmento de la señal de
      esa longitud. Finalmente, se demodula el segmento de la señal utilizando
      el método demodulate() del objeto AMReceiver y se devuelve la señal de
      audio original en el arreglo "audio".
   */
}

export class AMTransmitter {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
  }

  modulate(audio, frequency, type) {
    const carrier = this.generateCarrier(frequency, audio.length);
    const modulated = new Float32Array(audio.length);
    for (let i = 0; i < audio.length; i++) {
      if (type === 'AM') {
        modulated[i] = audio[i] * carrier[i];
      } else if (type === 'BLU') {
        modulated[i] = (1 + audio[i]) * carrier[i];
      } else {
        throw new Error('Unsupported modulation type');
      }
    }
    return modulated;
  }

  generateCarrier(frequency, length) {
    const carrier = new Float32Array(length);
    const period = this.sampleRate / frequency;
    for (let i = 0; i < length; i++) {
      carrier[i] = Math.sin(2 * Math.PI * (i / period));
    }
    return carrier;
  }

  /*
    La clase AMTransmitter tiene un constructor que toma la tasa de muestreo
    como parámetro y un método modulate() que toma la señal de audio, la
    frecuencia de la portadora y el tipo de modulación (AM o BLU) como
    parámetros. El método generateCarrier() genera la señal de la portadora
    sinusoidal utilizando una función sinusoidal.
    En el método modulate(), se utiliza la señal de audio y la señal de la
    portadora para generar la señal modulada. Para la modulación AM, se
    multiplica la señal de audio por la señal de la portadora. Para la
    modulación BLU, se suma 1 a la señal de audio antes de multiplicarla por la
    señal de la portadora. La señal modulada se almacena en un nuevo arreglo y
    se devuelve.
    A continuación, se muestra un ejemplo de cómo se puede utilizar la clase
    AMTransmitter para modular una señal de audio a AM o BLU:
  * */
  unitaryTest() {
    // Crear un objeto AMTransmitter con una tasa de muestreo de 44100 Hz
    const transmitter = new AMTransmitter(44100);

    // Supongamos que tenemos una señal de audio en un arreglo llamado "audio"
    const audio = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

    // Definimos la frecuencia de la portadora y el tipo de modulación (AM o BLU)
    const frequency = 1000; // Frecuencia de la portadora en Hz
    const modulationType = 'AM';

    // Modulamos la señal de audio
    const modulated = transmitter.modulate(audio, frequency, modulationType);

    // El arreglo "modulated" ahora contiene la señal modulada en AM
    console.log(modulated);
  }

  /*
    En este ejemplo, se crea un objeto AMTransmitter con una tasa de muestreo de 44100 Hz yuna señal de audio de ejemplo en un arreglo llamado "audio". Luego, se define la frecuencia de la portadora y el tipo de modulación (AM o BLU). Finalmente, se modula la señal de audio utilizando el método modulate() del objeto AMTransmitter y se devuelve la señal modulada en un nuevo arreglo llamado "modulated".
    Para modificar el tipo de modulación a BLU, simplemente cambia la variable "modulationType" a "BLU" en el ejemplo anterior.
  */
}



