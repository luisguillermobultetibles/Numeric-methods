

class Invoice {
  constructor({
    // principal
    title = 'Factura',
    date = new Date().toLocaleDateString(),
    providerLogo = '(C) Pipo',
    providerData = 'Datos del proveedor',
    clientData = 'Datos del cliente',
    contractData = 'Datos del contrato',
    products = [],
    operationData = 'Datos de la operación',
    invoiceNumber = 'N° 1',
    // optionals
    authorizedService = null,
    performedService = null,
    receivedService = null,
    authorizedName = null,
    authorizedTitle = null,
    authorizedCI = null,
    authorizedSignature = null,
    performedName = null,
    performedTitle = null,
    performedCI = null,
    performedSignature = null,
    receivedName = null,
    receivedTitle = null,
    receivedCI = null,
    receivedSignature = null,

  }) {
    this.title = title;
    this.date = date;
    this.providerLogo = providerLogo;
    this.providerData = providerData;
    this.clientData = clientData;
    this.contractData = contractData;
    this.products = products;
    this.operationData = operationData;
    this.invoiceNumber = invoiceNumber;
    //
    this.authorizedService = authorizedService ? authorizedService : '';
    this.performedService = performedService ? performedService : '';
    this.receivedService = receivedService ? receivedService : '';
    this.authorizedName = authorizedName ? authorizedName : '';
    this.authorizedTitle = authorizedTitle ? authorizedTitle : '';
    this.authorizedCI = authorizedCI ? authorizedCI : '';
    this.authorizedSignature = authorizedSignature ? authorizedSignature : '';
    this.performedName = performedName ? performedName : '';
    this.performedTitle = performedTitle ? performedTitle : '';
    this.performedCI = performedCI ? performedCI : '';
    this.performedSignature = performedSignature ? performedSignature : '';
    this.receivedName = receivedName ? receivedName : '';
    this.receivedTitle = receivedTitle ? receivedTitle : '';
    this.receivedCI = receivedCI ? receivedCI : '';
    this.receivedSignature = receivedSignature ? receivedSignature : '';

  }

  // Métodos
  calculateSubtotal() {
    return this.products.reduce((subtotal, product) => subtotal + product.amount * product.price, 0);
  }

  calculateTax() {
    return this.calculateSubtotal() * this.operationData.taxRate;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTax() + this.operationData.extraCosts - this.operationData.discount;
  }

  calculateProductSubtotal(product) {
    return product.amount * product.price;
  }

  calculateProductTax(product) {
    return this.calculateProductSubtotal(product) * this.operationData.taxRate;
  }

  calculateProductTotal(product) {
    return this.calculateProductSubtotal(product) + this.calculateProductTax(product);
  }

  // Método render para renderizar la factura
  render() {
    let html = `
      <div class="invoice">
        <div class="header">
          <div class="logo">
            <img src="${this.providerLogo}" alt="${this.providerData.name}">
          </div>
          <div class="title">
            <h1>${this.title}</h1>
            <p>${this.providerData.name}</p>
          </div>
          <div class="details">
            <p>${this.providerData.address}</p>
            <p>${this.providerData.phone}</p>
            <p>${this.providerData.email}</p>
          </div>
        </div>
        <div class="info">
          <div class="left">
            <div class="client">
              <h2>Cliente</h2>
              <p>${this.clientData.name}</p>
              <p>${this.clientData.address}</p>
              <p>${this.clientData.phone}</p>
              <p>${this.clientData.email}</p>
            </div>
            <div class="contract">
              <h2>Contrato</h2>
              <p>Número: ${this.contractData.number}</p>
              <p>Inicio: ${this.contractData.startDate}</p>
              <p>Fin: ${this.contractData.endDate}</p>
            </div>
          </div>
          <div class="right">
            <div class="number">
              <p>Factura Nº ${this.invoiceNumber}</p>
              <p>Fecha: ${this.date}</p>
            </div>
            <div class="operation">
              <h2>Operación</h2>
              <p>Tipo: ${this.operationData.type}</p>
              <p>Tasa impositiva: ${this.operationData.taxRate}</p>
              <p>Costos extra: ${this.operationData.extraCosts}</p>
              <p>Descuento: ${this.operationData.discount}</p>
            </div>
          </div>
        </div>
        <div class="products">
          <h2>Productos</h2>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
    `;
    for (const product of this.products) {
      html += `
        <tr>
          <td>${product.description}</td>
          <td>${product.quantity}</td>
          <td>${product.unitPrice}</td>
          <td>${product.subtotal}</td>
        </tr>
      `;
    }
    html += `
            </tbody>
          </table>
        </div>
        <div class="total">
          <p>Total: ${this.getTotal()}</p>
        </div>
      </div>
    `;
    this.element = document.createElement('div');
    this.element.innerHTML = html.trim();
    return this.element;
  }

  // Método show para mostrar la factura en pantalla
  show() {
    if (!this.element) {
      this.render();
    }
    document.body.appendChild(this.element);
  }

  // Método hide para ocultar la factura en pantalla
  hide() {
    if (this.element) {
      document.body.removeChild(this.element);
    }
  }

  // ...

  // Método para obtener el total de la factura
  getTotal() {
    let total = 0;
    for (const product of this.products) {
      total += product.subtotal;
    }
    total += total * (this.operationData.taxRate / 100);
    total += this.operationData.extraCosts;
    total -= this.operationData.discount;
    return total.toFixed(2);
  }

  // Método para obtener los datos de una línea de producto o servicio
  getProduct(index) {
    return this.products[index];
  }

  unitaryTest() {
    const invoice = new Invoice(/* datos de la factura */);
    const product = invoice.getProduct(1); // obtiene los datos del segundo producto
    console.log(product.description); // muestra la descripción del segundo producto en la consola
  }

}
