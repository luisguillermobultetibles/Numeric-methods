// Componentes interactivos del DOM
'use strict';

export class CustomComponent {
  constructor(owner = null, id = null, _class = null) {
    this.element = null;
    if (id) {
      this.element = document.getElementById(id);
      if (!this.element && _class) {
        this.element = document.createElement(_class);
        this.element.id = id;
        document.body.appendChild(this.container);
      }
    }
    if (owner && owner instanceof CustomContainer) {
      owner.addComponent(this);
    }
  }

  get element() {
    return this.htmlElement;
  }

  set element(element) {
    this.htmlElement = element;
  }

  setEvent(eventName, handler = () => {
    console.warn(` Empty event ${eventName} on ${this.constructor.name}.`);
  }) {
    this.handler = handler.bind(this);
    this.element.addEventListener(eventName, this.handler);
  }

  // Revisar si acepta un solo parámetro
  removeEvent(eventName) {
    this.element.removeEventListener(eventName, this.handler);
  }

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = '';
  }

}

export class CustomContainer extends CustomComponent {
  constructor(containerId = 'myCustomComponentContainer') {
    super(owner, id, 'div');
    this.container = element;
    this.components = [];
  }

  addComponent(component) {
    if (component instanceof Array) {
      component.forEach((comp) => {
        this.addComponent(comp);
      });
    } else {
      this.components.push(component);
      this.container.appendChild(component.getElement());
    }
  }

  removeComponent(component) {
    if (component instanceof Array) {
      component.forEach((comp) => {
        this.addComponent(comp);
      });
    } else {
      this.components = this.components.filter((c) => (c !== compoment) && (compoment.element.id !== component.element.id));
      this.container.removeChild(component.element);
    }
  }

}

export class Button extends CustomComponent {
  constructor(owner, text, onClick) {
    super(owner, null, 'button');
    this.caption = text;
    this.setEvent('click', onClick.bind(this));
  }

  get caption() {
    return this.element().innerText;
  }

  set caption(text) {
    this.element().innerText = text;
  }

}

export class Edit extends CustomComponent {
  constructor(owner, text, onChange) {
    super(owner, null, 'input');
    this.element.type = 'text';
    this.value = text;
    this.setEvent('input', onChange.bind(this));
  }

  get value() {
    return this.element().value;
  }

  set value(value) {
    this.element().value = value;
  }
}

export class Label extends CustomComponent {
  constructor(owner, text) {
    super(owner, null, 'label');
    this.element.text = text;
  }

  get text() {
    return this.element().innerText;
  }

  set text(text) {
    this.element().innerText = text;
  }

}

export class ComboBox extends CustomComponent {
  constructor(owner, options = [
    {value: 'option1', text: 'Option 1'},
    {value: 'option2', text: 'Option 2'},
    {value: 'option3', text: 'Option 3'},
  ]) {
    super(owner, null, 'select');
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.text = option.text;
      this.element.add(optionElement);
    });
  }

  get value() {
    return this.element().value;
  }

  set value(value) {
    this.element().value = value;
  }
}

export class Checkbox extends CustomComponent {
  constructor(owner, labelText, onChange) {
    super(owner, null, 'input');
    this.element.type = 'checkbox';
    this.element.setEvent('change', onChange);

    const label = document.createElement('label');
    label.innerText = labelText;
    label.prepend(this.element);
    this.element = label;
  }

  get value() {
    return this.element().querySelector('input').checked;
  }

  set value(value) {
    this.element().querySelector('input').checked = value;
  }
}

export class RadioButton extends CustomComponent {
  constructor(owner, name, labelText, onChange) {
    super(owner, name, 'input');
    this.element.type = 'radio';
    this.element.name = name;
    this.setEvent('change', onChange);

    const label = document.createElement('label');
    label.innerText = labelText;
    label.prepend(this.element);

    this.element = label;
  }

  get value() {
    return this.element().querySelector('input').checked;
  }

  set value(value) {
    this.element().querySelector('input').checked = value;
  }
}

