// 🌺

// En el siguiente modelo de tienda, incluye una clasificación de productos por categoría, ubicación y fecha de vencimiento, en cierre diario incluye las salidas por dependientes, las mismas pueden ser de tres tipos: venta, alquiler y subasta, implementa una lógica diferente para cada uno de los casos. Debes incluir además, los compronbantes con las ventas, los dependientes y productos que mas se venden, u aviso a tiempo para los quee están apunto de vencerse, implementa un horario para limpieza e inventario:

class Tienda {
  static Producto = class {
    constructor(tienda, nombre, categoria, ubicacion, fechaVencimiento, precio, foto, cantidad, disponibleSubasta = false, disponiblePrestamo = false, disponibleAlquiler = false) {
      this.tienda = tienda;
      this.nombre = nombre;
      this.categoria = categoria;
      this.ubicacion = ubicacion;
      this.fechaVencimiento = fechaVencimiento;
      this.precio = precio;
      this.foto = foto;
      this.cantidad = cantidad;
      this.disponibleSubasta = disponibleSubasta;
      this.disponiblePrestamo = disponiblePrestamo;
      this.disponibleAlquiler = disponibleAlquiler;
      this.aptoParaLaVenta = true; // ¿Ha pasado todas las inspecciones?

      this.agregarProducto(this);
    }

    get inventario() {
      return this.tienda.productos;
    }

    agregarProducto(producto) {
      if (!producto.nombre || typeof producto.nombre !== 'string') {
        throw new Error('El producto debe tener un nombre válido');
      }
      if (!producto.precio || typeof producto.precio !== 'number' || producto.precio <= 0) {
        throw new Error('El producto debe tener un precio válido');
      }
      if (!producto.cantidad || typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
        throw new Error('El producto debe tener una cantidad válida');
      }
      const productoEnInventario = this.inventario.find((p) => p.nombre === producto.nombre);
      if (productoEnInventario) {
        productoEnInventario.cantidad += producto.cantidad;
      } else {
        this.inventario.push({
          ...producto,
          cantidad,
        });
      }
    }

    buscarProducto(propiedad, valor) {
      for (const nombreProducto in this.inventario) {
        if (this.inventario.hasOwnProperty(nombreProducto)) {
          const producto = this.inventario[nombreProducto];
          if (producto[propiedad] === valor) {
            return producto;
          }
        }
      }
      return null; // si no se encuentra el producto
    }


    cancelarCompra(nombre, cantidad) {
      const producto = this.buscarProducto('nombre', nombre);
      if (!producto) {
        throw new Error(`El producto '${nombre}' no está disponible`);
      }
      producto.cantidad += cantidad;
      const transaccionIndex = this.transacciones.findIndex((t) => t.nombreProducto === nombre && t.cantidad === cantidad);
      if (transaccionIndex !== -1) {
        this.transacciones.splice(transaccionIndex, 1);
      }
    }

    listarTransacciones() {
      for (const transaccion of this.transacciones) {
        console.log(`${transaccion.nombreProducto} - ${transaccion.cantidad} unidades - $${transaccion.precio} cada una - Fecha: ${transaccion.fecha}`);
      }
    }

    cantidadTotalVendida() {
      let cantidadTotal = 0;
      for (const transaccion of this.transacciones) {
        cantidadTotal += transaccion.cantidad;
      }
      return cantidadTotal;
    }

    listarInventario() {
      for (const nombreProducto in this.inventario) {
        if (this.inventario.hasOwnProperty(nombreProducto)) {
          const producto = this.inventario[nombreProducto];
          console.log(`${producto.nombre} - $${producto.precio} - ${producto.cantidad} en stock`);
        }
      }
    }

    productosAgotados() {
      const productosAgotados = [];
      for (const nombreProducto in this.inventario) {
        if (this.inventario.hasOwnProperty(nombreProducto)) {
          const producto = this.inventario[nombreProducto];
          if (producto.cantidad === 0) {
            productosAgotados.push(producto.nombre);
          }
        }
      }
      return productosAgotados;
    }

    eliminarProducto(nombre) {
      if (!this.inventario[nombre]) {
        throw new Error(`El producto '${nombre}' no está en el inventario.`);
      }
      delete this.inventario[nombre];
    }

    actualizarProducto(nombre, propiedad, valor) {
      const producto = this.buscarProducto('nombre', nombre);
      if (!producto) {
        throw new Error(`El producto '${nombre}' no está en el inventario`);
      }
      producto[propiedad] = valor;
    }

    revisarProducto(producto) {
      // Lógica para revisar si el producto está disponible en el almacén
      // y actualizar las existencias si es necesario
    }

    // Lógica de una venta de un producto.
    async comprarProducto(nombre, cantidad, montoEntregado, esPagoConTarjeta = false) {
      const producto = this.buscarProducto('nombre', nombre);
      if (!producto) {
        throw new Error(`El producto '${nombre}' no está disponible`);
      }
      if (producto.cantidad < cantidad) {
        throw new Error(`No hay suficiente cantidad de '${nombre}' en el inventario`);
      }

      //  productoEnInventario.cantidad -= cantidad;
      const venta = {
        producto,
        cantidad,
        precio: producto.precio,
        pago: 'En efectivo',
        montoRecibido: montoEntregado,
        vuelto: 0,
      };
      const montoTotal = venta.precio * venta.cantidad;
      if (esPagoConTarjeta) {
        if (!this.paypal) {
          this.paypal = Tienda.CobrosPagos('apikey', 'id', 'secret');
        }
        await this.paypal.pagarConTarjeta(venta.precio * venta.cantidad);
        venta.pago = `A crédito: ${this.nombreTarjeta}-${this.numeroTarjeta}`;
        this.ventas.push(venta);
      } else {
        venta.pago = `Al cash, (${montoEntregado} en efectivo)`;
        if (montoEntregado < montoTotal) {
          console.error(`El monto recibido (${montoEntregado}) es menor al monto total de la venta (${montoTotal}).`);
          return;
        }
        venta.vuelto = montoEntregado - montoTotal;
        producto.cantidad -= cantidad;
        this.tienda.efectivo += producto.precio * cantidad; // agregar el ingreso al total de ventas
      }

      this.transacciones.push({
        nombreProducto: nombre,
        cantidad: cantidad,
        precio: producto.precio,
        importe: montoTotal,
        fecha: new Date().toISOString(),
        vuelto: venta.vuelto,
        pago: 'En efectivo',
      });
      this.efectivo += montoTotal;
      this.ventas.push(venta);
    }

    devolverProducto(producto, cantidad) {
      // Lógica para procesar la devolución de un producto debido a una inconformidad
      // dentro de la garantía y actualizar las existencias y las cuentas correspondientes
    }
  };

