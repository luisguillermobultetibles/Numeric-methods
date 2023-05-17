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

class AbsoluteOrientationSensor extends CustomSensor {
  constructor(options) {
    super();
    if (!options) {
      options = {};
    }

    this._alpha = null;
    this._beta = null;
    this._gamma = null;

    this._quaternion = new Quaternion();
    this._euler = new Euler();

    this._frequency = options.frequency || 60;

    if (typeof DeviceOrientationEvent !== 'undefined') {
      this._deviceOrientationListener = this._handleDeviceOrientation.bind(this);
      window.addEventListener('deviceorientation', this._deviceOrientationListener);
    } else {
      throw new Error('DeviceOrientation API not supported');
    }
  }

  get quaternion() {
    return this._quaternion.toArray();
  }

  get euler() {
    return this._euler.toArray();
  }

  get alpha() {
    return this._alpha;
  }

  get beta() {
    return this._beta;
  }

  get gamma() {
    return this._gamma;
  }

  start() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this._updateOrientation();
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
    this._alpha = event.alpha;
    this._beta = event.beta;
    this._gamma = event.gamma;
  }

  _updateOrientation() {
    this._quaternion.setFromEuler(
      this._euler.set(
        this._beta * Math.PI / 180,
        this._alpha * Math.PI / 180,
        -this._gamma * Math.PI / 180,
        'ZYX',
      ),
    );
  }

  destroy() {
    this.stop();

    window.removeEventListener('deviceorientation', this._deviceOrientationListener);

    this._quaternion = null;
    this._euler = null;
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

  _handleSensorReading() {
    let {
      northAngle,
      zenithAngle,
    } = this.getAxisAngles(this.sensor.quaternionToEuler().y * 180 / Math.PI, this.sensor.quaternionToEuler().x * 180 / Math.PI);

    let alpha = this.sensor.quaternion[3] * 180 / Math.PI;
    let beta = this.sensor.quaternion[1] * 180 / Math.PI;
    let gamma = this.sensor.quaternion[2] * 180 / Math.PI;

    if (northAngle < 0) {
      northAngle += 360;
    }
    if (zenithAngle < 0) {
      zenithAngle += 360;
    }

    let azimuth = this.calculateAzimuth(alpha, northAngle, this.deviceOrientation.screenOrientation);
    let altitude = this.calculateAltitude(zenithAngle, this.deviceOrientation.screenOrientation);

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

    return azimuth;
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

  getMagneticVariation() {
    let magneticDeclination = (latitude, longitude, altitude) => {
      function toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }

      var phi = toRadians(latitude);
      var lambda = toRadians(longitude);
      var h = altitude / 1000; // convert altitude to km
      var r = 6371.2 + h;

      var cos_phi = Math.cos(phi);
      var sin_phi = Math.sin(phi);
      var cos_lambda = Math.cos(lambda);
      var sin_lambda = Math.sin(lambda);

      var x = r * cos_phi * cos_lambda;
      var y = r * cos_phi * sin_lambda;
      var z = r * sin_phi;

      var a = 6371.2;
      var b = 6356.9;
      var f = (a - b) / a;
      var e = Math.sqrt(2 * f - f * f);

      var p = Math.sqrt(x * x + y * y);
      var theta = Math.atan2(z * a, p * b);

      var declination = Math.atan2(y, x);
      var inclination = Math.atan2(z, p);

      var bh = Math.sqrt(x * x + y * y + z * z) - 6371.2; // convert back to meters

      var g = 9.80665;
      var gamma = Math.atan2(z, p);
      var dip = toRadians(11.45);

      var B = (3 * g * a * a * z) / (2 * (a * a * z * z + b * b * p * p) ^ (3 / 2));
      var C = (3 * g * b * b * p) / (2 * (a * a * z * z + b * b * p * p) ^ (3 / 2));
      var D = -2 * gamma - dip;

      var H = B * sin(D);
      var Z = C * cos(D);

      var H0 = H * cos_theta + Z * sin_theta;
      var Z0 = Z * cos_theta - H * sin_theta;

      return toDegrees(declination - H0);
    };
    const {latitude, longitude, altitude} = this._currentLocation;
    const magneticVariation = magneticDeclination(latitude, longitude, altitude);
    return magneticVariation;
  }

  getGravityAnomaly() {
    const gravityAnomaly = (latitude, longitude, altitude) => {
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
    const {latitude, longitude, altitude} = this._currentLocation;
    return gravityAnomaly(latitude, longitude, altitude);
  }

  getCoriolisEffect() {
    const coriolis = (latitude) => {
      // Implementación del cálculo del efecto Coriolis
      // utilizando la fórmula de Coriolis (https://en.wikipedia.org/wiki/Coriolis_force)
      // que requiere la latitud y la velocidad
      const omega = 7.2921159e-5; // velocidad angular de la Tierra en rad/s
      const coriolisEffect = 2 * omega * Math.sin(latitude * Math.PI / 180);
      return coriolisEffect;
    };
    const {latitude} = this._currentLocation;
    const coriolisEffect = coriolis(latitude);
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
  constructor() {
    super();
    this.sensorType = 'magnetometer';
    this.magneticField = {x: null, y: null, z: null};
    this.calibrationField = {x: null, y: null, z: null};
    this.eulerAngle = {alpha: null, beta: null, gamma: null};
    this.quaternion = {w: null, x: null, y: null, z: null};
    this.sensor = null;
    this.declination = 0;
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

  start() {
    this.isRunning = true;
    this.sensor = new Magnetometer();
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
    await new Promise(resolve => {
      document.addEventListener('keydown', event => {
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
