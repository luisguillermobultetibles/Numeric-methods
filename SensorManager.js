// (c) Pipo
class CustomSensor {
  constructor() {
    this.listeners = [];
    this.isRunning = false;
  }

  attachEventListener(listener) {
    this.listeners.push(listener);
  }

  notifyListeners(data) {
    this.listeners.forEach((listener) => {
      listener(data);
    });
  }

  start() {
    throw new Error('start method not implemented');
  }

  stop() {
    throw new Error('stop method not implemented');
  }

  // deprecated
  attachEventToDOM(eventType, target, handler, useCapture) {
    if (target.addEventListener) {
      target.addEventListener(eventType, handler, useCapture);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, handler);
    } else {
      target['on' + eventType] = handler;
    }
  }

  // Comienza la medición del sensor
  start() {
    // Aquí iría la lógica para comenzar la medición del sensor
    this.isRunning = true;
  }

  // Detiene la medición del sensor
  stop() {
    // Aquí iría la lógica para detener la medición del sensor
    this.isRunning = false;
  }

  // Registra un listener para el evento onDataChanged
  addListener(listener) {
    this.listeners.push(listener);
  }

  // Elimina un listener para el evento onDataChanged
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);

    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notifica a los listeners que los datos del sensor han cambiado
  notifyListeners(data) {
    for (const listener of this.listeners) {
      listener(data);
    }
  }
}

class LightSensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'ambient-light';
    this.ambientLightValue = null;
    this._beforeAmbientLightValue = -1;
    this.data = {};
    this._deviceLightHandler = this._deviceLightHandler.bind(this);
  }

  _deviceLightHandler(event) {
    if (this.isRunning) {
      this.ambientLightValue = event.value; // in lux.
      console.log(`Cambio en la intensidad de la luz ambiental a ${this.ambientLightValue} lux.`);
      if (this._beforeAmbientLightValue !== -1 && this._beforeAmbientLightValue !== this.ambientLightValue) {
        if (this._beforeAmbientLightValue > this.ambientLightValue) {
          console.log(`La luz ambiental está oscureciéndose en ${this._beforeAmbientLightValue - this.ambientLightValue} lux.`);
        } else {
          console.log(`La luz ambiental está aclarándose en ${this.ambientLightValue - this._beforeAmbientLightValue} lux.`);
        }
      }
      this._beforeAmbientLightValue = this.ambientLightValue;
      this.data = {value: this.ambientLightValue, unit: 'lux'};
      this.notifyListeners(this.data);
    }
  }

  start() {
    this.isRunning = true;
    window.addEventListener('devicelight', this._deviceLightHandler);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('devicelight', this._deviceLightHandler);
  }
}


class FingerprintSensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'fingerprint';
    this.data = {};
    this._onSuccess = this._onSuccess.bind(this);
    this._onError = this._onError.bind(this);
  }

  _onSuccess(data) {
    if (this.isRunning) {
      console.log('Huella digital autenticada exitosamente.');
      this.data = {result: 'success', data: data};
      this.notifyListeners(this.data);
    }
  }

  _onError(error) {
    if (this.isRunning) {
      console.log('Error al autenticar la huella digital:', error);
      this.data = {result: 'error', error: error};
      this.notifyListeners(this.data);
    }
  }

  start() {
    this.isRunning = true;
    if (window.PublicKeyCredential) {
      navigator.credentials.get({publicKey: {}})
        .then((data) => {
          this._onSuccess(data);
        })
        .catch((error) => {
          this._onError(error);
        });
    } else {
      console.log('La API de autenticación web no está disponible en este navegador.');
    }
  }

  stop() {
    this.isRunning = false;
  }
}

class TemperatureSensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'ambient-temperature';
    this.temperature = null;
  }

  _temperatureHandler = (event) => {
    if (this.isRunning) {
      this.temperature = event.value;
      console.log(`Cambio en la temperatura, temperatura = ${event.value} C°`);
      this.notifyListeners({value: this.temperature, unit: 'C°'});
    }
  };

  start() {
    this.isRunning = true;
    window.addEventListener('ambienttemperature', this._temperatureHandler);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('ambienttemperature', this._temperatureHandler);
  }
}

class HumiditySensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'ambient-humidity';
    this.relativeHumidity = null;
  }

  _humidityHandler = (event) => {
    if (this.isRunning) {
      this.relativeHumidity = event.value;
      console.log(`Cambio en la humedad relativa, ahora es del ${this.relativeHumidity} %.`);
      this.notifyListeners({value: this.relativeHumidity, unit: '%'});
    }
  };

  start() {
    this.isRunning = true;
    window.addEventListener('ambienthumidity', this._humidityHandler);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('ambienthumidity', this._humidityHandler);
  }
}

class ProximitySensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'deviceproximity';
    this.proximityDistance = null;
  }

  _deviceProximityHandler = (event) => {
    if (this.isRunning) {
      this.proximityDistance = event.value;
      console.log(`Se detecta proximidad entre ${event.near ? event.near : event.min} y ${event.max}.`);
      this.notifyListeners({value: this.proximityDistance, unit: 'cm'});
    }
  };

  start() {
    this.isRunning = true;
    window.addEventListener('deviceproximity', this._deviceProximityHandler);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('deviceproximity', this._deviceProximityHandler);
  }
}

class AtmosphericPressureSensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'AmbientAtmosphericPressure';
    this.atmosphericPressure = null;
  }

  _atmosphericPressureHandler = (event) => {
    if (this.isRunning) {
      this.atmosphericPressure = event.value;
      console.log(`Cambio en la presión atmosférica, ahora es de ${this.atmosphericPressure} kP.`);
      this.notifyListeners({value: this.atmosphericPressure, unit: 'kP'});
    }
  };

  start() {
    this.isRunning = true;
    window.addEventListener('ambientpressure', this._atmosphericPressureHandler);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('ambientpressure', this._atmosphericPressureHandler);
  }
}

class BatterySensor extends CustomSensor {
  constructor() {
    super();
    this.sensorType = 'battery';
    this.batteryLevel = null;
  }

  _batteryHandler = (event) => {
    if (this.isRunning) {
      this.batteryLevel = event.value;
      console.log(`Cambio en el nivel de batería, ahora es del ${this.batteryLevel}%.`);
      this.notifyListeners({value: this.batteryLevel, unit: '%'});
    }
  };

  start() {
    this.isRunning = true;
    navigator.getBattery().then((battery) => {
      this.batteryLevel = battery.level * 100;
      battery.addEventListener('levelchange', this._batteryHandler);
    });
  }

  stop() {
    this.isRunning = false;
    navigator.getBattery().then((battery) => {
      battery.removeEventListener('levelchange', this._batteryHandler);
    });
  }
}

