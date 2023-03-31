import {WebSystemObject} from './WebSystemObject';

// Objeto para transferencia de datos entre servidores
class DataTransferObject extends WebSystemObject {
  #id; // optional entity id
  #url; // url
  #statusText; // Response status, literal
  #status; // optional numérico, código de error 0 si no, en un fetch, devuelve los 400 .
  #data; // la cosa en sí
  #callback; // js function were to go, data param
  #awaiting; // awaiting incoming data?
  #startingTime = null; // transaction starting time
  #endingTime = null; // transaction end time

  constructor(url, callback = null) {
    super();
    this.#url = url;
    this.#callback = callback;
    this.#awaiting = false;
  }

  get successfull() {
    return !this.#status;
  };

  // to save
  get data() {
    return this.#data;
  }

  // to load
  set data(x) {
    // here check js attack in x before parse, or take it integral:
    this.#data = this.clone(x);
  }

  send() {
    navigator.sendBeacon(this.#url, this.data)
  }

  #take(res) {
    this.#status = res.status;
    switch (this.#status) {
      case 0: {
        this.#statusText = "success";
        this.#endingTime = new Date();
        this.data = res.json();
        if (this.#callback) { // advise the user him received the packet
          this.#awaiting = false;
          this.#callback(this.data);
        }
        break;
      }
      default:
        if (this.#status >= 400) {
          throw new Error(res.statusText);
        }
    }
  }

  async syncrhonicJSONFetch(...params) {
    this.#awaiting = true;
    this.#startingTime = new Date();
    let res = await fetch(...params);
    return await res.json();
  }

  async asyncrhonicJSONFetch(...params) {
    this.#awaiting = true;
    const res = await fetch(...params);
    this.#take(res);
  }

  // tiempo transcurrido desde el comienzo de la transacción, en milisegundos.
  eleapsedTime() {
    return Number(new Date()) - Number(this.#startingTime);
  }

  unitaryTest() {
    // Recibir un objeto json dinámicamente...
    const request = new XMLHttpRequest();
    var elPaquete;
    // Cargando un script dinámicamente
    const receiveBacon = async (requestURL) => {
      request.open('GET', requestURL);
      // request.async = false; // Lo puse false para ver... sino lo hace asincrónico.
      request.responseType = 'json';
      request.send();
      request.onload = function () {
        elPaquete = request.response;
        alert("Revisa que llegó el paquete...");
      }
    };
    // another stuff..
  }

  test() {
    // Ejemplo implementando el metodo POST:
    async function postData(url = '', data = {}) {
      // Opciones por defecto estan marcadas con un *
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }, redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData('https://example.com/answer', {answer: 42})
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      });

    // Ejemplo Comprobando que la petición es satisfactoria
    fetch('flores.jpg').then(function (response) {
      if (response.ok) {
        response.blob().then(function (miBlob) {
          var objectURL = URL.createObjectURL(miBlob);
          miImagen.src = objectURL;
        });
      } else {
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
      }
    })
      .catch(function (error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
      });

    // Proporcionando tu propio objeto request
    var myHeaders = new Headers();

    var myInit = {
      method: 'GET', headers: myHeaders, mode: 'cors', cache: 'default'
    };

    var myRequest = new Request('flowers.jpg', myInit);

    fetch(myRequest)
      .then(function (response) {
        return response.blob();
      })
      .then(function (myBlob) {
        var objectURL = URL.createObjectURL(myBlob);
        myImage.src = objectURL;
      });

    // Request() acepta exactamente los mismos parámetros que el método fetch(). Puedes incluso pasar un objeto de petición existente para crear una copia del mismo:
    var anotherRequest = new Request(myRequest, myInit);

    // Enviar una petición con credenciales incluido
    fetch('https://example.com', {
      credentials: 'include'
    });

    // Si solo quieres enviar la credenciales si la URL de la petición está en el mismo origen desde donde se llamada el script, añade credentials: 'same-origin'.
    // El script fué llamado desde el origen 'https://example.com'

    fetch('https://example.com', {
      credentials: 'same-origin'
    })

    // Sin embargo para asegurarte que el navegador no incluye las credenciales en la petición, usa credentials: 'omit'.

    fetch('https://example.com', {
      credentials: 'omit'
    })

    // Enviando datos JSON
    var url = 'https://example.com/profile';
    var data = {username: 'example'};

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));

    // Enviando un archivo
    var formData = new FormData();
    var fileField = document.querySelector("input[type='file']");

    formData.append('username', 'abc123');
    formData.append('avatar', fileField.files[0]);

    fetch('https://example.com/profile/avatar', {
      method: 'PUT', body: formData
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));

    // Ejemplo de especificación de cabeceras
    var content = "Hello World";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Content-Length", content.length.toString());
    myHeaders.append("X-Custom-Header", "ProcessThisImmediately");

    // Se puede hacer lo mismo con
    myHeaders = new Headers({
      "Content-Type": "text/plain",
      "Content-Length": content.length.toString(),
      "X-Custom-Header": "ProcessThisImmediately",
    });

    // Los contenidos pueden ser consultados o recuperados:
    console.log(myHeaders.has("Content-Type")); // true
    console.log(myHeaders.has("Set-Cookie")); // false
    myHeaders.set("Content-Type", "text/html");
    myHeaders.append("X-Custom-Header", "AnotherValue");

    console.log(myHeaders.get("Content-Length")); // 11
    console.log(myHeaders.getAll("X-Custom-Header")); // ["ProcessThisImmediately", "AnotherValue"]

    myHeaders.delete("X-Custom-Header");
    console.log(myHeaders.getAll("X-Custom-Header")); // [ ]

    /* Todos los métodosde de headers lanzan un TypeError si un nombre de cabecera no es un nombre de cabecera HTTP válido.
       Las operaciones de mutación lanzarán un TypeError si hay un guarda inmutable (ver más abajo). Si no, fallan silenciosamente.
        Por ejemplo:
    */

    var myResponse = Response.error();
    try {
      myResponse.headers.set("Origin", "http://mybank.com");
    } catch (e) {
      console.log("Cannot pretend to be a bank!");
    }

    // Un buen caso de uso para headers es comprobar cuando el tipo de contenido es correcto antes de que se procese:
    fetch(myRequest).then(function (response) {
      var contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function (json) {
          // process your JSON further
        });
      } else {
        console.log("Oops, we haven't got JSON!");
      }
    });


    // Las propiedades de response que usarás son:

    // Response.status — Entero (por defecto con valor 200) que contiene el código de estado de las respuesta.
    // Response.statusText (en-US) — Cadena (con valor por defecto "OK"), el cual corresponde al mensaje del estado de código HTTP.
    // Response.ok — Visto en uso anteriormente, es una clave para comprobar que el estado está dentro del rango 200-299 (ambos incluidos). Este devuelve un valor Boolean (en-US), siendo true si lo anterior se cumple y false en otro caso.


  }

}