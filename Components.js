// Componentes interactivos del DOM
'use strict';
import {EventDispathcer} from './EventDispatcher.js';

export class CustomComponent extends EventDispathcer {
  constructor(owner = null, id = null, tagName = null) {
    super();
    this.element = null;
    if (id) {
      this.element = document.getElementById(id);
      if (!this.element && tagName) {
        this.element = document.createElement(tagName);
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

  setEvent(type, listener) {
    this.addEventListener(type, listener);
    this.element.addEventListener(type, listener);
  }

  removeEvent(type, listener) {
    this.removeEventListener(type, listener);
    this.element.removeEventListener(type, listener);
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

// Probar
class Modal extends CustomContainer {
  constructor(title, onAccept = null, onCancel = null) {
    super(null, null, 'div');
    this.title = title;
    this.onAccept = onAccept;
    this.onCancel = onCancel;

    // Crear el título del modal
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = this.title;
    this.addComponent(modalTitle);

    // Crear los campos del formulario
    const form = document.createElement('form');
    form.id = 'modal-form';
    this.addComponent(form);

    // Agregar el botón de aceptar al formulario
    const acceptButton = new Button(null, 'Aceptar', async () => {
      if (this.onAccept) {
        this.onAccept();
      }
      this.close();
    });
    form.appendChild(acceptButton.getElement());

    // Agregar el botón de cancelar al formulario
    const cancelButton = new Button(null, 'Cancelar', async () => {
      if (this.onCancel) {
        this.onCancel();
      }
      this.close();
    });
    form.appendChild(cancelButton.getElement());

    // Agregar el evento para cerrar el modal
    const closeButton = new Button(null, 'Cerrar', () => {
      this.close();
    });
    closeButton.element.style.position = 'absolute';
    closeButton.element.style.top = '5px';
    closeButton.element.style.right = '5px';
    this.addComponent(closeButton);

    // Establecer los estilos del modal
    this.element.style.display = 'none';
    this.element.style.backgroundColor = '#f1f1f1';
    this.element.style.borderRadius = '5px';
    this.element.style.padding = '20px';
    this.element.style.position = 'fixed';
    this.element.style.top = '50%';
    this.element.style.left = '50%';
    this.element.style.transform = 'translate(-50%, -50%)';
    this.element.style.zIndex = '9999';

    // Establecer los estilos del fondo del modal
    const backdrop = document.createElement('div');
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.zIndex = '9998';
    backdrop.addEventListener('click', () => {
      this.close();
    });
    this.addComponent(backdrop);
  }

  open() {
    this.element.style.display = 'block';
  }

  close() {
    this.element.style.display = 'none';
  }
}

class Modal2 extends Component {
  constructor(title, onAccept = null, onCancel = null) {
    super();
    this.title = title;
    this.onAccept = onAccept;
    this.onCancel = onCancel;

    this.modalTitle = new Component('h2', {
      textContent: this.title,
    });

    this.acceptButton = new Button('Aceptar', {
      onClick: async () => {
        if (this.onAccept) {
          this.onAccept();
        }
        this.close();
      },
    });

    this.cancelButton = new Button('Cancelar', {
      onClick: async () => {
        if (this.onCancel) {
          this.onCancel();
        }
        this.close();
      },
    });

    this.closeButton = new Button('Cerrar', {
      onClick: () => {
        this.close();
      },
    });

    this.form = new Component('form', {
      children: [this.acceptButton, this.cancelButton],
    });

    this.element = new Component('div', {
      children: [this.modalTitle, this.form, this.closeButton],
      style: {
        display: 'none',
        backgroundColor: '#f1f1f1',
        borderRadius: '5px',
        padding: '20px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
      },
    });

    this.backdrop = new Component('div', {
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9998',
      },
      onClick: () => {
        this.close();
      },
    });
  }

  open() {
    this.element.setStyle('display', 'block');
    document.body.appendChild(this.backdrop.getElement());
    document.body.appendChild(this.element.getElement());
  }

  close() {
    this.element.setStyle('display', 'none');
    document.body.removeChild(this.backdrop.getElement());
    document.body.removeChild(this.element.getElement());
  }
}

class Button extends Component {
  constructor(label, {onClick}) {
    super('button', {
      textContent: label,
      onClick,
      style: {
        margin: '5px',
      },
    });
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

// Puramente teórico desde ChatGPT y sin probar

export class Menu extends CustomComponent {
  constructor(owner, id, items, onSelect) {
    super(owner, id, 'ul');
    this.items = items;
    this.onSelect = onSelect;
    this.renderItems();
  }

  renderItems() {
    this.items.forEach((item) => {
      const li = document.createElement('li');
      li.innerText = item;
      li.addEventListener('click', () => {
        this.onSelect(item);
      });
      this.element.appendChild(li);
    });
  }

  get items() {
    return this._items;
  }

  set items(items) {
    this._items = items;
    this.renderItems();
  }

  get onSelect() {
    return this._onSelect;
  }

  set onSelect(onSelect) {
    this._onSelect = onSelect;
  }
}

export class ContextMenu extends Menu {
  constructor(owner, id, items, onSelect) {
    super(owner, id, items, onSelect);
  }

  renderItems() {
    this.items.forEach((item) => {
      const li = document.createElement('li');
      if (item instanceof Menu) {
        const subMenu = document.createElement('ul');
        subMenu.style.display = 'none';
        subMenu.appendChild(item.getElement());
        li.innerText = 'Expand'; // Add a label for the expandable item
        li.appendChild(subMenu);
        li.addEventListener('click', () => {
          subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
        });
      } else {
        li.innerText = item;
        li.addEventListener('click', () => {
          this.onSelect(item);
        });
      }
      this.element.appendChild(li);
    });
  }
}

// Un menú estático de parte superior de pantalla:
export class StaticMenu extends Menu {
  constructor(owner, id, items, onSelect) {
    super(owner, id, items, onSelect);
  }

  render() {
    const nav = document.createElement('nav');
    nav.classList.add('menu');
    nav.appendChild(this.getElement());
    document.body.insertBefore(nav, document.body.firstChild);
  }

  unitaryTest() {
    // Esta es una forma de probarlo en la aplicación principal.
    const menu = new StaticMenu(null, 'menu', ['Inicio', 'Acerca de nosotros', 'Productos', 'Servicios', 'Contacto'], (item) => {
      console.log(`Se seleccionó ${item}`);
    });

    menu.render();
  }
}