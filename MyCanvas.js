import {WebSystemObject} from './WebSystemObject.js';

/*
    Puedes utilizar las funciones de esta clase para conectar o crear un canvas
    o lienzo de dibujo, se incorporan algunas funciones para facilitar el proceso
    de actualización de imágenes según el standard, o bien puedes dibujar de la
    misma forma accediendo directamente al contexto.

    Se reconocen todos los derechos de autor, se agradece a sky-cons-master., etc.

*/

class MyCanvas extends WebSystemObject {
  static needToRepaint = 'needToRepaint';
  static updated = 'updated';
  static updating = 'updating';
  options = {
    ancho: ancho,
    autoOrienting: false, //
    autoLeveling: false, //
    autoLocating: false, //
    dotShape: 'box', // o bien "circle" para la forma de los puntos...
    'stroke-width': 1,
    stroke: 'white', // Color de las líneas
    fill: 'blue', // Color de relleno
    lineJoin: 'round', // Cómo van a conectar las líneas ("round", "bevel": recorta, "miter")
    lineCap: 'round', // Cómo va a terminar la línea "round": las redondea, "square": las cuadra, ("Butt": dice que hay poca diferencia)
    pathMethod: 'stroke', // "stroke" solamente dibuja el borde con un estilo de linea, "fill" lo rellena.
    textMethod: 'strokeText', // "strokeText" solamente dibuja el borde con un estilo de linea, "fillText" lo rellena.
    font: 'bold 12px verdana',
    textAlign: 'start',
    textBaseline: 'top',
    textMaxWidth: 600, // text justification section (do not touch)
    FILL: 0, // const to indicate filltext render
    STROKE: 1,
    MEASURE: 2,
    maxSpaceSize: 3, // Multiplier for max space size. If greater then no justificatoin applied
    minSpaceSize: 0.5, // Multiplier for minimum space size
    /* Este contiene todas las capas, (es un arreglo de objetos)                               algunos rótulos, etcétera... */
    currentLayer: 0,
    layers: [], // Para los estilos de flechas
    cabezaFlechaOff: 0,
    cabezaFlechaFinal: 1,
    cabezaFlechaInicial: 2,
    cabezaFlechaInicialFinal: 3,
  };
  canvas; // store canvas element
  ctx; // store canvas 2d context element
  invocableDrawEvent; // store user drawing callable program (your drawer)
  frame; // 24 x sec ?

  // do not touch, escalado original
  RENDER_GLOBALSX = 1.0;
  RENDER_GLOBALSY = 1.0;

  // Ancho y alto originales
  SW;
  SH;

  constructor(id, opciones = MyCanvas.options, invocableDrawEvent = null) {
    super();
    // Opciones generales del canvas


    // Si no se pasa o no se encuentra un id en el documento, se crea un canvas fuera de pantalla.
    if (id) {
      let tmp = document.getElementById(id);
      if (!tmp) {
        this.canvas = document.createElement('canvas');
        this.incject(id);
      } else {
        this.canvas = tmp;
      }
    } else {
      this.canvas = document.createElement('canvas'); // canvas sin lienzo sin atachar...
    }
    this.ctx = this.canvas.getContext('2d');
    if (invocableDrawEvent) {
      this.#handle = null;
      this.drawer = invocableDrawEvent;
    }

    this.SW = this.width;
    this.SH = this.height;

  }

  // setup your drawer as you wish...
  get drawer() {
    return this.invocableDrawEvent;
  }

  set drawer(r) {
    this.invocableDrawEvent = r;
    // Solamente en esos casos, utilizar el esquema de requesAnimationFrame
    this.start();
  }

  // Aquí van los gráficos...

