// Componentes interactivos del DOM
'use strict';
import {EventDispathcer} from './EventDispatcher.js';

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
  constructor(containerId = 'myCustomComponentContainer', owner = null) {
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
  constructor(owner, numRows, numCols, headers) {
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

    super(owner, null, null);
    this.element = table;
  }

  setCell(row, col, value) {
    this.element.rows[row].cells[col].textContent = value;
  }

  getCell(row, col) {
    return this.element.rows[row].cells[col].textContent;
  }
}

class Slider extends CustomComponent {
  constructor(owner, labelText, minValue, maxValue, step, defaultValue, onValueChange) {
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

    super(owner, null, null);
    this.element = slider;
    this.getValue = function() {
      return value;
    };
  }
}

class ProgressBar extends CustomComponent {
  constructor(owner, value, maxValue) {
    const progressBar = document.createElement('progress');
    progressBar.setAttribute('max', maxValue);
    progressBar.setAttribute('value', value);
    super(owner, null, null);
    this.element = progressBar;
  }

  setValue(value) {
    this.element.value = value;
  }

  getValue() {
    return this.element.value;
  }
}

class StatusBar extends CustomComponent {
  constructor(owner, items) {
    const statusBar = document.createElement('div');
    statusBar.classList.add('status-bar');
    for (let i = 0; i < items.length; i++) {
      const item = document.createElement('div');
      item.textContent = items[i];
      item.classList.add('status-item');
      statusBar.appendChild(item);
    }
    super(owner, null, null);
    this.element = statusBar;
  }

  setText(index, text) {
    this.element.children[index].textContent = text;
  }

  getText(index) {
    return this.element.children[index].textContent;
  }
}

class VerticalContainer extends CustomContainer {
  constructor(id) {
    super(id);
    this.element.classList.add('vertical-container');
  }
}

class HorizontalContainer extends CustomContainer {
  constructor(id) {
    super(id);
    this.element.classList.add('horizontal-container');
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



