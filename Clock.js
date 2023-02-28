
class Clock extends WebSystemObject {

    // Tech note: Utiliza un único handler, para mapear el tiempo de procesos vitales, industriales o sensibles que deben ser exactos, deberías utilizar otros métodos,
    // como rutinas a bajo nivel precompiladas por lenguajes de alto nivel.

    static _intervalLatency = 15; // increases to 100ms to improve cpu use if not enough the cap of 50ms to ensure responsiveness within the threshold of human perception.
    static _intervalHandler = -1; // take the unique 50ms interval handler and share others ()
    static _intervalData = [];

    constructor(duration = 1000, oninterval = null, active = true) {
        super();
        this.id = this.autoField(Clock._intervalData, "id");
        this.stopService();
        Clock._intervalData.push(this.newInterval(oninterval, duration, active, 0, this.id));
        Clock._intervalData.sort((a, b) => a.duration - b.duration); // prioritary duration
        if (Clock._intervalData.length > 0) {
            // Just bcoz we're sampling a time process, have to follow the Nyquist-Kotelnikov theorem.
            Clock._intervalLatency = Math.max(15, (Math.round(Clock._intervalData[0].duration / 2))); // 5 ms is the min tolerance.
        }
        this.active = active; // now we can use active, instead startService...
    }

    // esta activa o desactiva.
    get active() {
        return Clock._intervalData[this.id].active;
    }

    set active(state) {
        this.stopService();
        Clock._intervalData[this.id].active = state;
        Clock._intervalData[this.id].baseTime = Number(new Date());
        Clock._intervalData[this.id].latchCounter = Clock._intervalData[this.id].baseTime;
        Clock._intervalData[this.id].reachTime = Clock._intervalData[this.id].baseTime + Clock._intervalData[this.id].duration - Clock._intervalLatency;
        if (state) this.startService();
    }

    // este es el evento
    get oninterval() {
        return Clock._intervalData[this.oninterval];
    }

    // Eventos para el temporizador

    set oninterval(oninterval) {
        this.stopService();
        Clock._intervalData[this.id].oninterval = oninterval;
        this.startService();
    }

    static _intervalEvent = () => { // ti mer
        Clock._intervalData.forEach(interval => {
            let now, attention = true, delay;
            while (attention && interval.active) {
                attention = false;
                interval.latchCounter += Clock._intervalLatency; // oh no, is time elapsed
                now = now ? now : Number(new Date());
                delay = now - interval.reachTime + (interval.QoS_MeanDelay / 2);
                if (delay >= 0) {
                    // Demora media en la calidad del servicio, en milisegundos: (calidad = QoS_MeanDelay/duration, 0 -> Tiempo real, < 0.5 Eficiente, > 0.5 Ineficiente, 1 Imposible, (serve for Shannon theorem in transm.)
                    interval.QoS_MeanDelay = (interval.QoS_MeanDelay * interval.occurrences + delay) / (interval.occurrences + 1);
                    interval.occurrences++;
                    interval.baseTime = now;
                    interval.reachTime = interval.reachTime + interval.duration; // for next time
                    if (interval.oninterval) {
                        attention = true;
                        new Promise(async (resolve, reject) => {
                            try {
                                resolve(interval.oninterval(interval.occurrences)); // i promise you that...
                            } catch (error) {
                                reject(error);
                            }
                        });
                    }
                }
            }
        });
    };

    static enableIntervalTimer = () => {
        Clock._intervalHandler = setInterval(Clock._intervalEvent, Clock._intervalLatency);
    };

    static disableIntervalTimer = () => {
        clearInterval(Clock._intervalHandler);
    };

    newInterval(oninterval, duration = 1000, active = true, occurrences = 0, id = 0) {
        let baseTime = Number(new Date());
        return {
            "id": id,
            "oninterval": oninterval,
            "latchCounter": baseTime,
            "duration": duration,
            "baseTime": baseTime,
            "reachTime": baseTime + duration,
            "active": active,
            "occurrences": 0,
            "QoS_MeanDelay": 0
        };
    }

    // Para evitar alterar algún elemento de _intervalData mientras esté siendo utilizado por _intervalEvent //
    stopService() {
        if (Clock._intervalHandler !== -1) {
            Clock.disableIntervalTimer();
        }
    }

    startService() {
        Clock.enableIntervalTimer();
    }

    // Esta reinicia el contador...
    resetLatchCounter() {
        Clock.stopService();
        let position = Clock._intervalData.findIndex((element) => element.id === this.id);
        if (position !== -1) {
            Clock._intervalData[position].baseTime = Number(new Date());
            Clock._intervalData[position].latchCounter = Clock._intervalData[position].baseTime;
            Clock._intervalData[position].reachTime = Clock._intervalData[position].baseTime + Clock._intervalData[position].duration - Clock._intervalLatency;
            Clock.startService();
        }
    }

    // Usa esta para liberar el cronómetro, antes de destruir el objeto...
    free() {
        Clock.stopService();
        Clock._intervalData = Clock._intervalData.filter((element) => element.id !== this.id);
        // Y el último apaga
        if (Clock._intervalData.length > 0) {
            Clock.startService();
        }
        // super.free();
    }

}