  // Si los vas a hacer tú, te fuese muy útil
  #setglobalscales(w = this.width, h = this.height) {
    //do not touch
    this.RENDER_GLOBALSX = 1.0;
    this.RENDER_GLOBALSY = 1.0;
    // we are basing on the width, not the height....
    if (w != 0) {
      this.RENDER_GLOBALSX = w / this.SW;
      this.RENDER_GLOBALSY = w / this.SW;
      if (this.SH * this.RENDER_GLOBALSY > h) {
        this.RENDER_GLOBALSX = h / this.SH;
        this.RENDER_GLOBALSY = h / this.SH;
      }
    }
  }

  renderCanvas() {
    if (this.state !== MyCanvas.needToRepaint || this.state === MyCanvas.updated) {
      return;
    }

    this.state = MyCanvas.updating;
    try {
      this.drawer();
    } catch (e) {
      console.warn(`Problem with drawer ${JSON.stringify(e)}`);
    }
    this.state = MyCanvas.updated;
  }

  get hidden() {
    return this.canvas.hidden;
  }

  set hidden(v) {
    this.canvas.hidden = Boolean(v);
  }

  refresh() {
    this.state = MyCanvas.needToRepaint;
  }

  // Init, to para dibujar asicrónicamente... just be private and called from canvas driver constructor
  static #raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  // start or restart
  start() {
    this.frame = () => {
      this.#handle = MyCanvas.#raf(this.frame);
      this.renderCanvas();
    };
    this.frame();
  }

  static #caf = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame;

  stop(hand = this.#handle) {
    this.#caf(hand);
    this.#handle = null;
  }

  get paused() {
    return !!this.#handle;
  }

  set paused(p) {
    if (this.paused) {
      if (p) this.start();
    } else {
      if (!p) this.stop();
    }
  }

  // Se opone a la inyección, toma la imagen de un elemento del DOM, no la dibuja
  extract(html_id) {
    let img = document.getElementById(html_id);
    this.width = Number(img.width);
    this.height = Number(img.height);
    this.ctx.drawImage(img, 0, 0);
    return this.ctx.getImageData(0, 0, img.width, img.height);
  }

  incject(html_id) {
    this.canvas.id = html_id;
    document.body.appendChild(this.canvas);
  }

  get width() {
    try {
      return this.canvas.width;
    } catch (e) {
      console.warn('fail to get width');
    }
    return parseInt(this.canvas.childNodes[0].style.width);
  }

  set width(w) {
    try {
      this.canvas.width = w;
    } catch (e) {
      console.warn('retry to resize width');
    }
    this.canvas.childNodes[0].style.width = w + 'px';
  }

  get height() {
    try {
      return this.canvas.height;
    } catch (e) {
      console.warn('fail to get height');
    }
    return parseInt(this.canvas.childNodes[0].style.height);
  }

  set height(w) {
    try {
      this.canvas.height = w;
    } catch (e) {
      console.warn('retry to resize height');
    }
    this.canvas.childNodes[0].style.height = w + 'px';
  }


  // útil para cortar un pedacito...
  cloneImage(anotherImageData) {
    return this.ctx.createImageData(anotherImageData);
  }

  // dibuja la imagen en el canvas...

  // útil para crear un sprite...
  blankImage(w, h) {
    return this.ctx.createImageData(w, h);
  }

  // Carga la imagen desde una dirección en memoria...
  loadImage(imagePath, w, h, onLoadFunction) {
    let target;
    if (this.isNumber(w) && this.isNumber(h)) {
      if (!onLoadFunction) {
        target = new Image(imagePath, w, h);
        target.onload = function() {
          this.ctx.drawImage(target, 0, 0);
        };
      } else {
        target = new Image(imagePath, w, h, onLoadFunction); // must draw there
      }
    } else {
      target = new Image(imagePath);
    }
    target.src = imagePath;
    return target;
  }

  // assumes that the canvas context is in ctx and in scope
  drawImage(image, x, y, scale, rotation, alpha) {
    if (alpha) {
      this.ctx.globalAlpha = alpha;
    }
    if (scale || rotation) {
      if (!scale) {
        scale = 1;
      }
      if (!rotation) {
        rotation = 0;
      }
      this.ctx.setTransform(scale, 0, 0, scale, x, y); // set the scale and translation
      if (rotation) {
        this.ctx.rotate(rotation); // add the rotation
      }
      this.ctx.drawImage(image, -image.width / 2, -image.height / 2); // draw the image offset by half its width and height
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // set the context transform back to the default
    } else {
      this.ctx.drawImage(image, x, y);
    }
  } // que no es lo mismo que

  // este otro que se puede usar para los sprites, y la tira completa.
  putImage(imageData, x, y) {
    this.ctx.putImageData(imageData, x, y);
  }


  // Para lograr el efecto...


  putImageDemo() {
    /*
        Warning: Due to the lossy nature of converting to and from premultiplied
        alpha color values, pixels that have just been set using putImageData()
        might be returned to an equivalent getImageData() as different values.

    */

    // function for applying transparency to an extracted imageData
    function applyTransparency(imageData, transparency) {
      let length = imageData.length;
      for (var i = 3; i < length; i += 4) {
        imageData[i] = (imageData[i] < opacity) ? imageData[i] : 1 - transparency;
      }
      return imageData;
    }

    // Just the idea... (se promedian los niveles rgb y se ponderan por opacidad)
    function additiveMix(theImageData1, toTheImageData2, updateTransparency = false) {
      let length = toTheImageData2.length;
      if (theImageData1 !== length) throw new Error('Las imágenes a mezclar deben tener el mismo tamaño.');
      for (var i = 3; i < length; i += 4) {
        let ft = (toTheImageData2[i - 0] + theImageData1[i - 0]);
        if (ft === 0) {
          return theImageData1;
        }
        toTheImageData2[i - 3] = Math.round((toTheImageData2[i] * toTheImageData2[i - 3] + theImageData1[i] * theImageData1[i - 3]) / ft);
        toTheImageData2[i - 2] = Math.round((toTheImageData2[i] * toTheImageData2[i - 2] + theImageData1[i] * theImageData1[i - 2]) / ft);
        toTheImageData2[i - 1] = Math.round((toTheImageData2[i] * toTheImageData2[i - 1] + theImageData1[i] * theImageData1[i - 1]) / ft);
        if (updateTransparency) {
          toTheImageData2[i - 0] = Math.round((toTheImageData2[i] * toTheImageData2[i - 0] + theImageData1[i] * theImageData1[i - 0]) / ft);
        }
      }
      return toTheImageData2;
    }

    function putImageData(
      imageData,
      dx,
      dy,
      dirtyX,
      dirtyY,
      dirtyWidth,
      dirtyHeight,
    ) {
      const data = imageData.data;
      const height = imageData.height;
      const width = imageData.width;
      dirtyX = dirtyX || 0;
      dirtyY = dirtyY || 0;
      dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
      dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
      const limitBottom = dirtyY + dirtyHeight;
      const limitRight = dirtyX + dirtyWidth;
      for (let y = dirtyY; y < limitBottom; y++) {
        for (let x = dirtyX; x < limitRight; x++) {
          const pos = y * width + x;
          this.ctx.fillStyle = `rgba(${data[pos * 4 + 0]}, ${data[pos * 4 + 1]}, ${
            data[pos * 4 + 2]
          }, ${data[pos * 4 + 3] / 255})`;
          this.ctx.fillRect(x + dx, y + dy, 1, 1);
        }
      }
    }

    // Draw content onto the canvas
    ctx.fillRect(0, 0, 100, 100);
    // Create an ImageData object from it
    const imagedata = ctx.getImageData(0, 0, 100, 100);
    // use the putImageData function that illustrates how putImageData works
    putImageData(ctx, imagedata, 150, 0, 50, 50, 25, 25);

  }

  //
  working() {
    /*
    Para el canvas transition de colores rotaciones etc.

    Solamente para idiotas ridículos superdotados


      1._ Cuando la velocidad del objeto es menor a la frecuencia de actualización, se hace un fade in-out en secuencia en el tiempo establecido,
          esto es, una suma (mezcla) aditiva, a la distancia de dos píxeles consecutivos a un tiempo = a c/v cada una (la última iguala), a donde c = fps;
          Las imágenes se superponen a desplazamiento de un píxel, La suma de intensidades de ambas debe ser = a 1, la anterior descendente y la posterior ascendente.
          A una velocidad igual a c, esto no es necesario, la anterior siempre tiene intensidad cero.
      2._ Cuando la ... es igual a FPS, se utiliza una actualización con putaImagen normal, remplazando la anterior.
      3._ Cuando ... es mayor que la frecuencia de muestreo:
          Se calcula la longitud de la "estela" de la siguiente análoga a la dilatación de tiempo de Lorentz:
          Sea c = fps
          Les = 1 / Raíz(1 - v²/c²)
          donde c, es casualmente igual a la frecuencia de muestreo y v, la velocidad en píxels del objeto.
          Esta fórmula también se puede simplificar de la siguiente forma Les = (1/2) * (v²/c²).

    */
  }


  // https://developer.mozilla.org/en-us/docs/Web/HTML/CORS_enabled_image
  getPixel(x, y) {
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    // A  Uint8ClampedArray contains height × width × 4 bytes of data, with index values ranging from 0 to (height×width×4)-1.
    let r = imageData.data[0];
    let g = imageData.data[1];
    let b = imageData.data[2];
    let a = imageData.data[3];
    return {r, g, b, a}; // para 'rgba(r, g, b, a/255)' // hay que dividir entre 255
  }

  /*

    Source: https://stackoverflow.com/users/13833218/rifky-niyas
    In: https://stackoverflow.com/questions/667045/get-a-pixel-from-html-canvas

    // Get pixel data
    var imageData = context.getImageData(x, y, width, height);

    // Color at (x,y) position
    var color = [];
    color['red'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 0];
    color['green'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 1];
    color['blue'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 2];
    color['alpha'] = imageData.data[((y*(imageData.width*4)) + (x*4)) + 3];

  */

  // Selective level
  setPixel(x, y, pixel = {r: 0, g: 0, b: 0, a: 0}) {
    // acepta nulos para dejar los otros niveles...
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    let {r, g, b, a} = pixel;
    if (!this.isNumber(pixel.r)) {
      r = imageData.data[0];
      imageData.data[0] = r;
    }
    if (!this.isNumber(pixel.g)) {
      g = imageData.data[1];
      imageData.data[1] = g;
    }
    if (!this.isNumber(pixel.b)) {
      b = imageData.data[2];
      imageData.data[2] = b;
    }
    if (!this.isNumber(pixel.a)) {
      a = imageData.data[3];
      imageData.data[3] = a;
    }
    this.ctx.putImageData(imageData, x, y);
  }

  // Filtros

  // negativo
  invertImage(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];     // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
      // data[i + 3] is transparency
    }
    this.ctx.putImageData(imageData, 0, 0);
  };

  contrast(contrast, img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;
    let factor;

    contrast || (contrast = 100); // Default value

    factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (var i = 0; i < numPixels; i++) {
      var r = pixels[i * 4];
      var g = pixels[i * 4 + 1];
      var b = pixels[i * 4 + 2];

      pixels[i * 4] = factor * (r - 128) + 128;
      pixels[i * 4 + 1] = factor * (g - 128) + 128;
      pixels[i * 4 + 2] = factor * (b - 128) + 128;
    }

    this.ctx.putImageData(imageData, 0, 0);
  };

  // escala de grises
  grayscale(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
      // data[i + 3] is transparency
    }
    this.ctx.putImageData(imageData, 0, 0);
  };

  sepia(img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;

    for (var i = 0; i < numPixels; i++) {
      var r = pixels[i * 4];
      var g = pixels[i * 4 + 1];
      var b = pixels[i * 4 + 2];

      pixels[i * 4] = 255 - r;
      pixels[i * 4 + 1] = 255 - g;
      pixels[i * 4 + 2] = 255 - b;

      pixels[i * 4] = (r * .393) + (g * .769) + (b * .189);
      pixels[i * 4 + 1] = (r * .349) + (g * .686) + (b * .168);
      pixels[i * 4 + 2] = (r * .272) + (g * .534) + (b * .131);
    }

    this.ctx.putImageData(imageData, 0, 0);
  };

  // Based on the Patrick Wied Version: 1 (2011-04-04) ( http://www.patrick-wied.at )
  // Copyright (c) 2011 under the terms of the MIT LICENSE
  watermark(opacity, img) {
    if (img) {
      this.ctx.drawImage(img, img.width, img.height);
    }
    let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    let pixels = imageData.data;
    let numPixels = imageData.width * imageData.height;

    let transparency = opacity ? 1 : 1 - (255 / (100 / opacity)); // 50%; // Default value

    for (var i = 3; i < pixels.length; i += 4) {
      pixels[i] = (pixels[i] > transparency) ? pixels[i] : transparency;
    }

    this.ctx.putImageData(pixels, 0, 0);
  };

  save(filename = 'screenshot.jpg') {
    let link = window.document.createElement('a');
    let url = this.canvas.toDataURL();
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  /*

  John D. Cook

  How do you convert a color image to grayscale? If each color pixel is described
  by a triple (R, G, B) of intensities for red, green, and blue, how do you map
  that to a single number giving a grayscale value? The GIMP image software has
  three algorithms.

  The lightness method averages the most prominent and least prominent colors:
  (max(R, G, B) + min(R, G, B)) / 2.

  The average method simply averages the values: (R + G + B) / 3.

  The luminosity method is a more sophisticated version of the average method.
  It also averages the values, but it forms a weighted average to account for
  human perception. We’re more sensitive to green than other colors, so green is
  weighted most heavily. The formula for luminosity is 0.21 R + 0.72 G + 0.07 B.

  */

  // tha same ?
  convert_grey(image_data) {
    for (var x = 0; x < image_data.width; x++) {
      for (var y = 0; y < image_data.height; y++) {
        var i = x * 4 + y * 4 * image_data.width;
        var luma = Math.floor(image_data.data[i] * 299 / 1000 + image_data.data[i + 1] * 587 / 1000 + image_data.data[i + 2] * 114 / 1000);
        image_data.data[i] = luma;
        image_data.data[i + 1] = luma;
        image_data.data[i + 2] = luma;
        image_data.data[i + 3] = 255;
      }
    }
  }


  beginPath() {
    this.ctx.beginPath();
  }

  clearRectangle(x1, y1, x2, y2, fillStyle) {
    if (!fillStyle) {
      fillStyle = this.options.fill;
    }
    this.ctx.fillStyle = fillStyle;
    // Clear the entire canvas
    this.ctx.fillRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    // be sure to use beginPath() after to this if you need to draw something else.

  }

  clearCanvas(color) {
    // Clear the entire canvas, see end note on clearRectangle
    this.ctx.fillRect(0, 0, this.width, this.height, color);
    // console.log( this.clearRectangle(0, 0, this.ctx.width, this.ctx.height, color));
  }

  // revisar fading
  rectangle(x1, y1, x2, y2, fillStyle, lineWidth, lineJoin, lineCap, method) {
    if (!this.isNumber(lineWidth)) {
      lineWidth = this.options['stroke-width'];
    }
    if (!lineJoin) {
      lineJoin = this.options.lineJoin;
    }
    if (!lineCap) {
      lineCap = this.options.lineCap;
    }
    //if (!fillColor) {
    //    let fillColor = this.ctx.fillColor;
    // }
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
    // this.ctx.fillColor = fillColor;

    if (!method) {
      method = this.options.pathMethod;
    }
    // se chequea un error de analogía
    switch (method) {
      case 'stroke': {
        method = 'strokeRect';
        break;
      }
      case 'fill': {
        method = 'fillRect';
        break;
      }
    }
    this.ctx.fillStyle = fillStyle;
    if (method === 'strokeRect') {
      this.ctx.strokeRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    } else if (method === 'fillRect') {
      this.ctx.fillRect(Math.min(x1, y1), Math.min(x2, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    }
  }

  // Cierra un polígono de líneas que se encuentre abierto...
  // El que se utiliza al final es endPath() para que dibuje, que

  moveTo(x2, y2) {
    this.ctx.moveTo(Math.round(x2), Math.round(y2));
  }

  // Sintetizar colores en escala de rojo, verde, azul y transparencia...

  lineTo(x2, y2) {
    this.ctx.lineTo(Math.round(x2), Math.round(y2));
  }

  // Función para el cálculo de colores rgba a profundidad 1 byte 0-255 que puede aumentar en un futuro

  // invoca a alguno de los métodos de stroke() o fill().
  closePath() {
    this.ctx.closePath();
  }

  // por ejemplo: 'rgba(0,200,0,1)'; // verde 200
  color(r, g, b, a) {
    if (arguments.length < 4) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
  }

  // y viceversa
  rgbStringToArray(rgbString) {
    let arr = rgbString.replace(/ /g, '').slice(rgbString.indexOf('(') + 1, rgbString.indexOf(')')).split(',');
    for (let i = 0; i < arr.length; i++) {
      if (arr.length - 1 === i && arr.length === 4) {
        arr[i] = parseFloat(arr[i]);
      } else {
        arr[i] = parseInt(arr[i]);
      }
    }
    return arr;
  }

  // ajusta los niveles de transparencia de rr, gr, br para en el
  // suprimir el componente rs, gs, rr
  // del color rr, gr, y br

  // me devuelve un valor entre 0 y 1 (average o fuerza los canales, pueden usarse indistintamente)
  intensidad(r, g, b) {
    let resultado = r;
    if (this.isNumber(b)) {
      resultado = (resultado + g + b) / 3;
    } else if (this.isNumber(g)) {
      resultado = (resultado + g) / 2;
    }
    var how_deep = 255; // 1 byte 0-255 que puede aumentar en un futuro
    return resultado / how_deep;
  }

  ///////////////////////////////////////////////////

  // must be in this way... pueden utilizanse con rgb y rgba

  // lo que devuelve un valor entre 0 y 1 que significa la distancia entre los colores
  distanciaEntreColores(r1, g1, b1, r2, g2, b2, a1, a2) { // Mover hacia clase colores
    if (arguments.length > 6) {
      return Math.sqrt((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2) + (a1 - a2) * (a1 - a2)) / 510;
    } else {
      return Math.sqrt((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)) / 441.6729559300637;
    }
  }


  // sobre un fondo rf, gf, bf
  suprimirColor(redBackground, greenBackground, blueBackground, redSupress, greenSupress, blueSupress, redReal, greenReal, blueReal) {
    let umbral = 72 / 255;
    if ((this.intensidad(redReal, greenReal, blueReal) + umbral) < (this.intensidad(redBackground, greenBackground, blueBackground))) {
      return [redSupress, greenSupress, blueSupress, 0];
    } else {
      return [redSupress, greenSupress, blueSupress, 255 - 255 * this.distanciaEntreColores(redSupress, greenSupress, blueSupress, redBackground, greenBackground, blueBackground)];
    }
  }

  // Dibujar un punto seleccionado, pues los puntos reales no son visibles
  // Se representan centrados con 4 veces el ancho de la línea
  // Y mantienen todas sus otras propiedaes... se rellenan o no,

  // según el método activo en this.options.pathMethod
  dot(x, y, shape = this.options.dotShape, radius = this.ctx.lineWidth) {
    this.beginPath();
    this.ctx.lineWidth = this.options['stroke-width'];
    switch (shape) {
      case 'box': {
        this.ctx.moveTo(Math.round(x) - 2 * radius, Math.round(y) - 2 * radius);
        this.ctx.lineTo(Math.round(x) + 2 * radius, Math.round(y) + 2 * radius);
        break;
      }
      case 'circle': {
        this.arc(x, y, 2 * radius, 0, 2 * Math.PI, true);
        break;
      }
    }
    this.endPath();
  }

  // Algunos tipos especiales de líneas utilizadas en ingeniería y arquitectura
  LINE_TYPES = {
    SOLID: {
      name: 'Solid',
      dash: [],
    },
    // DASHED: {
    //   name: 'Dashed',
    //   dash: [10, 5],
    // },
    DOTTED: {
      name: 'Dotted',
      dash: [2, 5],
    },
    //
    BORDER: {
      name: 'Border',
      dash: [0, 12.7, -6.35],
    },
    BORDER_2X: {
      name: 'Border (2x)',
      dash: [0, 25.4, -12.7],
    },
    BORDER_05X: {
      name: 'Border (.5x)',
      dash: [0, 6.35, -3.175],
    },
    CENTER: {
      name: 'Center',
      dash: [31.75, -6.35],
    },
    CENTER_2X: {
      name: 'Center (2x)',
      dash: [63.5, -12.7],
    },
    CENTER_05X: {
      name: 'Center (.5x)',
      dash: [19.05, -3.175],
    },
    DASH_DOT: {
      name: 'Dash dot',
      dash: [12.7, -6.35, 0, -6.35],
    },
    DASH_DOT_2X: {
      name: 'Dash dot (2x)',
      dash: [25.4, -12.7, 0, -12.7],
    },
    DASH_DOT_05X: {
      name: 'Dash dot (.5x)',
      dash: [6.35, -3.175, 0, -3.175],
    },
    DASHED: {
      name: 'Dashed',
      dash: [12.7, -6.35],
    },
    DASHED_2X: {
      name: 'Dashed (2x)',
      dash: [25.4, -12.7],
    },
    DASHED_05X: {
      name: 'Dashed (.5x)',
      dash: [6.35, -3.175],
    },
    DIVIDE: {
      name: 'Divide',
      dash: [12.7, -6.35, 0, -6.35],
    },
    DIVIDE_2X: {
      name: 'Divide (2x)',
      dash: [25.4, -12.7, 0, -12.7],
    },
    DIVIDE_05X: {
      name: 'Divide (.5x)',
      dash: [6.35, -3.175, 0, -3.175],
    },
    DOT: {
      name: 'Dot',
      dash: [0, 6.35],
    },
    DOT_2X: {
      name: 'Dot (2x)',
      dash: [0, 12.7],
    },
    DOT_05X: {
      name: 'Dot (.5x)',
      dash: [0, 3.175],
    },
    HIDDEN: {
      name: 'Hidden',
      dash: [0, 12.7],
    },
    HIDDEN_2X: {
      name: 'Hidden (2x)',
      dash: [0, 25.4],
    },
    HIDDEN_05X: {
      name: 'Hidden (.5x)',
      dash: [0, 6.35],
    },
    PHANTOM: {
      name: 'Phantom',
      dash: [12.7, 12.7],
    },
    PHANTOM_2X: {
      name: 'Phantom (2x)',
      dash: [25.4, 25.4],
    },
    PHANTOM_05X: {
      name: 'Phantom (.5x)',
      dash: [6.35, 6.35],
    },
    ISO_DASH: {
      name: 'ISO dash',
      dash: [30, -15],
    },
    ISO_DASH_SPACE: {
      name: 'ISO dash space',
      dash: [30, -15, 0, -15],
    },
    ISO_LONG_DASH_DOT: {
      name: 'ISO long-dash dot',
      dash: [90, -15, 0, -15],
    },
    ISO_LONG_DASH_DOUBLE_DOT: {
      name: 'ISO long-dash double-dot',
      dash: [90, -15, 0, -15, 0, -15],
    },
    ISO_LONG_DASH_TRIPLE_DOT: {
      name: 'ISO long-dash triple-dot',
      dash: [90, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DOT: {
      name: 'ISO dot',
      dash: [0, 15],
    },
    ISO_LONG_DASH_SHORT_DASH: {
      name: 'ISO long-dash short-dash',
      dash: [60, -15, 0, -15, 0, -15],
    },
    ISO_LONG_DASH_DOUBLE_SHORT_DASH: {
      name: 'ISO long-dash double-short-dash',
      dash: [60, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DASH_DOT: {
      name: 'ISO dash dot',
      dash: [30, -15, 0, -15, 0, -15],
    },
    ISO_DOUBLE_DASH_DOT: {
      name: 'ISO double-dash dot',
      dash: [60, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DASH_DOUBLE_DOT: {
      name: 'ISO dash double-dot',
      dash: [30, -15, 0, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DOUBLE_DASH_DOUBLE_DOT: {
      name: 'ISO double-dash double-dot',
      dash: [60, -15, 0, -15, 0, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DASH_TRIPLE_DOT: {
      name: 'ISO dash triple-dot',
      dash: [30, -15, 0, -15, 0, -15, 0, -15, 0, -15, 0, -15],
    },
    ISO_DOUBLE_DASH_TRIPLE_DOT: {
      name: 'ISO double-dash triple-dot',
      dash: [60, -15, 0, -15, 0, -15, 0, -15, 0, -15, 0, -15, 0, -15],
    },
  };


  // PARE DIBUJAR LINEAS CON O SIN GRADACIONES
  line(x1, y1, x2, y2, startColor = this.options.stroke, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap, dash = [], lineType = '') {
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    // Crear gradiente si se especifican colores de inicio y fin
    if (endColor && (startColor !== endColor)) {
      if (!this.gradientCache) {
        this.gradientCache = {}; // Objeto para almacenar los gradientes reutilizables
      }
      const gradientId = `${startColor}-${endColor}`; // Identificador único para este gradiente
      let grad = this.gradientCache[gradientId];
      if (!grad) {
        grad = this.ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, startColor);
        grad.addColorStop(1, endColor);
        this.gradientCache[gradientId] = grad;
      }
      this.ctx.strokeStyle = grad;
    } else {
      this.ctx.strokeStyle = startColor;
    }

    // Seleccionar el patrón de línea en función del tipo de línea
    if (dash) {
      this.ctx.setLineDash(dash);
    } else {
      let gh = this.LINE_TYPES.find((lt) => lt.name === lineType);
      if (gh) {
        this.ctx.setLineDash(gh.dash);
      } else {
        switch (lineType) {
          case 'Fenceline circle': {
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
            break;
          }
          case 'Fenceline square': {
            const sideLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            this.ctx.beginPath();
            this.ctx.rect(centerX - sideLength / 2, centerY - sideLength / 2, sideLength, sideLength);
            this.ctx.stroke();
            break;
          }
          case 'Tracks': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.fillRect(0, -2.5, length, 5);
            this.ctx.restore();
            break;
          }
          case 'Batting': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -2.5);
            this.ctx.lineTo(length / 2, -2.5);
            this.ctx.lineTo(length / 2, -7.5);
            this.ctx.lineTo(0, -7.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();
            break;
          }
          case 'Hot water supply': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -2.5);
            this.ctx.lineTo(length / 2, -2.5);
            this.ctx.lineTo(length / 2, -7.5);
            this.ctx.lineTo(0, -7.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(length / 2 - 2.5, -5);
            this.ctx.lineTo(length / 2 + 2.5, -5);
            this.ctx.lineTo(length / 2 + 2.5, -10);
            this.ctx.lineTo(length / 2 - 2.5, -10);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
            break;
          }
          case 'Gas line 1': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(length / 4, 0);
            this.ctx.lineTo(length / 4, -5);
            this.ctx.lineTo(length / 2, -5);
            this.ctx.lineTo(length / 2, -10);
            this.ctx.lineTo(3 * length / 4, -10);
            this.ctx.lineTo(3 * length / 4, -5);
            this.ctx.lineTo(length, -5);
            this.ctx.lineTo(length, -10);
            this.ctx.stroke();
            this.ctx.restore();
            break;
          }
          case 'Gas line 2': {// codeword galileo: tomar el modelo para generalizar textos en la línea
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -2.5);
            this.ctx.lineTo(length / 2, -2.5);
            this.ctx.lineTo(length / 2, -7.5);
            this.ctx.lineTo(0, -7.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(length / 4, -5, 2.5, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.fillText('GAS', length / 2 + 5, -5);
            this.ctx.restore();
            break;
          }
          case 'Zig zag': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);

            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(length / 4, 0);
            this.ctx.lineTo(length / 4, -5);
            this.ctx.lineTo(length / 2, -5);
            this.ctx.lineTo(length / 2, -10);
            this.ctx.lineTo(3 * length / 4, -10);
            this.ctx.lineTo(3 * length / 4, -5);
            this.ctx.lineTo(length, -5);
            this.ctx.lineTo(length, -10);
            this.ctx.stroke();
            this.ctx.restore();
            break;
          }
          case 'Drainage': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);

            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -2.5);
            this.ctx.lineTo(length, -2.5);
            this.ctx.lineTo(length, -7.5);
            this.ctx.lineTo(0, -7.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(length / 2, -2.5);
            this.ctx.lineTo(length / 2, -10);
            this.ctx.stroke();
            this.ctx.restore();
            break;
          }
          case 'Drainage reversed': {
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            this.ctx.save();
            this.ctx.translate(x1, y1);
            this.ctx.rotate(angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -7.5);
            this.ctx.lineTo(length, -7.5);
            this.ctx.lineTo(length, -2.5);
            this.ctx.lineTo(0, -2.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(length / 2, -2.5);
            this.ctx.lineTo(length / 2, -10);
            this.ctx.stroke();
            this.ctx.restore();
            break;
          }
          default: {
            this.ctx.moveTo(Math.round(x1), Math.round(y1));
            this.ctx.lineTo(Math.round(x2), Math.round(y2));
            this.endPath();
          }
        }
      }
    }
  }

  polygon(coords, startColor = this.options.stroke, pathMethod = this.options.pathMethod, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap, closePath = false) {
    if (!coords) {
      return;
    }
    this.beginPath();
    this.ctx.lineWidth = lineWidth;
    var x1, y1, x2, y2;
    if (endColor && (startColor !== endColor)) {
      x1 = coords[0];
      y1 = coords[1];
      x2 = coords[coords.length - 2];
      y2 = coords[coords.length - 1];

      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro, en realidad hace un rectángulo

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradación
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;
    // recorrer el arreglo de coordenadas en el orden que te expliqué...
    const initialPoint = coords.shift();
    this.ctx.moveTo(initialPoint.x, initialPoint.y);
    coords.forEach(point => this.ctx.lineTo(point.x, point.y));
    if (closePath) {
      this.ctx.closePath(); // cerrar la poligonal...
    }
    this.endPath(pathMethod);
  }

  // curva bezier con tres puntos de control, puedes utilizarla para dibujar los meridianos en otras proyecciones
  bezier(x1, y1, x2, y2, x3, y3, startColor = this.options.stroke, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap, closePath = false) {
    this.beginPath();
    if (endColor && (startColor !== endColor)) {
      var gradacion = this.ctx.createLinearGradient(x1, y1, x3, y3); // puede mejorarse, falta el punto medio

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    this.ctx.moveTo(Math.round(x1), Math.round(y1));
    this.ctx.bezierCurveTo(Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2), Math.round(x3), Math.round(y3));
    if (closePath) {
      this.ctx.closePath(); // cerrar la poligonal...
    }
    this.endPath();
  }

  circle(xCenter, yCenter, radius, startAngle = 0, endAngle = 2 * Math.PI, clockWise = true, startColor = this.options.stroke, endColor = this.options.stroke, lineWidth = this.options['stroke-width'], lineJoin = this.options.lineJoin, lineCap = this.options.lineCap) {
    this.beginPath();
    this.ctx.lineWidth = lineWidth;
    if (endColor && (startColor !== endColor)) {

      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro de la diagonal de un rectángulo

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    this.moveTo(xCenter, yCenter);
    this.ctx.arc(xCenter, yCenter, radius, startAngle, endAngle, !clockWise);
    this.endPath();
  }

  // revisar si redunda con las funciones drawImage que se implementan mas abajo, revisar si se incluyó
  // un drawImaga a partir de una dirección fuente: ej. "vale.jpg"

  insertImage(image, x, y, w, h, sw, sh) { // please this order (inserta en un rango, recorta en el origen)
    if (arguments.length < 3) { // 2 param
      this.ctx.drawImage(image, x, y);
    } else if (arguments.length < 5) { // 4 param
      this.ctx.drawImage(image, x, y, w, h); // in destiny
    } else { // 4 param
      this.ctx.drawImage(image, sw, sh, x, y, w, h); // same order as above !== to original func.
    }
  }

  // ie: <img id=”mySheep” src=”sheep.png” style=”display:none;” />
  insertImageFromId(id, x, y, w, h, sw, sh) { // Ídem a insertImage
    // fix me
    this.insertImage(image, x, y, w, h, sw, sh);
  }

  // cambiar el color de fondo del canvas...
  backgroundColor(color) {
    this.canvas.style.backgroundColor = color; // por ejemplo, prueba: '#00F8', refresca instantáneo.
  }

  clearRect(x1, y1, x2, y2) {
    this.ctx.clearRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
  }

  endPath(method = this.options.pathMethod) {
    switch (method) {
      // estas son formas de dibujar lineas
      case 'stroke':
        return this.ctx.stroke();
      // esta otra me rellena un polígono
      case 'fill':
        return this.ctx.fill();
    }
  }

  outText(x, y, texto, font = this.options.font, textAlign = this.options.textAlign, textBaseline = this.options.textBaseline, textMaxWidth = this.options.textMaxWidth, textColor = this.options.stroke, method = this.options.textMethod) {
    // se chequea un error de analogía
    switch (method) {
      case
      'stroke': {
        method = 'strokeText';
        break;
      }
      case 'fill' : {
        method = 'fillText';
        break;
      }
    }
    // y a escribir
    if (method === 'strokeText') {
      return this.ctx.strokeText(texto, x, y, textMaxWidth);
    } else if (method === 'fillText') {
      return this.ctx.fillText(texto, x, y, textMaxWidth);
    }
  }


// POLIGONS & BASIC FORMS DRAWING

// Usage:
// this.drawStar(75,75,5,50,25,'mediumseagreen','gray',9);
// this.drawStar(150,200,8,50,25,'skyblue','gray',3);
// this.drawStar(225,75,16,50,20,'coral','transparent',0);
// this.drawStar(300,200,16,50,40,'gold','gray',3);
// centerX, centerY: the center point of the star
// points: the number of points on the exterior of the star
// inner: the radius of the inner points of the star
// outer: the radius of the outer points of the star
// fill, stroke: the fill and stroke colors to apply
// line: the linewidth of the stroke
  drawStar(centerX, centerY, points, outer, inner, fill, stroke, line) {
    // define the star
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY + outer);

    for (var i = 0; i < 2 * points + 1; i++) {
      var r = (i % 2 == 0) ? outer : inner;
      var a = Math.PI * i / points;
      this.ctx.lineTo(centerX + r * Math.sin(a), centerY + r * Math.cos(a));
    }

    this.ctx.closePath();
// draw
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = line;
    this.ctx.stroke();
  }


  /*
                                                                                        Dibujar un polígono con los bordes redondeados...
                                                                                        usage:

                                                                                        var triangle = [
                                                                                           { x: 200, y : 50 },
                                                                                           { x: 300, y : 200 },
                                                                                           { x: 100, y : 200 }
                                                                                          ];
                                                                                          var cornerRadius = 30;
                                                                                         this.ctx.lineWidth = 4;
                                                                                         this.ctx.fillStyle = "Green";
                                                                                         this.ctx.strokeStyle = "black";
                                                                                         this.ctx.beginPath(); // start a new path
                                                                                          roundedPoly(triangle, cornerRadius);
                                                                                         this.ctx.fill();
                                                                                         this.ctx.stroke();
                                                                                      */
  roundedPoly(points, radius) {
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection,
      drawDirection, angle, halfAngle, cRadius, lenOut;

    function asVec(p, pp, v) { // convert points to a line with len and normalised
      v.x = pp.x - p.x; // x,y as vec
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
      v.nx = v.x / v.len; // normalised
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx); // direction of vec
    }

    v1 = {};
    v2 = {};
    len = points.length; // number points
    p1 = points[len - 1]; // start at end of path
    for (i = 0; i < len; i++) { // do each corner
      p2 = points[(i) % len]; // the corner point that is being rounded
      p3 = points[(i + 1) % len];
      // get the corner as vectors out away from corner
      asVec(p2, p1, v1); // vec back from corner point
      asVec(p2, p3, v2); // vec forward from corner point
      // get corners cross product (asin of angle)
      sinA = v1.nx * v2.ny - v1.ny * v2.nx; // cross product
      // get cross product of first line and perpendicular second line
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
      angle = Math.asin(sinA); // get the angle
      radDirection = 1; // may need to reverse the radius
      drawDirection = false; // may need to draw the arc anticlockwise
      // find the correct quadrant for circle center
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
        } else {
          angle = Math.PI - angle; // move back into the 2nd quadrant
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      halfAngle = angle / 2;
      // get distance from corner to point where round corner touches line
      lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        // ajust the radius of corner rounding to fit
        cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
      y = p2.y + v2.ny * lenOut;
      x += -v2.ny * cRadius * radDirection; // move away from line to circle center
      y += v2.nx * cRadius * radDirection;
      // x,y is the rounded corner circle center
      this.ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
      p1 = p2;
      p2 = p3;
    }
    this.ctx.closePath();
  }

//  * From: Patrick Wied ( http://www.patrick-wied.at ) Under License: MIT License
  classifySkin(r, g, b) {
    // A Survey on Pixel-Based Skin Color Detection Techniques
    let rgbClassifier = ((r > 95) && (g > 40 && g < 100) && (b > 20) && ((Math.max(r, g, b) - Math.min(r, g, b)) > 15) && (Math.abs(r - g) > 15) && (r > g) && (r > b));
    let nurgb = this.toNormalizedRgb(r, g, b);
    let nr = nurgb[0];
    let ng = nurgb[1];
    let nb = nurgb[2];
    let normRgbClassifier = (((nr / ng) > 1.185) && (((r * b) / (Math.pow(r + g + b, 2))) > 0.107) && (((r * g) / (Math.pow(r + g + b, 2))) > 0.112));
    let hsv = this.toHsv(r, g, b);
    let h = hsv[0] * 100;
    let s = hsv[1];
    hsv = this.toHsvTest(r, g, b);
    h = hsv[0];
    s = hsv[1];
    let hsvClassifier = (h > 0 && h < 35 && s > 0.23 && s < 0.68);
    let ycc = this.toYcc(r, g, b);
    let y = ycc[0];
    let cb = ycc[1];
    let cr = ycc[2];
    let yccClassifier = ((y > 80) && (cb > 77 && cb < 127) && (cr > 133 && cr < 173));
    return {
      skin: (rgbClassifier || normRgbClassifier || hsvClassifier),
      class: yccClassifier,
    };
  }

  toYcc(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let y = 0.299 * r + 0.587 * g + 0.114 * b;
    let cr = r - y;
    let cb = b - y;

    return [y, cr, cb];
  }

  toHsv(r, g, b) {
    return [// hue
      Math.acos((0.5 * ((r - g) + (r - b))) / (Math.sqrt((Math.pow((r - g), 2) + ((r - b) * (g - b)))))), // saturation
      1 - (3 * ((Math.min(r, g, b)) / (r + g + b))), // value
      (1 / 3) * (r + g + b)];
  }

  toHsvTest(r, g, b) {
    let h = 0;
    let mx = Math.max(r, g, b);
    let mn = Math.min(r, g, b);
    let dif = mx - mn;

    if (mx == r) {
      h = (g - b) / dif;
    } else if (mx == g) {
      h = 2 + ((g - r) / dif);
    } else {
      h = 4 + ((r - g) / dif);
    }
    h = h * 60;
    if (h < 0) {
      h = h + 360;
    }

    return [h, 1 - (3 * ((Math.min(r, g, b)) / (r + g + b))), (1 / 3) * (r + g + b)];

  }

  toNormalizedRgb(r, g, b) {
    let sum = r + g + b;
    return [(r / sum), (g / sum), (b / sum)];
  }

  drawCheckbox(text, checked = false, x, y, paint = true) {
    this.ctx.save();
    this.ctx.font = '10px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    var metrics = this.ctx.measureText(text);
    if (paint) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.rect(x - 5, y - 5, 10, 10);
      this.ctx.stroke();
      if (checked) {
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
      }
      this.ctx.fillText(text, x + 5, y);
    }
    this.ctx.beginPath();
    this.ctx.rect(x - 7, y - 7, 12 + metrics.width + 2, 14);

    this.ctx.drawFocusIfNeeded(text);
    this.ctx.restore();
  }

  estratyegiaNotasIntermedias(x, y, radius, cpx, cpy, cp1x, cp1y, cp2x, cp2y) {
    // ✔MDN
    context.moveTo(x, y);
    path.moveTo(x, y);
    // Creates a new subpath with the given point.

    context.closePath();
    path.closePath();
    // Marks the current subpath as closed, and starts a new subpath with a point the same as the start and end of the newly closed subpath.

    context.lineTo(x, y);
    path.lineTo(x, y);
    // Adds the given point to the current subpath, connected to the previous one by a straight line.

    context.quadraticCurveTo(cpx, cpy, x, y);
    path.quadraticCurveTo(cpx, cpy, x, y);
    // Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.

    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    // Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.

    context.arcTo(x1, y1, x2, y2, radius);
    path.arcTo(x1, y1, x2, y2, radius);
  }

  conectarCanvas(nombre) {
    // Primero se carga en un objeto para poder accederlo a código
    this.canvas = document.getElementById(nombre);
    // Y este es el contexto que te permite dibujar
    this.ctx = canvas.getContext('2d');
  }

  colorDeFondo(col) {
    this.canvas.style.backgroundColor = col;
  }

  comenzarDibujo() {
    this.ctx.beginPath();
  }

  terminarDibujo(method) {
    if (!method) {
      method = 'stroke';
    }
    switch (method) {
      // estas son formas de dibujar lineas
      case 'stroke':
        return this.ctx.stroke();
      // esta otra me rellena un polígono
      case 'fill':
        return this.ctx.fill();
    }
  }

// PARE DIBUJAR LINEAS CON O SIN GRADACIONES
  linea(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash) {
    this.comenzarDibujo();
    if (!startColor) {
      startColor = 'white';
    }
    if (!endColor) {
      endColor = startColor;
    }
    if (!isNumber(lineWidth)) {
      lineWidth = 1;
    }
    if (!lineJoin) {
      lineJoin = 'round';
    }
    if (!lineCap) {
      lineCap = 'round';
    }
    this.ctx.lineWidth = lineWidth;
    if (endColor && (startColor !== endColor)) {
      var gradacion = this.ctx.createLinearGradient(x1, y1, x2, y2); // Desde un punto a otro, en realidad hace un rectángulo.

      gradacion.addColorStop(0, startColor);
      gradacion.addColorStop(1, endColor);
      // Y hay que decirle que dibuje la gradacion
      this.ctx.strokeStyle = gradacion;
      // Y esa es la máscara que se utiliza para dibujar las figuras.. súperok...
      // claro que no puedes sustituir el fillStyle...
    } else {
      this.ctx.strokeStyle = startColor;
    }
    this.ctx.lineJoin = lineJoin;
    this.ctx.lineCap = lineCap;

    if (dash) {
      this.ctx.setLineDash(dash); // /* dashes are 5px and spaces are 3px */
    } else {
      this.ctx.setLineDash([]);
    }

    this.ctx.moveTo(Math.round(x1), Math.round(y1));
    this.ctx.lineTo(Math.round(x2), Math.round(y2));
    this.terminarDibujo();
  }

  flecha(fromx, fromy, tox, toy, arrowWidth, color = 'black') {
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy - fromy, tox - fromx);

    this.ctx.save();
    this.ctx.strokeStyle = color;

    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.lineWidth = arrowWidth;
    this.ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    this.ctx.beginPath();
    this.ctx.moveTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7),
      toy - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    this.ctx.lineTo(tox, toy);
    this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    this.ctx.stroke();
    this.ctx.restore();
  }

  // PARA DIBUJAR FLECHAS Y CABEZAS DE FLECHAS (Los métodos que tienen el prefijo _ son privados para uso propio de la librería)
  // Copyright Patrick Horgan patrick at dbp-consulting dot com
  // Permission to use granted as long as you keep this notice intact
  // use strict is everywhere because some browsers still don't support
  // using it once for the whole file and need per method/function
  // use.
  // Part is derivitive of work by Juan Mendes as noted below as appropriate.
  // Some things depend on code in http://dbp-consulting/scripts/utilities.js
  drawLineAngle = function(x0, y0, angle, length) {
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x0 + length * Math.cos(angle), y0 + length * Math.sin(angle));
    this.ctx.stroke();
  };

  drawHead = function(x0, y0, x1, y1, x2, y2, style, color) {
    if (typeof (x0) == 'string') x0 = parseInt(x0);
    if (typeof (y0) == 'string') y0 = parseInt(y0);
    if (typeof (x1) == 'string') x1 = parseInt(x1);
    if (typeof (y1) == 'string') y1 = parseInt(y1);
    if (typeof (x2) == 'string') x2 = parseInt(x2);
    if (typeof (y2) == 'string') y2 = parseInt(y2);
    var radius = 3;
    var twoPI = 2 * Math.PI;

    // all cases do
    this.ctx.beginPath();
    if (color) this.ctx.strokeStyle = color;
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    switch (style) {
      case 0:
        // curved filled, add the bottom as an arcTo curve and fill
        var backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.arcTo(x1, y1, x0, y0, .55 * backdist);
        this.ctx.fill();
        break;
      case 1:
        // straight filled, add the bottom as a line and fill.
        this.ctx.beginPath();
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x0, y0);
        this.ctx.fill();
        break;
      case 2:
        // unfilled head, just stroke.
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.stroke();
        break;
      case 3:
        //filled head, add the bottom as a quadraticCurveTo curve and fill
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        var cpx = (x0 + x1 + x2) / 3;
        var cpy = (y0 + y1 + y2) / 3;
        this.ctx.quadraticCurveTo(cpx, cpy, x0, y0);
        this.ctx.fill();
        break;
      case 4:
        //filled head, add the bottom as a bezierCurveTo curve and fill
        var cp1x, cp1y, cp2x, cp2y, backdist;
        var shiftamt = 5;
        if (x2 == x0) {
          // Avoid a divide by zero if x2==x0
          backdist = y2 - y0;
          cp1x = (x1 + x0) / 2;
          cp2x = (x1 + x0) / 2;
          cp1y = y1 + backdist / shiftamt;
          cp2y = y1 - backdist / shiftamt;
        } else {
          backdist = Math.sqrt(((x2 - x0) * (x2 - x0)) + ((y2 - y0) * (y2 - y0)));
          var xback = (x0 + x2) / 2;
          var yback = (y0 + y2) / 2;
          var xmid = (xback + x1) / 2;
          var ymid = (yback + y1) / 2;

          var m = (y2 - y0) / (x2 - x0);
          var dx = (backdist / (2 * Math.sqrt(m * m + 1))) / shiftamt;
          var dy = m * dx;
          cp1x = xmid - dx;
          cp1y = ymid - dy;
          cp2x = xmid + dx;
          cp2y = ymid + dy;
        }
        if (color) {
          this.ctx.strokeStyle = color;
          this.ctx.fillStyle = color;
        }
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x0, y0);
        this.ctx.fill();
        break;
    }
  };

  drawArcedArrow = function(x, y, r, startangle, endangle, anticlockwise, style, which, angle, d) {
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1; // end point gets arrow
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
    d = typeof (d) != 'undefined' ? d : 10;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, startangle, endangle, anticlockwise);
    this.ctx.stroke();
    var sx, sy, lineangle, destx, desty;
    this.ctx.strokeStyle = 'rgba(0,0,0,0)';	// don't show the shaft
    if (which & 1) {	    // draw the destination end
      sx = Math.cos(startangle) * r + x;
      sy = Math.sin(startangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      } else {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      }
      this.flecha(this.ctx, sx, sy, destx, desty, style, 2, angle, d);
    }
    if (which & 2) {	    // draw the origination end
      sx = Math.cos(endangle) * r + x;
      sy = Math.sin(endangle) * r + y;
      lineangle = Math.atan2(x - sx, sy - y);
      if (anticlockwise) {
        destx = sx - 10 * Math.cos(lineangle);
        desty = sy - 10 * Math.sin(lineangle);
      } else {
        destx = sx + 10 * Math.cos(lineangle);
        desty = sy + 10 * Math.sin(lineangle);
      }
      this.flecha(ctx, sx, sy, destx, desty, style, 2, angle, d);
    }
    this.ctx.restore();
  };

  /*
  x1,y1 - the line of the shaft starts here
  x2,y2 - the line of the shaft ends here
  style - type of head to draw

      0 - filled head with back a curve drawn with arcTo
      n.b. some browsers have an arcTo bug that make this look bizarre (no longer but kept for historical purposes. Things get weird during implementation of specs).
      1 - filled head with back a straight line
      2 - unfilled but stroked head
      3 - filled head with back a curve drawn with quadraticCurveTo
      4 - filled head with back a curve drawn with bezierCurveTo
      function(ctx,x0,y0,x1,y1,x2,y2,style) - a function provided by the user to draw the head. Point (x1,y1) is the same as the end of the line, and (x0,y0) and (x2,y2) are the two back corners. The style argument is the this for the function. An example that just draws little circles at each corner of the arrow head is shown later in this document.

  default 3 (filled head with quadratic back)
  which - which end(s) get the arrow

      0 - neither
      1 - x2,y2 end
      2 - x1,y1 end
      3 - (that's 1+2) both ends

  default 1 (destination end gets the arrow)
  angle - the angle θ from shaft to one side of arrow head - default π/8 radians (22 1/2°, half of a 45°)
  length - the distance d in pixels from arrow point back along the shaft to the back of the arrow head - default 10px
  */

  flecha = function(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d) {
    if (which === 0) {
      return this.linea(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash);
    }
    // Ceason pointed to a problem when x1 or y1 were a string, and concatenation
    // would happen instead of addition
    if (typeof (x1) == 'string') x1 = parseInt(x1);
    if (typeof (y1) == 'string') y1 = parseInt(y1);
    if (typeof (x2) == 'string') x2 = parseInt(x2);
    if (typeof (y2) == 'string') y2 = parseInt(y2);
    style = typeof (style) != 'undefined' ? style : 3;
    which = typeof (which) != 'undefined' ? which : 1; // end point gets arrow
    angle = typeof (angle) != 'undefined' ? angle : Math.PI / 8;
    d = typeof (d) != 'undefined' ? d : 10;
    // default to using drawHead to draw the head, but if the style
    // argument is a function, use it instead
    var toDrawHead = typeof (style) != 'method' ? this.drawHead : style;

    // For ends with arrow we actually want to stop before we get to the arrow
    // so that wide lines won't put a flat end on the arrow.
    //
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;
    if (which & 1) {
      tox = Math.round(x1 + (x2 - x1) * ratio);
      toy = Math.round(y1 + (y2 - y1) * ratio);
    } else {
      tox = x2;
      toy = y2;
    }
    if (which & 2) {
      fromx = x1 + (x2 - x1) * (1 - ratio);
      fromy = y1 + (y2 - y1) * (1 - ratio);
    } else {
      fromx = x1;
      fromy = y1;
    }

    if (!endColor) {
      endColor = startColor;
    }

    // Draw the shaft of the arrow
    this.linea(fromx, fromy, tox, toy, startColor, endColor, lineWidth, lineJoin, lineCap, dash);

    // calculate the angle of the line
    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    // h is the line length of a side of the arrow head
    var h = Math.abs(d / Math.cos(angle));

    if (which & 1) {	// handle far end arrow head
      var angle1 = lineangle + Math.PI + angle;
      var topx = x2 + Math.cos(angle1) * h;
      var topy = y2 + Math.sin(angle1) * h;
      var angle2 = lineangle + Math.PI - angle;
      var botx = x2 + Math.cos(angle2) * h;
      var boty = y2 + Math.sin(angle2) * h;
      this.toDrawHead(topx, topy, x2, y2, botx, boty, style, endColor);
    }
    if (which & 2) { // handle near end arrow head
      var angle1 = lineangle + angle;
      var topx = x1 + Math.cos(angle1) * h;
      var topy = y1 + Math.sin(angle1) * h;
      var angle2 = lineangle - angle;
      var botx = x1 + Math.cos(angle2) * h;
      var boty = y1 + Math.sin(angle2) * h;
      this.toDrawHead(topx, topy, x1, y1, botx, boty, style, startColor);
    }
  };