class OrientationSensor extends CustomSensor {
  constructor(latitude, hourAngle) {
    super();

    if ('AbsoluteOrientationSensor' in window) {
      this.sensor = new AbsoluteOrientationSensor({frequency: 60});
      this.sensor.addListener(this._handleSensorReading.bind(this));
      this.sensor.start();
    } else {
      throw new Error('AbsoluteOrientationSensor not supported');
    }

    window.addEventListener('orientationchange', this._handleScreenOrientationChange.bind(this));
    window.addEventListener('deviceorientation', this._handleSensorReading.bind(this), true);
    window.addEventListener('deviceorientationabsolute', this._handleSensorReading.bind(this), true);

    this.deviceOrientation = {
      alpha: 0,
      beta: 0,
      gamma: 0,
      azimuth: 0,
      altitude: 0,
      direction: '',
      screenOrientation: '',
    };
  }

  start(onReading, onError) {
    this.onReading = onReading;
    this.onError = onError;
    super.start();
  }

  stop() {
    this.onReading = null;
    this.onError = null;
    super.stop();
  }

  _handleScreenOrientationChange() {
    switch (window.orientation) {
      case 0:
        this.deviceOrientation.screenOrientation = 'Portrait';
        break;
      case 180:
        this.deviceOrientation.screenOrientation = 'Portrait upside down';
        break;
      case 90:
        this.deviceOrientation.screenOrientation = 'Landscape left';
        break;
      case -90:
        this.deviceOrientation.screenOrientation = 'Landscape right';
        break;
      default:
        this.deviceOrientation.screenOrientation = 'unknown';
    }
  }

  // Métodos para trabajar con cuaterniones

  // crear un cuaternión a partir de un vector de ángulos de Euler
  static eulerToQuaternion(alpha, beta, gamma) {
    const cq = Math.cos(gamma / 2);
    const sq = Math.sin(gamma / 2);
    const cp = Math.cos(beta / 2);
    const sp = Math.sin(beta / 2);
    const cr = Math.cos(alpha / 2);
    const sr = Math.sin(alpha / 2);
    const q = new Float32Array(4);
    q[0] = cr * sp * cq - sr * cp * sq;
    q[1] = cr * cp * sq + sr * sp * cq;
    q[2] = sr * cp * cq - cr * sp * sq;
    q[3] = cr * cp * cq + sr * sp * sq;
    return q;
  }

  // crear un cuaternión a partir de un eje de rotación y un ángulo
  static axisAngleToQuaternion(axis, angle) {
    const axisNorm = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
    const axisUnit = [axis[0] / axisNorm, axis[1] / axisNorm, axis[2] / axisNorm];
    const q = newFloat32Array(4);
    const halfAngle = angle / 2;
    const sinHalfAngle = Math.sin(halfAngle);
    q[0] = Math.cos(halfAngle);
    q[1] = axisUnit[0] * sinHalfAngle;
    q[2] = axisUnit[1] * sinHalfAngle;
    q[3] = axisUnit[2] * sinHalfAngle;
    return q;
  }

  // multiplicación de cuaterniones
  static quaternionMultiply(q1, q2) {
    const w1 = q1[0];
    const x1 = q1[1];
    const y1 = q1[2];
    const z1 = q1[3];
    const w2 = q2[0];
    const x2 = q2[1];
    const y2 = q2[2];
    const z2 = q2[3];
    const q = new Float32Array(4);
    q[0] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    q[1] = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
    q[2] = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
    q[3] = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
    return q;
  }

  // inverso de un cuaternión
  static quaternionInverse(q) {
    const w = q[0];
    const x = q[1];
    const y = q[2];
    const z = q[3];
    const mag2 = w * w + x * x + y * y + z * z;
    const qInv = new Float32Array(4);
    qInv[0] = w / mag2;
    qInv[1] = -x / mag2;
    qInv[2] = -y / mag2;
    qInv[3] = -z / mag2;
    return qInv;
  }

  // convertir ángulos de Euler a cuaternión (convención ZYZ)
  static eulerZyzToQuaternion(alpha, beta, gamma) {
    const c1 = Math.cos(alpha / 2);
    const s1 = Math.sin(alpha / 2);
    const c2 = Math.cos(beta / 2);
    const s2 = Math.sin(beta / 2);
    const c3 = Math.cos(gamma / 2);
    const s3 = Math.sin(gamma / 2);
    const q = new Float32Array(4);
    q[0] = c1 * c2 * c3 - s1 * s2 * s3;
    q[1] = s1 * s2 * c3 + c1 * c2 * s3;
    q[2] = s1 * c2 * c3 + c1 * s2 * s3;
    q[3] = c1 * c2 * s3 - s1 * s2 * c3;
    return q;
  }

  // convertir ángulos de Euler a cuaternión (convención XYZ)
  static eulerXyzToQuaternion(alpha, beta, gamma) {
    const cq = Math.cos(gamma / 2);
    const sq = Math.sin(gamma / 2);
    const cp = Math.cos(beta / 2);
    const sp = Math.sin(beta / 2);
    const cr = Math.cos(alpha / 2);
    const sr = Math.sin(alpha / 2);
    const q = new Float32Array(4);
    q[0] = cr * sp * cq + sr * cp * sq;
    q[1] = sr * cp * cq - cr * sp * sq;
    q[2] = cr * cp * sq + sr * sp * cq;
    q[3] = cr * cp * cq - sr * sp * sq;
    return q;
  }

  // convertir cuaternión a ángulos de Euler (convención ZYZ)
  static quaternionToEulerZyz(q) {
    const w = q[0];
    const x = q[1];
    const y = q[2];
    const z = q[3];
    const alpha = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
    const beta = Math.acos(1 - 2 * (x * x + z * z));
    const gamma = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
    return [alpha, beta, gamma];
  }

  // convertir cuaternión a ángulos de Euler (convención XYZ)
  static quaternionToEulerXyz(q) {
    const w = q[0];
    const x = q[1];
    const y = q[2];
    const z = q[3];
    const alpha = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
    const beta = Math.asin(2 * (w * y - z * x));
    const gamma = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
    return [alpha, beta, gamma];
  }


