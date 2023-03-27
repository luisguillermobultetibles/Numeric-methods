import {WebSystemObject} from './WebSystemObject';
// Clase básica para todo tipo de documentos...
class Document extends WebSystemObject {
  constructor(no = 0, clave = "", introduccion = null, desarrollo = null, conclusiones = null) {
    super();
    // Estructural
    this._clave = clave; // tipo de documento
    this._no = no;       // número o folio
    // se construye con tres objetos con determinado formato
    if (!introduccion && !desarrollo && !conclusiones) {
      console.warn(`El documento (${clave}->${no}), no contiene información.`);
    } else {
      if (introduccion) {
        this._introduccion = {introduccion};
      }
      if (desarrollo) {
        this._desarrollo = {desarrollo};
      }
      if (conclusiones) {
        this._conclusiones = {conclusiones};
      }
    }
  }

  // Estructural
  get clave() {
    return this._clave;
  }

  set clave(tipo) {
    this._clave = tipo;
  }

  get no() {
    return this._no;
  }

  set no(folio) {
    this._no = folio;
  }

  // De la introducción
  get titulo() {
    return this._introduccion.titulo;
  }

  set titulo(v) {
    this._introduccion.titulo = v;
  }

  get subtitulo() {
    return this._introduccion.subtitulo;
  }

  set subtitulo(v) {
    this._introduccion.subtitulo = v;
  }

  get fecha() {
    return this._introduccion.fecha;
  }

  set fecha(v) {
    this._introduccion.fecha = v;
  }

  // Del desarrollo
  get contenido() {
    return this._desarrollo.contenido;
  }

  set contenido(v) {
    this._desarrollo.contenido = v;
  }

  get anexos() {
    return this._desarrollo.anexos;
  }

  set anexos(v) {
    this._desarrollo.anexos = v;
  }

  // De las conclusiones
  get conclusion() {
    return this._conclusiones.conclusion;
  }

  set conclusion(v) {
    this._conclusiones.conclusion = v;
  }

  get recomendaciones() {
    return this._conclusiones.recomendaciones;
  }

  set recomendaciones(v) {
    this._conclusiones.recomendaciones = v;
  }

  get notas() {
    return this._conclusiones.erratas;
  }

  set notas(v) {
    this._conclusiones.erratas = v;
  }

  get erratas() {
    return this._conclusiones.erratas;
  }

  set erratas(v) {
    this._conclusiones.erratas = v;
  }

  get fuentes() {
    return this._conclusiones.fuentes;
  }

  set fuentes(v) {
    this._conclusiones.fuentes = v;
  }

}