// Dibuja el borde de un rectángulo, si opcionalmente se le pasa un color de relleno, lo rellena
  rectangulo(x1, y1, x2, y2, colorBorde, colorRelleno) {
    // Cargando
    if (colorRelleno) {
      this.ctx.fillStyle = colorRelleno;
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }

    if (colorBorde) {
      this.ctx.strokeStyle = colorBorde;
    }

    this.linea(x1, y1, x2, y1, colorBorde);
    this.linea(x2, y2, x2, y1, colorBorde);
    this.linea(x1, y1, x1, y2, colorBorde);
    this.linea(x1, y2, x2, y2, colorBorde);
  }

  colorDibujo(col) {
    let tmp = this.ctx.strokeStyle;
    if (col) {
      this.ctx.strokeStyle = col;
    }
    return tmp;
  }

  colorRelleno(col) {
    let tmp = this.ctx.fillStyle;
    if (col) {
      this.ctx.fillStyle = col;
    }
    return tmp;
  }

// Usage:
// drawStar(75,75,5,50,25,'mediumseagreen','gray',9);
// drawStar(150,200,8,50,25,'skyblue','gray',3);
// drawStar(225,75,16,50,20,'coral','transparent',0);
// drawStar(300,200,16,50,40,'gold','gray',3);
// centroX, centroY: the center point of the star
// puntas: the number of points on the exterior of the star
// radioInterior: the radius of the inner points of the star
// radioExterior: the radius of the outer points of the star
// colorRelleno, colorBorde: the fill and stroke colors to apply
// anchoLinea: the linewidth of the stroke
  estrella(centroX, centroY, puntas, radioExterior, radioInterior, colorRelleno, colorBorde, anchoLinea) {
    // define the star
    this.ctx.beginPath();
    this.ctx.moveTo(centroX, centroY + radioExterior);
    for (var i = 0; i < 2 * puntas + 1; i++) {
      var r = (i % 2 == 0) ? radioExterior : radioInterior;
      var a = Math.PI * i / puntas;
      this.ctx.lineTo(centroX + r * Math.sin(a), centroY + r * Math.cos(a));
    }

    this.ctx.closePath();
    // draw
    this.ctx.fillStyle = colorRelleno;
    this.ctx.fill();
    this.ctx.strokeStyle = colorBorde;
    this.ctx.lineWidth = anchoLinea;
    this.ctx.stroke();
  }

  texto(x, y, lines, relleno, borde, fontFace, fontSize) {
    if (!fontFace) { // (es en px)
      fontFace = 'Tahoma';
    }
    if (!fontSize) { // (es en px)
      fontSize = 48;
    }
    this.ctx.font = `${fontSize}px "${fontFace}"'`; //estilo de texto
    this.ctx.beginPath(); //iniciar ruta
    if (!borde && !relleno) {
      relleno = ctx.fillStyle;
    }
    if (borde && relleno) {
      this.ctx.strokeStyle = borde;
      this.ctx.fillStyle = relleno;
      this.ctx.strokeText(lines, x, y); //texto con los dos métodos
      this.ctx.fillText(lines, x, y);
    } else if (borde) {
      this.ctx.strokeStyle = borde;
      this.ctx.strokeText(lines, x, y); //texto con método stroke
    } else if (relleno) { // should be
      this.ctx.fillStyle = relleno;
      this.ctx.fillText(lines, x, y);
    }
  }