  _handleSensorReading() {
    /*
        // manipulador clásico

        // obtener cuaternión y ángulos de Euler en convención ZXY
        var q = this.sensor.quaternion;
        var euler = this.sensor.euler;

        // imprimir los valores
        console.log('Quaternion:', q);
        console.log('Euler angles (ZXY):', euler);

        // convertir cuaternión a ángulos de Euler en convención XYZ
        var xyzEuler = OrientationSensor.quaternionToEulerXyz(q);
        console.log('Euler angles (XYZ):', xyzEuler);
    */


    let {
      northAngle,
      zenithAngle,
    } = this.getAxisAngles(this.sensor.quaternionToEuler().y * 180 / Math.PI, this.sensor.quaternionToEuler().x * 180 / Math.PI);

    const alpha = this.sensor.quaternion[3] * 180 / Math.PI;
    const beta = this.sensor.quaternion[1] * 180 / Math.PI;
    const gamma = this.sensor.quaternion[2] * 180 / Math.PI;

    if (northAngle < 0) {
      northAngle += 360;
    }
    if (zenithAngle < 0) {
      zenithAngle += 360;
    }

    const azimuth = this.calculateAzimuth(alpha, northAngle, this.deviceOrientation.screenOrientation)[0];
    const altitude = this.calculateAltitude(zenithAngle, this.deviceOrientation.screenOrientation);

    this.deviceOrientation.alpha = alpha;
    this.deviceOrientation.beta = beta;
    this.deviceOrientation.gamma = gamma;
    this.deviceOrientation.azimuth = azimuth;
    this.deviceOrientation.altitude = altitude;

    if (this.onReading) {
      this.onReading(this.deviceOrientation);
    }
  }

  getAxisAngles(pitch, roll) {
    let northAngle = 0;
    let zenithAngle = 0;

    switch (window.orientation) {
      case 0:
        northAngle = roll;
        zenithAngle = -pitch;
        break;
      case 180:
        northAngle = roll;
        zenithAngle = pitch;
        break;
      case 90:
        northAngle = pitch;
        zenithAngle = roll;
        break;
      case -90:
        northAngle = -pitch;
        zenithAngle = -roll;
        break;
    }

    return {
      northAngle: northAngle,
      zenithAngle: zenithAngle,
    };
  }

  calculateAzimuth(alpha, northAngle, screenOrientation) {
    let azimuth = 0;

    switch (screenOrientation) {
      case 'Portrait':
        azimuth = northAngle - alpha;
        break;
      case 'Portrait upside down':
        azimuth = northAngle - alpha + 180;
        break;
      case 'Landscape right':
        azimuth = northAngle - alpha + 90;
        break;
      case 'Landscape left':
        azimuth = northAngle - alpha - 90;
        break;
    }

    if (azimuth < 0) {
      azimuth += 360;
    }

    // Calcula la dirección a partir del ángulo de azimut
    let direction = '';
    if (azimuth >= 22.5 && azimuth < 67.5) {
      direction = 'Noreste';
    } else if (azimuth >= 67.5 && azimuth < 112.5) {
      direction = 'Este';
    } else if (azimuth >= 112.5 && azimuth < 157.5) {
      direction = 'Sureste';
    } else if (azimuth >= 157.5 && azimuth < 202.5) {
      direction = 'Sur';
    } else if (azimuth >= 202.5 && azimuth < 247.5) {
      direction = 'Suroeste';
    } else if (azimuth >= 247.5 && azimuth < 292.5) {
      direction = 'Oeste';
    } else if (azimuth >= 292.5 && azimuth < 337.5) {
      direction = 'Noroeste';
    } else {
      direction = 'Norte';
    }

    return {azimuth, direction};
  }

  calculateAltitude(zenithAngle, screenOrientation) {
    let altitude = 0;

    switch (screenOrientation) {
      case 'Portrait':
        altitude = zenithAngle;
        break;
      case 'Portrait upside down':
        altitude = -zenithAngle;
        break;
      case 'Landscape right':
        altitude = -90 - zenithAngle;
        break;
      case 'Landscape left':
        altitude = 90 - zenithAngle;
        break;
    }

    return altitude;
  }

  destroy() {
    this.sensor.destroy();
    window.removeEventListener('orientationchange', this._handleScreenOrientationChange.bind(this));
    window.removeEventListener('deviceorientation', this._handleSensorReading.bind(this), true);
    window.removeEventListener('deviceorientationabsolute', this._handleSensorReading.bind(this), true);
  }
}

class CompassSensor extends CustomSensor {
  constructor(options) {
    super();
    if (!options) {
      options = {};
    }

    this._frequency = options.frequency || 60;
    this._heading = null;

    if (typeof DeviceOrientationEvent !== 'undefined') {
      this._deviceOrientationListener = this._handleDeviceOrientation.bind(this);
      window.addEventListener('deviceorientation', this._deviceOrientationListener);
    } else {
      throw new Error('DeviceOrientation API not supported');
    }

    // Y aquí para error de la brújula aunque, resuelve con deviceorientation
    window.addEventListener('compassneedscalibration', () => {
      throw new Error('Compass needs calibration! Wave your device in a figure-eight motion !?');
    }, true);
  }

  get heading() {
    return this._heading;
  }

  start() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this._updateHeading();
      }, 1000 / this._frequency);
    }
  }

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _handleDeviceOrientation(event) {
    if (event.webkitCompassHeading && !this._heading) {
      this._heading = event.webkitCompassHeading;
    }
  }

  _updateHeading() {
    if (this._heading !== null) {
      this.notifyListeners(this._heading);
    }
  }

  destroy() {
    this.stop();

    window.removeEventListener('deviceorientation', this._deviceOrientationListener);

    this._heading = null;
  }
}

class MotionSensor extends CustomSensor {
  constructor() {
    super();
    this.data = {};
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
    this.lastUpdate = null;
    this.threshold = 10; // umbral de aceleración para detectar una caída
    this.impactThreshold = 50; // umbral de impacto para detectar el impacto con el suelo
    this.impactDurationThreshold = 500; // duración mínima del impacto en milisegundos
    this.falling = false;
    this.movimientoCircular = false;
    this.movimientoAFavorMacecillas = false;
    this.radioMovimientoCircular = 0;
    this.impactDetected = false;
    this._ondevicemotion = this._ondevicemotion.bind(this);
  }

  start() {
    window.addEventListener('devicemotion', this._ondevicemotion, true);
    this.isRunning = true;
  }

  stop() {
    window.removeEventListener('devicemotion', this._ondevicemotion, true);
    this.isRunning = false;
  }