  static Dependiente = class {
    constructor(tienda, nombre, ventas, salidas) {
      this.tienda = tienda;
      this.nombre = nombre;
      this.ventas = ventas;
      this.salidas = salidas;
      this.tienda.agregarDependiente(this);
    }
  };

  static Mostrador = class {
    constructor(tienda) {
      this.tienda = tienda;
      this.productos = this.tienda.productos;
    }

    agregarProducto(producto, cantidad) {
      const productoEnMostrador = this.productos.find((p) => p.producto.nombre === producto.nombre);
      if (productoEnMostrador) {
        productoEnMostrador.cantidad += cantidad;
      } else {
        this.productos.push({producto, cantidad});
      }
    }

    eliminarProducto(producto) {
      const index = this.productos.findIndex((p) => p.producto.nombre === producto.nombre);
      if (index !== -1) {
        this.productos.splice(index, 1);
      }
    }

    mostrarMostrador() {
      const mostradorHTML = `
      <html>
        <head>
          <title>Mostrador de Productos</title>
          <style>
            .slider {
              -webkit-appearance: none;
              width: 100%;
              height: 15px;
              border-radius: 5px;
              background: #ddd;
              outline: none;
              opacity: 0.7;
              -webkit-transition: .2s;
              transition: opacity .2s;
            }

            .slider:hover {
              opacity: 1;
            }

            .slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background: #4CAF50;
              cursor: pointer;
            }

            .slider::-moz-range-thumb {
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background: #4CAF50;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>Mostrador de Productos</h1>
          <form>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                  <th>Precio total</th>
                  <th>Imagen</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${this.productos.map((p) => `
                  <tr>
                    <td>${p.producto.nombre}</td>
                    <td>${p.producto.precio}</td>
                    <td><input type="range" class="slider" min="0" max="100" value="${p.cantidad}" step="0.1"></td>
                    <td>${p.producto.precio * p.cantidad}</td>
                    <td><img src="${p.producto.foto}" alt="${p.producto.nombre}" width="100"></td>
                    <td><input type="checkbox" name="eliminar" value="${p.producto.nombre}"></td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Total</strong></td>
                  <td>${this.productos.reduce((total, p) => total + p.producto.precio * p.cantidad, 0)}</td>
                  <td></td>
                  <td>
                    <input type="submit" value="Actualizar">
                    <button type="button" onclick="window.close()">Cerrar compra</button>
                    <button type="button" onclick="window.close()">Cancelar</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </form>
        </body>
      </html>
    `;

      const ventanaMostrador = window.open('', '_blank');
      ventanaMostrador.document.write(mostradorHTML);
      ventanaMostrador.document.close();

      const form = ventanaMostrador.document.querySelector('form');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            const producto = this.productos.find((p) => p.producto.nombre === checkbox.value);
            this.eliminarProducto(producto.producto);
          }
        });
        const sliders = form.querySelectorAll('.slider');
        sliders.forEach((slider) => {
          const producto = this.productos.find((p) => p.producto.nombre === slider.parentElement.previousElementSibling.previousElementSibling.textContent);
          producto.cantidad = parseFloat(slider.value);
        });
        this.mostrarMostrador();
      });
    }
  };

  static Subasta = class {
    constructor(tienda, producto, valorInicial) {
      this.tienda = tienda;
      this.producto = producto;
      this.valorInicial = producto.precio;
      this.propuestas = [];
      this.vendido = false;
      this.comprador = null;
      this.mejorOferta = valorInicial;
    }

    hacerPropuesta(comprador, oferta) {
      if (oferta <= this.mejorOferta || this.vendido) {
        // Si la oferta es menor o igual que la mejor oferta actual, o si el producto ya se vendió, no se acepta la propuesta
        return false;
      }
      this.propuestas.push({comprador, oferta});
      this.mejorOferta = oferta;
      return true;
    }

    finalizarSubasta() {
      if (this.propuestas.length === 0) {
        // Si no hubo propuestas, el producto no se vendió
        return false;
      }
      // Seleccionamos al comprador con la mejor oferta
      const mejorPropuesta = this.propuestas.reduce((mejor, actual) => {
        return actual.oferta > mejor.oferta ? actual : mejor;
      });
      this.comprador = mejorPropuesta.comprador;
      this.vendido = true;
      return true;
    }

    obtenerGanador() {
      if (!this.vendido) {
        return null;
      }
      return this.comprador;
    }

    obtenerMejorOferta() {
      return this.mejorOferta;
    }

    estaVendido() {
      return this.vendido;
    }
  };

  static Alquiler = class {
    constructor(tienda, producto, fechaTope, valorPorTiempo, garantia = producto.precio) {
      this.tienda = tienda;
      this.producto = producto;
      this.fechaTope = fechaTope;
      this.garantia = garantia;
      this.valorPorTiempo = valorPorTiempo;
      this.prestado = false;
      this.fechaPrestamo = new Date();
      this.fechaDevolucion = fechaTope;
      this.valorTotal = producto.precio;
      this.ganancia = producto.precio;
    }

    prestar(fecha) {
      if (this.prestado) {
        // Si el producto ya está prestado, no se puede prestar de nuevo
        return false;
      }
      this.prestado = true;
      this.fechaPrestamo = fecha;
      return true;
    }

    devolver(fecha) {
      if (!this.prestado) {
        // Si el producto no está prestado, no se puede devolver
        return false;
      }
      this.prestado = false;
      this.fechaDevolucion = fecha;

      // Calculamos el valor total del préstamo y la ganancia
      const tiempoPrestamo = Math.ceil((this.fechaDevolucion.getTime() - this.fechaPrestamo.getTime()) / (1000 * 60 * 60 * 24));
      this.valorTotal = tiempoPrestamo * this.valorPorTiempo;
      this.ganancia = this.valorTotal - this.garantia;

      // Verificamos si el préstamo se devolvió en el tiempo acordado
      if (this.fechaDevolucion > this.fechaTope) {
        // Si se pasó de la fecha tope, se penaliza restando la garantía del valor total
        this.valorTotal -= this.garantia;
      }

      return true;
    }

    obtenerGanancia() {
      return this.ganancia;
    }

    obtenerValorTotal() {
      return this.valorTotal;
    }

    obtenerGarantia() {
      return this.garantia;
    }

    obtenerFechaPrestamo() {
      return this.fechaPrestamo;
    }

    obtenerFechaDevolucion() {
      return this.fechaDevolucion;
    }

    estaPrestado() {
      return this.prestado;
    }
  };

  static Venta = class {
    constructor(tienda, productos, hora, unidades, dependiente, formaDePago, comprador = null) {
      this.tienda = tienda;
      this.productos = productos; // Múltiples
      this.hora = hora; // Hora de venta
      this.unidades = unidades; // Cantidad de unidades vendidas
      this.dependiente = dependiente; // Nombre del dependiente que realizó la venta
      this.formaDePago = formaDePago; // Forma de pago (por ejemplo: efectivo, tarjeta de crédito)
      this.comprador = comprador; // Información del comprador (por ejemplo: nombre, tarjeta de crédito, carnet de identidad)
      this.total = productos.reduce((total, p) => total + p.precio, 0);
    }

    generarComprobante() {
      const comprobanteHTML = `
    <html>
      <head>
        <title>Comprobante de Venta</title>
      </head>
      <body>
        <h1>Comprobante de Venta</h1>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            ${this.productos.map((p) => `
              <tr>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>${this.total}</strong></td>
            </tr>
            <tr>
              <td><strong>Hora de venta</strong></td>
              <td>${this.hora}</td>
            </tr>
            <tr>
              <td><strong>Unidades vendidas</strong></td>
              <td>${this.unidades}</td>
            </tr>
            <tr>
              <td><strong>Dependiente</strong></td>
              <td>${this.dependiente}</td>
            </tr>
            <tr>
              <td><strong>Comprador</strong></td>
              <td>${this.comprador}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

      const ventanaComprobante = window.open('', '_blank');
      ventanaComprobante.document.write(comprobanteHTML);
      ventanaComprobante.document.close();
    }

    // Resto del código igual que en la implementación anterior
  };

  static Probador = class {
    static Prenda = class {
      constructor(probador, nombre, imagen, transform, rotacion) {
        this.probabor = probador;
        this.nombre = nombre;
        this.imagen = imagen;
        this.transform = 0;
        this.rotacion = 0;
      }
    };

    constructor(tienda) {
      this.tienda = tienda;
      this.prendas = [];
    }

    agregarPrenda(prenda) {
      this.prendas.push(prenda);
    }

    quitarPrenda(prenda) {
      const index = this.prendas.findIndex((p) => p.nombre === prenda.nombre);
      if (index !== -1) {
        this.prendas.splice(index, 1);
      }
    }

    mostrarProbador() {
      const probadorHTML = `
      <html>
        <head>
          <title>Probador Virtual</title>
          <style>
            #probador {
              width: 400px;
              height: 600px;
              border: 1px solid black;
              position: relative;
            }

            #modelo {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background-image: url('https://via.placeholder.com/400x600');
              background-size: cover;
            }

            .prenda {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
            }
          </style>
        </head>
        <body>
          <h1>Probador Virtual</h1>
          <div id="probador">
            <div id="modelo"></div>
            ${this.prendas.map((p, i) => `
              <div class="prenda" style="z-index: ${i + 1}; transform: ${p.transform} rotate(${p.rotacion}deg); background-image: url('${p.imagen}')"></div>
            `).join('')}
          </div>
          <p>
            Altura: ${this.altura} cm<br>
            Peso: ${this.peso} kg
          </p>
        </body>
      </html>
    `;

      const ventanaProbador = window.open('', '_blank');
      ventanaProbador.document.write(probadorHTML);
      ventanaProbador.document.close();
    }
  };

  static CobrosPagos = class {
    static #paypalApiKey = '';
    static #id = '';
    static #secret = '';

    constructor(paypalApiKey = '(c) 2023 ', clientId = 'Luis Guillermo Bultet Ibles', secret = 'Para ti.') {
      CobrosPagos.#paypalApiKey = paypalApiKey; // La API Key de PayPal
      CobrosPagos.#id = id;
      CobrosPagos.#secret = secret;
    }

    static async PaypalAccessToken() {
      const url = 'https://api.sandbox.paypal.com/v1/oauth2/token';
      const data = {
        grant_type: 'client_credentials',
        client_id: Tienda.CobrosPagos.#id,
        client_secret: Tienda.CobrosPagos.#secret,
      };
      let resultData;
      await fetch(url, {method: 'POST', body: JSON.stringify(data)})
        .then((res) => res.json())
        .then((resultData) => {
          const accessToken = resultData.access_token;
          // Usa accessToken en tus peticiones a Paypal
        });
      return resultData;
    }

    static async pagarConPayPal(suma) {
      const data = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'TU_URL_DE_RETORNO',
          cancel_url: 'TU_URL_DE_CANCELACION',
        },
        transactions: [{
          amount: {
            total: suma.toFixed(2),
            currency: 'USD',
          },
          description: 'Compra en Mi Tienda',
        }],
      };

      const response = await fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Tienda.CobrosPagos.PaypalAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 201 && responseData.links) {
        const approvalUrl = responseData.links.find((link) => link.rel === 'approval_url').href;
        console.log(`Visita esta URL para aprobar el pago: ${approvalUrl}`);
        alert(`Visita esta URL para aprobar el pago: ${approvalUrl}`);
      } else {
        console.error('Error en el procesamiento del pago con PayPal');
        alert('Error en el procesamiento del pago con PayPal');
        throw new Error('Error en el procesamiento del pago con PayPal');
      }
    }

    // Procesar un pago a tu cuenta de paypal con tarjeta de crédito
    static async procesarPagoConTarjeta(nombreTarjeta, numeroTarjeta, fechaExpiracion, codigoSeguridad, monto) {
      // Validar los datos de la tarjeta
      if (!await CobrosPagos.validarTarjeta(numeroTarjeta)) {
        console.error('Número de tarjeta inválido');
        alert('Número de tarjeta inválido');
        throw new Error('Número de tarjeta inválido');
      }
      if (!/^[0-9]{2}\/[0-9]{2}$/.test(fechaExpiracion)) {
        console.error('Fecha de expiración inválida');
        alert('Fecha de expiración inválida');
        throw new Error('Fecha de expiración inválida');
      }
      if (!/^[0-9]{3,4}$/.test(codigoSeguridad)) {
        console.error('Código de seguridad inválido');
        alert('Código de seguridad inválido');
        throw new Error('Código de seguridad inválido');
      }

      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/payments/payment';
      const credit_card_data = {
        number: numeroTarjeta,
        type: CobrosPagos.obtenerTipoTarjeta(numeroTarjeta),
        expire_month: fechaExpiracion.substring(0, 2),
        expire_year: fechaExpiracion.substring(3, 5),
        cvv2: codigoSeguridad,
        first_name: nombreTarjeta.split(' ')[0],
        last_name: nombreTarjeta.split(' ')[1],
      };
      const data = {
        intent: 'sale',
        payer: {
          payment_method: 'credit_card',
          funding_instruments: [{
            credit_card: credit_card_data,
          }],
        },
        transactions: [{
          amount: {
            total: monto,
            currency: 'USD',
          },
        }],
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CobrosPagos.PaypalAccessToken()}`,
        },
        body: JSON.stringify(data),
      };

