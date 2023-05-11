export class Modal {
  constructor(title, content, options = {}) {
    // Crear el contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    // Crear el fondo oscuro detrás del modal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.classList.add('modal-backdrop');

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Crear el título del modal
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    modalContent.appendChild(modalTitle);

    // Crear el contenido del modal
    if (typeof content === 'string') {
      const modalBody = document.createElement('div');
      modalBody.innerHTML = content;
      modalContent.appendChild(modalBody);
    } else {
      modalContent.appendChild(content);
    }

    // Crear el botón de cerrar
    const modalCloseButton = document.createElement('button');
    modalCloseButton.classList.add('modal-close');
    modalCloseButton.innerHTML = '&times;';
    modalCloseButton.onclick = () => {
      this.close();
    };
    modalContent.appendChild(modalCloseButton);

    // Agregar el contenido del modal al contenedor
    modalContainer.appendChild(modalBackdrop);
    modalContainer.appendChild(modalContent);

    // Aplicar los estilos al modal
    modalContainer.style.display = 'none';
    modalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalBackdrop.style.position = 'fixed';
    modalBackdrop.style.top = '0';
    modalBackdrop.style.left = '0';
    modalBackdrop.style.width = '100%';
    modalBackdrop.style.height = '100%';
    modalContent.style.backgroundColor = '#f1f1f1';
    modalContent.style.margin = '15% auto';
    modalContent.style.borderRadius = '5px';
    modalContent.style.padding = '20px';
    modalCloseButton.style.float = 'right';
    modalCloseButton.style.fontWeight = 'bold';
    modalCloseButton.style.fontSize = '20px';
    modalCloseButton.style.border = 'none';
    modalCloseButton.style.backgroundColor = 'transparent';

    // Agregar opciones adicionales
    if (options.width) {
      modalContent.style.width = options.width;
    }
    if (options.height) {
      modalContent.style.height = options.height;
    }

    // Guardar una referencia al modal y al contenido
    this.modal = modalContainer;
    this.content = modalContent;

    // Agregar el modal al DOM
    document.body.appendChild(modalContainer);
  }

  open() {
    this.modal.style.display = 'block';
  }

  close() {
    this.modal.style.display = 'none';
  }

  unitaryTest() {
    // Crear el formulario
    const formulario = document.createElement('form');
    formulario.innerHTML = `
  <div>
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" name="nombre">
  </div>
  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
  </div>
`;

    // Crear la instancia del modal y abrirlo al hacer clic en un botón
    const abrirModalButton = document.createElement('button');
    abrirModalButton.textContent = 'Abrir formulario';
    const modal = new Modal('Formulario', formulario);
    abrirModalButton.onclick = () => {
      modal.open();
    };

    // Primero pudieras utilizar
    //
    // // Agregar el evento submit al formulario
    //     formulario.addEventListener('submit', (event) => {
    //       event.preventDefault();
    //       // Aquí puede hacer lo que desee con los datos del formulario, como enviarlos a un servidor o procesarlos de alguna otra manera
    //       // Cerrar el modal
    //       modal.close();
    //     });
    //
    // // Agregar el evento clic al botón de cancelar
    //     const cancelarButton = formulario.querySelector('.cancelar');
    //     cancelarButton.addEventListener('click', () => {
    //       // Cerrar el modal
    //       modal.close();
    //     });
    //
    // // Crear la instancia del modal y abrirlo al hacer clic en un botón
    //     const abrirModalButton = document.createElement('button');
    //     abrirModalButton.textContent = 'Abrir formulario';
    //     const modal = new Modal('Formulario', formulario);
    //     abrirModalButton.onclick = () => {
    //       modal.open();
    //     };

    // Agregar el botón al DOM
    document.body.appendChild(abrirModalButton);
  }
}
