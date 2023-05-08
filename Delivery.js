// Clase base para un paquete
class Delivery {
  constructor(weight, shippingAddress) {
    this.weight = weight;
    this.shippingAddress = shippingAddress;
    this.status = 'En proceso';
    this.trackingNumber = Math.floor(Math.random() * 1000000) + 1;
  }

  // Método para obtener el estado actual del paquete
  getStatus() {
    return this.status;
  }

  // Método para obtener el número de seguimiento del paquete
  getTrackingNumber() {
    return this.trackingNumber;
  }

  // Método para actualizar el estado del paquete
  updateStatus(status) {
    this.status = status;
  }

  // Método para enviar el paquete
  send() {
    this.updateStatus('En tránsito.');
  }

  // Método para recibir el paquete
  receive() {
    this.updateStatus('Entregado.');
  }
}

// Clase para un paquete con seguimiento
class TrackedPackage extends Delivery {
  constructor(weight, shippingAddress) {
    super(weight, shippingAddress);
    this.currentLocation = null;
  }

  // Método para obtener la ubicación actual del paquete
  getCurrentLocation() {
    return this.currentLocation;
  }

  // Método para actualizar la ubicación actual del paquete
  updateLocation(location) {
    this.currentLocation = location;
  }
}

// Clase para un servicio de envío
class ShippingService {
  constructor() {
    this._packages = [];
  }

  // Método para enviar un paquete
  sendPackage(_package) {
    _package.send();
    this._packages.push(_package);
  }

  // Método para recibir un paquete
  receivePackage(_package) {
    _package.receive();
  }

  // Método para obtener un paquete por número de seguimiento
  getPackageByTrackingNumber(trackingNumber) {
    return this._packages.find((_package) => _package.trackingNumber === trackingNumber);
  }
}

// Clase para entrega de pizzas a domicilio
class PizzaDelivery extends TrackedPackage {
  constructor(weight, shippingAddress, toppings) {
    super(weight, shippingAddress);
    this.toppings = toppings;
    this.deliveryStatus = 'En proceso';
  }

  // Método para obtener los ingredientes de la pizza
  getToppings() {
    return this.toppings;
  }

  // Método para actualizar el estado de la entrega
  updateDeliveryStatus(status) {
    this.deliveryStatus = status;
  }

  // Método para iniciar la entrega de la pizza
  startDelivery() {
    this.updateDeliveryStatus('En camino');
    this.updateStatus('En tránsito');
  }

  // Método para finalizar la entrega de la pizza
  completeDelivery() {
    this.updateDeliveryStatus('Entregado');
    this.updateStatus('Entregado');
  }
}