// Inyectar un div dentro de un canvas
  inyectar(x, y, divName, colorBorde) {
    var resultado = {width: 0, height: 0};
    var datosElemento = document.getElementById('idtable').getBoundingClientRect();
    resultado.width = Math.round(datosElemento.width);
    resultado.height = Math.round(datosElemento.height) + 40;
    var data = `<svg xmlns='http://www.w3.org/2000/svg' width='${resultado.width}' height='${resultado.height}'>` + '<foreignObject width=\'100%\' height=\'100%\'>' + document.getElementById(divName).innerHTML + '</foreignObject>' + '</svg>';
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([data], {
      type: 'image/svg+xml;charset=utf-8',
    });
    var url = DOMURL.createObjectURL(svg);
    img.onload = function() {
      ctx.drawImage(img, x, y);
      // alert(`${resultado.height} contra ${img.height}`);
      resultado.width = img.width;
      resultado.height = img.height;
      if (colorBorde) {
        this.rectangulo(x, y, x + img.width, y + img.height, colorBorde);
      }
      DOMURL.revokeObjectURL(url);
    };
    img.src = url;
    return resultado; // ancho y alto...
  }

  html_to_xml(html) {
    var doc = document.implementation.createHTMLDocument('');
    doc.write(html);

    // You must manually set the xmlns if you intend to immediately serialize
    // the HTML document to a string as opposed to appending it to a
    // <foreignObject> in the DOM
    doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

    // Get well-formed markup
    html = (new XMLSerializer).serializeToString(doc.body);
    return html;
  }

  conectarCanvas(nombre) {
    // Primero se carga en un objeto para poder accederlo a código
    this.canvas = document.getElementById(nombre);
    // Y este es el contexto que te permite dibujar
    this.ctx = canvas.getContext('2d');
  }

  dibujarConector(x1, y1, x2, y2, salida, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d) {
    if (x1 === x2 || y1 === y2) {
      this.flecha(x1, y1, x2, y2, startColor, endColor, lineWidth, lineJoin, lineCap, dash, style, which, angle, d);
    }
  }

