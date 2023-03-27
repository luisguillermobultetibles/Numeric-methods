import {WebSystemObject} from './WebSystemObject';
import {Autonumeric} from './Autonumeric';
import {Document} from './Document';

// Documentos de transacción
class Transaction extends Document {
  constructor(no, origen, destino, fecha, descripcion, monto) {
    super(no, 'Transacción', {fecha, descripcion}, {origen, destino}, {monto});
  }
}

// Documentos de amortización (Spanglish)
class Amortization extends Document {
  // Aquí implementa las funciones para calcular los intereses simples y compuestos, a partir de una base, una tasa y una cantidad de días...
  // Nota: los intereses no se agregan al capital productivo (es decir, siempre es capital pendiente, especulativo).
  static _interes = (capitalInicial, tasaEsPorciento = 0, periodoEsDias, interesCompuesto = false) => {
    var resultado;
    if (interesCompuesto) {
      resultado = capitalInicial * Math.pow(1 + tasaEsPorciento, periodoEsDias);
    } else {
      resultado = capitalInicial * tasaEsPorciento * periodoEsDias / 100;
    }
    return new Effective(resultado);
  };
  // Obtener el capital inicial.
  static _capitalInicial = (capitalFinal, tasaEsPorciento = 0, periodoEsDias, interesCompuesto = false) => {
    var resultado;
    if (interesCompuesto) {
      resultado = capitalFinal / Math.pow(1 + tasaEsPorciento, periodoEsDias);
    } else {
      resultado = 100 * capitalFinal / (tasaEsPorciento * periodoEsDias);
    }
    return new Effective(resultado);
  };
  // Calcular el número de periodo para obtener un capital final a partir de uno inicial.
  static _periodos = (capitalInicial, capitalFinal, tasaEsPorciento = 0, periodoEsDias, interesCompuesto = false) => {
    if (interesCompuesto) {
      return Math.log(capitalFinal / capitalInicial) / (1 + periodoEsDias);
    } else {
      return 100 * capitalFinal / (capitalInicial * tasaEsPorciento);
    }
  };

  // revisar
  constructor(no, descripcion, saldo, fecha, tasa, tiempo, suma, saldoFinal, simple = true, tiempoTotal = 12) {
    super(no, 'Amortización', {fecha, descripcion, tasa}, {
      saldo, simple, tiempo, tiempoTotal,
    }, {saldoFinal: Amortization._interes(saldo, tasa, tiempo / tiempoTotal, simple)});
  }
}

// Clase para cuenta de tipo bancaria...
// Esta clase está exprimental, está siendo
// desarrollada por Lic. Luis Guillermo Bultet Ibles.
class BankAccount extends WebSystemObject {
  static #banks = []; // Registro de bancos, incluido el actual
  static #operations = []; // Libro mayor global de operaciones

  constructor(balance, interestRate, bankCharges, currency = 'CUC', accessNumber = (new Autonumeric(BankAccount.#banks)).value) {
    super();
    BankAccount.#banks.push({
      accessNumber,
      name,
      balance,
      interestRate,
      bankCharges,
      currency,
      locked,
    });
    this.accessNumber = accessNumber;
  };

  get name() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].name;
  }

  set name(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    if (BankAccount.#banks[position].locked) {
      return new Error(`La cuenta ${BankAccount.#banks[position].accessNumber}->${BankAccount.#banks[position].name} está bloqueada.`);
    }
    BankAccount.#banks[position].name = value;
  }

  get balance() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].balance;
  }

  set balance(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    if (BankAccount.#banks[position].locked) {
      return new Error(`La cuenta ${BankAccount.#banks[position].accessNumber}->${BankAccount.#banks[position].name} está bloqueada.`);
    }
    BankAccount.#banks[position].balance = value;
  }

  get currency() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].currency;
  }

  set currency(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    if (BankAccount.#banks[position].locked) {
      return new Error(`La cuenta ${BankAccount.#banks[position].accessNumber}->${BankAccount.#banks[position].name} está bloqueada.`);
    }
    BankAccount.#banks[position].currency = value;
  }

  get interestRate() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].interestRate;
  }

  set interestRate(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    if (BankAccount.#banks[position].locked) {
      return new Error(`La cuenta ${BankAccount.#banks[position].accessNumber}->${BankAccount.#banks[position].name} está bloqueada.`);
    }
    BankAccount.#banks[position].interestRate = value;
  }

  get bankCharges() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].bankCharges;
  }

  set bankCharges(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    if (BankAccount.#banks[position].locked) {
      return new Error(`La cuenta ${BankAccount.#banks[position].accessNumber}->${BankAccount.#banks[position].name} está bloqueada.`);
    }
    BankAccount.#banks[position].bankCharges = value;
  }

  get locked() {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    return BankAccount.#banks[position].locked;
  }

  set locked(value) {
    let position = BankAccount.#banks.findIndex((bank) => bank.accessNumber === this.accessNumber);
    BankAccount.#banks[position].locked = value;
  }

  amortizacionMensual(accessNumber = this.accessNumber, value = this.bankCharges) {
    this.balance = ((((this.balance * (this.interestRate / 100)) / 12) + this.balance) - this.bankCharges);
  }

  depositar(depositedAmount) { // deposit
    this.balance += depositedAmount;
    return this.balance;
  }

  extraer(withdrawal) { // withdraw, extract
    this.balance -= withdrawal;
    return this.balance;
  }

  transferir(fromBankAccNum, toBankAccNum, amount, date = new Date(), description = '') {
    if (amount > 0) {
      // Pls register operations on a major book...
      let origin = BankAccount.#banks.findIndex((bank) => bank.accessNumber === fromBankAccNum);
      let destiny = BankAccount.#banks.findIndex((bank) => bank.accessNumber === toBankAccNum);
      BankAccount.#banks[origin].balance -= amount;
      BankAccount.#banks[destiny].balance += amount;
      BankAccount.#operations.push(new Transaction((new Autonumeric(BankAccount.#operations).value, BankAccount.#banks[origin], BankAccount.#banks[destiny], date, description, amount)));
    } else {
      throw new Error(`Por favor adeude, est sistema no permite neteos ni transferencias de saldos negativos.`);
    }
  }

}