  _ondevicemotion(event) {
    const acceleration = {
      x: event.acceleration.x,
      y: event.acceleration.y,
      z: event.acceleration.z,
    };

    const accelerationIncludingGravity = {
      x: event.accelerationIncludingGravity.x,
      y: event.accelerationIncludingGravity.y,
      z: event.accelerationIncludingGravity.z,
    };

    const rotationRate = {
      alpha: event.rotationRate.alpha,
      beta: event.rotationRate.beta,
      gamma: event.rotationRate.gamma,
    };

    this.data = {
      acceleration,
      accelerationIncludingGravity,
      rotationRate,
    };

    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;

    this.radioMovimientoCircular = Math.sqrt(x * x + y * y +z * z); // radio del movimiento circular o en 8
    let direction = '';
    let angle = 0;

    const now = new Date().getTime();
    const timeDiff = now - this.lastUpdate;
    const deltaX = x - this.lastX;
    const deltaY = y - this.lastY;
    const deltaZ = z - this.lastZ;
    const speed = Math.abs(deltaX + deltaY + deltaZ) / timeDiff * 10000;

    // detectar sacudidas arriba y abajo
    if (Math.abs(deltaY) > 10 && speed > 500) {
      if (deltaY < 0) {
        console.log('Sacudida hacia arriba');
      } else {
        console.log('Sacudida hacia abajo');
        if (!falling) { // si no se estaba cayendo antes
          this.falling = true;
          this.lastUpdate = now;
        }
      }
    }

    // detectar sacudidas adelante y atrás
    if (Math.abs(deltaZ) > 10 && speed > 500) {
      if (deltaZ < 0) {
        console.log('Sacudida hacia adelante');
      } else {
        console.log('Sacudida hacia atrás');
      }
    }

    // detectar sacudidas de lado a lado
    if (Math.abs(deltaX) > 10 && speed > 500) {
      if (deltaX < 0) {
        console.log('Sacudida hacia la izquierda');
      } else {
        console.log('Sacudida hacia la derecha');
      }
    }

    // detectar si está cayéndose
    if (lastZ !== null && falling) {
      if (deltaZ > threshold) { // se ha detectado una caída
        if (!impactDetected) { // aún no se ha detectado el impacto
          this.impactDetected = true;
          this.lastUpdate = now;
        } else { // ya se detectó el impacto
          var impactDuration = now - lastUpdate;
          if (deltaZ > impactThreshold && impactDuration > impactDurationThreshold) {
            console.log("El dispositivo ha sufrido un impacto con el suelo.");
            this.falling = false;
            this.impactDetected = false;
          }
        }
      } else { // no se ha detectado una caída
        this.impactDetected = false;
      }
    }

    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;
    this.lastUpdate = now;

    if (Math.abs(x) < Math.abs(y)) { // movimiento en 8
      if (x > 0 && y > 0) {
        direction = 'en sentido diagonal hacia abajo y hacia la derecha';
        angle = Math.atan(y / x) * 180 / Math.PI;
      } else if (x < 0 && y > 0) {
        direction = 'en sentido diagonal hacia abajo y hacia la izquierda';
        angle = Math.atan(-x / y) * 180 / Math.PI + 90;
      } else if (x < 0 && y < 0) {
        direction = 'en sentido diagonal hacia arriba y hacia la izquierda';
        angle = Math.atan(y / x) * 180 / Math.PI + 180;
      } else if (x > 0 && y < 0) {
        direction = 'en sentido diagonal hacia arriba y hacia la derecha';
        angle = Math.atan(x / -y) * 180 / Math.PI + 270;
      }
    } else { // movimiento circular
      const angleXY = Math.atan(y / x) * 180 / Math.PI;
      const angleXZ = Math.atan(z / x) * 180 / Math.PI;
      const angleYZ = Math.atan(z / y) * 180 / Math.PI;

      this.movimientoCircular = true;
      if (Math.abs(angleXY - angleXZ) < 30 && Math.abs(angleXY - angleYZ) < 30) {
        this.movimientoAFavorMacecillas = true;
        direction = 'en sentido horario';
      } else if (Math.abs(angleXY - angleXZ) < 30 && Math.abs(angleXY - angleYZ) > 150) {
        this.movimientoAFavorMacecillas = false;
        direction = 'en sentido antihorario';
      } else {
        this.movimientoCircular = false;
        return; // no es un movimiento circular válido
      }

      angle = Math.atan2(y, x) * 180 / Math.PI;
    }

    console.log('Radio: ' + this.radioMovimientoCircular);
    console.log('Dirección: ' + direction);
    console.log('Ángulo: ' + angle);

    this.notifyListeners(this.data);
  }
}

class GeoLocationSensor extends CustomSensor {
  constructor(options) {
    super();
    if (!options) {
      options = {};
    }

    this._frequency = options.frequency || 1000; // en milisegundos
    this._accuracy = options.accuracy || 100; // en metros
    this._watchId = null;

    this._currentLocation = null;
    this.#getCurrentLocation();
  }

