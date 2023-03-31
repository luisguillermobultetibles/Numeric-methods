import {WebSystemObject} from './WebSystemObject';

export class House extends WebSystemObject {
  constructor(address, floors = 1, garage = false, residents = {
    habituals: 0,
    eventuals: 0,
  }) {
    super();
    this.address = address;
    this.floors = floors;
    this.garage = garage;
    this.residents = residents;
  }

  bills() {
    // Medicinas. (de botiquín y de uso regular).
    // Agua.
    // Alimentación.
    // Teléfono, acceso a datos e internet.
    // Electricidad, refrigeración y conservación de bebidas y alimentos.
    // Transporte.
    // Climatización y reparaciones.
    // Fondo para eventualidades.
  }

  obligations() {
    // Aseo personal, corta uñas, pinturas, pinzas, almohadillas, gasas, etc...
    // Ropa y calzado, medias y ropa interior.
    // Ropas de cama, fundas, sábanas, mosquiteros.
    // Colchones y almohadas.
  }


}