export class Form extends CustomComponent {
  #form;

  constructor(
    owner,
    elements = [],
    onSubmit = (value) => {
    },
    submitButton = null,
    formId = 'myForm',
  ) {
    super(owner);
    this.#form = document.createElement('form');
    this.#form.id = formId;
    this.#form.addEventListener('submit', this.#onSubmit.bind(this));
    this.element(this.#form);

    elements.forEach((el) => {
      this.#form.appendChild(el.getElement());
      this.addComponent(el);
    });

    if (!submitButton) {
      submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.innerText = 'Enviar';
    }
    this.#form.appendChild(submitButton);

    this.onSubmit = onSubmit;
  }

  #onSubmit(event) {
    event.preventDefault();
    const value = event.target.querySelector('input[type=\'text\']').value;
    this.onSubmit(value);
  }
}

export function unitaryTest() {
  let myForm = new Form();

  const myButton = new Button(myForm, 'Click me', function() {
    console.log('Button clicked');
  });

  const myEdit = new Edit(myForm, function(event) {
    console.log(`Edit value changed: ${event.target.value}`);
  });

  const myLabel = new Label(myForm, 'Hello, world!');

  const myComboBox = new ComboBox(myForm, [
    {value: 'option1', text: 'Option 1'},
    {value: 'option2', text: 'Option 2'},
    {value: 'option3', text: 'Option 3'},
  ]);

  const myCheckbox1 = new Checkbox(myForm, 'Check me', function(event) {
    console.log(`Checkbox value changed: ${event.target.checked}`);
  });

  const myCheckbox2 = new Checkbox(myForm, 'Check me', function(event) {
    console.log(`Checkbox value changed: ${event.target.checked}`);
  });

  const myRadioButton1 = new RadioButton(myForm, 'myRadioGroup', 'Option 1', function(event) {
    console.log(`Radio button 1 value changed: ${event.target.checked}`);
  });

  const myRadioButton2 = new RadioButton(myForm, 'myRadioGroup', 'Option 1', function(event) {
    console.log(`Radio button 2 value changed: ${event.target.checked}`);
  });

  myButton.caption = 'Click me again';
  myEdit.value = 'New value';
  myLabel.caption = 'Hello, everyone! Hola a ti.';
  myComboBox.value = 'option2';
  myCheckbox1.value = true;
  myCheckbox2.value = false;
  myRadioButton1.value = true;
  myRadioButton2.value = false;

  // Para usar la clase, puedes crear una instancia de ella y pasar los datos y el ID del contenedor como argumentos:

  const tableta = new Table(myForm, datax, 'container');
}

///////////////////////////////////
class Table extends CustomComponent {
  constructor(data, id) {
    super(owner, id);
    this.data = data;
    this.element = null;
    this.tbody = null;
    this.createTable();
  }

  createTable() {
// Crear la tabla y agregar los encabezados
    this.element = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const thCheck = document.createElement('th');
    thCheck.textContent = 'Check';
    trHead.appendChild(thCheck);
    for (const key in this.data[0]) {
      const th = document.createElement('th');
      th.textContent = key;
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    this.element.appendChild(thead);

// Crear el cuerpo de la tabla y agregar los datos
    this.tbody = document.createElement('tbody');
    for (let i = 0; i < this.data.length; i++) {
      const tr = document.createElement('tr');
      const tdCheck = document.createElement('td');
      const inputCheck = document.createElement('input');
      inputCheck.type = 'checkbox';

      tdCheck.appendChild(inputCheck);
      tr.appendChild(tdCheck);
      for (const key in this.data[i]) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.data[i][key];
        input.readOnly = true;
        input.setAttribute('disabled', '');
        input.name = key;
        td.appendChild(input);
        tr.appendChild(td);
      }
      this.tbody.appendChild(tr);
    }
    this.element.appendChild(this.tbody);

// Agregar la tabla al contenedor
    this.element.appendChild(this.element);

// Agregar un listener al checkbox para hacer los campos editables o no
    this.element.addEventListener('click', (event) => {
      if (event.target.type === 'checkbox') {
        const inputs = event.target.parentNode.parentNode.getElementsByTagName(
          'input',
        );
        for (let i = 1; i < inputs.length; i++) { // Se sugiere que comience en 0
          if (event.target.checked) {
            inputs[i].readOnly = false;
            inputs[i].removeAttribute('disabled');
          } else {
            inputs[i].readOnly = true;
            inputs[i].setAttribute('disabled', '');
          }
        }
      }
    });

// Agregar un botón para aceptar los cambios y actualizar la data
    const button = document.createElement('button');
    button.textContent = 'Guardar cambios';
    button.addEventListener('click', () => {
      for (let i = 0; i < this.tbody.children.length; i++) {
        const tr = this.tbody.children[i];
        const inputs = tr.getElementsByTagName('input');
        for (let j = 0; j < inputs.length; j++) {
          const input = inputs[j];
          this.data[i][input.name] = input.value;
        }
      }
    });
    this.element.appendChild(button);

  }

// Elementos para combinar y dividir