  #getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          const data = {latitude, longitude};
          this._currentLocation = data;
        },
        (error) => {
          throw new Error(`Error getting location: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      );
    } else {
      throw new Error('Geolocation API not supported');
    }
  }

  /* Variación magnética:

    Compasses, instruments that align themselves with the magnetic poles of the
    Earth, have been used in navigation for centuries. The earth’s rotational axis
     defines the geographic north and south poles that we use for map references.
     It turns out that there is a discrepancy of around 11.5 degrees (around 1000 miles)
     between the geographic poles and the magnetic poles. Declination angle is applied
     to the magnetic direction to correct for this situation.

   */

  static magneticDeclination = (latitude, longitude, altitude) => {
    function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    const phi = toRadians(latitude);
    const lambda = toRadians(longitude);
    const h = altitude / 1000; // convert altitude to km
    const r = 6371.2 + h;

    const cos_phi = Math.cos(phi);
    const sin_phi = Math.sin(phi);
    const cos_lambda = Math.cos(lambda);
    const sin_lambda = Math.sin(lambda);

    const x = r * cos_phi * cos_lambda;
    const y = r * cos_phi * sin_lambda;
    const z = r * sin_phi;

    const a = 6371.2;
    const b = 6356.9;
    const f = (a - b) / a;
    const e = Math.sqrt(2 * f - f * f);

    const p = Math.sqrt(x * x + y * y);
    const theta = Math.atan2(z * a, p * b);

    const declination = Math.atan2(y, x);
    const inclination = Math.atan2(z, p);

    const bh = Math.sqrt(x * x + y * y + z * z) - 6371.2; // convert back to meters

    const g = 9.80665;
    const gamma = Math.atan2(z, p);
    const dip = toRadians(11.45);

    const B = (3 * g * a * a * z) / (2 * (a * a * z * z + b * b * p * p) ^ (3 / 2));
    const C = (3 * g * b * b * p) / (2 * (a * a * z * z + b * b * p * p) ^ (3 / 2));
    const D = -2 * gamma - dip;

    const H = B * sin(D);
    const Z = C * cos(D);

    const H0 = H * cos_theta + Z * sin_theta;
    const Z0 = Z * cos_theta - H * sin_theta;

    return toDegrees(declination - H0);
  };

  /*
          I show you how to do this in other ... mode.

          // First, get the latitude and longitude (omitted for brevity).
          var latitude = 0, longitude = 0;

          // Then, get the magnetic declination using your favorite web service.
          var base = 'http://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination';
          fetch(base + '?lat1=' + latitude + '&lon1=' + longitude + '&resultFormat=csv')
            .then(response => response.text()).then(text => {
              var declinationDegrees =
                  parseFloat(text.replace(/^#.*$/gm, '').trim().split(',')[4]);
              // Compensate for the magnetic declination to get the true north.
              console.log('True heading in degrees: ' + (headingDegrees + declinationDegrees));
          });


  * */

  static gravityAnomaly = (latitude, longitude, altitude) => {
    // Implementación del cálculo de la anomalía gravitacional
    // utilizando la fórmula de Somigliana (https://en.wikipedia.org/wiki/Somigliana_formula)
    // que requiere la latitud, longitud y altitud
    const a = 6378137; // radio ecuatorial de la Tierra en metros
    const b = 6356752.3142; // radio polar de la Tierra en metros
    const gamma_e = 9.7803253359; // valor de la gravedad en el ecuador en m/s^2
    const gamma_p = 9.8321849378; // valor de la gravedad en el polo en m/s^2
    const gamma_0 = (gamma_e + gamma_p) / 2; // valor de la gravedad a nivel del mar en el ecuador
    const e2 = 1 - (b / a) ** 2; // excentricidad al cuadrado
    const sinLat = Math.sin(latitude * Math.PI / 180);
    const W = Math.sqrt(1 - e2 * sinLat ** 2);
    const N = a / W; // radio de curvatura de la esfera que coincide con la Tierra en el ecuador
    const M = a * (1 - e2) / (W ** 3); // radio de curvatura de la esfera que coincide con la Tierra en la dirección normal al ecuador
    const delta_gamma = gamma_0 * ((-2 * altitude / N) + (3 * altitude ** 2 / M ** 2)); // corrección de la gravedad debido a la altitud
    const gravityAnomaly = gamma_0 - delta_gamma;
    return gravityAnomaly;
  };

  getGravityAnomaly() {
    const {latitude, longitude, altitude} = this._currentLocation;
    return GeoLocationSensor.gravityAnomaly(latitude, longitude, altitude);
  }

  static coriolis = (latitude) => {
    // Implementación del cálculo del efecto Coriolis
    // utilizando la fórmula de Coriolis (https://en.wikipedia.org/wiki/Coriolis_force)
    // que requiere la latitud y la velocidad
    const omega = 7.2921159e-5; // velocidad angular de la Tierra en rad/s
    const coriolisEffect = 2 * omega * Math.sin(latitude * Math.PI / 180);
    return coriolisEffect;
  };

  getCoriolisEffect() {

    const {latitude} = this._currentLocation;
    const coriolisEffect = GeoLocationSensor.coriolis(latitude);
    return coriolisEffect;
  }

  start() {
    if (navigator.geolocation) {
      this._watchId = navigator.geolocation.watchPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          const data = {latitude, longitude};
          this.notifyListeners(data);
        },
        (error) => {
          throw new Error(`Error getting location: ${error.message}`);
        },
        {
          enableHighAccuracy: true, // para obtener una ubicación más precisa
          maximumAge: this._frequency, // para usar datos de ubicación en caché si están disponibles
          timeout: this._frequency, // para establecer el tiempo máximo de espera para obtener una ubicación
        },
      );
    } else {
      throw new Error('Geolocation API not supported');
    }
  }

  stop() {
    if (this._watchId) {
      navigator.geolocation.clearWatch(this._watchId);
      this._watchId = null;
    }
  }

  destroy() {
    this.stop();
  }
}

class MagnetometerSensor extends CustomSensor {
  /*
      En resumen, el rango mínimo es de -2 a 2 Gauss en cada eje, con al menos
      4096 valores discreteos posibles en ese rango, y una precisión
      de 0.1 microTesla o mejor.
      Por lo tanto, el número total de vectores de campo magnético únicos posible
      es 4096 * 4096 * 4096 = 2^36 - 1 = 64 millones (68 719 476 735 en base 10)

      Es más probable que el rango de valores esté en el rango de -1000 a 1000 microteslas (µT) en lugar de -1 a 1 Gauss.

      La frecuencia puede ser de hasta 100 Hz.

      Ahora dice que -1000 µT a 1000 µT ( microteslas (µT).)
  */
  constructor(frequency = 60, minRange = -1000, maxRange = 1000) {
    super();
    this.sensorType = 'magnetometer';
    this.magneticField = {x: null, y: null, z: null};
    this.calibrationField = {x: null, y: null, z: null};
    this.eulerAngle = {alpha: null, beta: null, gamma: null};
    this.quaternion = {w: null, x: null, y: null, z: null};
    this.sensor = null;
    this.declination = GeoLocationSensor.gravityAnomaly();
    // La frecuencia de muestreo del magnetómetro en este ejemplo se establece en 60Hz porque es la frecuencia máxima que admite el API de Web Sensor.
    this.frequency = frequency;
    this.minRange = minRange;
    this.maxRange = maxRange;
    this.previousReading = {x: 0, y: 0, z: 0};
  }

  get _radioModule() {
    const result = Math.sqrt((this.magneticField.x - this.previousReading.x) ** 2 + (this.magneticField.y - this.previousReading.y) ** 2 + (this.magneticField.z - this.previousReading.z) ** 2);
    return result / Math.sqrt(3 * (this.maxRange ** 2));
  }

  // falta poco para la prueba, bueno a mí me falta un poco bastante: como por ejemplo el teléfono para empezar.

  // Calcular la exponencial.
  bigIntExp(exp, outputFormat) {
    let n = 1n;
    let f = 1n;
    let C = f;
    let D = 0n;
    let delta;
    let result = 0n;
    while (true) {
      if (n > 100n) {
        throw new Error('Series failed to converge');
      }
      delta = (exp * f) / n;
      C = 1n + delta / C;
      D = 1n + delta * D;
      f *= -exp;
      n += 1n;
      if (D === 0n) {
        D = 1n;
      }
      delta = C / D;
      result += delta;
      if (delta === 0n) {
        break;
      }
    }
    result += 1n;
    //
    if (outputFormat === 'bytes') {
      const byteLength = Math.ceil(result.toString(2).length / 8);
      const resultBytes = new Uint8Array(byteLength);
      let i = byteLength - 1;
      while (result > 0n) {
        resultBytes[i] = Number(result & 0xffn);
        result >>= 8n;
        i--;
      }
      return resultBytes;
    } else if (outputFormat === 'words') {
      const wordLength = Math.ceil(result.toString(2).length / 16);
      const resultWords = new Uint16Array(wordLength);
      let i = wordLength - 1;
      while (result > 0n) {
        resultWords[i] = Number(result & 0xffffn);
        result >>= 16n;
        i--;
      }
      return resultWords;
    } else if (outputFormat === 'longs') {
      const longLength = Math.ceil(result.toString(2).length / 32);
      const resultLongs = new Uint32Array(longLength);
      let i = longLength - 1;
      while (result > 0n) {
        resultLongs[i] = Number(result & 0xffffffffn);
        result >>= 32n;
        i--;
      }
      return resultLongs;
    } else {
      throw new Error('Invalid output format specified');
    }
  }

  // Generar un arreglo de... ya sabes (el arreglo de la exponencial de la recepción a 100 Hz yo apuersto a que sontoniza la radio)
  soundBlaster() {
    // Ecuación 20Khz = 20 000 = Math.Exp( this._radioModule * Math.ln(2^longitudmuestra)) // simplificar
  }

  _sensorReadingHandler = (event) => {
    if (this.isRunning) {
      const {x, y, z} = event.target.magneticField;
      this.magneticField = {x, y, z};
      console.log(`Cambio en el campo magnético, x = ${x}, y = ${y}, z = ${z}`);

      // Aplicación de la declinación magnética
      const {
        x: declinationX,
        y: declinationY,
      } = this.applyDeclination(this.magneticField.x, this.magneticField.y, this.declination);
      this.magneticField = {
        x: declinationX,
        y: declinationY,
        z: this.magneticField.z,
      };

      // Calibración del campo magnético
      if (this.calibrationField.x === null || this.calibrationField.y === null || this.calibrationField.z === null) {
        this.calibrationField = {
          x: this.magneticField.x,
          y: this.magneticField.y,
          z: this.magneticField.z,
        };
      } else {
        const {
          x: calibratedX,
          y: calibratedY,
          z: calibratedZ,
        } = this.zeroAdjust(this.magneticField.x, this.magneticField.y, this.magneticField.z, this.calibrationField.x, this.calibrationField.y, this.calibrationField.z);
        this.magneticField = {x: calibratedX, y: calibratedY, z: calibratedZ};
      }

      // Cálculo de los ángulos de Euler
      const {alpha, beta, gamma} = this.calculateEulerAngle(event.target);
      this.eulerAngle = {alpha, beta, gamma};

      // Cálculo del cuaternión
      const {
        w,
        x: qx,
        y: qy,
        z: qz,
      } = this.calculateQuaternion(alpha, beta, gamma);
      this.quaternion = {w, x: qx, y: qy, z: qz};

      this.notifyListeners({
        magneticField: this.magneticField,
        eulerAngle: this.eulerAngle,
        quaternion: this.quaternion,
      });
    }
  };

  _quaternionToRotationMatrix(q) {
    const [w, x, y, z] = q;
    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;
    const yy = y * y;
    const yz = y * z;
    const yw = y * w;
    const zz = z * z;
    const zw = z * w;
    return [
      [1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw)],
      [2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw)],
      [2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)],
    ];
  }

  _quaternionToRotationMatrixOld(q) {
    const q0 = q[0];
    const q1 = q[1];
    const q2 = q[2];
    const q3 = q[3];
    const xx = q0 * q0;
    const xy = q0 * q1;
    const xz = q0 * q2;
    const xw = q0 * q3;
    const yy = q1 * q1;
    const yz = q1 * q2;
    const yw = q1 * q3;
    const zz = q2 * q2;
    const zw = q2 * q3;
    const w2 = q3 * q3 - 0.5;
    const m = [
      [1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw)],
      [2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw)],
      [2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)],
    ];
    return m;
  }

  start() {
    this.isRunning = true;
    this.sensor = new Magnetometer({frequency: this.frequency});
    this.sensor.addEventListener('reading', this._sensorReadingHandler);
    this.sensor.start();
  }

  stop() {
    this.isRunning = false;
    this.sensor.stop();
    this.sensor.removeEventListener('reading', this._sensorReadingHandler);
  }

  setDeclination(value) {
    this.declination = value;
  }

  applyDeclination(x, y, declination) {
    const degToRad = Math.PI / 180;
    const radToDeg = 180 / Math.PI;

    const phi = -declination * degToRad;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const newX = x * cosPhi - y * sinPhi;
    const newY = x * sinPhi + y * cosPhi;

    return {x: newX, y: newY};
  }

  async calibrate() {
    console.log('Coloca el dispositivo en una superficie plana y presiona Enter.');
    await new Promise((resolve) => {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          resolve();
        }
      });
    });

    console.log('Calibrando magnetómetro...');

    const readings = await Promise.all([this._readReading(), this._readReading(), this._readReading(), this._readReading(), this._readReading(), this._readReading()]);

    const xOffset = (readings[0].x + readings[1].x + readings[2].x + readings[3].x + readings[4].x + readings[5].x) / 6;
    const yOffset = (readings[0].y + readings[1].y + readings[2].y + readings[3].y + readings[4].y + readings[5].y) / 6;
    const zOffset = (readings[0].z + readings[1].z + readings[2].z + readings[3].z + readings[4].z + readings[5].z) / 6;

    this.xBias = xOffset;
    this.yBias = yOffset;
    this.zBias = zOffset;

    this.calibrationField = {x: this.xBias, y: this.yBias, z: this.zBias};

    console.log('Magnetómetro calibrado. Desvíos: ', xOffset, yOffset, zOffset);
  }


  zeroAdjust(x, y, z, cx, cy, cz) {
    const k = Math.sqrt((cx * cx) + (cy * cy) + (cz * cz));
    const normX = x / k;
    const normY = y / k;
    const normZ = z / k;

    const dotProduct = (cx * normX) + (cy * normY) + (cz * normZ);
    const crossProductX = cy * normZ - cz * normY;
    const crossProductY = cz * normX - cx * normZ;
    const crossProductZ = cx * normY - cy * normX;

    const newX = x - (2 * dotProduct * normX) + (2 * crossProductX);
    const newY = y - (2 * dotProduct * normY) + (2 * crossProductY);
    const newZ = z - (2 * dotProduct * normZ) + (2 * crossProductZ);

    return {x: newX, y: newY, z: newZ};
  }

  calculateEulerAngle(sensor) {
    const {x, y, z} = sensor.magneticField;
    const degToRad = Math.PI / 180;

    const phi = Math.atan2(y, x);
    const theta = Math.atan2(z, Math.sqrt(x * x + y * y));
    const psi = 0;

    const heading = phi * radToDeg;
    const attitude = theta * radToDeg;
    const bank = psi * radToDeg;

    return {alpha: heading, beta: attitude, gamma: bank};
  }

  calculateQuaternion(alpha, beta, gamma) {
    const degToRad = Math.PI / 180;

    const phi = alpha * degToRad;
    const theta = beta * degToRad;
    const psi = gamma * degToRad;

    const cosPhi = Math.cos(phi / 2);
    const sinPhi = Math.sin(phi / 2);
    const cosTheta = Math.cos(theta / 2);
    const sinTheta = Math.sin(theta / 2);
    const cosPsi = Math.cos(psi / 2);
    const sinPsi = Math.sin(psi / 2);

    const w = (cosPhi * cosTheta * cosPsi) + (sinPhi * sinTheta * sinPsi);
    const x = (sinPhi * cosTheta * cosPsi) - (cosPhi * sinTheta * sinPsi);
    const y = (cosPhi * sinTheta * cosPsi) + (sinPhi * cosTheta * sinPsi);
    const z = (cosPhi * cosTheta * sinPsi) - (sinPhi * sinTheta * cosPsi);

    return {w, x, y, z};
  }

  async getDirection() {
    const [x, y, z] = await this.getReading();
    const heading = Math.atan2(y, x);
    const declination = 0.045; // declinación magnética para Buenos Aires
    const trueHeading = heading + declination;
    const directionX = Math.cos(trueHeading);
    const directionY = Math.sin(trueHeading);
    const directionZ = z;
    return [directionX, directionY, directionZ];
  }
}

// Ignore this
export class SensorManager {
  constructor() {
    this.sensors = new Map();
    this.permissions = new Map();
  }

  // Categorías de sensores
  static SENSOR_CATEGORY = {
    LOCATION: 'location',
    MOTION: 'motion',
    ENVIRONMENTAL: 'environmental',
    CUSTOM: 'custom',
  };

  // Tipos de sensores
  static SENSOR_TYPE = {
    ACCELEROMETER: 'accelerometer',
    GYROSCOPE: 'gyroscope',
    MAGNETOMETER: 'magnetometer',
    GRAVITY: 'gravity',
    LINEAR_ACCELERATION: 'linearAcceleration',
    ROTATION_VECTOR: 'rotationVector',
    GAME_ROTATION_VECTOR: 'gameRotationVector',
    GEOFENCING: 'geofencing',
    GPS: 'gps',
    NETWORK: 'network',
    WIFI: 'wifi',
    BLUETOOTH: 'bluetooth',
    CUSTOM: 'custom',
  };

  // Solicita permiso para acceder a un sensor
  requestPermission(sensorType) {
    return new Promise((resolve, reject) => {
      if (this.permissions.has(sensorType)) {
        resolve(true);
      } else {
        // Aquí iría la lógica para solicitar permisos al sistema operativo
        // En este ejemplo, se concede automáticamente el permiso
        this.permissions.set(sensorType, true);
        resolve(true);
      }
    });
  }

  // Registra un sensor en la categoría y tipo especificados
  registerSensor(sensor, category, type) {
    if (!this.sensors.has(category)) {
      this.sensors.set(category, new Map());
    }

    const categorySensors = this.sensors.get(category);

    if (!categorySensors.has(type)) {
      categorySensors.set(type, []);
    }

    const typeSensors = categorySensors.get(type);

    typeSensors.push(sensor);
  }

  // Obtiene una lista de sensores del tipo especificado
  getSensorList(sensorType) {
    const sensors = [];

    for (const [category, categorySensors] of this.sensors) {
      for (const [type, typeSensors] of categorySensors) {
        if (type === sensorType) {
          sensors.push(...typeSensors);
        }
      }
    }

    return sensors;
  }

  // Comprueba si un sensor del tipo especificado está soportado
  async isSensorSupported(sensorType) {
    const permissionGranted = await this.requestPermission(sensorType);
    return permissionGranted;
  }

  // Registra un listener para el sensor especificado
  registerListener(listener, sensor, rate) {
    // Aquí iría la lógica para registrar el listener en el sensor
    // En este ejemplo, se guarda el listener en el sensor
    sensor.onDataChanged = listener;
  }

  // Elimina un listener para el sensor especificado
  removeListener(listener, sensor) {
    // Aquí iría la lógica para eliminar el listener del sensor
    // En este ejemplo, se elimina el listener del sensor
    sensor.onDataChanged = null;
  }

  // Elimina un sensor de la categoría y tipo especificados
  removeSensor(sensor, category, type) {
    const categorySensors = this.sensors.get(category);
    const typeSensors = categorySensors.get(type);
    const index = typeSensors.indexOf(sensor);

    if (index !== -1) {
      typeSensors.splice(index, 1);
    }
  }

  // Elimina todos los sensores de la categoría y tipo especificados
  removeAllSensors(category, type) {
    const categorySensors = this.sensors.get(category);
    const typeSensors = categorySensors.get(type);

    for (const sensor of typeSensors) {
      this.removeSensor(sensor, category, type);
    }
  }
}

// Revisar esta última es una especie de fusión
class SensorFusion {
  constructor() {
    // Inicializamos las variables del estado interno
    this.position = [0, 0, 0]; // posición [x, y, z]
    this.orientation = [0, 0, 0]; // orientación [yaw, pitch, roll]
    this.velocity = [0, 0, 0]; // velocidad [vx, vy, vz]
    this.acceleration = [0, 0, 0]; // aceleración [ax, ay, az]
    this.timestamp = 0; // tiempo de la última actualización
  }

  update(data) {
    // Calculamos el intervalo de tiempo desde la última actualización
    const dt = (data.timestamp - this.timestamp) / 1000.0; // tiempo en segundos
    this.timestamp = data.timestamp;

    // Actualizamos la posición y velocidad usando los datos de geolocalización
    const lat = data.latitude;
    const lon = data.longitude;
    const alt = data.altitude;
    this.position = [lon, lat, alt];
    this.velocity = [data.speed * Math.cos(data.heading), data.speed * Math.sin(data.heading), 0];

    // Actualizamos la orientación usando los datos del magnetómetro y el giroscopio
    const yaw = data.magneticHeading * Math.PI / 180.0; // conversión a radianes
    const pitch = data.pitch * Math.PI / 180.0;
    const roll = data.roll * Math.PI / 180.0;
    this.orientation = [yaw, pitch, roll];

    // Actualizamos la aceleración usando los datos del acelerómetro
    const ax = data.accelerationIncludingGravity.x;
    const ay = data.accelerationIncludingGravity.y;
    const az = data.accelerationIncludingGravity.z;
    this.acceleration = [ax, ay, az];

    // Aplicamos el algoritmo de fusión de sensores para mejorar la precisión
    if (dt > 0) {
      const alpha = 0.9; // factor de corrección
      const gravity = [0, 0, -9.81]; // gravedad en m/s^2
      const R = this.rotationMatrix(this.orientation);
      const acc = this.rotateVector(this.acceleration, R);
      const acc_corrected = [acc[0], acc[1], acc[2] - gravity[2]]; // corregimos la componente de la gravedad
      const vel = [this.velocity[0] + acc_corrected[0] * dt, this.velocity[1] + acc_corrected[1] * dt, this.velocity[2] + acc_corrected[2] * dt];
      const pos = [this.position[0] + vel[0] * dt, this.position[1] + vel[1] * dt, this.position[2] + vel[2] * dt];
      this.velocity = [alpha * vel[0] + (1 - alpha) * this.velocity[0], alpha * vel[1] + (1 - alpha) * this.velocity[1], alpha * vel[2] + (1 - alpha) * this.velocity[2]];
      this.position = [alpha * pos[0] + (1 - alpha) * this.position[0], alpha * pos[1] + (1 - alpha) * this.position[1], alpha * pos[2] + (1 - alpha) * this.position[2]];
    }
  }

  // Función auxiliar para calcular la matriz de rotación a partir de los ángulos de Euler
  rotationMatrix(angles) {
    const cy = Math.cos(angles[0]);
    const sy = Math.sin(angles[0]);
    const cp = Math.cos(angles[1]);
    const sp = Math.sin(angles[1]);
    const cr = Math.cos(angles[2]);
    const sr = Math.sin(angles[2]);
    return [
      [cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr],
      [sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr],
      [-sp, cp * sr, cp * cr],
    ];
  }

  // Función auxiliar para rotar un vector por una matriz de rotación
  rotateVector(vector, matrix) {
    const result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
    }
    return result;
  }

  unitaryTest() {
    function distanceAndAzimuthBetweenTwoPoints(lat1, lon1, alt1, lat2, lon2, alt2, ellipsoid = {
      a: 6378137,
      b: 6356752.3142,
    }) {
      // Convertimos las coordenadas geográficas a radianes
      lat1 = lat1 * Math.PI / 180;
      lon1 = lon1 * Math.PI / 180;
      lat2 = lat2 * Math.PI / 180;
      lon2 = lon2 * Math.PI / 180;

      // Calculamos la distancia entre los dos puntos
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = ellipsoid.a * c;

      // Calculamos el achatamiento del elipsoide a partir de b
      const f = (ellipsoid.a - ellipsoid.b) / ellipsoid.a;

      // Calculamos el radio de curvatura en el primer punto
      const N1 = ellipsoid.a / Math.sqrt(1 - f * f * Math.sin(lat1) * Math.sin(lat1));

      // Calculamos el acimut y la elevación entre los dos puntos
      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      const azimuth = Math.atan2(y, x) * 180 / Math.PI;
      const elevation = Math.atan2(alt2 - alt1, Math.sqrt(x * x + y * y) * Math.cos(lat1) + (lat2 - lat1) * Math.sin(lat1) * N1) * 180 / Math.PI;

      // Devolvemos los resultados en un objeto
      return {
        distance: distance,
        azimuth: azimuth,
        elevation: elevation,
      };
    }

    function getGeographicCoordinates(azimuth, colatitude, distance, currentPosition) {
      // Convertimos los ángulos a radianes
      const lat = currentPosition[1] * Math.PI / 180;
      const lon = currentPosition[0] * Math.PI / 180;
      const azimuthRad = azimuth * Math.PI / 180;
      const colatitudeRad = (Math.PI / 2 - colatitude) * Math.PI / 180;

      // Calculamos las nuevas coordenadas geográficas
      const newLat = Math.asin(Math.sin(lat) * Math.cos(distance) + Math.cos(lat) * Math.sin(distance) * Math.cos(azimuthRad));
      const newLon = lon + Math.atan2(Math.sin(azimuthRad) * Math.sin(distance) * Math.cos(lat), Math.cos(distance) - Math.sin(lat) * Math.sin(newLat));

      // Convertimos las coordenadas geográficas agrados y las devolvemos en un arreglo
      return [newLon * 180 / Math.PI, newLat * 180 / Math.PI];
    }

    function getAzimuthAndColatitudeFromGeographicCoordinates(targetPosition, targetAltitude, currentPosition) {
      // Convertimos las coordenadas geográficas a radianes
      const lat1 = currentPosition[1] * Math.PI / 180;
      const lon1 = currentPosition[0] * Math.PI / 180;
      const lat2 = targetPosition[1] * Math.PI / 180;
      const lon2 = targetPosition[0] * Math.PI / 180;

      // Calculamos la distancia entre los dos puntos
      const dLon = lon2 - lon1;
      const cosLat2 = Math.cos(lat2);
      const x = Math.sqrt((cosLat2 * Math.sin(dLon)) ** 2 + (Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * cosLat2 * Math.cos(dLon)) ** 2);
      const y = Math.sin(lat1) * Math.sin(lat2) + cosLat2 * Math.cos(lon2 - lon1) * Math.cos(lat1);

      const distance = Math.atan2(x, y) * 6371 * 1000; // Radio de la Tierra en metros

      // Calculamos la elevación del objeto respecto al horizonte
      const targetElevation = Math.atan2(targetAltitude, distance);

      // Calculamos el ángulo de elevación del objeto respecto al cenit
      const colatitude = Math.PI / 2 - targetElevation - lat1;

      // Calculamos el acimut del objeto respecto al norte magnético
      const azimuth = Math.atan2(Math.sin(lon2 - lon1) * cosLat2, Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * cosLat2 * Math.cos(lon2 - lon1));

      // Convertimos los ángulos a grados y los devolvemos en un objeto
      return {
        azimuth: azimuth * 180 / Math.PI,
        colatitude: colatitude * 180 / Math.PI,
      };
    }
  }

  unitaryTest() {
    // Creamos una instancia del algoritmo de fusión de sensores
    const fusion = new SensorFusion();

    // Función para actualizar los datos de los sensores y mostrar la salida en la página
    function update() {
      // Simulamos la lectura de los sensores (en la práctica se usarían las API del dispositivo)
      const data = {
        timestamp: Date.now(),
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 10,
        speed: 5,
        heading: 0,
        magneticHeading: 0,
        pitch: 0,
        roll: 0,
        accelerationIncludingGravity: {x: 0, y: 0, z: 9.81},
      };

      // Actualizamos el estado interno del algoritmo de fusión de sensores
      fusion.update(data);

      // Mostramos la salida en la página
      const output = document.getElementById('output');
      output.innerHTML = 'Posición: ' + fusion.position + '<br>' +
        'Orientación: ' + fusion.orientation + '<br>' +
        'Velocidad: ' + fusion.velocity + '<br>' +
        'Aceleración: ' + fusion.acceleration;
    }

    // Actualizamos los datos de los sensores cada 100 ms
    setInterval(update, 100);
  }
}
