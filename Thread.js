export class Thread {
  static #taskData = [];

  constructor(defaultFunc = () => {}) {
    if (defaultFunc instanceof Function) {
      this.#addTask(defaultFunc);
    } else {
      this.#addTask(() => {});
    }
  }

  #addTask(func) {
    function autonum(array) {
      let id = 1;
      while (array.some((task) => task.id === id)) {
        id++;
      }
      return id;
    }

    const code = func.toString();
    const workerURL = URL.createObjectURL(new Blob([code], {type: 'application/javascript'}));
    const worker = new SharedWorker(workerURL);
    this.id = autonum(Thread.#taskData);
    const data = {
      id: this.id,
      code: code,
      workerURL: workerURL,
      worker: worker,
      generator: null,
      startingTime: new Date(),
      endingTime: null,
      status: 'nuevo',
      handler: null,
    };
    Thread.#taskData.push(data);
    worker.port.onmessage = (event) => {
      const task = Thread.#taskData.find((task) => task.worker === worker);
      if (task && task.handler) {
        task.handler(event.data);
      }
    };
    data.generator = func.call({
      postMessage: (message) => {
        setTimeout(() => {
          worker.port.postMessage(message);
        }, 0);
      },
      yield: () => {
        return new Promise((resolve) => {
          data.generator.resolve = resolve;
        });
      },
      next: (value) => {
        setTimeout(() => {
          data.generator.resolve(value);
        }, 0);
      }
    });
  }

  get onmessage() {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    return task ? task.handler : null;
  }

  set onmessage(handler) {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    if (task) {
      task.handler = handler;
    }
  }

  end() {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    if (task) {
      task.worker.port.postMessage('close');
      task.worker.port.close();
      URL.revokeObjectURL(task.workerURL);
      task.endingTime = new Date();
      task.status = 'ended';
    }
  }

  async getResults() {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    if (task && task.status === null) {
      return new Promise((resolve, reject) => {
        task.handler = (result) => {
          resolve(result);
        };
      });
    }
    return null;
  }

  async pause() {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    if (task && task.generator && task.status === 'running') {
      task.status = 'paused';
      await task.generator.next();
    }
  }

  async resume() {
    const task = Thread.#taskData.find((task) => task.id === this.id);
    if (task && task.generator && task.status === 'paused') {
      task.status = 'running';
      await task.generator.next();
    }
  }
}

// Aquí está la prueba unitaria actualizada, que incluye la pausa y reanudación
// de la tarea utilizando el método pause y resume:

  export async function pruebaUnitaria() {
    // Crea una instancia de la clase Thread
    const thread = new Thread(function* () {
      // Función que se ejecutará en el hilo
      let result = 0;
      for (let i = 0; i < 1000000000; i++) {
        yield;
        result += i;
      }
      this.postMessage(result);
    });

    // Lanza la tarea y espera un segundo
    const promise1 = thread.getResults();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Pausa la tarea y espera otro segundo
    await thread.pause();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reanuda la tarea y espera a que termine
    await thread.resume();
    const result = await promise1;

    console.log(result); // Output: 499999999500000000
    thread.end();
  }

  /*
  Los estados típicos comunes en un hilo, proceso o tarea son los siguientes:

  Nuevo: el hilo, proceso o tarea ha sido creado pero aún no se ha iniciado su ejecución.

  Listo: el hilo, proceso o tarea está listo para ejecutarse pero aún no ha sido seleccionado por el sistema operativo para su ejecución.

  En ejecución: el hilo, proceso o tarea está siendo ejecutado por el sistema operativo.

  Bloqueado: el hilo, proceso o tarea está esperando que se complete una operación de entrada/salida o que se libere algún recurso que está siendo utilizado por otro hilo, proceso o tarea.

  En espera: el hilo, proceso o tarea está esperando a que se cumpla una condición específica antes de continuar su ejecución.

  Terminado: el hilo, proceso o tarea ha finalizado su ejecución de manera normal o anormal.

  Suspendido: el hilo, proceso o tarea ha sido detenido temporalmente y su ejecución se reanudará en un momento posterior.
  */

