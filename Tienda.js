// 🌺 Ecmascript Store, Tienda (spanish version): B & U "Limited Time Edition"
class Tienda {

  static Producto = class {
    static categories = {
      clothingAndAccessories: 'Ropa y accesorios',
      beautyAndPersonalCare: 'Belleza y cuidado personal',
      homeAndDecor: 'Hogar y decoración',
      electronics: 'Electrónica',
      sportsAndOutdoors: 'Deportes y actividades al aire libre',
      toysAndEntertainment: 'Juguetes y entretenimiento',
      foodAndBeverages: 'Alimentos y bebidas',
      automotive: 'Automóvil y motocicleta',
      pets: 'Mascotas',
      healthAndWellness: 'Salud y bienestar',
    };

    // // Muestra
    static productsData = {
      clothingAndAccessories: [
        {name: 'Camiseta', contact: 'proveedorA', cost: 10, price: 20},
        {name: 'Pantalón', contact: 'proveedorB', cost: 20, price: 40},
        // otros productos de ropa y accesorios
      ],
      beautyAndPersonalCare: [
        {name: 'Cepillo de dientes', contact: 'proveedorC', cost: 2, price: 4},
        {name: 'Champú', contact: 'proveedorD', cost: 5, price: 10},
        // otros productos de belleza y cuidado personal
      ],
      homeAndDecor: [
        {name: 'Mesa de centro', contact: 'proveedorE', cost: 50, price: 100},
        {name: 'Lámpara', contact: 'proveedorF', cost: 20, price: 40},
        // otros productos de hogar y decoración
      ],
      electronics: [
        {name: 'Televisor', contact: 'proveedorG', cost: 300, price: 400},
        {name: 'Laptop', contact: 'proveedorH', cost: 600, price: 800},
        // otros productos de electrónica
      ],
      sportsAndOutdoors: [
        {name: 'Bicicleta', contact: 'proveedorI', cost: 200, price: 300},
        {name: 'Raqueta de tenis', contact: 'proveedorJ', cost: 50, price: 80},
        // otros productos de deportes y actividades al aire libre
      ],
      toysAndEntertainment: [
        {name: 'Juguete', contact: 'proveedorK', cost: 5, price: 10},
        {name: 'Videojuego', contact: 'proveedorL', cost: 30, price: 50},
        // otros productos de juguetes y entretenimiento
      ],
      foodAndBeverages: [
        {name: 'Café', contact: 'proveedorM', cost: 5, price: 8},
        {name: 'Té', contact: 'proveedorN', cost: 3, price: 6},
        // otros productos de alimentos y bebidas
      ],
      automotive: [
        {name: 'Aceite de motor', contact: 'proveedorO', cost: 5, price: 10},
        {name: 'Neumático', contact: 'proveedorP', cost: 50, price: 80},
        // otros productos de automóvil y motocicleta
      ],
      pets: [
        {name: 'Comida para perros', contact: 'proveedorQ', cost: 8, price: 15},
        {name: 'Comida para gatos', contact: 'proveedorR', cost: 8, price: 15},
        // otros productos de mascotas
      ],
      healthAndWellness: [
        {
          name: 'Suplemento vitamínico',
          contact: 'proveedorS',
          cost: 20,
          price: 30,
        },
        {name: 'Crema hidratante', contact: 'proveedorT', cost: 10, price: 20},
        // otros productos de salud y bienestar
      ],
    };

    constructor(tienda, nombre, categoria, ubicacion, fechaVencimiento, contact, cost, precio, foto, cantidad, disponibleSubasta = false, disponiblePrestamo = false, disponibleAlquiler = false) {
      this.tienda = tienda;
      this.nombre = nombre;
      this.categoria = categoria;
      this.ubicacion = ubicacion;
      this.fechaVencimiento = fechaVencimiento;
      this.contact = contact;
      this.costo = cost;
      this.precio = precio;
      this.foto = foto;
      this.cantidad = cantidad;
      this.disponibleSubasta = disponibleSubasta;
      this.disponiblePrestamo = disponiblePrestamo;
      this.disponibleAlquiler = disponibleAlquiler;
      this.aptoParaLaVenta = true; // ¿Ha pasado todas las inspecciones?
      this.agregarProducto(this);
    }

    agregarProductoData() { // demo sobre la muestra
      for (const category in productsData) {
        for (const productData of productsData[category]) {
          const product = new Product(this.tienda, productData.name, category, '', '', productData.contact, productData.cost, productData.price);
          products.push(product);
        }
      }
      // Mostrar información de los productos
      for (const product of products) {
        console.log(product.getInfo());
      }
    }

    getInfo() { // demo
      return `${this.name} (${Product.categories[this.category]}) - Precio de compra: $${this.cost} USD, Precio de venta: $${this.price} USD, Contacto: ${this.contact}`;
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

    // Método para registrar una compra
    registrarCompra(producto, precio) {
      this.inventario.push(producto);
      this.ganancias -= precio;
    }


    // Método para realizar un trueque
// Método para realizar un trueque
    realizarTrueque(producto1, producto2, valoracion1, valoracion2, efectivo = 0) {
      const index1 = this.inventario.indexOf(producto1);
      const index2 = this.inventario.indexOf(producto2);
      if (index1 !== -1 && index2 !== -1) {
        const valorTotal = producto1.precio * valoracion1 + producto2.precio * valoracion2;
        const comision = 0.1 * valorTotal;
        const tarifaFija = 5;
        const cambio = efectivo - valorTotal - comision - tarifaFija;
        if (cambio >= 0) {
          this.inventario.splice(index1, 1, producto2);
          this.inventario.splice(index2, 1, producto1);
          if (!this.trueques) {
            this.trueques = [];
          }
          this.trueques.push({producto1, producto2, valoracion1, valoracion2});
          this.tienda.ventas.push({
            nombre: 'Comisión',
            precio: comision,
            importe: comision,
          });
          this.tienda.ventas.push({
            nombre: 'Tarifa de trueque',
            precio: tarifaFija,
            importe: tarifaFija,
          });
          this.registrarCompra(producto1, producto1.precio * valoracion2);
          this.registrarCompra(producto2, producto2.precio * valoracion1);
          return cambio;
        }
      }
      return false;
    }

    // Método para establecer las políticas de préstamo y valores para los productos
    establecerPoliticas(politicas) {
      this.politicas = politicas;
    }

    // Método para verificar si un producto ha sido devuelto a tiempo
    verificarDevolucion(producto) {
      const politicas = this.politicas || {
        tiempoPrestamo: 7,
        valorProducto: 100,
      };
      const index = this.ventas.findIndex(venta => venta.producto === producto);
      if (index !== -1) {
        const fechaVenta = this.ventas[index].fecha;
        const fechaDevolucion = new Date();
        const diasPrestamo = (fechaDevolucion - fechaVenta) / (1000 * 60 * 60 * 24);
        const valorProducto = politicas.valorProducto || 100;
        if (diasPrestamo > politicas.tiempoPrestamo) {
          this.ganancias += 0.1 * valorProducto;
          console.log(`Se ha cobrado una multa del 10% por devolución tardía de ${producto}`);
        }
        this.ventas.splice(index, 1);
      }
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

    // Las siguientes dos funciones asumen que tienes una cuenta bancaria asociada a la tarjeta

    // Función para transferir saldo a una cuenta bancaria
    transferirSaldoACuentaBancaria(cuentaBancaria, monto) {
      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/payments/payouts';
      const data = {
        sender_batch_header: {
          email_subject: 'Transferencia de saldo de PayPal',
        },
        items: [{
          recipient_type: 'EMAIL',
          amount: {
            value: monto,
            currency: 'USD',
          },
          note: 'Transferencia de saldo de PayPal',
          receiver: cuentaBancaria,
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

      // Realizar la transferencia de saldo a la cuenta bancaria
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.batch_header.batch_status === 'COMPLETED') {
            return resultado;
          } else {
            throw new Error('Error al transferir el saldo a la cuenta bancaria');
          }
        });
    }

    // Función para transferir saldo a una tarjeta de débito o crédito
    transferirSaldoATarjeta(tarjeta, monto) {
      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/payments/payouts';
      const data = {
        sender_batch_header: {
          email_subject: 'Transferencia de saldo de PayPal',
        },
        items: [{
          recipient_type: 'BANK_ACCOUNT',
          amount: {
            value: monto,
            currency: 'USD',
          },
          note: 'Transferencia de saldo de PayPal',
          receiver: tarjeta,
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

      // Realizar la transferencia de saldo a la tarjeta de débito o crédito
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.batch_header.batch_status === 'COMPLETED') {
            return resultado;
          } else {
            throw new Error('Error al transferir el saldo a la tarjeta');
          }
        });
    }

    // Aquí te muestro las funciones para asociar y desasociar las tarjetas paypal

// Función para asociar una cuenta bancaria a la cuenta de PayPal

    asociarCuentaBancaria(cuentaBancaria) {
      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/user/payments/paypal-accounts';
      const data = {
        account_number: cuentaBancaria.numeroCuenta,
        account_type: cuentaBancaria.tipoCuenta,
        bank_name: cuentaBancaria.nombreBanco,
        country_code: cuentaBancaria.codigoPais,
        email_address: cuentaBancaria.correoElectronico,
        account_holder_name: cuentaBancaria.nombreTitular,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CobrosPagos.PaypalAccessToken()}`,
        },
        body: JSON.stringify(data),
      };

      // Realizar la asociación de la cuenta bancaria a la cuenta de PayPal
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.status === 'ACTIVE') {
            return resultado;
          } else {
            throw new Error('Error al asociar la cuenta bancaria a la cuenta de PayPal');
          }
        });
    }

// Función para desasociar una cuenta bancaria de la cuenta de PayPal

    desasociarCuentaBancaria(idCuentaBancaria) {
      // Configurar la petición a la API de PayPal
      const url = `https://api.paypal.com/v1/user/payments/paypal-accounts/${idCuentaBancaria}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${CobrosPagos.PaypalAccessToken()}`,
        },
      };

      // Realizar la desasociación de la cuenta bancaria de la cuenta de PayPal
      return fetch(url, options)
        .then(respuesta => {
          if (respuesta.status === 204) {
            return 'Cuenta bancaria desasociada de la cuenta de PayPal';
          } else {
            throw new Error('Error al desasociar la cuenta bancaria de la cuenta de PayPal');
          }
        });
    }

// Función para asociar una tarjeta de débito o crédito a la cuenta de PayPal

    asociarTarjeta(tarjeta) {
      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/vault/credit-cards';
      const data = {
        number: tarjeta.numero,
        type: tarjeta.tipo,
        expire_month: tarjeta.mesExpiracion,
        expire_year: tarjeta.anioExpiracion,
        billing_address: {
          line1: tarjeta.direccion.linea1,
          line2: tarjeta.direccion.linea2,
          city: tarjeta.direccion.ciudad,
          state: tarjeta.direccion.estado,
          postal_code: tarjeta.direccion.codigoPostal,
          country_code: tarjeta.direccion.codigoPais,
        },
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CobrosPagos.PaypalAccessToken()}`,
        },
        body: JSON.stringify(data),
      };

      // Realizar la asociación de la tarjeta de débito o crédito a la cuenta de PayPal
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          if (resultado.state === 'ok') {
            return resultado;
          } else {
            throw new Error('Error al asociar la tarjeta de débito o crédito a la cuenta de PayPal');
          }
        });
    }

// Función para desasociar una tarjeta de débito o crédito de la cuenta de PayPal

    desasociarTarjeta(idTarjeta) {
      // Configurar la petición a la API de PayPal
      const url = `https://api.paypal.com/v1/vault/credit-cards/${idTarjeta}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${CobrosPagos.PaypalAccessToken()}`,
        },
      };