  static TableRow = class {
    constructor(row) {
      this.row = row;
      this.cells = [];
      for (let i = 0; i < row.cells.length; i++) {
        this.cells.push(new TableCell(row.cells[i]));
      }
    }

    addCell() {
      const cell = this.row.insertCell();
      const tableCell = new TableCell(cell);
      this.cells.push(tableCell);
      return tableCell;
    }

    remove() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].remove();
      }
      this.row.remove();
    }

  };

  static TableCell = class {
    constructor(cell) {
      this.cell = cell;
    }

    remove() {
      this.cell.parentNode.removeChild(this.cell);
    }

  };

  // Reconstruir una tabla dadas sus filas y columnas
  constructTable(numRows = 1, numCols = 1) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = this.addRow();
      this.rows.push(row);
      for (let j = 1; j < numCols; j++) {
        row.addCell();
      }
    }
  }

  get numRows() {
    return this.element.rows.length;
  }

  set numRows(r) {
    this.element.rows.length = r;
  }

  get numCols() {
    return this.element.cols;
  }

  set numCols(c) {
    this.element.cols = c;
  }

  addRow() {
    const row = new Table.TableRow(this.element.insertRow());
    this.numRows++;
    this.rows.push(row);
    return row;
  }

  addColumn() {
    for (let i = 0; i < this.numRows; i++) {
      this.rows[i].addCell();
    }
    this.numCols++;
  }

  removeColumn(col = this.numRows - 1) {
    this.rows[col].remove();
  }


  combineCells(startRow, startCol, endRow, endCol) {
    const startCell = this.getCellElement(startRow, startCol);
    const endCell = this.getCellElement(endRow, endCol);
    const colspan = endCol - startCol + 1;
    const rowspan = endRow - startRow + 1;
    startCell.cell.colSpan = colspan;
    startCell.cell.rowSpan = rowspan;
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol + 1; j <= endCol; j++) {
        this.getCellElement(i, j).remove();
      }
    }
    for (let i = startRow + 1; i <= endRow; i++) {
      this.rows[i].cells[startCol].remove();
    }
  }

  splitCell(row, col) {
    const cell = this.getCellElement(row, col);
    const rowspan = cell.cell.rowSpan;
    const colspan = cell.cell.colSpan;
    cell.cell.rowSpan = 1;
    cell.cell.colSpan = 1;
    for (let i = rowspan - 1; i >= 1; i--) {
      const newRow = row + i;
      const newCell = this.rows[newRow].insertCell(col);
      newCell.innerHTML = cell.cell.innerHTML;
      this.rows[newRow].cells[col] = new this.TableCell(newCell);
    }
    for (let i = colspan - 1; i >= 1; i--) {
      const newCol = col + i;
      const newCell = this.rows[row].insertCell(newCol);
      newCell.innerHTML = cell.cell.innerHTML;
      this.rows[row].cells[newCol] = new this.TableCell(newCell);
    }
  }

  getCellElement(row, col) {
    return this.element.rows[row].cells[col];
  }

  getCellValue(row, col) {
    return this.element.rows[row].cells[col].innerHTML;
  }

  // Inner html
  setCellValue(row, col, value) {
    this.element.rows[row].cells[col].innerHTML = value;
  }

}