      // Procesar el pago con PayPal
      const respuesta = await fetch(url, options);
      const resultado = await respuesta.json();

      if (resultado.state === 'approved') {
        return resultado;
      } else {
        console.error('Error al procesar el pago con PayPal');
        alert('Error al procesar el pago con PayPal');
        throw new Error('Error al procesar el pago con PayPal');
      }
    }


    // Para obtener tu API Key (tanto live como sandbox), sigue estos pasos:
    // Inicia sesión en tu cuenta de desarrollador de Paypal (developer.paypal.com)
    // Ve a la sección "Dashboard" y luego a "API Keys"
    // Click en "Create App" para generar una nueva aplicación
    // Selecciona el tipo de aplicación (live, sandbox o ambas)
    // Paypal generará tu Client ID y Secret (que usarás para obtener un access token)
    // Para obtener el access token, llama a la API de auth de Paypal pasando tu Client ID y Secret:

    static cobrarPaypal(cantidad) {
      const url = `https://api.paypal.com/v1/payments/payment`;
      const headers = {Authorization: `Bearer ${this.paypalApiKey}`};
      const data = {
        intent: 'sale',
        payer: {payment_method: 'paypal'},
        transactions: [{amount: {total: cantidad, currency: 'USD'}}],
      };
      fetch(url, {method: 'POST', headers, body: JSON.stringify(data)});
    }

    static async recibirPagoPaypal(cantidad) {
      const url = `https://api.paypal.com/v1/payments/payment`;
      const headers = {Authorization: `Bearer ${this.paypalApiKey}`};
      let result;
      await fetch(url, {headers})
        .then((res) => res.json())
        .then((result) => {
          if (result.transactions[0].amount.total === cantidad) {
            console.log('Se recibió el pago con Paypal');
            alert('Se recibió el pago con Paypal');
          }
        });
    }

    static async subMayorPaypal() {
      const url = 'https://api.sandbox.paypal.com/v1/payments/payment';
      const headers = {Authorization: 'Bearer <TU_SANDBOX_API_KEY>'};
      let data;
      await fetch(url, {headers})
        .then((res) => res.json())
        .then((data) => {
          // Usa data para verificar pagos, etc.
        });
      return data;
    }

    // Validar tarjeta de crédito
    static async validarTarjeta(numeroTarjeta) {
      if (/[^0-9-\s]+/.test(numeroTarjeta)) return false;

      // Eliminar espacios en blanco y guiones
      const tarjeta = numeroTarjeta.replace(/\D/g, '');

      // Verificar longitud de la tarjeta
      if (tarjeta.length < 13 || tarjeta.length > 19) return false;

      // Verificar número de identificación del emisor
      const identificacionEmisor = parseInt(tarjeta.substring(0, 2));
      if (identificacionEmisor < 1 || identificacionEmisor > 99) return false;

      // Algoritmo de Luhn
      let suma = 0;
      let doble = false;
      for (let i = tarjeta.length - 1; i >= 0; i--) {
        let digito = parseInt(tarjeta.charAt(i));
        if (doble) {
          digito *= 2;
          if (digito > 9) digito -= 9;
        }
        suma += digito;
        doble = !doble;
      }
      return suma % 10 === 0;
    }

    static async #determinarSaldos(card_id, accessToken) {
      let availableBalance = 0;
      let balance = 0;

      const paypalCardsUrl = `https://api.sandbox.paypal.com/v1/vault/credit-cards/${card_id}`; // cambiar a 'https://api.paypal.com/v1/vault/credit-cards/${cardId}' para producción

      await fetch(paypalCardsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          availableBalance = data.available_balance.value; // el saldo disponible de la tarjeta
          balance = data.balance.value; // el saldo total de la tarjeta
          console.log(`Saldo disponible: ${availableBalance}`);
          console.log(`Saldo total: ${balance}`);
        })
        .catch((error) => console.log(error));

      return {
        availableBalance: Number(availableBalance),
        balance: Number(balance),
      };
    }

    // Saldo
    static async saldoTarjetaCredito(tarjeta) {
      let saldotarjeta = 0;
      const paypalAuthUrl = 'https://api.sandbox.paypal.com/v1/oauth2/token'; // cambiar a 'https://api.paypal.com/v1/oauth2/token' para producción

      const clientId = CobrosPagos.#id;
      const clientSecret = CobrosPagos.#secret;

      const authString = `${clientId}:${clientSecret}`;
      const base64AuthString = btoa(authString);

      fetch(paypalAuthUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64AuthString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })
        .then((response) => response.json())
        .then((data) => {
          const accessToken = data.access_token;
          // aquí puedes utilizar el token de acceso para hacer solicitudes a la API de PayPal
          // por ejemplo:
          saldotarjeta = CobrosPagos.#determinarSaldos(tarjeta, token);
        })
        .catch((error) => console.log(error));
      return saldotarjeta.availableBalance;
    }


    // Ventana para pagar
    static async pagarConTarjeta(suma) {
      const modal = document.createElement('div');
      modal.innerHTML = `
    <div class="modal">
      <h2>Introduce los datos de tu tarjeta de crédito</h2>
      <form>
        <label for="nombre-tarjeta">Nombre del titular:</label>
        <input type="text" id="nombre-tarjeta" required>
        <label for="numero-tarjeta">Número de tarjeta:</label>
        <input type="text" id="numero-tarjeta" required>
        <label for="fecha-expiracion">Fecha de expiración:</label>
        <input type="text" id="fecha-expiracion" required>
        <label for="codigo-seguridad">Código de seguridad:</label>
        <input type="text" id="codigo-seguridad" required>
        <label for="monto">Monto a pagar:</label>
        <input type="text" id="monto" value="${suma.toFixed(2)}" readonly>
        <button type="submit">Pagar</button>
      </form>
    </div>
    <div class="overlay"></div>
  `;

      let result = false;
      document.body.appendChild(modal);

      const form = modal.querySelector('form');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        this.nombreTarjeta = form.querySelector('#nombre-tarjeta').value;
        this.numeroTarjeta = form.querySelector('#numero-tarjeta').value;

        this.fechaExpiracion = form.querySelector('#fecha-expiracion').value;
        this.codigoSeguridad = form.querySelector('#codigo-seguridad').value;
        const monto = parseFloat(form.querySelector('#monto').value);
        const respuesta = await CobrosPagos.procesarPagoConTarjeta(this.nombreTarjeta, this.numeroTarjeta, this.fechaExpiracion, this.codigoSeguridad, monto);
        if (respuesta.ok) {
          result = true;
          console.log('Pago procesado exitosamente');
          alert('Pago procesado exitosamente');
        } else {
          result = false;
          console.error('Error en el procesamiento del pago con tarjeta');
          alert('Error en el procesamiento del pago con tarjeta');
          throw new Error('Error en el procesamiento del pago con tarjeta');
        }
        modal.remove();
      });

      return result;
    }
  };

  // Constructor de la tienda
  constructor() {
    // Revisamos las cuentas de entradas, salidas y existencias
    this.entradas = 0;
    this.salidas = 0;
    this.existencias = 0;
    // Actualizamos los productos disponibles en el mostrador
    this.productos = [];
    // Iniciamos la caja (Ventas, vueltos por devolver y propinas)
    this.efectivo = 0;
    // Iniciamos las las ventas
    this.ventasDiarias = 0;
    // Delegamos a los dependientes
    this.dependientes = [];
    // Abrimos los mostradores
    this.mostradores = [];
  }

  agregarDependiente(dependiente) {
    this.dependientes.push(dependiente);
  }

  agregarMostrador(mostrador) {
    this.mostradores.push(mostrador);
  }

  abrirDia() {
    // Lógica para abrir el día de trabajo y preparar la tienda para las ventas
  }

  cerrarDia() {
    // Lógica para cerrar el día de trabajo y calcular las ventas diarias
  }

  obtenerProductosPorCategoria(categoria) {
    return this.productos.filter((producto) => producto.categoria === categoria);
  }

  obtenerProductosPorUbicacion(ubicacion) {
    return this.productos.filter((producto) => producto.ubicacion === ubicacion);
  }

  obtenerProductosPorFechaVencimiento(fechaVencimiento) {
    return this.productos.filter((producto) => producto.fechaVencimiento === fechaVencimiento);
  }

  obtenerProductosMasVendidos() {
    // Lógica para obtener los productos que más se han vendido durante el día
  }

  obtenerDependientesMasEfectivos() {
    // Lógica para obtener los dependientes que más han vendido durante el día
  }

  agregarSalidaDependiente(tipoSalida, nombreDependiente, producto, cantidad) {
    // Lógica para agregar una salida de producto por parte de un dependiente
    // según el tipo de salida (venta, alquiler o subasta)
    const dependiente = this.dependientes.find((dep) => dep.nombre === nombreDependiente);
    if (!dependiente) {
      throw new Error(`El dependiente ${nombreDependiente} no existe.`);
    }
    if (tipoSalida === 'venta') {
      // Lógica para registrar una venta
      dependiente.ventas += cantidad;
      this.salidas += cantidad;
      this.existencias -= cantidad;
      this.ventasDiarias += producto.precio * cantidad;
      this.efectivo += producto.precio * cantidad;
    } else if (tipoSalida === 'alquiler' && producto.disponibleAlquiler) {
      // Lógica para registrar un alquiler
      dependiente.salidas.push({
        producto: producto,
        cantidad: cantidad,
        tipo: 'alquiler',
      });
      this.salidas += cantidad;
      this.existencias -= cantidad;
      producto.disponibleAlquiler = false;
    } else if (tipoSalida === 'prestamo' && producto.disponiblePrestamo) {
      // Lógica para registrar un préstamo
      dependiente.salidas.push({
        producto: producto,
        cantidad: cantidad,
        tipo: 'prestamo',
      });
      this.salidas += cantidad;
      this.existencias -= cantidad;
      producto.disponiblePrestamo = false;
    } else if (tipoSalida === 'subasta' && producto.disponibleSubasta) {
      // Lógica para registrar una subasta
      dependiente.salidas.push({
        producto: producto,
        cantidad: cantidad,
        tipo: 'subasta',
      });
      this.salidas += cantidad;
      this.existencias -= cantidad;
      producto.disponibleSubasta = false;
    } else {
      throw new Error(`El producto ${producto.nombre} no está disponible para ${tipoSalida}`);
    }
  }

  obtenerComprobanteVenta(idVenta) {
    // Lógica para obtener el comprobante de una venta específica
  }

  obtenerComprobanteAlquiler(idAlquiler) {
    // Lógica para obtener el comprobante de un alquiler específico
  }

  obtenerComprobanteSubasta(idSubasta) {
    // Lógica para obtener el comprobante de una subasta específica
  }

  enviarAvisoVencimiento(fechaVencimiento) {
    // Lógica para enviar un aviso cuando un producto está a punto de vencer
  }

  establecerHorarioLimpiezaInventario(horario) {
    // Lógica para establecer el horario de limpieza e inventario de la tienda
  }
}

// Esto es una tienda con todas las de la ley. 🌺
