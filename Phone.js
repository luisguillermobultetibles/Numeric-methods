// This is my javascript phone class, initially based on by Maya Shavin: idea Let's divide our phones into Classes
// I'm a cuban, this is my ideal phone prototype.
class Phone extends WebSystemObject {
    static Person = class {
        constructor(name, phoneNum) {
            this.name = name;
            this.phone = phoneNum;
        }
    };

    static PhoneOptions = class {
        constructor(options = {}) {
            this.options = options;
        }
    };

    // private local options
    static #Self = new Phone.PhoneOptions({
        name: 'My name',
        phone: '053 0123456789',
        password: 'give it to me, later',
    });

    static BatteryLevelRequiredForVoiceCall = 2;
    static BatteryLevelPerSecondCompsumtionRate = 0.005;
    static latitude;
    static longitude;
    static talvez;
    static quesi;
    static brujula;
    static connected;

    static secretPhoneCodes = [ // Códigos internacionalmente reconocidos, esta lista es provisional...
        {
            code: '*#06#',
            description: 'El principal de los códigos que debemos tener a mano, es el que nos permite conocer el identificador único de nuestro móvil, en ingles \'International Mobile Equipment Identity\', conocido comúnmente como IMEI.',
            domain: 'international',
        }, {
            code: '*#62#',
            description: 'Conocer el número de tu teléfono',
            domain: 'international',
        }, {
            code: '*#*#6484#*#*',
            description: 'Menú de testing',
            domain: 'international',
        }, {
            code: '*#*#37263#*#*',
            description: 'Información de la pantalla',
            domain: 'international',
        }, {
            code: '*#*#4636#*#*',
            description: 'Mostrar información sobre el teléfono, la batería y las estadísticas de uso',
            domain: 'international',
        }, {
            code: '*#*#7780#*#*',
            description: 'Restablecimiento del smartphone al estado de fábrica (solo afecta a apps)',
            domain: 'international',
        }, {
            code: '*#2767*3855',
            description: '#Limpieza y restauración —ideal para tener el primer firmware estable—',
            domain: 'international',
        }, {
            code: '*#*#34971539#*#*',
            description: 'Información de “dev” sobre la cámara del terminal',
            domain: 'international',
        }, {
            code: '*#*#7594#*#*',
            description: 'Habilita el apagado directo usando el botón de encendido',
            domain: 'international',
        }, {
            code: '*#*#273283*255',
            description: '*663282*#*#*	Copia de seguridad rápida',
            domain: 'international',
        }, {
            code: '*#*#197328640#*#*',
            description: 'Activa el “modo de prueba”',
            domain: 'international',
        }, {
            code: '*#*#225#*#*',
            description: 'Información sobre el calendario de MIUI',
            domain: 'international',
        }, {
            code: '*#*#426#*#*',
            description: 'Información sobre los servicios de Google Play',
            domain: 'international',
        }, {
            code: '*#*#526#*#*',
            description: 'Análisis de rendimiento de la LAN inalámbrica',
            domain: 'international',
        }, {
            code: '*#*#232338#*#*',
            description: 'Muestra la dirección MAC',
            domain: 'international',
        }, {
            code: '*#*#1472365#*#*',
            description: 'Test de rendimiento del GPS. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*#*#1575#*#*',
            description: 'Más pruebas de GPS',
            domain: 'international',
        }, {
            code: '*#*#0283#*#*',
            description: 'Test del packet loopback —un sistema de accesos directos—',
            domain: 'international',
        }, {
            code: '*#*#0*#*#*',
            description: 'Test de pantallas LCD. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*#*#0673#*#*',
            description: ' Ó *#*#0289#*#* Test del sistema de audio. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*#*#34971539#*#*',
            description: 'Test de cámara. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*#*#0842#*#*',
            description: 'Test de la vibración y luz de fondo',
            domain: 'international',
        }, {
            code: '*#*#2663#*#*',
            description: 'Muestra la versión de la pantalla táctil',
            domain: 'international',
        }, {
            code: '*#*#2664#*#*',
            description: 'Prueba del rendimiento de la pantalla táctil',
            domain: 'international',
        }, {
            code: '*#*#759#*#*',
            description: 'Información sobre el Google Partner Setup',
            domain: 'international',
        }, {
            code: '*#*#0588#*#*',
            description: 'Test del sensor de proximidad.',
            domain: 'international',
        }, {
            code: '*#*#3264#*#*',
            description: 'Indica la versión de la RAM instalada',
            domain: 'international',
        }, {
            code: '*#*#232331#*#*',
            description: 'Prueba de Bluetooth. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*#*#284#*#*', description: 'Crea al momento un informe de fallos',
            domain: 'international',
        }, {
            code: '*#*#7262626#*#*',
            description: 'Field test. Si todo funciona correcto, no pasará nada',
            domain: 'international',
        }, {
            code: '*3001#12345#*',
            description: 'El Modo Prueba de campo, en ingles Field Test Mode es una herramienta que incluyen varios modelos de celulares, que permite obtener información sobre detalles técnicos y estadísticas sobre la red móvil y conectividad y que además permite realizar diferentes pruebas o test.',
            domain: 'iPhone',
        }, {
            code: '*#*#232337#*#',
            description: 'Muestra la dirección Bluetooth del terminal',
            domain: 'international',
        }, {
            code: '*#*#4986*2650468',
            description: '#*#* Ver el firmware de varios componentes',
            domain: 'international',
        }, {
            code: '*#*#1234#*#*',
            description: 'Información del firmware del terminal',
            domain: 'international',
        }, {
            code: '*#*#1111#*#*',
            description: 'Ver la versión del software FTA',
            domain: 'international',
        }, {
            code: '*#*#2222#*#*',
            description: 'Ver la versión de hardware FTA',
            domain: 'international',
        }, {
            code: '*#*#44336#*#*',
            description: 'Ver el número de compilación',
            domain: 'international',
        }, {
            code: '*#*#8351#*#*',
            description: 'Habilita la marcación por voz',
            domain: 'international',
        }, {
            code: '*#*#8350#*#*',
            description: 'Desactiva la marcación por voz',
            domain: 'international',
        }, {
            code: '*#*#12580*369#',
            description: 'Información sobre el hardware y el software',
            domain: 'international del directorio',
        }, {
            code: '*#*#9900#',
            description: 'Modo de volcado del sistema',
            domain: 'international del directorio',
        }, {
            code: '*#*#301279#',
            description: 'Menú de control HSDPA / HSUPA',
            domain: 'international del directorio',
        }, {
            code: '*#*#7465625#',
            description: 'Bloqueo de dispositivo',
            domain: 'international del directorio',
        }, {
            code: '*#*#7594#',
            description: 'Desactivar teléfono',
            domain: 'international del directorio',
        },
        { // Autenticación automática
            code: '*444*40*01*${cardNumber}#',
            description: 'Autenticarse en BPA',
            domain: 'transfermovil',
        }, {
            code: '*444*40*02*${cardNumber}#',
            description: 'Autenticarse en Bandec',
            domain: 'transfermovil',
        },
        {
            code: '*444*40*03*${cardNumber}#',
            description: 'Autenticarse en Metropolitan o',
            domain: 'transfermovil',
        },
        {
            code: '*444*41#',
            description: 'Pagar factura de electridad',
            domain: 'transfermovil',
        }, {
            code: '*444*42#',
            description: 'Pagar factura telefónica',
            domain: 'transfermovil',
        }, {
            code: '*444*43#',
            description: 'Pagar ONAT',
            domain: 'transfermovil',
        }, {
            code: '*444*44#',
            description: 'Pagar una multa',
            domain: 'transfermovil',
        }, {
            code: '*444*45#',
            description: 'Transferencia a otra cuenta o tarjeta BPA',
            domain: 'transfermovil',
        },
        {
            code: '*444*45*01*${cardNumber}#',
            description: 'Transferencia a otra cuenta o tarjeta BANDEC',
            domain: 'transfermovil',
        },
        {
            code: '*444*45*02*${cardNumber}#',
            description: 'Transferencia a otra cuenta o tarjeta BM',
            domain: 'transfermovil',
        },
        {
            code: '*444*46#',
            description: 'Consultar saldo',
            domain: 'transfermovil',
        }, {
            code: '*444*47#',
            description: 'Consulta de servicio',
            domain: 'transfermovil',
        }, {
            code: '*444*48#',
            description: 'Últimas operaciones',
            domain: 'transfermovil',
        }, {
            code: '*444*49*01*número de la tarjeta#',
            description: 'Registro',
            domain: 'transfermovil',
        }, {
            code: '*444*50#',
            description: 'Solicitar tarjeta Telebanca',
            domain: 'transfermovil',
        }, {
            code: '*444*51#',
            description: 'Pago del agua',
            domain: 'transfermovil',
        },
        {
            code: '*444*52#',
            description: 'Mostrar servicios contratados. Adicionar, consultar y pagar facturas',
            domain: 'transfermovil',
        },
        {
            code: '*444*54#',
            description: 'Recargar saldo móvil',
            domain: 'transfermovil',
        }, {
            code: '*444*55#',
            description: 'Amortizar créditos',
            domain: 'transfermovil',
        }, {
            code: '*444*56*RC05#',
            description: 'Consulta a ONAT',
            domain: 'transfermovil',
        }, {
            code: '*444*56#',
            description: 'Ídem',
            domain: 'transfermovil',
        }, {
            code: '*444*57#',
            description: 'Consulta a ONAT anual / Cambiar el pin multibanca?',
            domain: 'transfermovil',
        }, {
            code: '*444*58#',
            description: 'Consulta integrada',
            domain: 'transfermovil',
        }, {
            code: '*444*59#',
            description: 'Recargar cuenta NAUTA nacional o internacional',
            domain: 'transfermovil',
        }, {
            code: '*444*60#',
            description: 'Asociar (cambiar de) tarjeta',
            domain: 'transfermovil',
        }, {
            code: '*444*61#',
            description: 'Cambio de límites',
            domain: 'transfermovil',
        }, {
            code: '*444*62#',
            description: 'Consulta de límites, de operaciones de extracción en u día',
            domain: 'transfermovil',
        }, {
            code: '*444*64#',
            description: 'Enviar giro postal via Correos de Cuba',
            domain: 'transfermovil',
        }, {
            code: '*444*65#',
            description: 'Consultar giro postal / Consultar todas las cuentas',
            domain: 'transfermovil',
        }, {
            code: '*444*66#',
            description: 'Aporte solidario',
            domain: 'transfermovil',
        }, {
            code: '*444*67#',
            description: 'Pago del gas',
            domain: 'transfermovil',
        }, {
            code: '*444*68*01#',
            description: 'Eliminar registro',
            domain: 'transfermovil',
        }, {
            code: '*444*68*02#',
            description: 'Eliminar registro en transfer móvil',
            domain: 'transfermovil',
        }, {
            code: '*444*68*03#',
            description: 'Eliminar registro',
            domain: 'transfermovil',
        }, {
            code: '*444*69#',
            description: 'Cambiar clave (PIN) de Banca móvil',
            domain: 'transfermovil',
        }, {
            code: '*444*70#',
            description: 'Desconectar (cerrar sesión)',
            domain: 'transfermovil',
        }, {
            code: '*444*71#',
            description: 'Lista de servicios y operaciones permitidas. Ayuda',
            domain: 'transfermovil',
        }, {
            code: '*444*72#',
            description: 'Consultar créditos',
            domain: 'transfermovil',
        },
        {
            code: '*444*73#',
            description: 'Localizar transferencias',
            domain: 'transfermovil',
        },
        {
            code: '*444*74#',
            description: 'Reimprimir tarjeta',
            domain: 'transfermovil',
        },
        {
            code: '*444*75#',
            description: 'Cambio de PIN tarjeta multibanca',
            domain: 'transfermovil',
        },
        {
            code: '*444*76#',
            description: 'Apertura de cuenta USD con respaldo MLC',
            domain: 'transfermovil',
        }, {
            code: '*444*77#',
            description: 'Recargar tarjeta propia',
            domain: 'transfermovil',
        },
        {
            code: '*444*78#',
            description: 'Información de tarjeta de red',
            domain: 'transfermovil',
        },
        {
            code: '*444*79#',
            description: 'Obtener el PIN digital',
            domain: 'transfermovil',
        },
        {
            code: '*444*81#',
            description: 'Apertura de depósito a plazo fijo',
            domain: 'transfermovil',
        },

        {
            code: '*444*82#',
            description: 'Cierre de depósito a plazo fijo',
            domain: 'transfermovil',
        },
        {
            code: '*444*83#',
            description: 'Reportar pérdida del PIN de tarjeta magnética',
            domain: 'transfermovil',
        },
        {
            code: '*444*84#',
            description: 'Pagar cuota nauta hogar',
            domain: 'transfermovil',
        },
        {
            code: '*444*85#',
            description: 'Consultar tipo de cambio',
            domain: 'transfermovil',
        },
        {
            code: '*444*86#',
            description: 'Pagar deuda nauta hogar',
            domain: 'transfermovil',
        }, {
            code: '*444*93#',
            description: 'Recargar cuenta joven club',
            domain: 'transfermovil',
        },
        {
            code: '*2266',
            description: 'Atención telefónica Publicidad',
            domain: 'Cubacel',
        }, {
            code: '*222#',
            description: 'Consultar saldo',
            domain: 'Cubacel',
        }, {
            code: '*222*266#',
            description: 'Muestra el saldo del bono promocional, es decir los megas que se entregan adicionalmente, como son el de navegación nacional y para LTE si adquirimos un paquete de la 3G.',
            domain: 'Cubacel',
        }, {
            code: '*222*264#',
            description: 'Plan Amigos',
            domain: 'Cubacel',
        }, {
            code: '*222*328#',
            description: 'Consultar estado del paquete bolsa de correo nauta (SERVICIOS COMPLEMENTARIOS COMPRADOS O ADQUIRIDOS) Muestra la cantidad de datos del paquete comprado, expresado en MB.',
            domain: 'Cubacel',
        }, {
            code: '*222*468#',
            description: 'Para conocer si la línea de datos móviles se encuentra validada',
            domain: 'Cubacel',
        }, {
            code: '222*889#',
            description: 'Ver crédito del Plan de VOZ',
            domain: 'Cubacel',
        }, {
            code: '222*767#',
            description: 'Ver crédito del Plan SMS',
            domain: 'Cubacel',
        }, {
            code: '*99Número',
            description: 'Cobro revertido, número deseado Paga el que recibe la llamada',
            domain: 'Cubacel',
        }, {
            code: '*31#Número',
            description: 'Llamada anónima',
            domain: 'Cubacel',
        }, {
            code: '*666',
            description: 'Recargar saldo siguiendo instrucciones de voz',
            domain: 'Cubacel',
        }, {
            code: '*662*CodigoDeAccesoORecarga(tarjeta)#',
            description: 'Recargar saldo rápidamente',
            domain: 'Cubacel',
        }, {
            code: '*133#',
            description: 'Permite activar diferentes planes.',
            domain: 'ETECSA',
        }, {
            code: '*123#',
            description: 'Permite acceder al buzón de voz.',
            domain: 'ETECSA',
        }, {
            code: '*80',
            description: 'Buzón de voz',
            domain: 'Cubacel',
        }, {
            code: '*234#Clavepersonal',
            description: 'Permite transferir saldo a otra cuenta., se decuenta una comisión del 0.30 cuc. Los caracteres \'Clavepersonal\' se refieren a nuestra contraseña. Si no hemos establecido ninguna, la predeterminada es 1234.',
            domain: 'Cubacel',
        }, {
            code: '*234*1*NúmeroBefeficiario*Clavepersonal*Saldoatransferir',
            description: 'Transferencia de saldo rápido.',
            domain: 'Cubacel',
        }, {
            code: '*234*2*Clavepersonalvigente*Clavepersonalnueva#',
            description: 'Cambiar la clave personal.',
            domain: 'Cubacel',
        }, {
            code: '*80',
            description: 'Buzón de voz.',
            domain: 'ETECSA',
        }, {
            code: '*30#',
            description: 'Anteriormente era la hora exacta. Activar mostrar el Caller ID del que nos llama',
            domain: 'ETECSA',
        }, {
            code: '#30#',
            description: 'Desactivar la identidad o Caller ID del que nos llama',
            domain: 'ETECSA',
        }, {
            code: '*#30#',
            description: 'Ver el estado del Caller ID del que nos llama',
            domain: 'ETECSA',
        }, {
            code: '*31#',
            description: 'Activar mostrar nuestro Caller ID al llamar',
            domain: 'ETECSA',
        }, {
            code: '#31#',
            description: 'Desactivar la identidad o Caller ID al llamar',
            domain: 'ETECSA',
        }, {
            code: '*#31#', description: 'Ver el estado del Caller ID al llamar',
            domain: 'ETECSA',
        }, {
            code: '#31#NUMERO',
            description: 'Realizar una llamada anónima a un número específico.',
            domain: 'ETECSA',
        }, {
            code: '*43#',
            description: 'Activar llamada en espera.',
            domain: 'ETECSA',
        }, {
            code: '#43#',
            description: 'Desactivar llamada en espera.',
            domain: 'ETECSA',
        }, {
            code: '*#43#',
            description: 'Ver estado de llamada en espera.',
            domain: 'ETECSA',
        }, {
            code: '**21*NUMERO*BS*T#',
            description: 'Desvío de llamadas de forma incondicional.',
            domain: 'ETECSA',
        }, {
            code: '##21**BS#',
            description: 'Desactivar el desvío de llamadas de forma incondicional.',
            domain: 'ETECSA',
        }, {
            code: '*#21**BS#',
            description: 'Ver el estado del desvío de llamadas de forma incondicional.',
            domain: 'ETECSA',
        }, {
            code: '**61*NUMERO*BS*T#',
            description: 'Desvío de llamadas cuando no haya respuesta.',
            domain: 'ETECSA',
        }, {
            code: '##61**BS#',
            description: 'Desactivar el desvío de llamadas cuando no haya respuesta.',
            domain: 'ETECSA',
        }, {
            code: '*#61**BS#',
            description: 'Ver el estado del desvío de llamadas cuando no haya respuesta.',
            domain: 'ETECSA',
        }, {
            code: '**62*NUMERO*BS*T#',
            description: 'Desvío de llamadas si no está localizable (móvil apagado o fuera del área de servicio).',
            domain: 'ETECSA',
        }, {
            code: '##62**BS#',
            description: 'Desactivar el desvío de llamadas si no está localizable (móvil apagado o fuera del área de servicio).',
            domain: 'ETECSA',
        }, {
            code: '*#62**BS#',
            description: 'Ver el estado del desvío de llamadas si no está localizable (móvil apagado o fuera del área de servicio).',
            domain: 'ETECSA',
        }, {
            code: '*67*NUMERO*BS*T#',
            description: 'Desvío de llamadas si está ocupado o rechazan la llamada.',
            domain: 'ETECSA',
        }, {
            code: '##67**BS#',
            description: 'Desactivar el desvío de llamadas si está ocupado o rechazan la llamada.',
            domain: 'ETECSA',
        }, {
            code: '*#67**BS#',
            description: 'Ver el estado del desvío de llamadas si está ocupado o rechazan la llamada.',
            domain: 'ETECSA',
        }, {
            code: '*777#',
            description: 'Crédito disponible (prepago).',
            domain: 'AT&T',
        }, {
            code: '*225#',
            description: 'Crédito disponible (postpago).',
            domain: 'AT&T',
        }, {
            code: '*646#',
            description: 'Minutos disponibles (postpago).',
            domain: 'AT&T',
        }, {
            code: '*141#',
            description: 'Crédito disponible (prepago).',
            domain: 'Vodafone',
        }, {
            code: '*131*CantidadDestino#',
            description: 'Transferir saldo.',
            domain: 'Vodafone',
        }, {
            code: '*225#',
            description: 'Crédito disponible.',
            domain: 'Verizone',
        }, {
            code: '#646',
            description: 'Ver los minutos usados.',
            domain: 'Verizone',
        }, {
            code: '#3282',
            description: 'Ver el uso de datos).',
            domain: 'Verizone',
        }, {
            code: '#768',
            description: 'Pagar factura por teléfono.',
            domain: 'Verizone',
        },
    ];

    // other stuff
    static TELEPHONY_SERVICE = 1; // pls update o dereference
    static SIM_STATE_READY = 0;
    static #MY_PERMISSIONS_REQUEST_CALL_PHONE = 1;
    static CALL_STATE_RINGING = 1;
    static CALL_STATE_OFFHOOK = 2;
    static CALL_STATE_IDLE = 3;

    constructor(name, owner = Phone.#Self.name) {
        super();
        this.name = name; // The phone name (nombre del equipo).
        this.owner = owner;

        // Que no cunda el pánico, es solamente una idea.
        if (navigator.TelephonyManager) {
            this.telephonyManager = navigator.getSystemService(Phone.TELEPHONY_SERVICE);
            navigator.onCallStateChanged = this.onCallStateChanged; // attach telephony hardware to logic
        }

        if (this.#isTelephonyEnabled() || true) { // true by the moment
            this.battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;
            if (this.battery) {
                // Battery status (Este evento se dispara cuando hay un cambio en el nivel de la bateria del móvil)
                // is an event
                this._updateBatteryStatus = function (event) {
                    this.BatteryLevel = this.battery.level;
                    this.LineOverlap = this.battery.lineOverlap; // ¿Indicará situación de corte en las lineas, o cortocircuito?

                    if (this.battery.lineOverlap) {
                        this.speak('Su móvil está descompuesto.');
                        this.shutDown();
                    } else {
                        this.speak('El nivel de la batería de su móvil ' + this.BatteryLevel * 100 + ' %');
                    }

                    this.BatteryCharging = this.battery.charging;

                    if (this.BatteryCharging) {
                        this.speak('La batería está cargándose.');
                    } else {
                        this.DischargingTime = this.battery.dischargingTime;
                        this.speak(`La batería no está cargándose y se estima que tiene carga suficiente para ${this.DischargingTime / 60} minutos.`);
                    }
                };

                // Enable tone detecting driver
                window.addEventListener('ontone', this.onToneStateChanged);
            }

            // Geolocation setup
            navigator.geolocation.getCurrentPosition((position) => {
                // Get the positioning coordinates.
                Phone.latitude = position.coords.latitude;
                Phone.longitude = position.coords.longitude;
            });

            // Check to make sure the browser supprots DeviceOrientationEvents
            if (window.DeviceOrientationEvent) {
                // Create an event listener
                window.addEventListener('deviceorientation', function (event) {
                    // Get the left-to-right tilt (in degrees).
                    Phone.talvez = event.gamma;
                    // Get the front-to-back tilt (in degrees).
                    Phone.quesi = event.beta;
                    // Get the direction of the device (in degrees).
                    Phone.brujula = event.alpha;
                });
            }

            // Conectivity
            Phone.connected = navigator.onLine;
            if (window.ononline) {
                window.ononline = () => {
                    Phone.connected = true;
                    this.speak(`Ahora tienes cobertura.`);
                };
            }
            if (window.onoffline) {
                window.onoffline = () => {
                    Phone.connected = false;
                    this.speak(`Estás fuera de cobertura.`);
                };
            }
        } else { // the phone is not enable
            this.speak('Your phone is not enabled.');
            // eg. this.disableCallButton();
            // Disable the call button...
        }
    }

    #isTelephonyEnabled() {
        if (this.telephonyManager) {
            if (this.telephonyManager.getSimState() === Phone.SIM_STATE_READY) {
                return true;
            }
        }
        return false;
    }

    onCallStateChanged(e) {
        switch (e.state) {
            case Phone.CALL_STATE_RINGING:
                // Incoming call is ringing.
                this.speak(`Llamada entrante desde ${e.incomingNumber}`);
                break;
            case Phone.CALL_STATE_OFFHOOK:
                // Phone call is active -- off the hook.
                this.speak(`La llamada está activa en ${e.incomingNumber}`);
                break;
            case Prone.CALL_STATE_IDLE:
                return '';// Phone call is active -- off the hook.
            default:
                // Must be an error. Raise an exception or just log it.
                break;
        }
    }

    onToneStateChanged(e) {
        switch (e) {
            case 'dial': {
                this.tone = 'dial';
                break;
            }
            case 'dialrecall': {
                this.tone = 'dialrecall';
                break;
            }
            case 'specialdial': {
                this.tone = 'specialdial';
                break;
            }
            case 'busy': {
                this.tone = 'busy';
                break;
            }
            case 'congestion': {
                this.tone = 'congestion';
                break;
            }
            case 'ring': {
                this.tone = 'ring';
                break;
            }
            case 'facility': {
                this.tone = 'facility';
                break;
            }
            case 'ringmobile': {
                this.tone = 'ringmobile';
                break;
            }
            case 'callwaiting': {
                this.tone = 'callwaiting';
                break;
            }
            case 'specialcongestion': {
                this.tone = 'specialcongestion';
                break;
            }
            case 'creditexpired': {
                this.tone = 'creditexpired';
                break;
            }
            case 'confirm': {
                this.tone = 'confirm';
                break;
            }
            case 'unobtainable': {
                this.tone = 'unobtainable';
                break;
            }
            case 'nutone': {
                this.tone = 'notone'; // oye, dice que no hay tono.
                break;
            }
            case 'intrusion': {
                this.tone = 'intrusion';
                break;
            }
            case 'warning': {
                this.tone = 'warning';
                break;
            }
            case 'acceptance': {
                this.tone = 'acceptance';
                break;
            }
            case 'holdinga': {
                this.tone = 'holdinga';
                break;
            }
            case 'holdingb': {
                this.tone = 'holdingb';
                break;
            }
            case 'specialcallwaiting': {
                this.tone = 'specialcallwaiting';
                break;
            }
            case 'switching': {
                this.tone = 'switching';
                break;
            }
            case 'info': {
                this.tone = 'info';
                break;
            }
            case 'record': {
                this.tone = 'record';
                break;
            }
            case 'stutter': {
                this.tone = 'stutter';
                break;
            }
            default: {
                this.tone = 'notone';
                break;
            }
        }
    }

    beCute() {
        this.speak(`Mo nombre es ${this.name} y pertenezco a ${ths.owner}.`);
    }

    bark() {
        this.speak(`Jau jau.`);
    }

    call(person, enableVideo = false, inSitu = true) {
        if (enableVideo && this.BatteryLevel > Phone.BatteryLevelRequiredForVoiceCall) {
            this.speak(`Su batería tiene carga suficiente para ${(this.BatteryLevel / Phone.BatteryLevelPerSecondCompsumtionRate) / 60} de video streaming bidireccinal.`);
            return this.speak(`Llamada de video a  ${person.name ? person.name : person.phone}.`);
        } else {
            this.speak(`Llamando a ${person.name ? person.name : person.phone}.`);
            if (inSitu) {
                window.location.href = `tel:${person.phone}`;
            } else {
                window.open(`tel:${person.phone}`);
            }
        }
    }

    // Invite a third person to call or video-conference
    invite(person, enableVideo = false) {

    }

    showTime() {
        const date = new Date();
        this.speak(`La hora es ${date.getHours()} horas, y ${date.getMinutes()} minutos.`);
    }

    test() {
        this.realcall({name: 'Pikachú', phone: '007'}); // Calling Pikachu
    }

    // función para marcar
    dial(no, protocol = `tel`, awaiting = false, inSitu = false, anonymous = false, payThere = false, message = null, subject = null) {
        function detectSeparator() {
            let result;
            const defaultSeparator = '?';
            if (this.isAndroid()) {
                result = defaultSeparator;
            } else if (this.isIos()) {
                const iOsVersion_major = +(navigator.userAgent).match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace('OS ', '');
                result = iOsVersion_major < 8 ? ';' : '&';
            } else {
                result = defaultSeparator;
            }
            return result;
        }

        const body = encodeURIComponent(message || '');
        const phone_str = `${anonymous ? '#31#' : ''}${payThere ? '*99' : ''}${no}${sep}subject=${subject}body=${body}`;
        if (awaiting) {
            // window.postMessage(message, `tel:${no}`);
            return fetch(`${protocol}:${phone_str}`).then((response) => {
                if (!response.ok) {
                    const message = `Número no remarcable: ${response.status}, (${response.statusText}), respuesta de tono remoto ${this.tone}.`;
                    throw new Error(message);
                }
            }).json();
        } else if (inSitu) {
            window.location.href = `${prococol}:${phone_str}`;
        } else {
            window.open(`${protocol}:${phone_str}`);
        }
    }

    // Función para enviar un sms
    sms(no, message, awaiting = false, inSitu = false, anonymous = false) {
        // this.speak(`Enviando un sms a ${no ? person.name : person.phone} con el texto "${text}".`);
        this.dial(no, 'sms', awaiting, inSitu, anonymous, false, message);
    }

    // Función imei
    imei(no, anonymous = false, payThere = false) {
        return dial1('*#06#');
    }

    // Función whoami (mi número)
    whoami(no, anonymous = false, payThere = false) {
        return dial1('*#62#');
    }

    // Función para transferir o donar saldo de un teléfono a otro, cuba
    tranferirSaldo(numero, saldo, clave = '1234') {
        return this.call(`*234*1*${numero}*${clave}*${Number(saldo).toFixed(2)}`);
    }

    // función para formatear cadenas ussd...
    ussdRouter(str, goToHomeKeyword = '0', goBackKeyword = '00') {
        const goBack = (str, keyword = '00') => {
            const strArray = str.split('*');
            let newStrArray = [];
            for (let i = 0; i < strArray.length; i += 1) {
                if (strArray[i] === keyword) {
                    newStrArray = newStrArray.slice(0, -1); // remove the string coming before the keyword
                } else {
                    newStrArray = [
                        ...newStrArray,
                        strArray[i],
                    ];
                }
            }
            return newStrArray.join('*');
        };
        const goToHome = (str, keyword = '0') => {
            const strArray = str.split('*');
            let newStr = str;
            for (let i = strArray.length; i >= 0; i -= 1) {
                if (strArray[i] === keyword) {
                    newStr = strArray.slice(i + 1).join('*'); // remove everything preceding keyword (keyword included)
                    break;
                }
            }
            return newStr;
        };
        return goBack(goToHome(str, goToHomeKeyword), goBackKeyword);
    }


    // Sección servicios (experimental)
    ussdService(code) {
        const position = Phone.secretPhoneCodes.findIndex((element) => element.code);
        if (position !== -1) {
            // here implements a way to access the internal módem
            const desc = Phone.secretPhoneCodes[position].description;
            const dom = Phone.secretPhoneCodes[position].description;
            this.speak(`Haciendo udo del código: ${code} del dominio: ${dom}.`);
            console.warn(desc);
            fetch(`tel:${content}`).then((data) => {
                console.warn(`This experimental prototype for telephony lover's, engineers and developers... and hackers.`);
                console.warn(`Use with responsibility...`);

            }); // ???? pls improve (no #libraries & no + than 1 code line)
        } else {
            this.speak('El código es desconocido o no autorizado.');
        }
    }
}