// Incorporar
function createSlider(labelText, minValue, maxValue, step, defaultValue, onValueChange) {
  const slider = document.createElement('div');
  slider.classList.add('slider');

  const label = document.createElement('label');
  label.innerText = labelText;
  label.classList.add('slider-label');
  slider.appendChild(label);

  const input = document.createElement('input');
  input.setAttribute('type', 'range');
  input.setAttribute('min', minValue);
  input.setAttribute('max', maxValue);
  input.setAttribute('step', step);
  input.setAttribute('value', defaultValue);
  input.classList.add('slider-input');
  slider.appendChild(input);

  let value = defaultValue;

  input.addEventListener('input', function() {
    value = parseFloat(input.value);
    if (onValueChange) {
      onValueChange(value);
    }
  });

  return {
    element: slider,
    getValue: function() {
      return value;
    }
  };
}

class Slider extends CustomComponent {
  constructor(owner, labelText, minValue, maxValue, step, defaultValue, onValueChange) {
    super(owner, null, 'div');

    this.element.classList.add('slider');

    const label = document.createElement('label');
    label.innerText = labelText;
    label.classList.add('slider-label');
    this.element.appendChild(label);

    const input = document.createElement('input');
    input.setAttribute('type', 'range');
    input.setAttribute('min', minValue);
    input.setAttribute('max', maxValue);
    input.setAttribute('step', step);
    input.setAttribute('value', defaultValue);
    input.classList.add('slider-input');
    this.element.appendChild(input);

    let value = defaultValue;

    input.addEventListener('input', function() {
      value = parseFloat(input.value);
      if (onValueChange) {
        onValueChange(value);
      }
    });
    this.element = this.element;
    this.getValue = function() {
      return value;
    };
  }
}
function createTable(numRows, numCols, headers) {
  const table = document.createElement('table');

  // Create header row
  if (headers) {
    const headerRow = document.createElement('tr');
    for (let i = 0; i < numCols; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = headers[i];
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
  }

  // Create data rows
  for (let i = 0; i < numRows; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  return table;
}

function createProgressBar(value, maxValue) {
  const progressBar = document.createElement('progress');
  progressBar.setAttribute('max', maxValue);
  progressBar.setAttribute('value', value);
  return progressBar;
}

function createStatusBar(items) {
  const statusBar = document.createElement('div');
  statusBar.classList.add('status-bar');
  for (let i = 0; i < items.length; i++) {
    const item = document.createElement('div');
    item.textContent = items[i];
    item.classList.add('status-item');
    statusBar.appendChild(item);
  }
  return statusBar;
}

class ProgressBar extends CustomComponent {
  constructor(owner, value, maxValue = 100) {
    super(owner, progressBar, 'progress');
    this.element.setAttribute('max', maxValue);
    this.element.setAttribute('value', value);
  }
}

class PresentableText extends CustomComponent {
  constructor(owner, text, className = 'p') {
    super(owner);
    this.element = document.createElement(className);
    this.element.textContent = text;
    if (className) {
      this.element.classList.add(className);
    }
  }

  setText(text) {
    this.element.textContent = text;
  }

  setClass(className) {
    this.element.classList.add(className);
  }

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = '';
  }
}

class Paragraph extends PresentableText {
  constructor(text, className) {
    super(text, className);
    this.element = document.createElement('p');
    this.element.textContent = text;
    if (className) {
      this.element.classList.add(className);
    }
  }
}

class Heading extends PresentableText {
  constructor(text, level, className) {
    super(text, className);
    this.element = document.createElement('h' + level);
    this.element.textContent = text;
    if (className) {
      this.element.classList.add(className);
    }
  }
}



