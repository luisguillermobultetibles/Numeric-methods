// 🌺
class Tienda {
  constructor() {
    // Inicializamos las cuentas de entradas, salidas y existencias
    this.entradas = 0;
    this.salidas = 0;
    this.existencias = 0;
    // Inicializamos los productos disponibles en el mostrador
    this.productos = [];
    // Inicializamos la caja
    this.caja = 0;
    // Inicializamos las ventas diarias
    this.ventasDiarias = 0;
  }

  revisarProducto(producto) {
    // Lógica para revisar si el producto está disponible en el almacén
    // y actualizar las existencias si es necesario
  }

  venderProducto(producto, cantidad, metodoPago) {
    // Lógica para vender un producto y actualizar las cuentas correspondientes
    // según el método de pago utilizado
  }

  devolverProducto(producto, cantidad) {
    // Lógica para procesar la devolución de un producto debido a una inconformidad
    // dentro de la garantía y actualizar las existencias y las cuentas correspondientes
  }

  abrirDia() {
    // Lógica para abrir el día de trabajo y preparar la tienda para las ventas
  }

  cerrarDia() {
    // Lógica para cerrar el día de trabajo y calcular las ventas diarias
  }
}
