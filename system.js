class WebSystemObject extends Object {
    // Poner esto a true si vas a depurar (via debugMode).
    static #apiDebugVerboseMode = true;
    // Clase básica de trabajo, poner aquí las funciones más generales
    // equality under permissive range.
    static epsilon = Math.pow(2, -52);
    // @property lastId: Number
    // Last unique ID used by [`stamp()`](#util-stamp)
    static lastId = 0;
    static $ = document.querySelector.bind(document);

    constructor(multimedia = false) {
        super();
        if (multimedia) {
            this.initializeMedia(); // La reasignación de eventos necesita validación.
        }
    }

    // some thing like a class method...

    // debug time
    get debugMode() {
        return WebSystemObject.#apiDebugVerboseMode;
    }

    set debugMode(m) {
        WebSystemObject.#apiDebugVerboseMode = m;
    }

    // modo productivo, quieto pancho... quieto (nada de mensajes en la consola).
    get quiet() {
        return !this.debugMode;
    }

    set quiet(m) {
        this.debugMode = !m;
    }

    get maxint() {
        Math.pow(2, 53);
    }

    get pausedAudio() {
        return this.audio.paused;
    }

    get muteAudio() {
        return this.audio.muted = value;
    }

    set muteAudio(value) {
        try {
            this.audio.muted = value;
            console.log("Muting audio " + this.audio);
        } catch (err) {
            console.log("Failed to muting, error: " + err);
        }
    }

    // medias

    get speakPaused() {
        return this.synth.paused;
    }

    set speakPaused(value) {
        if (value !== this.synth.paused) {
            if (value) {
                this.speakPause();
            } else {
                this.speakResume();
            }
        } // is ok
    }

    // @function stamp(obj: Object, onFieldName: String): Number

    asString() {
        return JSON.stringifyObject(this);
    }

    asJson(argumento) {
        var className = this.GetClass(argumento);
        if (className == "Boolean") {
            return "" + argumento;
        } else if (className == "Number") {
            return window.isNaN(argumento) ? "null" : "" + argumento;
        } else if (className == "String") {
            var escapedStr = "" + argumento;
            return "\"" + escapedStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
        }
        if (typeof argumento === "object") {
            var str = '';
            if (className == "Array" || className == "Array Iterator") {
                for (var index = 0, length = argumento.length; index < length; ++index) {
                    str += this.asJson(argumento[index]) + ',';
                }
                return "[" + str.slice(0, -1) + "]";
            } else {
                for (var property in argumento) {
                    if (argumento.hasOwnProperty(property)) {
                        str += '"' + property + '":' + this.asJson(argumento[property]) + ',';
                    }
                }
                return "{" + str.slice(0, -1) + "}";
            }
        }
        return undef;
    }

    // interactividad
    ask(caption, target = this) {
        if (!caption) {
            caption = this.GetClass(target);
            if (target.id) {
                caption += "(" + caption.id + ")";
            } else (target.name)
            {
                caption += "(" + caption.name + ")";
            }
        }
        this.asString = this.seConfirma("¿" + caption + "?", this.asString);
        return this;
    }

    askFor(some = this) {
        return this.ask("", some);
    }

    /**
     * @function
     * @description Deep clone a class instance.
     * @param {object} instance The class instance you want to clone.
     * @returns {object} A new cloned instance.
     */
    clone(instance) {
        return Object.assign(Object.create(// Set the prototype of the new object to the prototype of the instance.
            // Used to allow new object behave like class instance.
            Object.getPrototypeOf(instance)), // Prevent shallow copies of nested structures like arrays, etc
            JSON.parse(JSON.stringify(instance)));
    }

    // clone me
    copy() {
        return this.clone(this);
    }

    /**
     * @returns the protocol, http or https for the document if possible.
     **/
    checkProtocol() {
        let _protocol = 'http:';
        if (typeof document !== 'undefined' && document.location && "https:" === document.location.protocol) {
            _protocol = 'https:';
        }
        return _protocol;
    }


    // flow predicate %check functions
    hasArgs(value) {
        return arguments.length !== 0 && typeof value !== 'undefined';
    }

    hasNoArgs(value) {
        return arguments.length === 0 || typeof value === 'undefined';
    }

    isStringArg(value) {
        return arguments.length !== 0 && typeof value === 'string';
    }

    isNumArg(value) {
        return typeof value === 'number';
    }

    isNonEmptyStringArg(value) {
        return arguments.length !== 0 && isStringArg(value) && value.length !== 0;
    }

    isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    isDef(v) {
        return typeof v !== 'undefined' && v !== null;
    }

    /**
     * Converts name and value into a html query parameter, with appending ampersand.
     *
     * @param   name parameter name
     * @param   val  parameter value
     * @returns      formated query parameter
     */
    makeParam(name, val) {
        return name + "=" + encodeURIComponent(stringify(val)) + "&";
    }

    /*
    * String representation of input. This is kind of dumb but makes
    *  flow happier.
    *
    * @param value any kind of thing that can be turned into a string
    * @returns a string
    */
    stringify(value) {
        if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'number') {
            return value.toString();
        } else if (typeof value === 'boolean') {
            return value ? "true" : "false";
        } else if (typeof value === 'undefined') {
            return "undefined";
        } else if (typeof value === 'function') {
            return "function " + value.name;
        } else if (typeof value === 'object') {
            if (value) {
                if (value instanceof Date) {
                    return value.toISOString();
                } else {
                    return value.constructor.name + " " + value.toString();
                }
            } else {
                return "null";
            }
            // symbol not yet supported by flow
            //  } else if (typeof value === 'symbol') {
            //    return value.toString();
        } else {
            return "<unknown" + (typeof value) + "???>";
        }
    }

    tellMeTheTime() {
        // this.initializeSpeaker();
        let momento = new Date();
        this.speak(`La hora es ${momento.getHours()} horas, y ${momento.getMinutes()} minutos `);
    }

    // I think this the better way to engineer a sleep in JavaScript (stack - overflow)
    sleep(millis) {
        try {
            var fromMoment = new Date();
            var now = null;
            do {
                now = new Date();
                // app.ProcessMessages;
                /* Here should go the javascript, C++ Application.ProcessMessages equivalent (the programmings doc said that)
                   Interrupts the execution of an application so that it can process the application dedicated operating system message queue.
                   Call ProcessMessages to permit the application to process messages that are currently in the message queue.
                   ProcessMessages cycles the Windows message loop until it is empty, and then returns control to the application.
                   Note: Neglecting message processing affects only the application calling ProcessMessages, not other applications.
                   In lengthy operations, calling ProcessMessages periodically allows the application to respond to paint and other messages.
                   Note: ProcessMessages does not allow the application to go idle, whereas HandleMessage does.
                 */
            } while (now - fromMoment < millis);
        } catch (e) {
            throw new Error(`Error ${String(e)}, al inducir una espera de ${millis} milisegundos.`);
        }
    }

    // Algunos efectos y funciones para el web
    // Solamente milisegundos, para esperar mas de un segundo usa otra cosa.
    waitMilliSeconds(iMilliSeconds) { // rename to dalay
        var counter = 0, start = new Date().getTime(), end = 0;
        while (counter < iMilliSeconds) {
            end = new Date().getTime();
            counter = end - start;
        }
    }

    is_IE() {
        /**
         * Checks if the current browser is any version of IE
         * @returns {*|boolean}
         */
        return window.ActiveXObject || "ActiveXObject" in window;
    }

    // Identificador de navegador

    isAndroid() {
        return navigator.userAgent.match(/Android/i)
    };

    iswebOS() {
        return navigator.userAgent.match(/webOS/i)
    };

    isiPhone() {
        return navigator.userAgent.match(/iPhone/i)
    };

    isIos() {
        return navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)
    };

    isiPad() {
        return navigator.userAgent.match(/iPad/i)
    };

    isBlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i)
    };

    isMobile() {
        return isAndroid() || iswebOS() || isiPhone() || isiPad() || isBlackBerry() || isMobile()
    };

    #mailSeparator() {
        let defaultSeparator = '?';
        if (this.isAndroid()) {
            result = defaultSeparator;
        } else if (this.isIos()) {
            let iOsVersion_major = +(navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace("OS ", "");
            result = iOsVersion_major < 8 ? ';' : '&'
        } else {
            result = defaultSeparator;
        }
        return result;
    }

    // función para enviar correo electrónico
    sendMail(address, message = null, subject = null, inSitu = false) {

        let protocol = `mailto`;
        let sep = this.#mailSeparator();
        let sub = encodeURIComponent(subject || '');
        let body = encodeURIComponent(message || '');

        let content_ = `${protocol}:${address}${sep}subject=${sub}${sep}body=${body}`;
        if (inSitu) {
            window.location.href = content_;
        } else {
            window.open(content_);
        }
    }

    fadeOut(element) {
        element.style.opacity = 1;

        (function fade() {
            element.style.opacity -= 0.1;
            if (element.style.opacity < 0) {
                element.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    fadeIn(element, display) {
        element.style.opacity = 0;
        element.style.display = display || "block";

        (function fade() {
            let val = parseFloat(element.style.opacity) + 0.1;
            if (val <= 1) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    docReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(fn, 1); // Ni te embarres
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    addEventListenersToElements(elements, event, listener) {
        elements.forEach((el) => el.addEventListener(event, listener));
    }


    // dame todos los scripts de esta página...
    scripts() {
        return document.getElementsByTagName('script');
    }

    // eliminar un script (true if).
    removeScript(name) {
        let s = this.scripts();
        s.forEach(scriptNode, function (scriptNode) {
            if (scriptNode.getAttribute('data-requiremodule') === name && scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                scriptNode.parentNode.removeChild(scriptNode);
                return true;
            }
        });
        return false;
    }

    // buena esa
    loadScript(url, callback) {
        var head = document.querySelector('head');
        var script = document.createElement('script');

        script.async = true;
        script.src = url;
        script.onload = callback;

        head.appendChild(script);
    }

    // btoa() and atob() are two Base64 helper functions that are a core part of the HTML specification and available in all modern browsers.
    base64ToString(b) {
        return btoa(b);
    }

    stringToBase64(s) {
        return atob(s);
    }

    // Piotr Bonk (Polonia):
    // Nalin Bhasin:
    // Ossama Rafique:
    imageToBase64(htmlElement, { type, quality } = { type: 'png', quality: 1 }) {
        const [imageHeight, imageWidth] = [htmlElement.width, htmlElement.height];
        const base64 = htmlElement.toDataURL('image/' + type, quality);
        return { base, type, imageHeight, imageWidth };
    }

    // Incrustar una imagen codificada en base64
    // Piotr Bonk (Polonia):
    // Nalin Bhasin:
    // Ossama Rafique:
    imageFromBase64(base, type = "gif", alt = `embedded ${type} image`, width, height) {
        let inWidth = width ? `width="${Number(width).toFixed(0)}"` : '';
        let inHeight = height ? `height="${Number(height).toFixed(0)}"` : '';
        let inAlt = height ? `alt="${alt}"` : '';
        return `<img src="data:image/${type};base64,${base}"${inWidth} ${inHeight} ${inAlt}>`;
    }


    isTagged(s, pattern = "<>") {
        let tmp = String(s).trim();
        return s.length >= 2 && s[0] === pattern[0] && s[s.length - 1] === pattern[1];
    }

    // No funciona arreglar
    readFromFile(filename, mode = "ASTEXT") {
        var resultado;
        var fr = new FileReader();
        switch (mode) {
            case "ASTEXT":
                fr.readAsText(filename, {});
                break;
            case "ASBINARYSTRING":
                fr.readAsBinaryString(filename);
                break;
            case "ASARRAYBUFFER":
                fr.readAsArrayBuffer(filename);
                break;
            case "DATAURL":
                fr.readAsDataURL(filename);
                break;
            default:
                throw new Error("Modo desconocido de lectura de archivo.");
                break;
        }
        reader.onload = function (e) {
            resultado = e.target;
        }
        return resultado;
    }

    // No funciona arreglar
    writeToFile(filename, line) {
        var fileWriter = new FileWriter(filename);
        fileWriter.open();
        fileWriter.writeLine(line);
        fileWriter.close()
    }

    // Ejecuta una partitura y devuelve la pista...
    async playAudio(path) {
        this.audio = new Audio(path);
        this.audio.type = "audio/mp3";
        this.audio.crossOrigin = "anonymous";
        this.audio.load();
        try {
            await this.audio.play();
            console.log("Playing audio " + path);
        } catch (err) {
            console.log("Failed to play, error: " + err);
        }
        return this.audio;
    }

    // pausa... and resume
    async pauseAudio() {
        try {
            await this.audio.pause();
            console.log("Pausing audio " + this.audio);
        } catch (err) {
            console.log("Failed to pause, error: " + err);
        }
    }


    // > - ###### For vibration pattern
    // > We can also provide multiple values to the array such that starting with 0, even indices are the time for vibration and odd index are for interval between vibration.
    // > ```js
    // >    window.navigator.vibrate([500,250,500,250,500]);

    async resumeAudio() {
        try {
            await this.audio.play();
            console.log("Pausing audio " + this.audio);
        } catch (err) {
            console.log("Failed to pause, error: " + err);
        }
    }

    // Todos los objetos no necesitan utilizar los medios y dispositivos, con ese fin:
    initializeMedia() {
        this.initializeSpeaker();

        // Utiliza funciones anónimas para eventos elementales...

        if (navigator.ononline) {
            this.keepOnOnLine = navigator.ononline;
        }

        navigator.ononline = function (e) {
            this.online = navigator.onLine;
            this.connectionType = navigator.connection.type; // "bluetooth" | "cellular" | "ethernet" | "mixed" | "none" | "other" | "unknown" | "wifi";
            if (this.keepOnOnLine) this.keepOnOnLine(e);
        };

        if (navigator.onoffline) {
            this.keepOnOffLine = navigator.onoffline;
        }
        navigator.onoffline = function (e) {
            this.online = navigator.onLine;
            if (this.keepOnOffLine) this.keepOnOffLine(e);
        };

        // Check if the device supports the Vibration API
        this.vibra = window.navigator.vibrate;
        if (!this.vibra) {
            console.log("No se encuentra el dispositivo de vibración...."); // no hay de eso que tú conoces.
        }

        //  En este ejemplo, observamos los cambios en el estado de la carga (este o no conectado y cargando)
        //  y en el nivel de la batería. Esto se hace escuchando el evento chargingchange y el evento levelchange respectivamente.
        this.battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;

        if (this.battery) {

            // Battery status (Este evento se dispara cuando hay un cambio en el nivel de la bateria del móvil)
            // is an event
            this._updateBatteryStatus = function (event) {
                this.BatteryLevel = this.battery.level;
                this.LineOverlap = this.battery.lineOverlap; // ¿Indica situación de corte en las lineas, o cortocircuito?

                console.log("El estado de la batería es de " + this.BatteryLevel * 100 + " %");

                this.BatteryCharging = this.battery.charging;

                if (this.BatteryCharging) {
                    console.log("La batería está cargándose.");
                } else {
                    this.DischargingTime = this.battery.dischargingTime;
                    console.log(`La batería no está cargándose y se estima que tiene carga suficiente para ${this.DischargingTime / 60} minutos.`);
                }
            }

            this.attachEventToDOM("online", navigator, this._updateBatteryStatus, true);
            this.attachEventToDOM("levelchange", navigator, this._updateBatteryStatus, true);
            this.attachEventToDOM("ondischargingtimechange", navigator, this._updateBatteryStatus, true);

            // this.battery.addEventListener("chargingchange", this._updateBatteryStatus);
            // this.battery.addEventListener("levelchange", this._updateBatteryStatus);
            // this.battery.addEventListener("ondischargingtimechange", this._updateBatteryStatus);

            this._updateBatteryStatus();
        } else {
            console.log("No se encuentra el dispositivo de administración de batería..."); // no hay de eso que tú conoces.
        }

        // Assigning the Event Handler to a Listener
        this._beforeDistance = -1;
        this._deviceProximityHandler = function (event) {
            this.proximityDistance = event.value;
            if (this._beforeDistance !== -1 && this._beforeDistance !== this.proximityDistance) {
                if (this.proximityDistance - this._beforeDistance > 0) {
                    console.log(`Se ha detectado un objeto físico alejándose del móvil.`);
                } else if (this.proximityDistance - this._beforeDistance < 0) {
                    console.log(`Se ha detectado un objeto físico acercándose al móvil.`);
                }
            }

            if (this.proximityDistance == 0) {
                console.log("Se ha detectado un objeto físico en la proximidad del móvil.");
                this.speak("¡¡¡ Deténgase !!!");
                this.sosVibrate(); // do something, or make a 911, phone call...
            }
            console.log(`Se detecta proximidad entre ${event.near ? event.near : event.min} y ${event.max}.`);
            this._beforeDistance = this.proximityDistance;
        }
        window.addEventListener('deviceproximity', this._deviceProximityHandler);

        // Monitoreo de luz ambiental
        this._beforeAambientLightValue = -1;
        this._deviceLightHandler = function (event) {
            this.ambientLightValue = event.value; // in lux.
            console.log(`Cambio en la intensidad de la luz ambiental a ${this.ambientLightValue} lux.`);
            if (this._beforeAambientLightValue !== -1 && this._beforeAambientLightValue !== this.ambientLightValue) {
                if (this._beforeAambientLightValue > this.ambientLightValue) {
                    console.log(`La luz ambiental está oscureciéndose en ${this._beforeAambientLightValue - this.ambientLightValue} lux.`);
                } else {
                    console.log(`La luz ambiental está aclarándose en ${this.ambientLightValue - this._beforeAambientLightValue} lux.`);
                }
            }
            this._beforeAambientLightValue = this.ambientLightValue;
        }
        window.addEventListener('devicelight', this._deviceLightHandler);

        // Monitoreo de la temperatura (lectura y seguimiento del termostato)
        // Pueden agregarse algoritmos predictivos sencillos en función del tiempo, tanto para este, como para los otros sensores.
        // Para saber si está subiendo o bajando demasiado rápido., en una magnitud considerable o si el usuario está sufriendo de algún tipo de calentura...
        this._beforeThermostatTemperature = -273;
        this._thermostatHandler = function (event) {
            this.thermostatTemperature = event.value; // In Celcius (C°)
            console.log(`Cambio en la temperatura, temperatura = ${event.value} C°`);
            if (this._beforeThermostatTemperature !== -273 && this._beforeThermostatTemperature !== this.thermostatTemperature) {
                if (this._beforeThermostatTemperature > this.thermostatTemperature) {
                    console.log(`La temperatura está bajando en ${this._beforeThermostatTemperature - this.thermostatTemperature} C°.`);
                } else {
                    console.log(`La temperatura esta subiendo en ${this.thermostatTemperature - this._beforeThermostatTemperature} C°.`);
                }
            }
            this._beforeThermostatTemperature = this.thermostatTemperature;
        }
        window.addEventListener('ambienttemperature', this._thermostatHandler);
        // navigator.system.watch("AmbientTemperature", this._thermostatHandler);

        // Draft: propuesta de monitoreo de la Humedad relativa (especulativo, se esperaba que así fuera en December 2013 [Tran 2013]).
        this._beforeRelativeHumidity = -1;
        this._humidityHandler = function (event) {
            this.relativeHumidity = event.value;
            console.log(`Cambio en la humedad relativa, ahora es del ${this.relativeHumidity} %.`);
            if (this._beforeRelativeHumidity !== -1 && this._beforeRelativeHumidity !== this.relativeHumidity) {
                if (this._beforeRelativeHumidity > this.relativeHumidity) {
                    console.log(`La humedad relativa está bajando en un ${this._beforeRelativeHumidity - this.relativeHumidity} %.`);
                } else {
                    console.log(`La humedad relativa esta subiendo en un ${this.relativeHumidity - this._beforeRelativeHumidity} %.`);
                }
            }
            this._beforeRelativeHumidity = this.relativeHumidity;
        }
        window.addEventListener('ambienthumidity', this._humidityHandler);

        // Draft: propuesta de monitoreo de la presión atmosférica (especulativo, se esperaba que así fuera en December 2013 [Tran 2013]).
        this._beforeAtmosphericPressure = -1;
        this._atmosphericPressureHandler = function (event) {
            this.atmosphericPressure = event.value;
            console.log(`Cambio en la presión atmosférica, ahora es del ${this.atmosphericPressure} kP.`);
            if (this._beforeAtmosphericPressure !== -1 && this._beforeAtmosphericPressure !== this.atmosphericPressure) {
                if (this._beforeAtmosphericPressure > this.atmosphericPressure) {
                    console.log(`La presión atmosférica está bajando en ${this._beforeAtmosphericPressure - this.atmosphericPressure} kP.`);
                } else {
                    console.log(`La presión atmosférica esta subiendo en ${this.atmosphericPressure - this._beforeAtmosphericPressure} kP.`);
                }
            }
            this._beforeAtmosphericPressure = this.atmosphericPressure;
        }
        window.addEventListener('AtmPressure', this._atmosphericPressureHandler);
        // navigator.system.watch("AmbientAtmosphericPressure", this._atmosphericPressureHandler);

        // Swipe (screen touches)
        this.touches = {
            "touchstart": { "x": -1, "y": -1 },
            "touchmove": { "x": -1, "y": -1 },
            "touchend": false,
            "direction": "undetermined"
        };

        this.handler = function (event) {
            var touch;

            if (typeof event !== 'undefined') {
                event.preventDefault();
                if (typeof event.touches !== 'undefined') {
                    touch = event.touches[0];
                    switch (event.type) {
                        case 'touchstart':
                        case 'touchmove':
                            this.touches[event.type].x = touch.pageX;
                            this.touches[event.type].y = touch.pageY;
                            break;
                        case 'touchend':
                            this.touches[event.type] = true;
                            if (this.touches.touchstart.x > -1 && this.touches.touchmove.x > -1) {
                                this.touches.direction = this.touches.touchstart.x < this.touches.touchmove.x ? "right" : "left";

                                // DO STUFF HERE
                                alert(this.touches.direction);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        };

        // Init swipe
        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
            document.addEventListener('touchstart', this.handler, false);
            document.addEventListener('touchmove', this.handler, false);
            document.addEventListener('touchend', this.handler, false);
        }

        // Vibratios api extensions

        // ## Simple implementation of Vibration Web API
        // Vibration Web API is the API to control vibration of the device. Currently (May 18th 2021), this API is not supported on IOS devices. Although, device supports the API but does not have vibration mechanism, then also it does not work.
        // Now for vibration logic, window.navigator.vibrate method is responsible with accepts an array with multiple values.

        // > - ###### For static vibration
        // > if we provide single valued array, then it will vibrate for provided interval and then stops.
        // > ```js
        // >    window.navigator.vibrate([500]);
        // >```
        // > In this example, device will vibrate for 500ms and then stops.
    }

    // Returns the unique ID of an object, assigning it one if it doesn't have it (if exists, uses onFieldName instead of ID field).
    stamp(onFieldName) {
        /* eslint-disable */
        var newId = ++WebSystemObject.lastId;
        if (onFieldName) {
            this[onFieldName] = this[onFieldName] || newId;
        } else {
            this.id = this.id || newId;
        }
        /* eslint-enable */
    }

    // Russell Gooday (Generar números consecutivos, desde start hasta end)
    consecutives(end, start = 1) {
        return [...function* () {
            while (start <= end) yield start++
        }()]
    };

    // intercambiar dos elementos
    interchange(x, y) {
        [x, y] = [x, y]
    };

    // Función para generar un autonumérico a partir de una lista de id's.
    autoNum(array) {
        // Javascript program to find the smallest elements missing in a sorted array.
        function findFirstMissing(array, start = 0, end = array.length - 1) {
            if (start > end) return end + 1;
            if (start != array[start]) return start;
            let mid = parseInt((start + end) / 2, 10);
            // Left half has all elements from 0 to mid
            if (array[mid] === mid) return findFirstMissing(array, mid + 1, end);
            return findFirstMissing(array, start, mid);
        }

        return findFirstMissing(array.sort((a, b) => a - b));
    }

    // Función para generar un autonumérico a partir de los valores de un campo en una lista.
    autoField(array, fieldName = "id") {
        let tmp = array.map((element) => element[fieldName]);
        return this.autoNum(tmp);
    }

    // >```
    vibrate(pattern) {
        if (!this.vibra) {
            console('Su navegador o su hard, no tiene una chapa que vibre...');
            return;
        }
        pattern = pattern ? pattern : [];
        window.navigator.vibrate(pattern);
    }

    //Vibrate normally for 500ms (Older Iphone Vibration pattern.).
    normalVibrate() {
        this.vibrate([500]);
    };

    //Vibrate pattern 1 (Legacy samsung phone's vibration pattern).
    pattern1Vibrate() {
        // > In this example, device will vibrate for 500ms waits 250ms , again vibrates 500ms and waits 250ms and so on.
        // This flexibility allows us to program different vibration patterns. Below others vibration patterns.
        this.vibrate([250, 250, 250, 250, 250, 800, 250, 250, 250, 250, 250, 250]);
    };

    // speech technology

    //Vibrate pattern 2
    pattern2Vibrate() {
        this.vibrate([1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]);
    };

    // Vibrate SOS in morse code.
    sosVibrate() {
        this.vibrate([100, 30, 100, 30, 100, 30, 200, 30, 200, 30, 200, 30, 100, 30, 100, 30, 100]);
    };

    stopVibration() {
        this.vibrate([]);
    }

    initializeSpeaker() {
        // Con Speech synth API?
        this.synth = window.speechSynthesis;

        if (this.synth) {

            // detect speech voices change (is an event).
            this._populateVoices = function (event) {
                this.voices = this.synth.getVoices().sort(function (a, b) {
                    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
                    if (aname < bname) return -1; else if (aname == bname) return 0; else return +1;
                });
            }

            if (this.synth.onvoiceschanged) {
                this.synth.onvoiceschanged = this._populateVoices;
            }

        }
        this._populateVoices();
    }

    speak(it, voice, lang, rate, pitch) {

        // habla
        if (!this.synth) {
            console.log('Su navegador o su hard, no tiene sintetizador de voz...');
            return;
        }
        // está hablando
        if (this.synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        var voces = this.voices, wichone = -1;

        var i;

        // First pass (dafult voice)
        for (i = 0; i < voces.length; i++) {
            if (voces[i].default) {
                wichone = i;
                break;
            }
        }
        // Second pass (specified voice name or lang)
        if (wichone === -1 || this.isNumber(voice)) {
            for (i = 0; i < voces.length; i++) {
                if (voces[i].lang === lang || voces[i].name === voice) {
                    wichone = i;
                    break;
                }
            }
        }
        // Third pass (should be her)
        wichone === -1 ? (this.isNumber(voice) ? voice : 0) : 0;

        let ua = new SpeechSynthesisUtterance(it);

        // Estos son los eventos asociados al sintetizador de voz, lo puedes publicar en el constructor...
        ua.onend = function (event) {
            console.log('SpeechSynthesisUtterance.onend');
        }
        ua.onerror = function (event) {
            console.error('SpeechSynthesisUtterance.onerror');
        }

        // Allí se le pasa un objeto de voz
        ua.voice = voces[wichone];

        if (pitch) ua.pitch = pitch;
        if (rate) ua.rate = rate;

        window.speechSynthesis.speak(ua)
    }

    speakPause() {
        this.synth.pause();
    }

    speakResume() {
        this.synth.resume();
    }

    // Geolocalizar la posición del navegador del usuario (si lo permite) y ubicar su posición en el mapper a determinado zoom.

    // evento privado de geolocalización (this is my location response handler)
    _onLocationFound(pos) {
        // Y aquí se guarda la información de la geolocalización...
        this.location = {};
        this.userLocation.latitud = pos.coords.latitude;
        this.userLocation.longitud = pos.coords.longitude;
        this.userLocation.center = new Vector.LatLng(this.userLocation.latitud, this.userLocation.longitud);

        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        function toBounds(sizeInMeters) {
            var latAccuracy = 180 * sizeInMeters / 40075017,
                lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

            return toLatLngBounds([this.lat - latAccuracy, this.lng - lngAccuracy], [this.lat + latAccuracy, this.lng + lngAccuracy]);
        }

        this.userLocation.bounds = toBounds(pos.coords.accuracy);

        this.location.radius = pos.coords.accuracy / 2;
        this.location.accuracy = pos.coords.accuracy;

        this.location.altitude = pos.coords.altitude; // Altitud.
        this.location.altitudeAccuracy = pos.coords.altitudeAccuracy; // Precisión de la altitud.
        this.location.heading = pos.coords.heading; // Este es la brújula papi, creo que responde azimutal en grados desde el norte a favor del tiempo.

        /* Revisar integración móviles en html5 + javascript...

                    .Referencia de los fabricantes de sistemas operativos para Android e Ios.

                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_MAGNETIC_FIELD
                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_LIGHT
                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_AMBIENT_TEMPERATURE
                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_PROXIMITY
                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_PRESSURE
                    https://developer.android.com/reference/android/hardware/Sensor.html#TYPE_PRESSURE

                    .Referencia de los fabricantes de los sensores de hard:

                    Mgr. Jonáš Ševˇcík

                    AK8973 (by Asahi Kasei Corp.) compass/magnetic field sensor integrated
                    L3G4200 (by ST Microelectronics) gyroscopic sensor.
                    BMA150 (by Bosch Sensortec) three-axis accelerometer.
                    ST LYPR540AH Tri-axis MEMS gyroscope

                    .Referencia del w3c consortium, mozilla firefox, google chrome...
         */


        this.location.speed = pos.coords.speed; // Este otro es la velocidad.

        this.userLocation.time = pos.timestamp;

        // Para el seguimiento en tiempo real, es decir, el callback para que actualice la posición...
        if (this.userLocation.options.setView) {
            // aquí pudieses disparar un evento de seguimiento, que haga algo, por ejemplo en leaflet es algo así:
            //let zoom = this.map.getBoundsZoom(this.userLocation.bounds);
            //this.setView(this.userLocation.latlng, this.userLocation.options.maxZoom ? Math.min(zoom, this.userLocation.options.maxZoom) : zoom);
            //document.getElementById(esteMapa.map._container.id).style.transform = "rotate(-" + this.location.heading + "deg)";
        }
    }

    // evento privado de orientación (giróscopo, se dispara si hay un cambio al menos de 1 grado sexagesimal).
    _ondeviceorientation(event) {
        this.userLocation.alpha = Math.round(event.alpha); // rotación en el eje z (negativo en la espalda, positivo en la pantalla),
        this.userLocation.beta = Math.round(event.beta); // rotación en el eje x (negativo a la izquierda, positivo a la derecha),
        this.userLocation.gamma = Math.round(event.gamma); // rotación en el eje y (negativo bajo y positivo arriba).

        /* Si el móvil está en una superficie horizontal (p. ej. una mesa) y apuntando al norte
             (es decir la parte "superior" del móvil hacia el norte) entonces el valor de alpha, beta y gamma es 0.

           Posiciones:

                                    Alfa    Beta    Gamma   Descripcion
            Portrait                0        90°       0°      posición normal de frente
            Portrait upside down    180°    -90°       0°      posición de cabeza de frente
            Landscape left          90        0°     -90°      acostado apuntando a la izqquierda, de frente
            Landscape right         90°    -180°     -90°      acostado apuntando a la derecha, de frente
            Display up               0°       0°       0°      acostado apuntando al frente, pantalla arriba
            Display down             0°    -180°       0°      acostado apuntándote, pantalla abajo

        */

        // Según la brújula de Leaflet
        // (this.userLocation.angle, es el acimut del Headding del móvil con respecto al norte).
        if (event.webkitCompassHeading) {
            //iphone
            this.angle = 360 - event.webkitCompassHeading;
        } else if (e.alpha) {
            //android
            this.angle = this.userLocation.alpha;
        } else {
            throw new Error("No se encuentra la orientación angular del dispositivo...");
        }

        let paraAcimut = this.userLocation.alpha > 180 ? this.userLocation.alpha - 360 : this.userLocation.alpha;
        let paraColatitud = this.userLocation.beta - 90;
        let paraG_nosequees = this.userLocation.gamma > 180 ? 360 - this.userLocation.gamma : -this.userLocation.gamma;

        this.angle = Math.round(this.angle);
        console.warn(`Alpha: ${this.userLocation.alpha},  Beta: ${this.userLocation.beta}, Gamma: ${this.userLocation.gamma}`);
    }

    // evento privado de cálculo de velocidad (velocímetro).
    _ondevicemotion(event) {
        // this.userLocation.acceleration = event.acceleration; // poner aquí la aceleración absoluta o calcularla por pitágoras.
        this.userLocation.acceleration.x = event.acceleration.x; // Normalmente debería devolver 9.81 (m/s²)
        this.userLocation.acceleration.y = event.acceleration.y;
        this.userLocation.acceleration.z = event.acceleration.z;
        this.userLocation.accelerationIncludingGravity.x = event.accelerationIncludingGravity.x * implementationFix; // aceleración incluyendo los efectos de la gravedad terrestre
        this.userLocation.accelerationIncludingGravity.y = event.accelerationIncludingGravity.y * implementationFix;
        this.userLocation.accelerationIncludingGravity.z = event.accelerationIncludingGravity.z;
    }

    // evento privado (this is the error in locating response handler)
    _onLocationError(e) {
        alert("Ha habido un error de código: " + e.code + " (" + e.message + ")");
        if (e.code === 1) {
            // 1->User denied Geolocation 2->Ubicación no disponible 3->Tiempo excedido para geolocalizar.
            throw new Error("Lo sentimos, para que funcione correctamente deberías permitirle a tu navegador acceder a tu localización geográfica.");
        } else if (e.code === 2) {
            throw new Error("La ubicación no se encuentra disponible.");
        } else if (e.code === 3) {
            throw new Error("Se ha excedido el tiempo para geolocalizar.");
        }
    }

    // Aquí la aplicación se conecta con los dispositivos de navegación local
    geoLocalizar(conSeguimientoTiempoReal, enfocandoLaUbicacion, maxZoom) {
        // eg. true, 16; so nice.
        if (!("geolocation" in navigator)) {
            throw new Error("Su navegador no soporta geolocalización.");
        }

        // Aquí se guardan las opciones de geolocalización, así se utilizan el Leaflet...
        this.userLocation = {
            options: {
                watch: conSeguimientoTiempoReal, setView: enfocandoLaUbicacion, maxZoom: maxZoom,
            }, locationWatchId: 0, alpha: 0, beta: 0, gamma: 0,

        };

        this.localeDeviceOptions = {
            imeout: 10000, watch: this.userLocation.options.watch,
        };

        if (this.userLocation.options.watch) {
            navigator.geolocation.getCurrentPosition(this._onLocationFound, this._onLocationError, this.localeDeviceOptions);
        } else {
            this.userLocation.locationWatchId = navigator.geolocation.watchPosition(this._onLocationFound, this._onLocationError, this.localeDeviceOptions);
        }

        if (!window.DeviceMotionEvent) {
            throw new Error("Su navegador no soporta o no manipula los dispositivos de orientación.");
        }

        // Y aquí conecta con los sensores del móvil para la orientación
        this.userLocation.implementationFix = 1;
        if (window.navigator.userAgent.match(/^.*(iPhone|iPad).*(OS\s[0-9]).*(CriOS|Version)\/[.0-9]*\sMobile.*$/i)) {
            // is Mobile Safari
            this.userLocation.implementationFix = -1;
        }

        navigator.addEventListener("deviceorientation", this._ondeviceorientation, true);
        navigator.addEventListener("deviceorientationabsolute", this._ondeviceorientation, true);

        // Y aquí conecta con los sensores de velocidad
        // Revisar: devtools://devtools/bundled/devtools_app.html?remoteBase=https://chrome-devtools-frontend.appspot.com/serve_file/@b6172ef8d07ef486489a4b11b66b2eaeed50d132/&can_dock=true&dockSide=undocked#:~:text=%C6%92%20DeviceMotionEvent()%20%7B%20%5B-,native,-code%5D%20%7D
        navigator.addEventListener("devicemotion", this._ondevicemotion, true);

        // Y aquí para error de la brújula aunque, resuelve con deviceorientation
        navigator.addEventListener("compassneedscalibration", () => {
            throw new Error("Su brújula necesita recalibración! Wave your device in a figure-eight motion !?");
        }, true);
    }

    // Detener el seguimiento de la geolocalización en tiempo real (si está activa).
    detenerSeguimiento() {
        if (navigator.geolocation && navigator.geolocation.clearWatch) {
            navigator.geolocation.clearWatch(this.userLocation.locationWatchId);
        } else {
            throw new Error("Su navegador ni siquiera soporta geolocalización.");
        }
        if (this.localeDeviceOptions) {
            this.localeDeviceOptions.watch = false;
        }
        return this;
    }


    // Para conectar el objeto con un socket web
    // (Para acceder a las redes wifi, bluetooth de forma transparente)

    // Eventos privados manipuladores (drivers) de la conección ws...
    onOpen(evt) {
        this._wsConnected = true;
        console.log(`CONNECTED "${evt.data}"`);
        // doSend("WebSockets Rocks");
    }

    onClose(evt) {
        this._wsConnected = false;
        console.log(`DISCONNECTED "${evt.data}"`);
    }

    onMessage(evt) {
        console.log(`RESPONSE: "${evt.data}".`);
    }

    onError(evt) {
        console.log(`ERROR: "${evt.data}".`);
    }

    // Métodos de manipulación del web socket
    // Test with this address "ws://echo.websocket.org/" o un servidor tuyo... y ponlo a punto.
    connectWebSocket(wsUri) {
        this.websocket = new WebSocket(wsUri);
        this.websocket.onopen = function (evt) {
            return this.onOpen ? this.onOpen(evt) : null;
        };
        this.websocket.onclose = function (evt) {
            return this.onClose ? this.onClose(evt) : null;
        };
        this.websocket.onmessage = function (evt) {
            return this.onMessage ? this.onMessage(evt) : null;
        };
        this.websocket.onerror = function (evt) {
            return this.onError ? this.onError(evt) : null;
        };
    }

    disConnectWebSocket() {
        try {
            this.websocket.close();
            this._wsConnected = false;
        } catch (e) {
            console.log(`COULD'NT DISCONNECT BCOZ: "${e}".`);
        }
    }

    // Test with this "WebSockets Rocks" or whatever you wan't.
    webSocketDoSend(message) {
        try {
            this.websocket.send(message);
            console.log(`SENT: "${message}".`);
        } catch (e) {
            console.log(`COULD'NT B'SENT BCOZ: "${e}".`);
        }
    }

    /////////////////////////////////////////////
    // Sección de reconocimiento de voz


    calibrateVoiceRecognition(lang) {
        this.SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        this.SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        this.SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        if (!lang) {
            lang = "es-ES";
        }

        this.phrases["en-US"] = ['I love to sing because it\'s fun', 'where are you going', 'can I call you tomorrow', 'why did you talk while I was talking', 'she enjoys reading books and playing games', 'where are you going', 'have a great day', 'she sells seashells on the seashore'];
        this.phrasesES["es-ES"] = ['Me gustan las modelos y las matemáticas', 'Dónde vas', 'Súbele el volumen al componente', 'Te llamo mañana', 'Qué fue lo que me dijiste', 'A ella le gusta jugar y leer', 'Qué estás haciendo', 'Pásala bien', 'Puedes venir', 'Ella vende ropa importada', 'Uno, dos, hola'];


        console.log('Voice calibration in progress');

        function randomPhrase() {
            var number = Math.floor(Math.random() * phrases.length);
            return number;
        }

        this.phrase = phrases[lang][randomPhrase()];
        // To ensure case consistency while checking with the returned output text
        this.phrase = this.phrase.toLowerCase();
        phrasePara.textContent = this.phrase;
        resultPara.textContent = 'Right or wrong?';
        resultPara.style.background = 'rgba(0,0,0,0.2)';
        diagnosticPara.textContent = '...diagnostic messages';

        this.grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + this.phrase + ';';
        this.recognition = new SpeechRecognition();
        this.speechRecognitionList = new SpeechGrammarList();
        this.speechRecognitionList.addFromString(this.grammar, 1);

        this.recognition.grammars = this.speechRecognitionList;
        this.recognition.lang = lang;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.start();

        this.recognition.onresult = function (event) {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at position 0.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            this.speechResult = event.results[0][0].transcript.toLowerCase();
            diagnosticPara.textContent = 'Speech received: ' + this.speechResult + '.';
            if (this.speechResult === this.phrase) {
                console.log('I heard the correct phrase!');
            } else {
                console.log(`That didn't sound right.`);
            }
            console.log('Confidence: ' + event.results[0][0].confidence);
        }

        this.recognition.onspeechend = function () {
            this.recognition.stop();
        }

        this.recognition.onerror = function (event) {
            console.log('Error occurred in recognition: ' + event.error + ', just try to start new test.');
        }

        this.recognition.onaudiostart = function (event) {
            //Fired when the user agent has started to capture audio.
            console.log('SpeechRecognition.onaudiostart');
        }

        this.recognition.onaudioend = function (event) {
            //Fired when the user agent has finished capturing audio.
            console.log('SpeechRecognition.onaudioend');
        }

        this.recognition.onend = function (event) {
            //Fired when the speech recognition service has disconnected.
            console.log('SpeechRecognition.onend');
        }

        this.recognition.onnomatch = function (event) {
            //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
            console.log('SpeechRecognition.onnomatch');
        }

        this.recognition.onsoundstart = function (event) {
            //Fired when any sound — recognisable speech or not — has been detected.
            console.log('SpeechRecognition.onsoundstart');
        }

        this.recognition.onsoundend = function (event) {
            //Fired when any sound — recognisable speech or not — has stopped being detected.
            console.log('SpeechRecognition.onsoundend');
        }

        this.recognition.onspeechstart = function (event) {
            //Fired when sound that is recognised by the speech recognition service as speech has been detected.
            console.log('SpeechRecognition.onspeechstart');
        }

        this.recognition.onstart = function (event) {
            //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
            console.log('SpeechRecognition.onstart');
        }
    }

    // Utiliza esta para activar reconocimiento de voz
    startVoiceRecognition() {
        try {
            this.recognition.start();
        } catch (e) {
            console.log(` Error ${JSON.stringify(e)}, parece que su navegador no soporta reconocimiento de voz; si así fuere, recuerde primero calibrar,\n puede utilizar el método: calibrateVoiceRecognition("es-ES").`);
        }
    }

    // Utiliza esta para desactivar reconocimiento de voz
    endVoiceRecognition() {
        this.recognition.end();
    }

    // alias
    isDebugMode() {
        return this.debugMode;
    }

    /////////////////////////////////////////////////////////
    isArray(input) {
        return (input instanceof Array || Object.prototype.toString.call(input) === '[object Array]');
    }

    isString(value) {
        let toString = {}.toString;
        return typeof value === 'string' || toString.call(value) === '[object String]';
    }

    isObject(value) {
        let toString = {}.toString;
        return value != null && typeof value === 'object' && !Array.isArray(value);
    }

    hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (Object.hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    isUndefined(input) {
        return input === void 0;
    }

    // is ok
    isNumber(str) {
        try {
            var tmp = Number((String(str)).trim());
            // pero además...
            if (((str !== 0) && (str !== "0") && (tmp === 0)) || isNaN(tmp)) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    // verdadero si el cáracter es una de esas letras ().
    isAlphabetic(expr) {
        let alphaCheck = /^[a-zA-Z_áéíóúüÁÉÍÓÚÜñÑ]+$/g;
        return alphaCheck.test(expr);
    }

    isAlphabeticAt(expr, position) {
        if (str.length < position + 1) return false;
        return (
            String(
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZAáéíóúüÁÉÍÓÚÜñÑ',
            ).indexOf(str.substr(position, 1)) !== -1
        );
    };

    isSpecialOrSpace(expr) {
        return String(expr).trim() === '';
    }

    // verdadero si el cáracter es una letra o un número.
    isAlphanumeric(expr) {
        return this.isNumber(expr) || this.isAlphabetic(expr);
    }

    // Verfica que la primera sentencia de la cadena es un comentario correcto., TESTED 13:54|21/04/2022
    isComment(line) {
        return this.left(line.trim(), 2) === "//" || ((this.left(line.trim(), 2) === "/*") && this.sintaxCheck(line, line.indexOf("//") + 2));
    }

    isoperator(line) {
        // Determinar si el próximo token de line es un operador
        const operadores = ["instanceof", "typeof", ">>>=", ">>>", ">>=", "<>=", "===", "!==", "<=", ">=", "&&", "||", "++", "--", "+=", "-=", "*=", "/=", "%=", "^=", "&=", "!=", "|=", "&", "|", "^", "", "<", ">", "-", "!", "~", "+", "-", "*", "/", "%", ";", ",", "=>"];
        var savedLine = line.trim();
        for (var i = 0; i < operadores.length; i++) {
            if (this.left(savedLine, operadores[i].length) === operadores[i]) {
                return operadores[i];
            }
        }
        return false;
    }

    isSymbol(line) {
        // Determinar si el próximo token de line es un operador
        const simbolos = [";", ".", "@", "#", "$", "%", "^", "&", "*", "~", ":", "{", "}", "=", "[", "]", ",", ">", "<"];
        var savedLine = line.trim();
        for (var i = 0; i < simbolos.length; i++) {
            if (this.left(savedLine, String(simbolos[i]).length) === simbolos[i]) {
                return simbolos[i];
            }
        }
        return false;
    }

    // revisar
    isClassConst(line) {
        // Determinar si es una función
        line = line.trim();
        if (this.begins(line, "constructor")) {
            var firstParBeg = line.indexOf("(");
            if (firstParBeg === false) return false;
            var firstParEnd = this.sintaxCheck(line, line.indexOf("("));
            if (firstParEnd === false) return false;
            var corpusBeg = line.indexOf("{");
            if (corpusBeg === false || corpusBeg < firstParEnd) return false;
            var corpusEnd = this.sintaxCheck(line, line.indexOf("{"));
            if (corpusEnd === false) return false;
            return true;
        }
        return false;
    }


    // Verfica que la primera instancia de cadena esté bien formada y devuelve su posición final., TESTED 13:54|21/04/2022
    isQuotedString(line) {
        var posicion;
        for (let index = 0; index < 3; index++) {
            const stringSeparator = ["'", "`", '"'][index];
            if (this.left(line.trim(), 1) === stringSeparator) {
                posicion = line.indexOf(stringSeparator, line.indexOf(stringSeparator) + 1);
                if (posicion !== -1) {
                    return posicion; // eureka
                }
            }
        }
        return false;
    }

    isQuotedParenthesis(line) {
        return left(line.trim(), 1) === "(" && sintaxCheck(line, line.indexOf("(") !== -1);
    }

    isIdentifier(line, position = 0) {
        if ((!line) || (line.length === 0) || isNumericAt(line, position)) {
            return false;
        }
        var pos = position;
        while ((pos < line.length - 1) && isAlphanumericAt(line, pos)) {
            pos++;
        }
        return pos;
    }

    // Determinar si es un identificador
    isBlock(line) {
        if ((!line) || (line.length === 0)) {
            return false;
        }
        line = line.trim();
        return (this.left(line, 1) === "{" && this.sintaxCheck(line, 0) !== -1);
    }

    // Revisar (si es una declaración de clase)
    isClassDecl(str) {

        function getNextIdentifier(str, position) {
            if (!str) {
                return '';
            }
            let tmp = String(str).trim();
            if ((tmp.length === 0) || this.isNumericAt(tmp, position)) {
                return '';
            }
            let posicion = 1;
            let result = '';
            while ((posicion < tmp.length) && this.isAlphanumericAt(tmp, posicion)) {
                posicion++;
            }
            if (this.isIdentifier(tmp)) {
                result = tmp.substring(0, posicion).trim();
            }
            return result;

        }

        var next, tmp = str.trim();
        var lista = [];
        var result = { name: next, exported: false, extends: null, implements: [] };

        // Parseo rápido de identificadores por espacio antes del primer símbolo
        next = getNextIdentifier(tmp);
        tmp = this.recortarPorlaIzquierda(tmp, next.length).trim();
        while (next !== "" && tmp.trim().length !== 0) {
            lista.push(next);
            next = getNextIdentifier(tmp);
            tmp = this.recortarPorlaIzquierda(tmp, next.length).trim();
        }
        var declaraClase = false;
        var identificadorDesconocido = false;
        for (let index = 0; index < lista.length - 1; index++) {
            const element = lista[index];
            switch (element) {
                case "export":
                case "extends":
                case "implements": {
                    break;
                }
                case "class": {
                    declaraClase = true;
                    break;
                }
            }
        }
        if (!this.isBlock(tmp)) return false;
        return declaraClase && this.isBlock(tmp) !== -1 ? true : false;
    }

    firstCharacter(expr) {
        return expr.charAt(0);
    }

    lastCharacter(expr) {
        return expr.charAt(expr.length - 1);
    }

    // Estas funciones me cortan una subcadenas de desde la izquierda o desde la derecha
    left(str, l) {
        return String(str).substring(0, l);
    }

    right(str, l) {
        return String(str).substring(str.length - l, str.length);
    }

    ends(str, s) {
        return this.right(str, s.length) === s;
    }

    eliminarSufijo(str, s) {
        if (this.right(str, s.length) === s) {
            return this.left(str, str.length - s.length);
        } else {
            return str;
        }
    }

    begins(str, s) {
        return this.left(str, s.length) === s;
    }

    eliminarPrefijo(str, s) {
        if (this.left(str, s.length) === s) {
            return this.right(str, str.length - s.length);
        } else {
            return str;
        }
    }

    // recortar por la izquierda a la cadena, con tantos caracteres como aparezcan el caracteres... ok tested
    recortarPorlaIzquierda(str, caracteres) {
        if (!str || str.length === 0 || caracteres > str.length) {
            return "";
        }
        return String(str).substring(caracteres);
    }

    esMayuscula(position) {
        return this[position] === this[position].toLocaleUpperCase();
    }

    _sameLetter(a, b) {
        return (String(a).toLocaleLowerCase() === String(b).toLocaleLowerCase());
    }


    isDate(input) {
        return (input instanceof Date || Object.prototype.toString.call(input) === '[object Date]');
    }

    _map(arr, fn) {
        var res = [], i, arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    // alias, lo que piensas.
    log(message, context = "Application") {
        if (this.quiet) return;
        try {
            console.log(`${context}: ${(new Date()).toISOString()}: ${typeof (message) === 'object' ? JSON.stringify(message) : message}`);
        } catch (e) {
        }
    }

    static _enableLogging = function (enable = true) {
        this.debugMode = enable;
    };

    static _disableLogging = function (disable = false) {
        WebSystemObject._enableLogging(disable);
    };

    cls() {
        if (this.quiet) return;
        console.clear();
    }

    consoleTimerStart(processName) {
        if (this.quiet) return;
        if (!processName) {
            throw new Error("Necesita un nombre para registrar el proceso a temporizar.");
        }
        console.time(procesName);
    }

    consoleTimerEnd(procesName) {
        if (this.quiet) return;
        if (!processName) {
            throw new Error("Necesita un nombre de proceso para temporizar.");
        }
        console.timeEnd(processName);
    }

    consoleError(x) {
        if (this.quiet) return;
        let failure = ["background: red", "color: white", "display: block", "text-align: center",].join(";");
        console.error("%c " + x, failure);
    }

    consoleSucess(x) {
        if (this.quiet) return;
        let sucess = ["background: green", "color: white", "display: block", "text-align: center",].join(";");
        console.log("%c " + x, success);
    }

    consoleTable(x) {
        if (this.quiet) return;
        if (!x) {
            x = this;
        }
        console.table(x); // Aquí espera un arreglo
    }

    // borrar la consola...
    clearConsole() {
        if (this.quiet) return;
        this.cls();
    }

    dpEnter() {
        if (this.quiet) return;
        this.writeLn();
    }

    debugPrint(x) {
        if (this.quiet) return;
        this.log(x);
    }

    console(objective, theObject) {
        if (this.quietMode) return;
        if (!objective) {
            console.log(this);
        } else {
            if (!theObject) {
                console.dir(this);
            } else {
                if (theObject instanceof Array) {
                    console.table(theObject);
                } else if (theObject instanceof Object) {
                    console.log(`Miembros del objeto %o, de tipo: ${theObject.constructor.name}.`, theObject);
                } else {
                    // redirecciona, no era necesario objective, no es un objeto.
                    (new superString(theObject)).console(false);
                }
            }
        }
    }


    // Generar una tabla html a partir de un objeto
    mensajeEmergente(objeto, estilo) {
        if (!estilo) {
            estilo = "border=1";
        }
        var popupContent = `<table ${estilo}>`;
        // Títulos
        popupContent += "<thead>";
        for (let llave in objeto) {
            popupContent += "<th>";
            popupContent += llave.toString().bold();
            popupContent += "</th>";
        }
        popupContent += "</thead>";
        // Contenido
        popupContent += "<tbody>";
        popupContent += '<tr>';
        for (let llave in objeto) {
            let valor = objeto[llave];
            if (typeof (valor) == 'boolean') {
                valor = (valor ? 'Sí' : 'No');
            } else {
                valor = ((objeto[llave]) !== null ? String((objeto[llave])) : '');
            }
            popupContent += '<td>' + valor.toString().italics() + '</td>';
        }
        popupContent += '</tr>';
        popupContent += "<tbody>";
        popupContent += '</table>';

        alert(popupContent);
        return popupContent;
    }


    seAdvierte(msg) {
        if (this.quiet || !console.warn) return;
        console.warn('Deprecation warning: ' + msg);
    }

    // Hay que poner a punto todas las funciones del depuración y consola
    // A partir de aquí, todas las funciones utilitarias

    // Devuelve un arreglo estúpido con la cosa repetida esa cantidad de veces.
    repetir(cosa, veces) {
        var arr = [];
        for (var i = 0; i < veces; i++) {
            arr.push(cosa);
        }
        return arr;
    }

    // indentar (justificar) un texto a tantos espacios
    indentar(texto, spaces) {
        var lines = (texto || '').split('\n');
        var newArr = [];
        for (var i = 0; i < lines.length; i++) {
            newArr.push(this.repetir(' ', spaces).join('') + lines[i]);
        }
        return newArr.join('\n');
    }

    /**
     * Convert a input value to a number for persistence.
     */
    toNumber(val) {
        if (!val) {
            val = this.toString();
        }
        var n = parseFloat(val);
        if (isNaN(n)) {
            throw new Error(`Please reconsider, ${s} is not a number.`);
        }
        return isNaN(n) ? val : n;
    }

    /* Nice to mee you too, vue 'l come Cuba */
    stringifyArray(value) {
        var res = "";
        var stringified;
        for (var i = 0, l = value.length; i < l; i++) {
            if (this.isDef((stringified = this._stringifyClass(value[i]))) && stringified !== "") {
                if (res) {
                    res += " ";
                }
                res += stringified;
            }
        }
        return res;
    }

    stringifyObject(value) {
        var res = "";
        for (var key in value) {
            if (value[key]) {
                if (res) {
                    res += " ";
                }
                res += key;
            }
        }
        return res;
    }


    // Chequear si un objeto es igual a otro nodo
    // Esta función determina si los elementos son iguales, independientemente del tipo que sean (re-entrante).

    // Lo mismo, corregida versión de 17-11-2022
    equals(a, b) {
        // chequea si el argumento es primitivo, (en tal caso, el compilador o intérprete puede aplicar operadores de igualdad).
        if (this.hasPrimitiveType(a) && this.hasPrimitiveType(b)) {
            return a === b; // coerción en primitivas
        } else if ((a instanceof Array) && (b instanceof Array)) {
            if (a.length === 0) {
                return b.length === 0;
            } else if (b.length === 0) {
                return (a.length === 0);
            } else if (a.length !== b.length) {
                return false;
            } else {
                for (var i = 0; i < a.length; i++) {
                    if (!this.equals2(a[i], b[i])) {
                        return false;
                    }
                }
            }
        } else {
            if (a.some(p => (a.hasOwnProperty(p) && (!b.hasOwnProperty(p) || !this.equals2(b[p], a[p])))) || b.some(p => (b.hasOwnProperty(p) && (!a.hasOwnProperty(p) || !this.equals2(a[p], b[p]))))) {
                return false;
            }
        }
        return true;
    }

    /*  Obtiene el nombre de la clase:
        getClass("")              === "String";
        getClass(true)            === "Boolean";
        getClass(0)               === "Number";
        getClass([])              === "Array";
        getClass({})              === "Object";
        getClass(null)            === "Null";
        getClass(undefined)       === "Undefined";
        getClass(new Point(0 ,0)) === "Point";
        etc...
        @based on the work of:
    */
    GetClass(obj) {
        if (typeof (obj) === "undefined") {
            return "Undefined";
        }
        if (obj === null) {
            return "Null";
        }
        var res = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        if (res === "Object") {
            res = obj.constructor.name;
            if (typeof (res) != 'string' || res.length == 0) {
                if (obj instanceof jQuery) {
                    return "jQuery";
                }// jQuery build stranges Objects
                if (obj instanceof Array) {
                    return "Array";
                }// Array prototype is very sneaky
                return "Object";
            }
        }

        function capitalize(str) {
            let result = str;
            if (result.length > 0) {
                result = String(result.substr(0, 1)).toLocaleUpperCase();
            }
            if (str.length > 1) {
                result += String(str.substring(1).toLocaleLowerCase());
            }
            return result;
        }

        if (this.hasPrimitiveType(obj)) {
            res = capitalize(res); // estos primitivos, se consideran de clase
        }
        return res;
    }

    /**
     * Mix from properties into self object and return it;
     */
    extend(from) {
        for (var key in from) {
            this[key] = from[key];
        }
        return this;
    }

    /**
     * Perform no operation.
     * Stubbing args to make Flow happy without leaving useless transpiled code
     * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
     */
    noop(a, b, c) {
    }

    /**
     * Always return false.
     */
    no(a, b, c) {
        return false;
    }

    // these helpers produces better vm code in JS engines due to their

    /**
     * Return same value
     */
    identity(_) {
        return _;
    }

    // explicitness and function inlining
    isUndef(v) {
        return v === undefined || v === null;
    }

    isDef(v) {
        return v !== undefined && v !== null;
    }

    isTrue(v) {
        if (!v) {
            v = this;
        }
        return v === true;
    }

    isFalse(v) {
        if (!v) {
            v = this;
        }
        return v === false;
    }

    // Is object?
    isObject(input) {
        return input instanceof Object;
    }

    isZero(v) {
        if (this.isUndef(v)) {
            return this.isNumber() && Number(this.toString()) === 0;
        } else {
            return this.isNumber(v) && Number(v.toString()) === 0;
        }
    }

    /**
     * Check if value is primitive
     */
    hasPrimitiveType(x) {
        return (typeof (x) == "boolean") || (typeof (x) == "number") || (typeof (x) == "string") || // $flow-disable-line
            (typeof (x) == "symbol") || (x instanceof Boolean) || (x instanceof Number) || (x instanceof String);
    }

    seAlerta(mensaje) {
        alert(mensaje);
    }

    seRespondePositivamente(pregunta) {
        return confirm(pregunta);
    }

    seConfirma(captionPregunta, confirmacion) {
        return prompt(captionPregunta, confirmacion);
    }

    dump(prelud) {
        if (!prelud) {
            prelud = this;
        }
        let tipo = typeof prelud;
        if (this.hasPrimitiveType(prelud)) {
            if (typeof prelud == "boolean") {
                tipo = "lógico";
                prelud = prelud ? "Sí" : "No";
            }
            console.log("(%s) = " + prelud, tipo);
        } else if (prelud instanceof Array) {
            console.group("Elementos del arreglo primitivo (js):");
            console.table(prelud);
            console.groupEnd();

        } else if (prelud instanceof Object) {
            console.log(`Miembros del objeto %o, de tipo: ${prelud.constructor.name}.`, prelud); // debes hacerlo así Miembros del objeto %o, de tipo tal:
        }
    }

    windowOpen(url = "", nameofWindow = "", html = "", width = 20, height = 20, resizable = true, menubar = false, toolbar = false, directories = false, location = false, scrollbars = true, status = false) {
        // Es perfectamente válido, para crear una ventana nueva e introducirle contenido html
        function intoit(tf) {
            return tf ? "yes" : "no"
        }

        var features = `width = ${width}, height = ${height}, resizable = ${intoit(resizable)}, menubar = ${intoit(menubar)}, toolbar = ${intoit(toolbar)}, directories = ${intoit(directories)}, location = ${intoit(location)}, scrollbars = ${intoit(scrollbars)}, status = ${intoit(status)}`
        var msg = window.open("", "DiplayWindowName", features);
        msg.document.write(html);
        return msg;
    }

    // Obtener la instancia del elemento por su id en el DOM, sino intenta buscarlo por su nombre...
    justGetTheElement(nameOrId) {
        var element;
        element = document.getElementById(nameOrId);
        if (!element) {
            var elements = document.getElementsByName(nameOrId);
            if (elements.length > 0) {
                return elements[0];
            } else {
                throw new Error(`No se encuentra el elemento ${nameOrId} en el DOM.`);
                return null;
            }
        }
    }

    /*
        Función que añade un evento a un objeto del DOM, válida tanto para el código propietario de IE como para el estándar definido por la W3C
        Basado en un demo de la wiki como demostración del paradigma no obstructivo... (Guess http://www.onlinetools.org/articles/unobtrusivejavascript/)

    */

    attachEventToDOM(name, elem, func, propagationOrUseCapture = true) {
        let obj, eventName = name;

        if (elem instanceof String) {
            try {
                obj = this.justGetTheElement(elem);
            } catch (e0) {
                throw new Error(e0.message);
            }
        } else {
            obj = elem;
        }

        if (!obj) {
            throw new Error("There is not an objective to be attached.");
        }

        function normalAttach(o, e, f, p) {
            if (o.addEventListener) {
                return o.addEventListener(e, f, p);
            } else if (o.attachEvent) {
                return o.attachEvent(e, f, p);
            } else {
                o[e] = f; // and then
                console.warn(`Warning: cannot be associated event "${e}" to object.`);
            }
        }

        if (eventName.substring(0, 4) === "onon") {
            console.log(`Warning: event name "${eventName}" could be ambivalent.`);
        }

        try {
            return normalAttach(elem, eventName, func, propagationOrUseCapture);
        } catch (e1) {
            while (eventName.substring(0, 2) === "on") {
                eventName = eventName.substring(2);
            }
            try {
                return normalAttach(elem, "on" + eventName, func, propagationOrUseCapture);
            } catch (e2) { // and let raise error
                return normalAttach(elem, "onon" + eventName, func, propagationOrUseCapture); // ononline ?
            }
        }
    }

    detachEventFromDOM(name, elem, func) {
        let obj, eventName = name;

        if (elem instanceof String) {
            try {
                obj = this.justGetTheElement(elem);
            } catch (e0) {
                throw new Error(e0.message);
            }
        } else {
            obj = elem;
        }

        if (!obj) {
            throw new Error("There is not an objective to be attached.");
        }

        function normalDetach(o, e, f) {
            if (o.removeEventListener) {
                return o.removeEventListener(e, f);
            } else if (o.detachEvent) {
                return o.detachEvent(e, f);
            } else {
                o[e] = null; // and then
                throw new Error(`Cannot be dissasociated evento "${e}" from object.`);
            }
        }

        if (eventName.substring(0, 4) === "onon") {
            console.log(`Warning: event name "${eventName}" could be ambivalent.`);
        }

        try {
            return normalDetach(elem, eventName, func);
        } catch (e1) {
            while (eventName.substring(0, 2) === "on") {
                eventName = eventName.substring(2);
            }
            try {
                return normalDetach(elem, "on" + eventName, func);
            } catch (e2) { // and let raise error
                return normalDetach(elem, "onon" + eventName, func); // ononline ?
            }
        }
    }

    // Funciones para Cookies ESCAPE
    // Escrito por: Bill Dortch, hIdaho Design
    // Las funciones siguientes se ceden al dominio publico
    encode(str) {
        var dest = "";
        var len = str.length;
        var index = 0;
        var code = null;
        for (var i = 0; i < len; i++) {
            var ch = str.charAt(i);
            if (ch === " ") {
                code = "%20";
            } else switch (ch) {
                case "%": {
                    code = "%25";
                    break;
                }
                case ",": {
                    code = "%2C";
                    break;
                }
                case ";": {
                    code = "%3B";
                    break;
                }
                case "\b": {
                    code = "%08";
                    break;
                }
                case "\t": {
                    code = "%09";
                    break;
                }
                case "\n": {
                    code = "%OA";
                    break;
                }
                case "\f": {
                    code = "%OC";
                    break;
                }
                case "\r": {
                    code = "%OD";
                    break;
                }
                default: {
                    if (code) {
                        dest += str.substring(index, i) + code;
                        index = i + 1;
                        code = null;
                    }
                }
            }
        }
        if (index < len) dest += str.substring(index, len);
        return dest;
    }

    // this is the UNESCAPE source code
    decode(str) {
        var dest = "";
        var len = str.length;
        var index = 0;
        var code = null;
        var i = 0;
        while (i < len) {
            i = str.index0f("%", i);
            if (i === -1) break;
            if (index < i) dest += str.substring(index, i);
            code = str.substring(i + l, i + 3);
            i += 3;
            index = i;
            if (code == "20") dest += " "; else if (code === "25") dest += "%"; else if (code === "2C") dest += ","; else if (code === "3B") dest += ";"; else if (code === "08") dest + -"\b"; else if (code === "09") dest += "\t"; else if (code === "OA") dest += "\n"; else if (code === "OC") dest += "\f"; else if (code === "OD") dest += "\r"; else {
                i -= 2.
                index -= 3;
            }
        }
        if (index < len) dest += str.substring(index, len);
        return dest;
    }

    getcookieVal(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr === -1) endstr = document.cookie.length;
        return decodeURI(document.cookie.substring(offset, endstr));
    }

    Getcookie(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substrinq(i, j) === arg) return this.getcookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i === 0) break;
        }
        return null;
    }

    Setcookie(name, value, expires = manhana().toGMTString(), creationTime = hoy().toGMTString(), lastAccesed = hoy().toGMTString(), host = "127.0.0.1", path = "/", domain = null, httpOnly = false, hostOnly = true, secure = false, sameSite = 'none', size = 100) {
        var argv = this.Setcookie.arguments;
        var argc = argv.length;
        document.cookie = name + "=" + encodeURI(value) + (!creationTime ? "" : ("; creationTime=" + creationTime)) + (!expires ? "" : "; expires=" + expires) + (!httpOnly ? `; httpOnly=${httpOnly} ? "true"` : `"false"};`) + (!hostOnly ? "" : "; expires=" + expires) + (!host ? "" : "; host='" + host + "'") + (!path ? "" : "; path='" + path + "'") + (!domain ? "" : "; domain='" + domain + "'") + (!sameSite ? "; sameSite='none';" : `; sameSite='${sameSite}'`) + (!secure ? "" : "; secure") + (`; size=${size};`) + (!lastAccesed ? "" : "; lastAccesed=" + lastAccesed);
    }


    // inspect
    inspect(obj) {
        if (!obj) {
            obj = this;
        }
        console.dir(obj);
    }

    // Inspeccionar el cuerpo
    inspectDocumentBody() {
        console.dir(document.body);
    }

    inspectNavigator() {
        console.dir(navigator);
    }

    construirUnObjeto(jsonDefinition) {
        return JSON.parse(jsonDefinition);
    }

    // Me dice a qué clase pertenece ó si es objeto
    tipoDeObjetoDe(o) {
        return typeof o;
    }

    // Me dice si objeto o pertenece a una clase c
    esInstanciaDe(c) {
        return this instanceof c;
    }

    estaVacio(o) {
        for (var key in o) {
            return false;
        }
        return true;
    }

    esBooleano(o) {
        return typeof o == "boolean";
    }

    // is ok
    isNumber(str) {
        try {
            var tmp = Number((String(str)).trim());
            // pero además...
            if (((str !== 0) && (str !== "0") && (tmp === 0)) || isNaN(tmp)) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    esEntero(o) {
        return this.isNumber(o) && (o | 0) == o;
    }

    esNulo(o) {
        return o === null;
    }

    esUnArreglo(o) {
        return o instanceof Array;
    }

    esUnaVentana(a) {
        return null != a && a == a.window;
    }

    // Welcome mathematical area (some function's taken from rtl.js free object pascal)

    esUnaVentanaVisible(imagen) {
        // eg. var imagen = document.querySelector(".rast-photo");
        var visible = false;
        var posTopView = window.scrollY;
        var posButView = posTopView + window.innerHeight;
        var elemTop = imagen.offsetTop;
        var elemBottom = elemTop + imagen.offsetHeight;
        if ((elemBottom < posButView && elemBottom > posTopView) || (elemTop > posTopView && elemTop < posButView)) {
            if (visible === false) {
                return true;
            }
        } else {
            if (visible === true) {
                return false;
            }
        }
    }

    // 32 bits operations

    // FloatToStr converts the floating-point value given by Value to its string representation.
    floatToStr(d, w, p) {
        // input 1-3 arguments: double, width, precision
        if (arguments.length > 2) {
            return rtl.spaceLeft(d.toFixed(p), w);
        } else {
            // exponent width
            var pad = "";
            var ad = Math.abs(d);
            if (ad < 1.0e10) {
                pad = "00";
            } else if (ad < 1.0e100) {
                pad = "0";
            }
            if (arguments.length < 2) {
                w = 9;
            } else if (w < 9) {
                w = 9;
            }
            var p = w - 8;
            var s = (d > 0 ? " " : "") + d.toExponential(p);
            s = s.replace(/e(.)/, "E$1" + pad);
            return rtl.spaceLeft(s, w);
        }
    }

    _lw(l) {
        // fix longword bitwise operation
        return l < 0 ? l + 0x100000000 : l;
    }

    and(a, b) {
        var hi = 0x80000000;
        var low = 0x7fffffff;
        var h = (a / hi) & (b / hi);
        var l = a & low & (b & low);
        return h * hi + l;
    }

    and(a, b, c, d) {
        return this.and(this.and(a, b), this.and(c, d));
    }

    or(a, b) {
        var hi = 0x80000000;
        var low = 0x7fffffff;
        var h = (a / hi) | (b / hi);
        var l = (a & low) | (b & low);
        return h * hi + l;
    }

    or(a, b, c, d) {
        return this.or(this.or(a, b), this.or(c, d));
    }

    xor(a, b) {
        var hi = 0x80000000;
        var low = 0x7fffffff;
        var h = (a / hi) ^ (b / hi);
        var l = (a & low) ^ (b & low);
        return h * hi + l;
    }

    shr(a, b) {
        if (a < 0) a += this.maxint;
        if (a < 0x80000000) return a >> b;
        if (b <= 0) return a;
        if (b > 54) return 0;
        return Math.floor(a / Math.pow(2, b));
    }

    shl(a, b) {
        if (a < 0) a += this.maxint;
        if (b <= 0) return a;
        if (b > 54) return 0;
        var r = a * Math.pow(2, b);
        if (r <= this.maxint) return r;
        return r % this.maxint;
    }

    // Algunos métodos numéricos, bajo validación.

    identicalOnTheRange(x) {
        return 1 / 2 + Math.atan(Math.tan((Math.PI * x) - (Math.PI / 2))) / Math.PI;
    }

    integerPart(x) {
        return Math.trunc(x);
    }

    fractionalPart(x) {
        return x < 0 ? x + this.integerPart(x) : x - this.integerPart(x);
    }

    // both numbers are equals under ... ?
    equivalents(a, b, eps = this.epsilon) {
        return (a === b) || Math.abs(a - b) <= eps;
    }

    isInteger(x, eps = this.epsilon) {
        return Math.abs(x - Math.trunc(x)) <= eps;
    }

    isFraction(x, eps = this.epsilon) {
        return !this.isInteger(x, eps);
    }

    // this is a generalization of module, over commensurable numbers of rational real sub set.
    module(x, y) {
        return x - y * Math.floor(x / y);
    }

    residuo(x, y) {
        return x - y * Math.floor(x / y);
    }

    // divisibility of a by b.
    divides(a, b, eps = this.epsilon) {
        return !this.equivalents(b, 0, eps) && this.equivalents(this.module(a, b), 0, eps);
    }

    Gamma(x) {
        // Útil para demostrar el teorema de Wilson
        // function residuo(x, y) {
        //     return x - y * Math.floor(x / y);
        // }
        // function wilson(x) {
        //     return residuo(gamma(x - 1), x) === 1;
        // }
        console.log(x);
        let epsilon = 1e-17; // error permisible
        function vecindad(q, t) { // verdadero si t está en la epsilon vecidad de q
            return Math.abs(q - t) < epsilon;
        }

        function formulaDefinitoria(y) {
            return (y - 1) * this.Gamma(y - 1);
        }

        function formulaDeDuplicacion(y) {
            return (this.Gamma(y / 2) * this.Gamma((y + 1) / 2)) * (Math.pow(2, y - 1) / Math.sqrt(Math.PI));
        }

        function formulaDeInversion(z) {
            return Math.PI / (this.Gamma(1 - z) * Math.sin(Math.PI * z));
        }

        /*
            Otras propiedades para futuras implementaciones

            Gamma(1/2 + x) * Gamma(1/2 + x) = π / Cos(πx)
            Si n es un número natural, entonces:
            Gamma(n*z) = Math.pow(n, (n*z) - 1/2) * Math.pow((2*Math.PI), (1-n)/2) * (k = 0 to n - 1)∏Gamma(z + k/n)
            También:
            eᵞ = 1.781072417990197985236 y ᵞ = 0.577 215 664 901 532 860 606
            Gamma(z) =  (Math.pow(1.781072417990197985236, z)/z) * (n = 1 to ∞)∏ [Math.Exp(z/n)/(1 + z/n)]
        */
        function corneliusLanczos1964(x) {
            var p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
            var g = 7;
            if (x < 0.5) {
                return Math.PI / (Math.sin(Math.PI * x) * Gamma(1 - x));
            }
            x -= 1;
            var a = p[0];
            var t = x + g + 0.5;
            for (var i = 1; i < p.length; i++) {
                a += p[i] / (x + i);
            }
            return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
        }

        function byInfiniteProductFormula(z, precision = 0.0001) { // Euler y Weierstrass
            let absolutePrecision = 1 + precision;
            // let absolutePrecision = 1 + Math.pow(precision, z);
            if (z === 0 || z == 1) return 1;
            let producto, resultado = 1, k = 0;
            do {
                k++; // starts on 1
                producto = Math.pow(1 + (1 / k), z) / (1 + z / k);
                resultado *= producto;
            } while (producto > absolutePrecision);
            return resultado / z;
        }

        if (x < 0) {  // Negativos
            return formulaDeInversion(x);
        } else if (vecindad(x, 0) || vecindad(x, 1)) { // casi 0 o 1 dentro de lo permisible
            return 1;
        } else if (x > 0 && x < 1) { // entre 0 y 1
            // retornar optimización de gamma para el caso 0 < x < 1, utilizano un método...
            // Valores exactos
            if (vecindad(x, 1 / 2)) {
                return Math.sqrt(Math.PI);
            } else { // Para el intervalo 0 < x < 1, se utiliza la aproximación de Lanczos
                return corneliusLanczos1964(x); // or just return byInfiniteProductFormula(x, 1e-17);
            }
        } else {  // Todos los otros casos
            // Algunos valores exactos
            if (vecindad(x, 3 / 2)) {
                return 1 * Math.sqrt(Math.PI) / 2;
            } else if (vecindad(x, 5 / 2)) {
                return 3 * Math.sqrt(Math.PI) / 4;
            } else if (vecindad(x, 7 / 2)) {
                return 15 * Math.sqrt(Math.PI) / 8;
            } else if (vecindad(x, 9 / 2)) {
                return 105 * Math.sqrt(Math.PI) / 16;
            }
            var i = Math.trunc(Math.round(x));
            if (vecindad(x, i)) { // Entero
                if (i % 2 === 0) { // Par
                    return formulaDeDuplicacion(i);
                } else { // impar
                    return formulaDefinitoria(i);
                }
            } else { // Racional
                return formulaDeDuplicacion(x);
            }
        }
    }

    // This is my original code... (returns the mcd between a and b)
    // mcd divides both, but the most important is that: mcd * mcm = a * b.
    euclides(a, b) {
        let eps = 0.00000000000001;
        let result;
        let [minFactor, maxFactor] = [Math.min(a, b), Math.max(a, b)];
        // this trivial checks avoids div. by zero.
        if (Math.abs(minFactor) <= eps) {
            if (Math.abs(maxFactor) <= eps) {
                result = Infinity;
            } else {
                result = maxFactor;
            }
        } else if (Math.abs(maxFactor) <= eps) {
            if (Math.abs(minFactor) <= eps) {
                result = Infinity;
            } else {
                result = minFactor;
            }
        } else {
            result = maxFactor;
            while (Math.abs(minFactor) > eps) {
                maxFactor = result;
                result = minFactor;
                minFactor = this.module(maxFactor, minFactor);
            }
            if (minFactor > eps / 2) {
                result = 1;
            }
        }
        return result;
    }

    // Copyright ®Luis Guillermo Bultet Ibles for sigdt project., all right reserved.
    // Based on pascal language, swag file: Expression Evaluator by Rainer Huebenthal on 01-27-94 at 12:00.
    calculate(expression, solver) {
        let _f = String;

        function isOperation(l) {
            let tmp = String(l).trim();
            return (tmp.indexOf("+") !== -1) || (tmp.indexOf("-") !== -1) || (tmp.indexOf("*") !== -1) || (tmp.indexOf("/") !== -1) || (tmp.indexOf("(") !== -1) || (tmp.indexOf(")") !== -1);
        }

        function isNumber(str) {
            try {
                let tmp = Number((String(str)).trim());
                // pero además...
                if (((str !== 0) && (str !== "0") && (tmp === 0)) || isNaN(tmp)) {
                    return false;
                } else {
                    return true;
                }
            } catch (e) {
                return false;
            }
        }

        function _evaluate(l, r) {

            // ok
            if (r >= _f.length) {
                r = _f.length - 1;
            }

            // La validación de la división por cero se resuelve dentro de la clase BigInteger
            var wo, op, k;
            var t1 = 0;
            var t2 = 0;

            k = 0;  // parenthesis level
            wo = 0; // were operator is ?
            op = 8; //

            // Substituir un segmento de la cadena por la cadena original...
            function substituir(s, start, end, subStr) {
                var prefijo = start === 0 ? "" : s.substring(0, start);
                var sufijo = end === s.length - 1 ? "" : s.substring(end + 1);
                return prefijo + subStr + sufijo;
            }

            // Sintactical analizer (where the operator in position ends, else position of next char).
            function sintaxCheck(cadena, posicion) {
                // Si es una línea de comentarios debe devolver la posición de la siguiente línea.
                if (posicion === -1 || posicion >= cadena.length) {
                    return false;
                }
                // pares
                var pares = [{ start: "(", end: ")" }, { start: "{", end: "}" }, { start: "[", end: "]" }];
                if (cadena.substr(posicion, 2) === "//") { // Line comment, until CR or EOF
                    var endComment = cadena.indexOf("\n", posicion + 2);
                    if (endComment === -1) {
                        return cadena.length + 1; // y se devuelve hasta el retorno del carro.
                    }
                    return endComment + 1;
                } else if (cadena.substr(posicion, 2) === "/*") { // Block comment, always until */, or error
                    var endComment = cadena.indexOf("*/", posicion + 2);
                    return endComment; // sino, completo.
                }
                // De otro modo
                switch (cadena[posicion]) {
                    case "'": { // simples
                        return cadena.indexOf("'", posicion + 1);
                        break;
                    }
                    case "`": { // francesas, to do internal ${...}
                        return cadena.indexOf("`", posicion + 1);
                    }
                    case '"': { // dobles
                        return cadena.indexOf('"', posicion + 1);
                    }
                    default: {
                        for (var i = 0; i < pares.length; i++) {
                            if (cadena.substr(posicion, pares[i].start.length) === pares[i].start) {
                                posicion = posicion + pares[i].start.length; // reubica el puntero
                                while ((posicion !== -1) && (posicion < cadena.length)) {
                                    if (cadena.substr(posicion, pares[i].end.length) === pares[i].end) {
                                        return posicion + pares[i].end.length;
                                    }
                                    posicion = sintaxCheck(cadena, posicion);
                                    if (posicion >= cadena.length) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (posicion === -1 || posicion >= cadena.length) {
                    // here just try to find where begin some of them...
                    return false;
                }
                return posicion + 1;
            }

            var wep, delta;
            if ((_f.charAt(l) === '(') && (_f.charAt(r) === ')')) {
                wep = sintaxCheck(_f, l);
                if (wep && wep - 1 <= r) {
                    if (wep - 1 === r) {
                        return _evaluate(l + 1, r - 1);
                    } else {
                        delta = _f.length;
                        _f = substituir(_f, l, wep - 1, _evaluate(l + 1, wep - 2));
                        delta = delta - _f.length;
                        r = r - delta;
                    }
                }
            }

            for (var i = l; i < r; i = i + 1) {

                // validación de paréntesis
                if (k < 0) throw new Error(`La expresión tiene ${_f}, tiene paréntesis mal formados en la posición ${i}.`);

                switch (_f.charAt(i)) {
                    case '(': {
                        k = k + 1;
                        break;
                    }
                    case ')': {
                        k = k - 1;
                        break;
                    }
                    case '+': {
                        if (k == 0) {
                            wo = i;
                            op = 1;

                        }
                        break;
                    }
                    case '-': {
                        if (k == 0) {
                            wo = i;
                            op = 2;

                        }
                        break;
                    }
                    case '*': {
                        if (k == 0 && op > 2) {
                            wo = i;
                            op = 3;
                        }
                        break;
                    }
                    case '/': {
                        if (k == 0 && op > 2) {
                            wo = i;
                            op = 4;
                        }
                        break;
                    }
                }
            }

            if (op < 5) {
                t1 = _evaluate(l, wo - 1);
                t2 = _evaluate(wo + 1, r);
            }

            switch (op) {
                case 1:
                    return String(Number(t1) + Number(t2));
                case 2:
                    return String(Number(t1) - Number(t2));
                case 3:
                    return String(Number(t1) * Number(t2));
                case 4:
                    return String(Number(t1) / Number(t2));
            }

            let tmp = String(_f).substring(l, r + 1).trim();
            if (!isOperation(tmp) && !this.isNumber(tmp)) {
                if (solver) {
                    return solver(tmp);
                } else {
                    console.log("Necesita resolver una referencia a: " + tmp.trim());
                }
            }
            return tmp;
        }

        _f = String(expression);
        return _evaluate(0, _f.length - 1);
    }

    // Calcular la posición del sol utilizanfl el algoritmo: NOAA Solar Calculations.
    NOAA_Solar(latitude = 45, longitude = -120, timeZone = -8, time_past_local_midnight = 0, utcdate = new Date("07/13/1992")) {

        function jday(date) {
            let jdayInternal = (year, mon, day, hr, minute, sec, msec = 0) => (((367.0 * year) - Math.floor((7 * (year + Math.floor((mon + 9) / 12.0))) * 0.25)) + Math.floor((275 * mon) / 9.0) + day + 1721013.5 + (((((msec / 60000) + (sec / 60.0) + minute) / 60.0) + hr) / 24.0) // ut in days
                - 0.5 * Math.sign(100.0 * year + mon - 190002.5) + 0.5);
            return jdayInternal(date.getUTCFullYear(), date.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
                date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds(),);
        }

        /** remove this two later
         * Converts radians (0 to 2π) to degrees (0 to 360).
         */
        let radiansToDegrees = radians => radians * (180 / Math.PI);

        /**
         * Converts degrees (0 to 360) to radians (0 to 2π).
         */
        let degreesToRadians = degrees => degrees * (Math.PI / 180);

        let residuo = (x, y) => {
            return x - y * Math.floor(x / y);
        }

        // Don't pass date parameter to test against test date = 13/07/1992 on given Geostar file NOAA_Solar.xls
        let julianday = jday(utcdate);
        let juliancentury = (julianday - 2451545) / 36525; // G
        let geommeanlongsundeg = residuo((280.46646 + juliancentury * (36000.76983 + juliancentury * 0.0003032)), 360); // I
        let geomeananomsundeg = 357.52911 + juliancentury * (35999.05029 - 0.0001537 * juliancentury); // J
        let eccentearthorbit = 0.016708634 - juliancentury * (0.000042037 + 0.0001537 * juliancentury); // K
        let suneqofctr = Math.sin(degreesToRadians(geomeananomsundeg)) * (1.914602 - juliancentury * (0.004817 + 0.000014 * juliancentury)) + Math.sin(degreesToRadians(2 * geomeananomsundeg)) * (0.019993 - 0.000101 * juliancentury) + Math.sin(degreesToRadians(3 * geomeananomsundeg)) * 0.000289; // L
        let suntruelongdeg = geommeanlongsundeg + suneqofctr; // M
        let suntrueanomdeg = geomeananomsundeg - suneqofctr; // N
        let sunradvectoraus = (1.000001018 * (1 - Math.pow(eccentearthorbit, 2)) / (1 + eccentearthorbit * Math.cos(degreesToRadians(suntrueanomdeg)))); // O
        let sunapplongdeg = suntruelongdeg - 0.00569 - 0.00478 * Math.sin(degreesToRadians(125.04 - 1934.136 * juliancentury)); // P
        let meanobliqeclipticdeg = 23 + (26 + ((21.448 - juliancentury * (46.815 + juliancentury * (0.00059 - juliancentury * 0.001813)))) / 60) / 60; // Q
        let obliqcorrdeg = meanobliqeclipticdeg + 0.00256 * Math.cos(degreesToRadians(125.04 - 1934.136 * juliancentury)); // R
        let sunrtascendeg = radiansToDegrees(Math.atan2(Math.cos(degreesToRadians(sunapplongdeg)), Math.cos(degreesToRadians(obliqcorrdeg)) * Math.sin(degreesToRadians(sunapplongdeg)))); // S
        let sundeclindeg = radiansToDegrees(Math.asin(Math.sin(degreesToRadians(obliqcorrdeg)) * Math.sin(degreesToRadians(sunapplongdeg)))); // T
        let uvary = Math.tan(degreesToRadians(obliqcorrdeg / 2)) * Math.tan(degreesToRadians(obliqcorrdeg / 2)); // U
        let eqoftimeminutes = 4 * radiansToDegrees(uvary * Math.sin(2 * degreesToRadians(geommeanlongsundeg)) - 2 * eccentearthorbit * Math.sin(degreesToRadians(geomeananomsundeg)) + 4 * eccentearthorbit * uvary * Math.sin(degreesToRadians(geomeananomsundeg)) * Math.cos(2 * degreesToRadians(geommeanlongsundeg)) - 0.5 * uvary * uvary * Math.sin(4 * degreesToRadians(geommeanlongsundeg)) - 1.25 * eccentearthorbit * eccentearthorbit * Math.sin(2 * degreesToRadians(geomeananomsundeg))); // V
        let hasunrisedeg = radiansToDegrees(Math.acos(Math.cos(degreesToRadians(90.833)) / (Math.cos(degreesToRadians(latitude)) * Math.cos(degreesToRadians(sundeclindeg))) - Math.tan(degreesToRadians(latitude)) * Math.tan(degreesToRadians(sundeclindeg)))); // W
        let solarnoonlst = (720 - 4 * longitude - eqoftimeminutes + timeZone * 60) / 1440; // X
        let sunrisetimelst = (solarnoonlst - hasunrisedeg * 4 / 1440); // Y
        let sunsettimelst = (solarnoonlst + hasunrisedeg * 4 / 1440); // Z
        let sunlightdurationdurationminutes = (8 * hasunrisedeg); // AA
        let truesolartimemin = residuo((time_past_local_midnight * 1440 + eqoftimeminutes + 4 * longitude - 60 * timeZone), 1440); // AB
        let hourangledeg = truesolartimemin / 4 < 0 ? truesolartimemin / 4 + 180 : truesolartimemin / 4 - 180; // AC
        let solarzenithangledeg = radiansToDegrees(Math.acos(Math.sin(degreesToRadians(latitude)) * Math.sin(degreesToRadians(sundeclindeg)) + Math.cos(degreesToRadians(latitude)) * Math.cos(degreesToRadians(sundeclindeg)) * Math.cos(degreesToRadians(hourangledeg)))); // AD
        let solarelevationangledeg = 90 - solarzenithangledeg; // AE
        let approxatmosphericrefractiondeg = (solarelevationangledeg > 85 ? 0 : (solarelevationangledeg > 5 ? 58.1 / Math.tan(degreesToRadians(solarelevationangledeg)) - 0.07 / Math.pow(Math.tan(degreesToRadians(solarelevationangledeg)), 3) + 0.000086 / Math.pow(Math.tan(degreesToRadians(solarelevationangledeg)), 5) : (solarelevationangledeg > -0.575 ? 1735 + solarelevationangledeg * (-518.2 + solarelevationangledeg * (103.4 + solarelevationangledeg * (-12.79 + solarelevationangledeg * 0.711))) : -20.772 / Math.tan(degreesToRadians(solarelevationangledeg))))) / 3600;
        let solarelevationcorrectedforatmrefractiondeg = solarelevationangledeg + approxatmosphericrefractiondeg; // AG
        let solarazimuthangledegcwfromN = (hourangledeg > 0 ? (radiansToDegrees(Math.acos(((Math.sin(degreesToRadians(latitude)) * Math.cos(degreesToRadians(solarzenithangledeg))) - Math.sin(degreesToRadians(sundeclindeg))) / (Math.cos(degreesToRadians(latitude)) * Math.sin(degreesToRadians(solarzenithangledeg))))) + 180 % 360) : (540 - radiansToDegrees(Math.acos(((Math.sin(degreesToRadians(latitude)) * Math.cos(degreesToRadians(solarzenithangledeg))) - Math.sin(degreesToRadians(sundeclindeg))) / (Math.cos(degreesToRadians(latitude)) * Math.sin(degreesToRadians(solarzenithangledeg))))) % 360));  // AF

        return {
            acimut: solarazimuthangledegcwfromN,
            elevacionReal: solarelevationangledeg,
            elevacionAparente: solarelevationcorrectedforatmrefractiondeg
        }

    }

    getJulian(date = new Date()) {
        /* Calculate the present UTC Julian Date. Function is valid after
         * the beginning of the UNIX epoch 1970-01-01 and ignores leap
         * seconds. */
        return (Number(date) / 86400000) + 2440587.5;
    }

    getGMST(date = new Date()) {
        /* Calculate Greenwich Mean Sidereal Time according to
           http://aa.usno.navy.mil/faq/docs/GAST.php */
        var julianDay = this.getJulian(date);
        var d = julianDay - 2451545.0;
        // Low precision equation is good enough for our purposes.
        return (18.697374558 + 24.06570982441908 * d) % 24;
    }

    static _R2D = 180 / Math.PI;
    static _D2R = Math.PI / 180;

    setTime(date) {
        this.options.time = date;
        var latLng = this._compute(date || null)
        this.setLatLngs(latLng);
    }

    _eclipticObliquity(julianDay) {
        // Following the short term expression in
        // http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
        var n = julianDay - 2451545.0;
        // Julian centuries since J2000.0
        var T = n / 36525;
        var epsilon = 23.43929111 -
            T * (46.836769 / 3600
                - T * (0.0001831 / 3600
                    + T * (0.00200340 / 3600
                        - T * (0.576e-6 / 3600
                            - T * 4.34e-8 / 3600))));
        return epsilon;
    }

    _sunEquatorialPosition(sunEclLng, eclObliq) {
        /* Compute the Sun's equatorial position from its ecliptic
         * position. Inputs are expected in degrees. Outputs are in
         * degrees as well. */
        var alpha = Math.atan(Math.cos(eclObliq * WebSystemObject._D2R)
            * Math.tan(sunEclLng * WebSystemObject._D2R)) * WebSystemObject._R2D;
        var delta = Math.asin(Math.sin(eclObliq * WebSystemObject._D2R)
            * Math.sin(sunEclLng * WebSystemObject._D2R)) * WebSystemObject._R2D;

        var lQuadrant = Math.floor(sunEclLng / 90) * 90;
        var raQuadrant = Math.floor(alpha / 90) * 90;
        alpha = alpha + (lQuadrant - raQuadrant);

        return { "alpha": alpha, "delta": delta };
    }

    _hourAngle(lng, sunPos, gst) {
        /* Compute the hour angle of the sun for a longitude on
         * Earth. Return the hour angle in degrees. */
        var lst = gst + lng / 15;
        return lst * 15 - sunPos.alpha;
    }

    _latitude(ha, sunPos) {
        /* For a given hour angle and sun position, compute the
         * latitude of the terminator in degrees. */
        var lat = Math.atan(-Math.cos(ha * WebSystemObject._D2R) /
            Math.tan(sunPos.delta * WebSystemObject._D2R)) * WebSystemObject._R2D;
        return lat;
    }

    _compute(time) {
        if (time == null)
            var today = new Date();
        else
            var today = new Date(time);
        var julianDay = today.getJulian();
        var gst = today.getGMST();
        var latLng = [];
        var ha, lat;

        var sunEclPos = this._sunEclipticPosition(julianDay);
        var eclObliq = this._eclipticObliquity(julianDay);
        var sunEqPos = this._sunEquatorialPosition(sunEclPos.lambda, eclObliq);
        for (var i = 0; i <= 720 * this.options.resolution; i++) {
            lng = -360 + i / this.options.resolution;
            ha = this._hourAngle(lng, sunEqPos, gst);
            lat = this._latitude(ha, sunEqPos);
            latLng[i + 1] = [lat, lng];
        }
        if (sunEqPos.delta < 0) {
            latLng[0] = [90, -360];
            latLng[latLng.length] = [90, 360];
        } else {
            latLng[0] = [-90, -360];
            latLng[latLng.length] = [-90, 360];
        }
        return latLng;
    }

    // Otras funciones utilizarias

    caracterDeCodigo(code) {
        // Devuelve un caracter a partir del de código utilizado c...
        return String.fromCharCode(code);
    }

    characterAt(position) {
        return this.value.charAt(position);
    }

    // Caracteres especiales

    spLineFeed() {
        return "\n";
    }

    spHorizontalTabulator() {
        return "\t";
    }

    spBackSpace() {
        return "\b";
    }

    spCarriageReturn() {
        return "\r";
    }

    // verdadero si el cáracter es un número.

    spFormFeed() {
        return "\f";
    }

    spBackSlash() {
        return "\\";
    }

    spSingleQuote() {
        return "\'";
    }

    spDuobleQuote() {
        return '\"';
    }

    unicodeAt(position) {
        // Devuelve el código utilizado a partir del caracter... 10 -> Enter, visualiza \n
        return this.value.charCodeAt(position);
    }

    unicodeChar(lC) {
        // Devuelve un caracter que se corresponde con ese código...
        return String.fromCharCode(lC);
    }

    arrayOfUnicode() {
        let resultado = [];
        for (let position = 0; position < this.length; position++) {
            resultado.push(this.unicodeAt(position));
        }
        return resultado;
    }

    // 
    // indentar (justificar) todas las líneas a tantos espacios a la derecha
    indent(spaces) {
        // Devuelve un arreglo estúpido con la cosa repetida esa cantidad de veces.
        function repeat(cosa, veces) {
            let arr = [];
            for (let i = 0; i < veces; i++) {
                arr.push(cosa);
            }
            return arr;
        }

        let lines = (this || '').split('\n');
        let newArr = [];
        for (let i = 0; i < lines.length; i++) {
            newArr.push(repeat(' ', spaces).join('') + lines[i]);
        }
        return newArr.join('\n');
    }

    anchor(nombre) {
        return this.value.anchor(nombre);
    }

    hiperLink(locationOrURL) {
        return this.value.link(locationOrURL);
    }

    blink() {
        return this.value.blink();
    }

    big() {
        return this.value.big();
    }

    bold() {
        return this.value.bold();
    }

    small() {
        return this.value.small();
    }

    fixec() {
        return this.value.fixed();
    }

    strike() {
        return this.value.strike();
    }

    color(colorValue) {
        return this.value.fontcolor(colorValue);
    }

    subTitle() {
        return this.value.sub();
    }

    talla(tallaEnteroDe1a7) {
        return this.value.fontsize(tallaEnteroDe1a7);
    }

    superTitles() {
        return this.value.sup();
    }

    italics() {
        return this.value.italics();
    }

    pureHtml(content) {
        return content;
    }

    toTag(tagName, attributions, content) {
        return '<' + (tagName ? tagName : this.toString()) + ' ' + (attributions ? attributions : ' ') + '>' + (content ? content : "") + '</' + (tagName ? tagName : this.toString()) + '>';
    }

    toComment(mensaje) {
        return '<!-- $' + mensaje + '-->';
    }

    toScript() {
        return this.toTag('SCRIPT');
    }

    _attribution(name, value) {
        if (value instanceof String) {
            value = new superString(value);
            if (!value.isQuoted()) {
                value = '"' + value + '" ';
            }
        }
        return `${name}=${value} `;
    }

    BR() {
        // Eauivale a un ENTER o fin de linea
        return "<BR>";
    }

    HorizonalRule() {
        return "HR";
    }

    htmlButton(id, type, title, onClick, enabled, hidden, imageURL) {
        var conferedAttributions = "";

        // en tl tipo se pasa el método del botó y el formulario ("button", "reset", "submit")

        if (id) {
            conferedAttributions += this._attribution('name', id);
            conferedAttributions += this._attribution('id', id);
        }
        if (title) {
            conferedAttributions += this._attribution('title', title);
        }
        if (onClick) {
            conferedAttributions += this._attribution('OnClick', '"' + onClick + '"');
        }

        if (type) {
            conferedAttributions += this._attribution('type', "'" + type + "'");
        }

        if (!!enabled) {
            conferedAttributions += ' enabled';
        } else {
            conferedAttributions += ' disabled';
        }
        if (hidden) {
            conferedAttributions += ' hidden';
        }

        if (imageURL) {
            return this.toTag("BUTTON", conferedAttributions, this.htmlImage(null, imageURL, title));
        } else {
            return this.toTag("BUTTON", conferedAttributions);
        }


    }

    htmlIntegerInput(id, min, max, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'number');
        if (min) {
            result += this._attribution('min', min);
        }
        if (max) {
            result += this._attribution('max', max);
        }
        if (value) {
            result += this._attribution('value', value);
        }
        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlCheckbox(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'checkbox');
        if (value) {
            result += this._attribution(' value', value);
        }
        if (value) {
            result += ' checked';
        }
        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlPassword(id, enabled, hidden, value) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'password');
        if (value) {
            result += this._attribution('value', value);
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlRadioButton(id, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'radio');
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlReset(id, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'reset');
        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlSubmitInput(id, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'submit');
        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlTextInput(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'text');

        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlDate(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'date');
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlMonth(id, vale, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'month');
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlWeek(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'week');
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlTime(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'time');
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    /*
 
                                                                                                // Incorpora la lectura de micrófono
 
                                                                                                <p>
                                                                                                Currently it doesn't work so well with Nexus 7 Chrome browser. It just launches a
                                                                                                file selector, and audio recorder is not one of the options if you don't have it
                                                                                                installed.
                                                                                                </p>
                                                                                                <form action="server.cgi" method="post" enctype="multipart/form-data">
                                                                                                <input type="file" accept="audio/*;capture=microphone">
                                                                                                </form>
                                                                                                <form action="server.cgi" method="post" enctype="multipart/form-data">
                                                                                                <input type="file" name="audio" accept="audio/*" capture>
                                                                                                <input type="submit" value="Upload">
                                                                                                </form>
 
                                                                                                */

    htmlPhone(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'tel');
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    htmlColor(id, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'color');
        if (value) {
            result += this._attribution('value', value);
        }
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }

        result += '>';
        return result;
    }

    htmlAttach(label, value, required, enabled, hidden) {
        if (!label) {
            label = "Attachments:";
        }
        let result = `<label>${label}<input type="file" multiple name="att" `;
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += `></label>`;
        return result;
    }

    // Depuración

    htmlFile(label, value, required, enabled, hidden) {
        if (!label) {
            label = "File:";
        }
        let result = `<label>${label}<input type="file" multiple name="att" `;
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += `>`;

        result += `<output id="list"></output>`
        result += `<script> `;
        result += `function handleFileSelect(evt) { `;
        result += `var files = evt.target.files; `;
        result += `// FileList object `;
        result += `// files is a FileList of File objects. List some properties. `;
        result += `var output = []; `;
        result += `for (var i = 0, f; f = files[i]; i++) { `;
        result += `output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') `;
        result += `- ', f.size, ' bytes, last modified: ', f.lastModifiedDate ? `;
        result += `f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>'); `;
        result += `} `;
        result += `document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>'; `;
        result += `} `;
        result += `document.getElementById('files').addEventListener('change', handleFileSelect, false); `;
        result += `</` + `script>`;


        result += `</label>`;
        return result;
    }

    htmlRange(id, min, max, step, value, required, enabled, hidden) {
        let result = `<INPUT `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        result += this._attribution('type', 'range');
        if (min) {
            result += this._attribution('min', min);
        }
        if (max) {
            result += this._attribution('max', max);
        }
        if (step) {
            result += this._attribution('step', step);
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (value) {
            result += ` value = "${value}"`;
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    // La alineación puede ser top, bottom o middle
    htmlImage(id, url, alterntiveText, align, enabled, hidden) {
        let result = `<IMG `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        if (url) {
            result += this._attribution('Src', `"${url}"`);
        }
        if (alterntiveText) {
            result += this._attribution('Alt', `"${alterntiveText}"`);
        }
        if (align) {
            result += this._attribution('Align', `"${align}"`);
        }
        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }
        if (hidden) {
            result += ' hidden';
        }
        result += '>';
        return result;
    }

    /* pueden pasársele parámetros opcionales, otros objetos, y tiene un modo que ayuda a
                                                                                                                                visualizarlos
                                                                                                                                en
                                                                                                                                la
                                                                                                                                depuración
                                                                                                                            */

    htmlTextArea(id, rows, columns, value, required, enabled, hidden) {
        let result = `<TEXTAREA `;
        if (id) {
            result += this._attribution('name', id);
            result += this._attribution('id', id);
        }
        if (rows) {
            result += this._attribution('Rows', `"${rows}"`);
        }
        if (columns) {
            result += this._attribution('Columns', `"${columns}"`);
        }
        if (value) {
            result += ` value = "${value}"`;
        }

        if (!!required) {
            result += ' required'; // es un campo obligatorio
        }

        if (!!enabled) {
            result += ' enabled';
        } else {
            result += ' disabled';
        }

        if (hidden) {
            result += ' hidden';
        }
        result += '></TEXTAREA>';
        return result;
    }

    // Depuración


    // Me devuelve un arreglo con todas las posiciones donde aparece la subcadena...
    ocurrencies(str, subString, allowOverlapping) {
        let resultado = [];
        let string = str;
        subString = String(subString);

        string += "";
        subString += "";
        if (subString.length <= 0) return string.length + 1;

        let pos = 0,
            step = allowOverlapping ? 1 : subString.length;

        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                resultado.push(pos);
                pos += step;
            } else break;
        }
        return resultado;
    }

    // qué lugar ocupa la enésima ocurrencia de esa subcadena
    ocurrency(str, n, substring, allowOverlapping) {
        let resultado = -1;
        let posicion = this.ocurrencies(str, substring, allowOverlapping);
        if (posicion.length === 0) {
            return -1;
        }
        let pos = n - 1;
        if (pos < posicion.length) {
            resultado = posicion[pos];
        }
        return resultado;
    }

    // Devuelve el remplazo de la enésima aparición de searchString por replaceString en mainStr.
    replaceStringOcurrency(str, searchString, replaceString, ocurrency = 1, allowOverlapping = false) {
        searchString = String(searchString);
        let resultado = str;
        if (str.indexOf(str, searchString) === -1) {
            return resultado;
        }
        let head = this.ocurrencyPrefix(searchString, ocurrency, allowOverlapping); // console(true, head);
        let tail = this.ocurrencyPostfix(searchString, ocurrency, allowOverlapping); // console(true, tail);
        resultado = head + replaceString + tail;
        return String(resultado);
    }

    // Esta función me dice si un texto contiene uno o alguno de los prefijos (no trimea)
    contains(str, subStrings) {
        let result;
        if (subStrings instanceof Array) {
            result = subStrings.some((element) => {
                return str.indexOf(element) !== -1
            });
        } else {
            result = (str.indexOf(subStrings) !== -1);
        }
        return result;
    }

    // Lo que aparece justo antes de esa aparición de la subcadena en el texto
    ocurrencyPrefix(str, subString, ocurrency, allowOverlapping) {
        if (!allowOverlapping) {
            allowOverlapping = false;
        }
        let posicion = this.ocurrency(str, ocurrency, subString, allowOverlapping);
        return this.left(0, posicion);
    }

    // Lo que aparece justo después de esa aparición de la subcadena en el texto
    ocurrencyPostfix(str, subString, ocurrency, allowOverlapping) {
        if (!allowOverlapping) {
            allowOverlapping = false;
        }
        let posicion = this.ocurrency(ocurrency, subString, allowOverlapping);
        return this.right(posicion + subString.length, length);
    }

    // Mid igual al de visual basic...
    instr(str, pos, cant) {
        let tmp = String(str);
        return tmp.substring(pos, pos + cant)
    }

    // Substituir un segmento de la cadena por la cadena original...
    substituir(
        s,
        start,
        end,
        subStr,
    ) {
        const prefijo = start === 0 ? '' : s.substring(0, start);
        const sufijo = end === s.length - 1 ? '' : s.substring(end + 1);
        return prefijo + subStr + sufijo;
    };

    // Puede mejorarse... busca el correspondiente símbolo dentro de la cadena...
    sintaxCheck(cadena, posicion) {
        let endComment;
        if (
            !cadena ||
            cadena.length === 0 ||
            posicion < 0 ||
            posicion >= cadena.length
        ) {
            return -1;
        }
        // pares
        const pares = [
            { start: '(', end: ')' },
            { start: '{', end: '}' },
            { start: '[', end: ']' },
        ];
        if (cadena.substring(posicion, posicion + 2) === '//') {
            // Line comment, until CR or EOF
            endComment = cadena.indexOf('\n', posicion + 2);
            if (endComment === -1) {
                return cadena.length - 1;
            }
            return endComment + 1; // hasta cr
        } else if (cadena.substring(posicion, posicion + 2) === '/*') {
            // Block comment, always until */, or error
            endComment = cadena.indexOf('*/', posicion + 2);
            return endComment; // sino, completo.
        }
        // De otro modo
        switch (cadena[posicion]) {
            case "'": // simples
                return cadena.indexOf("'", posicion + 1);
            case '`': // francesas
                return (posicion = cadena.indexOf('`', posicion + 1));
            case '"': // dobles
                return cadena.indexOf('"', posicion + 1);
            default: {
                let q;
                for (let i = 0; i < pares.length; i++) {
                    if (
                        cadena.substr(posicion, pares[i].start.length) === pares[i].start
                    ) {
                        q = posicion + pares[i].start.length; // reubica el puntero
                        while (q !== -1 && q < cadena.length) {
                            if (cadena.substr(q, pares[i].end.length) === pares[i].end) {
                                return q + pares[i].end.length - 1;
                            } else {
                                q = this.sintaxCheck(cadena, q);
                                if (q !== -1 && q < cadena.length) {
                                    q++;
                                } else {
                                    return -1;
                                }
                            }
                        }
                        return -1;
                    }
                }
                // None of them
            }
        }
        // Sino retorna posición y ya...
        return posicion;
    }

    /** Función para reconocimiento y transformación de patrones
     *
     * Esta función analiza cómo se cotejan las partes variables del patronAReconocer, dentro de el
     * objetivo, tomando como comodines, las partes literales residuales, se toman como variables los
     * identificadores que comienzan con el carácter %; después de ese proceso se se devuelve un resultado
     * que consiste en la sustitucón de las respectivas variables dentro del patrónAAplicar.
     *
     *  Si el patrón coincide, se transforma sino, se devuelve el objetivo sin transformar.
     *
     *  Por ejemplo:
     *  y = aplicarPatron("multiplicar %x por %y", "%x * %y", "multiplicar 34 por 2");
     *  debería  devolver "34 * 2"
     *
     *  1. ¿Cuál es el literal a reconocer que más se repite en el objetivo?
     *  Si no aparece ninguna vez, el patrón no matchea.
     *  Si aparece una vez, toma esa posición y no se acomoda.
     *  Si aparece más de una vez, pueden haber varias soluciones
     *   En tal caso la función acepta el argumento opcional variante (1 .. ?).
     *   Hay que tener presente que dos variantes diferentes pueden o no dar el mismo resultado.
     *
     * @param {String} patronAReconocer     El patrón que quiero encontrar en el texto.
     * @param {String} patronAAplicar       El patrón que voy a aplicar si lo encuentro.
     * @param {Boolean} objetivo            El texto que voy a analizar.
     *
     * @author Lic. Luis G. Bultet Ibles
     * @mail luisguillermobultetibles@gmail.com
     *
     *  recuerda arreglar para que funcione en x = transformate("%b.%a0", "%b.%a", x); // para el argumento 12.00 con el objetivo de suprimir ceros a la derecha después de la coma.
     *  tampoco funciona para el caso OJO, revisar transformate("%var% : %tip%", "this.%var% = %var;", "n : Number");
     *
     *  recuerda incluir un chequeo para cotejar cuando aparezca mas de una vez una variable en la regla o patrón a reconocer, ambas deben hacer referencia al mismo contenido
     *  para que el patrón sea válido, de otra forma se devolverá el objetivo sin transformar, como establece el algoritmo.
     *
     * */
    transformate(objetivo, patronAReconocer, patronAAplicar) {
        // Es ua variable si comienza con % y no tiene espacios.
        function esUnaVariable(expr) {
            if (!expr) {
                return false;
            }
            let apa = String(expr);
            if ((apa.length < 2)) {
                return false;
            }
            if (apa.charAt(0) !== '%') {
                return false;
            }
            return apa.charAt(1) !== ' ';
        }

        // Descompone la expresión expr en un arreglo con las partes variables y literales por separado.
        function parsearEnPartes(expr) { // fixed
            expr = String(expr);

            var resultado = [];
            var tmp = "";
            var itIsVariable = false;
            expr = String(expr);
            for (i = 0; i < expr.length; i++) {
                if (expr.charAt(i) === '%') {
                    if (tmp !== '') {
                        resultado.push(String(tmp));
                        tmp = ''
                    }
                    if (!itIsVariable) { // no lo era?
                        itIsVariable = true;
                    }
                } else if (!this.isAlphanumeric(expr.charAt(i))) {
                    if (itIsVariable) {
                        resultado.push(String(tmp));
                        tmp = '';
                        itIsVariable = false;
                    }
                }
                tmp = tmp + expr.charAt(i);
            }
            resultado.push(String(tmp));
            return resultado;
        }

        function getVar(cadenaPrincipal, nombreDeVariable, arregloDelAPtronAReconocer) {
            for (i = 0; i < arregloDelAPtronAReconocer.length; i++) {
                if (nombreDeVariable === arregloDelAPtronAReconocer[i].cadena) {
                    return String(cadenaPrincipal).substring(arregloDelAPtronAReconocer[i].inicio, arregloDelAPtronAReconocer[i].fin + 1);
                }
            }
            return "";
        }

        // Se necesita como un objeto, no como una cadena.
        obj = String(objetivo);

        // Se inicializa el arreglo (listado) de los resultados.
        let resultado = objetivo;

        if (obj === "" || patronAReconocer === "") {
            // El objetivo está vacío.
            return resultados;
        }

        let par = parsearEnPartes(patronAReconocer);
        let paa = parsearEnPartes(patronAAplicar);

        // Si hay algín literal de patrón a reconocer que no esté el objetivo, te vas clarito
        let baseBusqueda = 0;
        for (j = 0; j < par.length; j++) {
            baseBusqueda = obj.indexOf(par[j], baseBusqueda);
            if (baseBusqueda === -1 && !esUnaVariable(par[j])) {
                return objetivo;
            }
        }

        // Solamente para fines de validación, si el primer elemento del paa es un literal
        // y no está en la posición 0 del objetivo, se va igual...
        if (!esUnaVariable(par[0]) && obj.indexOf(par[0], 0) !== 0) {
            return objetivo;
        }

        // De igual forma, si el último...
        if (!esUnaVariable(par[par.length - 1]) && obj.indexOf(par[par.length - 1], obj.length - par[par.length - 1].length) !== obj.length - par[par.length - 1].length) {
            return objetivo;
        }

        if (par.length === 0 || par.length === 0) {
            return resultado;
        } else if (par.length === 1 && esUnaVariable(patronAReconocer)) {
            let resultado = reemplazarCadena(patronAAplicar, patronAReconocer, obj);
            return resultado;
        } else if (paa.length === 1 && !esUnaVariable(patronAAplicar)) {
            let resultado = patronAAplicar;
            return resultado;
        }

        let toTheLeft = 0;
        let toTheRight = par.length - 1;
        let llastPost = 0;
        let parL = new Array(par.length); // Guarda las posiciones de los literales dentro del objetivo...
        for (j = 0; j < par.length; j++) {
            if (!esUnaVariable(par[j])) {
                a = obj.indexOf(par[j], obj, llastPost);
                llastPost = a;
                parL[j] = { cadena: par[j], inicio: a, fin: a + par[j].length - 1 };
            } else {
                parL[j] = { cadena: par[j], inicio: -1, fin: -1 };
            }
        }

        // encadenar los principios
        for (i = 1; i < parL.length; i++) {
            if (parL[i].inicio <= 0) {
                parL[i].inicio = parL[i - 1].fin + 1;
            }
        }

        // encadenar los finales
        for (i = 0; i < parL.length - 1; i++) {
            if (parL[i].fin <= 0) {
                parL[i].fin = parL[i + 1].inicio - 1;
            }
        }

        // no se te debe olvidar que el primer elemento comienza en cero y el último en la longitud
        parL[0].inicio = 0;
        parL[parL.length - 1].fin = obj.length - 1;

        // armar el resultado, a partir de nada.
        resultado = "";
        for (j = 0; j < paa.length; j++) {
            if (esUnaVariable(paa[j])) {
                // console.log("getvar me da " + getVar(obj, paa[i], parL));
                resultado += getVar(obj, paa[j], parL);
            } else {
                resultado += paa[j];
            }
        }

        return resultado;
    }

    // Español
    /** Syllabler gets a word and outputs and array containing its syllables.
     *  This code belongs to https://github.com/vic/silabas.js
     *
     *    The up´s comment and the code itself was taken from Lorca library by Lic Luis Guillermo Bultet Ibles.
     */
    syllaber() {
        let stressedFound = false;
        let stressed = 0;
        let letterAccent = -1;

        let wordLength = this.length;
        let positions = [];
        let word = this;

        function process() {
            let numSyl = 0;

            // Look for syllables in the word
            for (let i = 0; i < wordLength;) {
                positions[numSyl++] = i;

                i = onset(i);
                i = nucleus(i);
                i = coda(i);

                if (stressedFound && stressed === 0) {
                    stressed = numSyl; // it marks the stressed syllable
                }
            }

            // If the word has not written accent, the stressed syllable is determined
            // according to the stress rules
            if (!stressedFound) {
                if (numSyl < 2) stressed = numSyl;
                // Monosyllables
                else {
                    // Polysyllables
                    let endLetter = toLower(wordLength - 1);

                    if (
                        !isConsonant(wordLength - 1) ||
                        endLetter === "y" ||
                        endLetter === "n" ||
                        (endLetter === "s" && !isConsonant(wordLength - 2))
                    )
                        stressed = numSyl - 1;
                    // Stressed penultimate syllable
                    else stressed = numSyl; // Stressed last syllable
                }
            }
        }

        function onset(pos) {
            let lastConsonant = "a";

            while (pos < wordLength && isConsonant(pos) && toLower(pos) !== "y") {
                lastConsonant = toLower(pos);
                pos++;
            }

            // (q | g) + u (example: queso, gueto)
            if (pos < wordLength - 1) {
                if (toLower(pos) === "u") {
                    if (lastConsonant === "q") {
                        pos++;
                    } else if (lastConsonant === "g") {
                        let letter = toLower(pos + 1);
                        if (
                            letter === "e" ||
                            letter === "é" ||
                            letter === "i" ||
                            letter === "í"
                        ) {
                            pos++;
                        }
                    }
                } else if (toLower(pos) === "ü" && lastConsonant === "g") {
                    // The 'u' with diaeresis is added to the consonant
                    pos++;
                }
            }

            return pos;
        }

        function nucleus(pos) {
            // Saves the type of previous vowel when two vowels together exists
            let previous = 0;
            // 0 = open
            // 1 = close with written accent
            // 2 = close

            if (pos >= wordLength) return pos; // ¡¿Doesn't it have nucleus?!

            // Jumps a letter 'y' to the starting of nucleus, it is as consonant
            if (toLower(pos) === "y") pos++;

            // First vowel
            if (pos < wordLength) {
                switch (toLower(pos)) {
                    // Open-vowel or close-vowel with written accent
                    case "á":
                    case "à":
                    case "é":
                    case "è":
                    case "ó":
                    case "ò":
                        letterAccent = pos;
                        stressedFound = true;
                        break;
                    case "a":
                    case "e":
                    case "o":
                        previous = 0;
                        pos++;
                        break;
                    // Close-vowel with written accent breaks some possible diphthong
                    case "í":
                    case "ì":
                    case "ú":
                    case "ù":
                    case "ü":
                        letterAccent = pos;
                        pos++;
                        stressedFound = true;
                        return pos;
                    // Close-vowel
                    case "i":
                    case "I":
                    case "u":
                    case "U":
                        previous = 2;
                        pos++;
                        break;
                }
            }

            // If 'h' has been inserted in the nucleus then it doesn't determine diphthong neither hiatus
            let aitch = false;
            if (pos < wordLength) {
                if (toLower(pos) === "h") {
                    pos++;
                    aitch = true;
                }
            }

            // Second vowel
            if (pos < wordLength) {
                switch (toLower(pos)) {
                    // Open-vowel with written accent
                    case "á":
                    case "à":
                    case "é":
                    case "è":
                    case "ó":
                    case "ò":
                        letterAccent = pos;
                        if (previous !== 0) {
                            stressedFound = true;
                        }
                        break;
                    case "a":
                    case "e":
                    case "o":
                        if (previous === 0) {
                            // Two open-vowels don't form syllable
                            if (aitch) pos--;
                            return pos;
                        } else {
                            pos++;
                        }

                        break;

                    // Close-vowel with written accent, can't be a triphthong, but would be a diphthong
                    case "í":
                    case "ì":
                    case "ú":
                    case "ù":
                        letterAccent = pos;

                        if (previous !== 0) {
                            // Diphthong
                            stressedFound = true;
                            pos++;
                        } else if (aitch) pos--;

                        return pos;
                    // Close-vowel
                    case "i":
                    case "u":
                    case "ü":
                        if (pos < wordLength - 1) {
                            // ¿Is there a third vowel?
                            if (!isConsonant(pos + 1)) {
                                if (toLower(pos - 1) === "h") pos--;
                                return pos;
                            }
                        }

                        // Two equals close-vowels don't form diphthong
                        if (toLower(pos) !== toLower(pos - 1)) pos++;

                        return pos; // It is a descendent diphthong
                }
            }

            // Third vowel?
            if (pos < wordLength) {
                if (toLower(pos) === "i" || toLower(pos) === "u") {
                    // Close-vowel
                    pos++;
                    return pos; // It is a triphthong
                }
            }

            return pos;
        }

        function coda(pos) {
            if (pos >= wordLength || !isConsonant(pos)) {
                return pos; // Syllable hasn't coda
            } else if (pos === wordLength - 1) {
                // End of word
                pos++;
                return pos;
            }

            // If there is only a consonant between vowels, it belongs to the following syllable
            if (!isConsonant(pos + 1)) return pos;

            let c1 = toLower(pos);
            let c2 = toLower(pos + 1);

            // Has the syllable a third consecutive consonant?
            if (pos < wordLength - 2) {
                let c3 = toLower(pos + 2);

                if (!isConsonant(pos + 2)) {
                    // There isn't third consonant
                    // The groups ll, ch and rr begin a syllable

                    if (c1 === "l" && c2 === "l") return pos;
                    if (c1 === "c" && c2 === "h") return pos;
                    if (c1 === "r" && c2 === "r") return pos;

                    // A consonant + 'h' begins a syllable, except for groups sh and rh
                    if (c1 !== "s" && c1 !== "r" && c2 === "h") return pos;

                    // If the letter 'y' is preceded by the some
                    // letter 's', 'l', 'r', 'n' or 'c' then
                    // a new syllable begins in the previous consonant
                    // else it begins in the letter 'y'
                    if (c2 === "y") {
                        if (c1 === "s" || c1 === "l" || c1 === "r" || c1 === "n" || c1 === "c") {
                            return pos;
                        }
                        pos++;

                        return pos;
                    }

                    // groups: gl - kl - bl - vl - pl - fl - tl
                    if (
                        (c1 === "b" ||
                            c1 === "v" ||
                            c1 === "c" ||
                            c1 === "k" ||
                            c1 === "f" ||
                            c1 === "g" ||
                            c1 === "p" ||
                            c1 === "t") &&
                        c2 === "l"
                    ) {
                        return pos;
                    }

                    // groups: gr - kr - dr - tr - br - vr - pr - fr
                    if (
                        (c1 === "b" ||
                            c1 === "v" ||
                            c1 === "c" ||
                            c1 === "d" ||
                            c1 === "k" ||
                            c1 === "f" ||
                            c1 === "g" ||
                            c1 === "p" ||
                            c1 === "t") &&
                        c2 === "r"
                    ) {
                        return pos;
                    }

                    pos++;

                    return pos;
                } else {
                    // There is a third consonant
                    if (pos + 3 === wordLength) {
                        // Three consonants to the end, foreign words?
                        if (c2 === "y") {
                            // 'y' as vowel
                            if (c1 === "s" || c1 === "l" || c1 === "r" || c1 === "n" || c1 === "c") {
                                return pos;
                            }
                        }

                        if (c3 === "y") {
                            // 'y' at the end as vowel with c2
                            pos++;
                        } else {
                            // Three consonants to the end, foreign words?
                            pos += 3;
                        }
                        return pos;
                    }

                    if (c2 === "y") {
                        // 'y' as vowel
                        if (c1 === "s" || c1 === "l" || c1 === "r" || c1 === "n" || c1 === "c")
                            return pos;

                        pos++;
                        return pos;
                    }

                    // The groups pt, ct, cn, ps, mn, gn, ft, pn, cz, tz and ts begin a syllable
                    // when preceded by other consonant

                    if (
                        (c2 === "p" && c3 === "t") ||
                        (c2 === "c" && c3 === "t") ||
                        (c2 === "c" && c3 === "n") ||
                        (c2 === "p" && c3 === "s") ||
                        (c2 === "m" && c3 === "n") ||
                        (c2 === "g" && c3 === "n") ||
                        (c2 === "f" && c3 === "t") ||
                        (c2 === "p" && c3 === "n") ||
                        (c2 === "c" && c3 === "z") ||
                        (c2 === "t" && c3 === "s") ||
                        (c2 === "t" && c3 === "s")
                    ) {
                        pos++;
                        return pos;
                    }

                    if (
                        c3 === "l" ||
                        c3 === "r" || // The consonantal groups formed by a consonant
                        // following the letter 'l' or 'r' cann't be
                        // separated and they always begin syllable
                        (c2 === "c" && c3 === "h") || // 'ch'
                        c3 === "y"
                    ) {
                        // 'y' as vowel
                        pos++; // Following syllable begins in c2
                    } else pos += 2; // c3 begins the following syllable
                }
            } else {
                if (c2 === "y") return pos;

                pos += 2; // The word ends with two consonants
            }

            return pos;
        }

        function toLower(pos) {
            return word[pos].toLowerCase();
        }

        function isConsonant(pos) {
            return !/[aeiouáéíóúàèìòùüAEIOUÁÉÍÓÚÀÈÌÒÙÜ]/.test(word[pos]);
        }

        process();

        //this.positions = function () {
        //   return positions;
        //};

        let syllables = [];

        for (let i = 0; i < positions.length; i++) {
            let start = positions[i];
            let end = wordLength;
            if (positions.length > i + 1) {
                end = positions[i + 1];
            }
            let seq = word.slice(start, end).replace(/ /, "").toLowerCase();
            syllables.push(seq);
        }

        return syllables;
    }