      // Realizar la desasociación de la tarjeta de débito o crédito de la cuenta de PayPal
      return fetch(url, options)
        .then(respuesta => {
          if (respuesta.status === 204) {
            return 'Tarjeta de débito o crédito desasociada de la cuenta de PayPal';
          } else {
            throw new Error('Error al desasociar la tarjeta de débito o crédito de la cuenta de PayPal');
          }
        });
    }

    /*

    Las anteriores:
    La función asociarCuentaBancaria toma como parámetro un objeto cuentaBancaria que debe contener los campos necesarios para asociar una cuenta bancaria a tu cuenta de PayPal, como el número de cuenta, el tipo de cuenta, el nombre del banco, el correo electrónico asociado a la cuenta bancaria, el nombre del titular de la cuenta y el código del país. La función devuelve una promesa que resuelve con el resultado de la asociación de la cuenta bancaria a la cuenta de PayPal.
    La función desasociarCuentaBancaria toma como parámetro el ID de la cuenta bancaria que deseas desasociar de tu cuenta de PayPal. La función devuelve una promesa que resuelve con un mensaje indicando que la cuenta bancaria ha sido desasociada de la cuenta de PayPal.
    La función asociarTarjeta toma como parámetro un objeto tarjeta que debe contener los campos necesarios para asociar una tarjeta de débito o crédito a tu cuenta de PayPal, como el número de tarjeta, el tipo de tarjeta, la fecha de expiración, la dirección de facturación de la tarjeta y el código del país. La función devuelve una promesa que resuelve con el resultado de la asociación de la tarjeta de débito o crédito a la cuenta de PayPal.
    La función desasociarTarjeta toma como parámetro el ID de la tarjeta de débito o crédito que deseas desasociar de tu cuenta de PayPal. La función devuelve una promesa que resuelve con un mensaje indicando que la tarjeta de débito o crédito ha sido desasociada de la cuenta de PayPal.

    Y las siguientes por si pudiera servir de algo:

    */

    obtenerCuentasAsociadasATarjeta(idTarjeta) {
      // Obtener el token de acceso de PayPal
      const accessToken = CobrosPagos.PaypalAccessToken();

      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/user/payments/paypal-accounts';
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      // Realizar la petición a la API de PayPal
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          // Filtrar las cuentas asociadas a la tarjeta
          const cuentas = resultado.accounts.filter(cuenta => cuenta.funding_instruments.some(instrumento => instrumento.credit_card.id === idTarjeta));
          return cuentas;
        });
    }

    obtenerTarjetasAsociadasACuenta() {
      // Obtener el token de acceso de PayPal
      const accessToken = CobrosPagos.PaypalAccessToken();

      // Configurar la petición a la API de PayPal
      const url = 'https://api.paypal.com/v1/vault/credit-cards';
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      // Realizar la petición a la API de PayPal
      return fetch(url, options)
        .then(respuesta => respuesta.json())
        .then(resultado => {
          // Mapear la información de las tarjetas
          const tarjetas = resultado.credit_cards.map(tarjeta => ({
            id: tarjeta.id,
            numero: tarjeta.number,
            tipo: tarjeta.type,
            mesExpiracion: tarjeta.expire_month,
            anioExpiracion: tarjeta.expire_year,
            direccion: {
              linea1: tarjeta.billing_address.line1,
              linea2: tarjeta.billing_address.line2,
              ciudad: tarjeta.billing_address.city,
              estado: tarjeta.billing_address.state,
              codigoPostal: tarjeta.billing_address.postal_code,
              codigoPais: tarjeta.billing_address.country_code,
            },
          }));
          return tarjetas;
        });
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