// FUNCIONAL, ESTE ES PARA EL FRONT END
  insertarTablaEnCanvas(tableHtml, x, y, colorBorde) {
    var resultado = {x: x, y: y, ancho: 0, alto: 0};
    document.getElementById('idtable').innerHTML = tableHtml;
    let tmp = this.inyectar(x, y, 'mytable', colorBorde); // Aquí va el nombre del div...
    resultado.ancho = tmp.width;
    resultado.alto = tmp.height;
    document.getElementById('idtable').innerHTML = '';
    return resultado;
  }

  // Copyright(c) CpnCrunch (Stackoverflow, validado, inserta con estilos pero hay que darle dimensiones)
  render_html_to_canvas(html, ctx, x, y, width, height, colorBorde) {
    var resultado = {x: x, y: y, ancho: width, alto: height, colorBorde};

    function html_to_xml(html) {
      var doc = document.implementation.createHTMLDocument('');
      doc.write(html);
      // You must manually set the xmlns if you intend to immediately serialize
      // the HTML document to a string as opposed to appending it to a
      // <foreignObject> in the DOM
      doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
      // Get well-formed markup
      html = (new XMLSerializer).serializeToString(doc.body);
      return html;
    }

    var xml = html_to_xml(html);
    xml = xml.replace(/\#/g, '%23');
    var data = 'data:image/svg+xml;charset=utf-8,' + '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' + '<foreignObject width="100%" height="100%">' + xml + '</foreignObject>' + '</svg>';
    var img = new Image();
    img.onload = function() {
      this.#ctx.drawImage(img, x, y);
      if (colorBorde) {
        rectangulo(x, y, x + img.width, y + img.height, colorBorde);
      }
      resultado.x = x;
      resultado.y = y;
      resultado.ancho = img.width;
      resultado.alto = img.height;
      resultado.colorBorde = colorBorde;
    };
    img.src = data;
    return resultado;
  }

  extractToCanvas(html, x, y, colorBorde) {
    document.getElementById('idtable').innerHTML = html;
    var datosElemento = document.getElementById('idtable').getBoundingClientRect();
    return this.render_html_to_canvas(html, ctx, x, y, datosElemento.width, datosElemento.height, colorBorde);
  }

  //The ColorCode() will give the code every time.
  generateRandomColore() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h, s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {Array}           The RGB representation
   */
  hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   *
   * @param   {number}  r       The red color value
   * @param   {number}  g       The green color value
   * @param   {number}  b       The blue color value
   * @return  {Array}           The HSL representation
   */
  rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  // setColorCode(color = this.generateRandomColor()) {
  //   this.canvas.css("background-color", color);
  // }

  get Diameter() {
    return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  // Ya otro
  static projections = {
    /**
     * Webmercator projection (from lagoLast).
     * Since D === MAP_SIZE this function already returns pixel coordinates in the canvas.
     */
    Webmercator: ([lon, lat]) => {
      const sinlat = Math.sin(lat * Math.PI / 180.0);
      const x = this.Diameter * lon / 360.0;
      const y = R / 2 * Math.log((1 + sinlat) / (1 - sinlat));
      return {
        x: (this.Diameter / 2 + x),
        y: (this.Diameter - (this.Diameter / 2 + y)),
      };
    },

    /**
     * Spherical mercator projection (from Leaflet).
     * Since D === MAP_SIZE this function already returns pixel coordinates in the canvas.
     */
    SphericalMercator: ([lon, lat]) => {
      const MAX_LATITUDE = 85.0511287798;
      const d = Math.PI / 180.0;
      const max = MAX_LATITUDE;
      const nlat = Math.max(Math.min(max, lat), -max);
      const x = lng * d;
      const y = Math.log(Math.tan((Math.PI / 4) + (nlat * d / 2)));
      return {x, y};
    },

    LonLat: ([lon, lat]) => {
      return {x: lon, y: lat};
    },
  };

  // @Nota: Esta es la forma de recorrer todos los elementos de un GeoJSON, independientemente de su tipo básico, en este caso, se utiliza para dibujar en un Canvas, pero puede adaptarse a cualquier visor que utilice.
  // proyecciones geográficas...
  // @Parámetro: obj, el objeto GeoJSON.
  // @Retorna: Un procesamiento el objeto, en su totalidad, con todas sus colecciones; "Successfully" si fue satisfactorio, o error.
  // @Author: Luis Guillermo Bultet Ibles. 2022
  //
  // ESTA FUNCIÓN SE INCLUYE SOLAMENTE CON FINES DE DOCUMENTACIÓN
  procesarGeoJSON(obj, project = MyCanvas.projections.Webmercator) {
    /*
        Type definitions for geojson 7946.0
        Project: https://geojson.org/
        Definitions by: Jacob Bruun <https://github.com/cobster>
        Arne Schubert <https://github.com/atd-schubert>
        Jeff Jacobson <https://github.com/JeffJacobson>
        Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
        TypeScript Version: 2.3

    */

    // From d3 geo projection
    function clockwise(ring) {
      if ((n = ring.length) < 4) return false;
      var i = 0,
        n,
        area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
      while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
      return area <= 0;
    }

    // From d3 geo projection
    function contains(ring, point) {
      var x = point[0],
        y = point[1],
        contains = false;
      for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
        var pi = ring[i], xi = pi[0], yi = pi[1],
          pj = ring[j], xj = pj[0], yj = pj[1];
        if (((yi > y) ^ (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) contains = !contains;
      }
      return contains;
    }

    switch (obj.type) {
      // Lo que está comentado es lo que hay en obj.coordinates en orden lat, lon igual que geojson
      case 'Point': {   // [100, 0] a Point or position
        console.warn(`Tratará de procesar Point `, obj);
        try {
          let punto = project(obj.coordinates[i][1], obj.coordinates[i][0]);
          return {
            tipo: 'punto',
            coordenadas: punto,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
      }
      case 'LineString': {   // [[-24, 63], [-23, 60], [-25, 65], [-20, 69]] un arreglo de puntos [lat, log] (an array of Positions)
        console.warn(`Tratará de procesar LineString `, obj);
        try {
          let punto1, punto2, lineas = [];
          for (let index = 0; index < obj.coordinates.length - 1; index++) {
            let p1 = project(obj.coordinates[index][1], obj.coordinates[index][0]);
            let p2 = project(obj.coordinates[index + 1][1], obj.coordinates[index + 1][0]);
            lineas.push({puntoInicial: p1, puntoFinal: p2});
          }
          return {
            tipo: 'líneas',
            lineas: lineas,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
      }
      case 'Polygon': {   // [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]] an array of LinearRings
        console.warn(`Tratará de procesar Polygon `, obj);
        try {
          let polygonCoords = [];
          for (let j = 0; j < obj.coordinates.length; j++) {
            polygonCoords = []; // reinit it
            let punto;
            for (let k = 0; k < obj.coordinates[j].length; k++) {
              punto = project(obj.coordinates[j][k][1], obj.coordinates[j][k][0]);
              polygonCoords.push(punto);
            }
            return {
              tipo: 'polígono',
              puntos: polygonCoords,
            };
          }
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
        /* Fixme
         * En los casos que sea necesario dibujar polígonos con huecos, tienes que luego que dibujes
         * el de afuera con el color de dibujo, dibujar los de adentro con el color de fondo... o no sé
         * si la función del canvas resuelve esto, eso es por si se nos da un caso en un futuro...
         * los huecos van en contra de las manecillas del reloj o lo normal a favor o vs.
         *
         * */
      }
      case 'MultiPoint': { // [[0, 0], [10, 10]] an array of Points
        console.warn(`Tratará de procesar MultiPoint `, obj);
        try {
          let puntos = [], punto;
          for (let i = 0; i < obj.coordinates; i++) {
            punto = project(obj.coordinates[i][1], obj.coordinates[i][0]);
            puntos.push(punto);
          }
          return {
            tipo: 'puntos',
            puntos: puntos,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
        return success;
      }
      case 'MultiLineString': { // [[[0, 0], [10, 10]], [[5, 5],[15, 15]]] an array of LineStrings
        console.warn(`Tratará de procesar MultiLineString `, obj);
        try {
          let lineas = [];
          obj.coordinates.forEach((lineString) => lineas.push(procesarGeoJSON({
            type: 'LineString',
            coordinates: lineString,
          }, projection)));
          lineas = lineas.map((elemento) => elemento.lineas);
          return {
            tipo: 'lineas',
            lineas: lineas,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
        return success;
      }
      case 'MultiPolygon': { // [[[[0,0],[0,10],[10,10],[10,0],[0,0]]]] an array of Polygons
        console.warn(`Tratará de procesar MultiPolygon `, obj);
        try {
          let poligonos = [];
          obj.coordinates.forEach((pol) => poligonos.push(procesarGeoJSON({
            type: 'Polygon',
            coordinates: pol,
          })), projection);
          poligonos = poligonos.map((elemento) => elemento.puntos);
          return {
            tipo: 'polígonos',
            poligonos: poligonos,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
      }
      case 'GeometryCollection': {
        // Es cual es una agregación de objetos básicos...
        // geometries:    "[] un arreglo de objetos geojson completos"
        console.warn(`Tratará de procesar GeometryCollection `, obj);
        try {
          let coleccion = [];
          obj.geometries.forEach((i, d) => coleccion.push(procesarGeoJSON(d, projection)));
          return {
            tipo: 'coleccion',
            objetos: coleccion,
          };
        } catch (e) {
          throw new Error('Error tratando de dibujar el objeto ' + JSON.stringify(obj));
        }
        return success;
      }
      case 'Topology': {
        console.warn(`Tratará de procesar Topology `, obj);
        /* este no contiene coordenadas directamente sino los campos:
            type:       "Topology";
            investigar

             */
        // Esta función, es útil en topojson...
        // The following JavaScript reference implementation transforms a single position from the given quantized topology to absolute coordinates:
        function transformPoint(topology, position) {
          position = position.slice();
          position[0] = position[0] * topology.transform.scale[0] + topology.transform.translate[0];
          position[1] = position[1] * topology.transform.scale[1] + topology.transform.translate[1];
          return position;
        }

        // haz lo que vayas a hacer acá...

        return success;
      }
      case 'Feature': {
        console.warn(`Tratará de procesar Feature `, obj);
        /* ES EL OBJETO COMO TAL... IGNORA LAS PROPIEDADES PUES YA DEBEN ESTAR REGISTRADAS EN LA CAPA Y DIBUJA LA GEOMETRÍA RECURSIVAMENTE...

           Es un feature, tienen un property y una geometría, que sí puede ser un objeto geojson...
           Este objeto contiene, el campo obj.type == "Feature",

           CONTIENE EL CAMPO properties

           obj.properties con las propiedades, algo así: obj.properties == { "Tipo": "Línea de costa" }
           ie, las propiedades no geométricas del objetos (aquí se puede guardar el color, grosor, el line dashing, etc..), por ejemplo obj.properties == {"ID": ""},

           YA AQUÍ APARECEN LAS COORDENADAS, QUE PUEDEN SER DE LOS MAS VARIOPINTOS TIPOS...

           pues contiene una geometría en el campo obj.geometry == {"type": "MultiPolygon", "coordinates": [[[[-74.132379747787112,... etc ...}
           o algo asao: "geometry": { "type": "LineString", "coordinates": [ [ -83.664278678722823, 22.07776689790829 ], [ -83.662424591873233, 22.07842344971332 ] ] }
           */
        return procesarGeoJSON(obj.geometry);
      }
      case 'FeatureCollection': { // Es una capa, debe agregarse, recorrerse todos sus elementos a la lista de objetos...
        console.warn(`Tratará de procesar FeatureCollection `, obj);
        let objetos = [];
        obj.features.forEach((objeto) => {
          console.warn(`Se detecta `, objeto);
          objetos.push(procesarGeoJSON(objeto, projection));
        });
        if (objetos.length === 1) {
          objetos = objetos[0];
        }
        return {
          capa: obj.name ? obj.name : 'no~name',
          crs: obj.crs ? obj.crs : 'no~projection',
          objetos: objetos,
        };
      }
      default: {
        throw new Error(`El tipo de geometría: ${obj.type} que se pretende procesar, es inválido.`);
      }
    }
  }


}

/*

muestras de cómo invocar eventos manualmente ...

var event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  view: window
});
myButton.dispatchEvent(event);

var event = new InputEvent("input", {
  bubbles: true,
  cancelable: true,
  data: "Hola mundo"
});
myTextarea.dispatchEvent(event);

*/

// Simular un segmento en un canvas (click abajo movimiento click arriba).
function simularDrag(canvas = document.getElementById('myCanvas'),
  x1 = 100,
  y1 = 100,
  x2 = 200,
  y2 = 200) {

  const rect = canvas.getBoundingClientRect();
  const event1 = new MouseEvent('mousedown', {
    clientX: rect.left + x1,
    clientY: rect.top + y1,
    button: 0,
    bubbles: true,
  });

  const event2 = new MouseEvent('mousemove', {
    clientX: rect.left + x2,
    clientY: rect.top + y2,
    button: 0,
    bubbles: true,
  });

  const event3 = new MouseEvent('mouseup', {
    clientX: rect.left + x2,
    clientY: rect.top + y2,
    button: 0,
    bubbles: true,
  });

  canvas.dispatchEvent(event1);
  canvas.dispatchEvent(event2);
  canvas.dispatchEvent(event3);
  return;
}
