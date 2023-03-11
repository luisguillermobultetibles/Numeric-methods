import fs from 'fs';
import {Arreglo} from './Arreglo.js';
import process from 'process';

// Versión inestable...
export class Dataset extends Arreglo {
  constructor(datasource) {
    super();
    if (datasource) {
      this.open(datasource);
    } else {
      this.open([]);
    }
    this.filename = null;
  }

  // Cargar de un formato .json clásico
  loadFromFile(filename) {
    if (filename && !this.filename) {
      this.filename = filename;
    }
    if (this.filename) {
      const data = super.readFromFile(filename);
      const content = JSON.parse(data);
      this._array = content['RECORDS'];
    } else {
      throw new Error('You must specify a file name at lest once time.');
    }
  }

  writeToFile(fileName) {
    if (filename && !this.filename) {
      this.filename = filename;
    }
    if (this.filename) {
      super.writeToFile(fileName, `{"RECORDS":${JSON.stringify(this._array)}}`);
    } else {
      throw new Error('You must specify a file name at lest once time.');
    }
  }

  // Sin ser tan mongo, puedes desarrollar tu propio SGDB.


// Agregar una nueva relación... (no chequea., luego)., foreign es la tabla física con la que se relaciona, también de tipo Table.

  get recNo() {
    return this._recNo;
  }

  set recNo(value) {
    this._recNo = value;
    this.loadBuffer();
  }

// @Abstract, @Platform dependent

// Puedes acceder a los campos dal registro anterior sin necesidad de mover el cursor
  get priorRecord() {
    return this.recNo > 0 ? null : this._array[this.recNo - 1];
  }

// @Abstract, @Platform dependent

  set priorRecord(value) {
    if (this.recNo > 0) {
      this._array[this.recNo - 1] = value;
    }
  }

// Puedes utilizar la propiedad activeRecord para acceder a los campos del registro activo...
  get activeRecord() {
    return this._array[this.recNo];
  }

  set activeRecord(value) {
    this._array[this.recNo] = value;
  }

// Puedes acceder a los campos del siguiente registro sin necesidad de mover el cursor
  get nextRecord() {
    return this.recNo + 1 < this._array.length ? this._array[this.recNo + 1] : null;
  }

  set nextRecord(value) {
    if (this.recNo + 1 < this._array.length) {
      this[this.recNo + 1] = value;
    }
  }

  get active() {
    return this._active;
  }

  set active(value) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }

  get fields() {
    return this.buffer;
  }

  set fields(value) {
    this.buffer = value;
  }

// Lo demás son nombres de campos y el de la misma.
  addRelation(localKey, foreignName, foreignKey, foreign) {
    if (!this._relations) {
      this._relations = new Dataset({
        localKey: primaryKey,
        foreignName: foreignName,
        foreignKey: foreignKey,
        foreign: foreign,
      }); // is an array of object records like {primaryKey:"color_id", foreignTable: this, foreignKey: id}
    } else {
      this._relations._array.push({
        localKey: primaryKey, foreignName: foreignName, foreignKey: foreignKey,
      });
    }
  }

// Realiza una relación sencilla previamente establecida de uno a muchos...
  relations(tableName, tableField) {
    if (!this._relations.find('foreignName', tableName)) {
      throw new Error(`No existe relación con la tabla ${tableName}.`);
    }

    if (this._relations.activeRecord['foreign'].find(tableField, this.activeRecord[this._relations.localKey])) {
      return this._relations.activeRecord.foreign[tableField];
    }
  }

// Este método debería cargar el datasource completo en la bd.
  load() {
    return null;
  }

// Este método debería guardar el datasource completo en la bd.
  save() {
    return null;
  }

// Cargar o guardar el contenido del dataset en memoria, hacia o desde la posición actual.
  loadBuffer() {
    this.buffer = this._array[this._recNo];
  }

  saveBuffer() {
    this._array[this._recNo] = this.buffer;
  }

// Todos los campos de la tabla
  allFields() {
    const resultado = [];
    for (const field in this.activeRecord) {
      if (this.activeRecord.hasOwnProperty(field)) {
        resultado.push(field);
      }
    }
    return resultado;
  }

// Abre un dataset, un arreglo de objetos
  open(datasource) {
    if (datasource) {
      this._array = datasource;
    }
    if (!this._array) {
      this._array = [];
    }
    this._recNo = 0;
    // Esta es la primera vez que se va a cargar el buffer.
    this.loadBuffer();
    this._active = true;
  }

// Si la tabla está activa, la salva y la cierra; si no querías salvar, primero debiste cancelar la op.
  close() {
    if (this._active) {
      this.saveBuffer();
      this.save();
      this.open([]);
      this._active = false;
    }
  }

  recordCount() {
    return this._array.length;
  }

// Las funciones first, last, prev y next, cancelan la operación.
  first() {
    this._recNo = 0;
    this.loadBuffer();
  }

  last() {
    this._recNo = this._array.length - 1;
    this.loadBuffer();
  }

  prev() {
    if (this._recNo > 0) {
      this._recNo = this._recNo - 1;
    }
    this.loadBuffer();
  }

  next() {
    if (this._recNo < this._array.length - 1) {
      this._recNo = this._recNo + 1;
    }
    this.loadBuffer();
  }

// Subir y bajar registros (es útil en el control de capas) // re-con-validado
  moveUp() {
    [tabla.nextRecord, tabla.activeRecord] = [tabla.activeRecord, tabla.nextRecord];
  }

  moveDown() {
    [tabla.priorRecord, tabla.activeRecord] = [tabla.activeRecord, tabla.priorRecord];
  }

// refresh from db
  refresh() {
    const tmpRec = this.recNo;
    this.open();
    this.recNo = tmpRec;
    this.loadBuffer();
  }

// return an array with the fieldNames
  fieldNames() {
    const resultado = [];
    if (this._array.length > 0) {
      for (const llave in this._array[0]) {
        resultado.push(llave);
      }
    }
    return resultado;
  }

// insert
  insert(fieldNames, fieldValues) {
    const blob = {};
    for (let i = 0; i < Math.min(fieldNames.length, fieldValues.length); i++) {
      blob[fieldNames[i]] = fieldValues[i];
    }
    this._array.push(blob);
    this.refresh();
  }

// el registro actual cumple ese criterio de igualdad
  match(fieldNames, fieldValues) {
    let prov = 0;
    const comparables = Math.min(inFieldNames.length, inFieldValues.length);
    for (let j = 0; j < comparables; j++) {
      if (this.activeRecord[inFieldNames[j]] === inFieldValues[j]) {
        prov++;
      }
    }
    return (prov === comparables);
  }

// find === criteria (si devuelve true, actualiza el cursor apuntando al resultado)
// todo select y where condition
  find(fieldNames, fieldValues) {
    // Flexibility
    const inFieldNames = fieldNames instanceof Array ? fieldNames : [fieldNames];
    const inFieldValues = fieldValues instanceof Array ? fieldNames : [fieldValues];
    // recorre el dataset...
    let comparables;
    let prov;
    comparables = Math.min(inFieldNames.length, inFieldValues.length);
    for (let i = 0; i < this._array.length; i++) {
      prov = 0;
      for (let j = 0; j < comparables; j++) {
        if (this._array[i][inFieldNames[j]] === inFieldValues[j]) {
          prov++;
        }
      }
      if (prov === comparables) {
        // update recno
        this.recNo = i;
        return true;
      }
    }
    return false;
  }

// Delete when
// todo where condition
  delete(fieldNames, fieldValues) {
    // Flexibility
    const inFieldNames = fieldNames instanceof Array ? fieldNames : [fieldNames];
    const inFieldValues = fieldValues instanceof Array ? fieldNames : [fieldValues];
    // recorre el dataset...
    let comparables;
    let prov;
    let hasDeleted = false;
    comparables = Math.min(inFieldNames.length, inFieldValues.length);
    for (let i = this._array.length - 1; i >= 0; i--) {
      prov = 0;
      for (let j = 0; j < comparables; j++) {
        if (this._array[i][inFieldNames[j]] === inFieldValues[j]) {
          prov++;
        }
      }
      if (prov === comparables) {
        // update recno
        this._array.splice(i, 1);
        hasDeleted = true;
        // update the rearguard
        if (this.recNo > this._array.length - 1) {
          this.recNo = this._array.length - 1;
        }
        this.loadBuffer();
      } // until the end...
    }
    return hasDeleted;
  }

// select
// todo where condition y from varias tablas, que debe hacen un producto cartesiano
//
  select(selectedFields, fieldNames, fieldValues) {
    // Flexibility, revisar, galileo

    const inSelectedFields = !fieldValues instanceof Array ? fieldNames : [fieldValues];

    const inFieldNames = !fieldNames instanceof Array ? fieldNames : [fieldNames];
    const inFieldValues = !fieldValues instanceof Array ? fieldNames : [fieldValues];
    // recorre el dataset...
    let comparables;
    let prov;
    const hasDeleted = false;
    const selection = new Dataset();
    comparables = Math.min(inFieldNames.length, inFieldValues.length);
    for (let i = this._array.length - 1; i >= 0; i--) {
      prov = 0;
      for (let j = 0; j < comparables; j++) {
        if (this._array[i][inFieldNames[j]] === inFieldValues[j]) {
          prov++;
        }
      }
      if (prov === comparables) {
        const item = {};
        var value;
        var sValues = [];
        for (let k = 0; k < inSelectedFields.length; k++) {
          value = this._array[i][inSelectedFields[k]];
          sValues.push(value);
          item[inSelectedFields[k]] === value;
          prov++;
        }
      }
      selection.insert(inSelectedFields, sValues);
    } // until the end...
    return selection;
  }

// Este te genera la tabla html (recuerda que el datasource es un arreglo de objetos o registros)
  html(estilo) {
    if (!estilo) {
      estilo = 'border=1';
    }
    let popupContent = `<table ${estilo}>`;
    if (this._array.length !== 0) { // something in the data set?
      popupContent += '<thead>';
      // Títulos
      for (let llave in this._array[0]) {
        popupContent += '<th>';
        popupContent += llave.toString().bold();
        popupContent += '</th>';
      }
      popupContent += '</thead>';
      popupContent += '<tbody>';
      // Contents
      for (let i = 0; i < this._array.length; i++) {
        popupContent += '<tr>';
        for (let llave in this._array[i]) {
          let valor = this._array[i][llave];
          if (typeof (valor) == 'boolean') {
            valor = (valor ? 'Sí' : 'No');
          } else {
            valor = ((this._array[i][llave]) !== null ? String((this._array[i][llave])) : '');
          }
          popupContent += '<td>' + valor.toString().italics() + '</td>';
        }
        popupContent += '</tr>';
      }
      // Par luego, en caso de que se esté editando u registro, puedes poner cuadros de edición con botones
      // de aplicar o cancelar... de igual forma, a la derecha, abrir o eliminar registro,
      // esto es super que genérico..., y por supuesto se puede adaptar a los nuevos proyectos...
      popupContent += '<tbody>';
    } // else if at least you have an schema... just show the caption's
    popupContent += '</table>';
    return popupContent;
  }

//  Posted by Solomon Yunana (location Kaduna, Nigeria.) to https://dev.to/solexy on 14 mar 2022...
  groupBy(key) {
    // tried to figure this out, help!!!!!
    return this._array.reduce((previous, current) => {
      if (!previous[current[key]]) {
        previous[current[key]] = [];
      }
      previous[current[key]].push(current);
      return previous;
    }, {});
  }
}

// The substantial parts, ported from
// JSONBb (c) 2016 Niccolò Maggioni, under:
// The MIT License (MIT)
export class JSONdb extends Dataset {

  /**
   * Default configuration values.
   * @type {{ jsonSpaces: number}}
   */
  static defaultOptions = {
    jsonSpaces: 4,
    stringify: JSON.stringify,
    parse: JSON.parse,
  };

  /**
   * Validates the contents of a JSON file.
   * @param {string} fileContent
   * @returns {boolean} `true` if content is ok, throws error if not.
   */
  validateJSON(fileContent) {
    try {
      this.options.parse(fileContent);
    } catch (e) {
      console.error('Given filePath is not empty and its content is not valid JSON.');
      throw e;
    }
    return true;
  };

  // CAUTION !!! UNDER AUTHOR LICENCE, AUTO-TEST AND ADVANCED.

  static iterableTestsCount = 100;

  /**
   * Generates a file path and name based on current UNIX timestamp.
   * @returns {string}
   */
  static genFileName() {
    return '/tmp/' + Date.now().toString() + '.json';
  }

  /**
   * Makes sure that a unique filename is generated.
   */
  static genFilePath(timeOut = 10000) {
    let loop = true;
    setTimeout(() => loop = false, timeOut);
    while (loop) {
      try {
        this.filePath = JSONdb.genFileName();
        fs.statSync(this.filePath);
      } catch (err) {
        console.error(err.toString());
        break;
      }
    }
  };

  /**
   * Returns a new instance of JSONdb.
   * @returns {JSONdb}
   */
  static createInstance() {
    return new JSONdb(this.filePath);
  }

  // Priviledge tests (facultades).

  // Tests are not being run as root
  static checkRunAsRoot() {
    try {
      let isRoot = process.getuid && process.getuid() === 0;
      if (!isRoot) {
        console.error('Please do not run tests with root privileges!');
      }
    } catch (e) {
      console.error('Cannot check key instances, cause:', e.toString());
    }
  }

  // Consistency tests (solidez).

  // Database cleanup
  static checkDatabaseCleanup() {
    try {
      this.createInstance().deleteAll();
    } catch (e) {
      console.error('Cannot check database cleanup, cause:', e.toString());
    }
  }

  // Create a new JSONdb instance and test `instanceOf`'
  static checkDatabaseInstance() {
    try {
      const db = this.createInstance();
      if (!(db, JSONdb)) {
        console.error(`Database is not saved as instance of ${JSONdb.constructor.name}.`);
      }
    } catch (e) {
      console.error('Cannot check database instance, cause:', e.toString());
    }
  }

  // Create a new JSONdb instance and test `instanceOf`'
  static checkDatabaseInstance() {
    try {
      const db = this.createInstance();
      if (!(db, JSONdb)) {
        console.error(`Database is not saved as instance of ${JSONdb.constructor.name}.`);
      }
    } catch (e) {
      console.error('Cannot check database instance, cause:', e.toString());
    }
  }

  //
  // it('Check error handling for paths with no access', function() {
  //   assert.throws(function() {
  //     const db = new JSONdb('/' + Date.now().toString() + '.json', { syncOnWrite: true });
  //     db.set('foo', 'bar');
  //   });
  // });
  //

  // Check that a non-exhistent key returns `undefined`
  static checkNonExhistentKey() {
    try {
      const db = JSONdb.createInstance();
      if (typeof (db.get(Date.now())) !== 'undefined') {
        console.error('Unexpected type of initial read.');
      }
    } catch (e) {
      console.error('Cannot check key instances, cause:', e.toString());
    }
  }

  // Mechanic tests (así es la mecánica).

  // Check that values can change (deterministic)
  static checkVolumeChange() {
    try {
      const db = JSONdb.createInstance();
      for (let i = 0; i < JSONdb.iterableTestsCount; i++) {
        db.set('foo', new Date().toISOString());
        let firstVal = db.get('foo');
        db.set('foo', new Date().toUTCString());
        let secondVal = db.get('foo');
        if (firstVal !== secondVal) {
          console.error('Values do not change');
        }
      }
    } catch (e) {
      console.error('Cannot check key instances, cause:', e.toString());
    }
  }

  // Check that keys can be deleted
  static checkKeyDeletion() {
    try {
      const db = JSONdb.createInstance();
      for (let i = 0; i < this.witerableTestsCount; i++) {
        db.set('foo', Date.now());
        let firstVal = db.get('foo');
        db.delete('foo');
        let secondVal = db.get('foo');
        if (firstVal !== secondVal) {
          console.error('Values do not change.');
        }
        if (!secondVal) {
          console.error('Key was not deleted.');
        }
      }
    } catch (e) {
      console.error('Cannot check key deletion, cause:', e.toString());
    }
  }

  // Check that keys existence can be verified
  static checkKeyInstance() {
    try {
      const db = this.createInstance();
      for (let i = 0; i < this.iterableTestsCount; i++) {
        db.set('foo', Date.now());
        if (!db.has('foo')) {
          console.error('Key existence is erroneous (returned False instead of True)');
        }
        db.delete('foo');
        if (db.has('foo')) {
          console.error('Key existence is erroneous (returned True instead of False)');
        }
      }
    } catch (e) {
      console.error('Cannot check key instances, cause:', e.toString());
    }
  }

  // Verify sync to disk
  static diskSynch() {
    try {
      const db = JSONdb.createInstance();
      db.set('foo', Date.now());
    } catch (e) {
      console.error('Cannot save to disk, cause:', e.toString());
    }
  }

  // Check that the copy of the underlying structure is coherent
  static underlyingCoherency() {
    try {
      const db = JSONdb.createInstance();
      const reference = {};
      for (let i = 0; i < JSONdb.iterableTestsCount; i++) {
        const now = Date.now();
        db.set('foo', now);
        reference.foo = now;
        db.set('bar', now + 1000);
        reference.bar = now + 1000;
        if (JSON.stringify(db.JSON()) !== JSON.stringify(reference)) {
          console.error('Returned copy does not match.');
        }
      }
    } catch (e) {
      console.error('Cannot check underlying coherency, cause:', e.toString());
    }
  }

  // Check that the underlying structure can be replaced
  static underlyingReplacement() {
    try {
      const db = JSONdb.createInstance();
      const replacement = {};
      const now = Date.now();
      db.set('foo', now);
      db.set('bar', now + 1000);
      replacement.foo = now - 1000;
      replacement.bar = now - 2000;
      if (JSON.stringify(db.JSON()) === JSON.stringify(replacement)) {
        console.log('Replacement is equal.');
      }
      db.JSON(replacement);
      if (JSON.stringify(db.JSON()) !== JSON.stringify(replacement)) {
        console.log('Replacement is not equal.');
      }
    } catch (e) {
      console.error(e.toString());
    }
  }

  // Persistency
  static persitency() {
    try {
      let db = JSONdb.createInstance();
      db.set('foo', Date.now());
      let oldVal = db.get('foo');
      db = JSONdb.createInstance();
      if (db.get('foo') !== oldVal) {
        console.error('Reloaded value differs from last written.');
      }
    } catch (e) {
      console.error(e.toString());
    }
  }

  // Temporary file removal
  static cleanUp() {
    try {
      fs.unlinkSync(this.filePath);
    } catch (e) {
      console.error('Unable to cleanup.');
    }
  }

  /**
   * Main constructor, manages existing storage file and parses options against default ones.
   * @param {string} filePath The path of the file to use as storage.
   * @param {object} [options] Configuration options.
   * @param {boolean} [options.syncOnWrite] Makes the storage be written to disk after every modification. Enabled by default.
   * @param {boolean} [options.syncOnWrite] Makes the storage be written to disk after every modification. Enabled by default.
   * @param {number} [options.jsonSpaces] How many spaces to use for indentation in the output json files. Default = 4
   * @constructor
   */
  constructor(filePath, options) {
    super();
    // Mandatory arguments check
    if (!filePath || !filePath.length) {
      throw new Error('Missing file path argument.');
    } else {
      this.filePath = filePath;
    }

    // Options parsing
    if (options) {
      for (let key in defaultOptions) {
        if (!options.hasOwnProperty(key)) options[key] = defaultOptions[key];
      }
      this.options = JSON(options);
    } else {
      this.options = JSON(defaultOptions);
    }

    // Storage initialization
    this.storage = {};

    // File existence check
    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        /* File doesn't exist */
        return;
      } else if (err.code === 'EACCES') {
        throw new Error(`Cannot access path "${filePath}".`);
      } else {
        // Other error
        throw new Error(`Error while checking for existence of path "${filePath}": ${err}`);
      }
    }
    /* File exists */
    try {
      fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      throw new Error(`Cannot read & write on path "${filePath}". Check permissions!`);
    }
    if (stats.size > 0) {
      let data;
      try {
        data = fs.readFileSync(filePath);
      } catch (err) {
        throw err;  // TODO: Do something meaningful
      }
      if (this.validateJSON.bind(this)(data)) this.storage = this.options.parse(data);
    }
  }

  /**
   * Creates or modifies a key in the database.
   * @param {string} key The key to create or alter.
   * @param {object} value Whatever to store in the key. You name it, just keep it JSON-friendly.
   */
  set(key, value) {
    this.storage[key] = value;
    if (this.options) this.sync();
  };

  /**
   * Extracts the value of a key from the database.
   * @param {string} key The key to search for.
   * @returns {object|undefined} The value of the key or `undefined` if it doesn't exist.
   */
  get(key) {
    return this.storage.hasOwnProperty(key) ? this.storage[key] : undefined;
  };

  /**
   * Checks if a key is contained in the database.
   * @param {string} key The key to search for.
   * @returns {boolean} `True` if it exists, `false` if not.
   */
  has(key) {
    return this.storage.hasOwnProperty(key);
  };

  /**
   * Deletes a key from the database.
   * @param {string} key The key to delete.
   * @returns {boolean|undefined} `true` if the deletion succeeded, `false` if there was an error, or `undefined` if the key wasn't found.
   */
  delete(key) {
    let retVal = this.storage.hasOwnProperty(key) ? delete this.storage[key] : undefined;
    if (this.options) this.sync();
    return retVal;
  };

  /**
   * Deletes all keys from the database.
   * @returns {object} The JSONdb instance itself.
   */
  deleteAll() {
    for (var key in this.storage) {
      //noinspection JSUnfilteredForInLoop
      this.delete(key);
    }
    return this;
  };

  /**
   * Writes the local storage object to disk.
   */
  sync() {
    if (this.options) {
      fs.writeFile(this.filePath, this.options.stringify(this.storage, null, this.options.jsonSpaces), (err) => {
        if (err) throw err;
      });
    }
  };

  /**
   * If no parameter is given, returns **a copy** of the local storage. If an object is given, it is used to replace the local storage.
   * @param {object} storage A JSON object to overwrite the local storage with.
   * @returns {object} Clone of the internal JSON storage. `Error` if a parameter was given and it was not a valid JSON object.
   */
  JSON(storage) {
    if (storage) {
      try {
        JSON.parse(this.options.stringify(storage));
        this.storage = storage;
      } catch (err) {
        throw new Error('Given parameter is not a valid JSON object.');
      }
    }
    return JSON.parse(this.options.stringify(this.storage));
  };


  // Recuerda hacer la salva antes de actualizar el archivo para evitar pérdidas de datos
  // y borrarla después de la operación.
  // y en la carga inicial, revisar si este archivo existe... para determinar si es posible
  // una pérdida de datos... además, incluir un chequeo de errores.
  // Hacerlo compatible con TypeORM o Massive.js

}

/*


function saveState(state) {
   window.localStorage.setItem("gameState", JSON.stringify(state));
}

function restoreState() {
   var state = window.localStorage.getItem("gameState");
   if (state) {
      return JSON.parse(state);
   } else {
      return null;
   }
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function removeFromStorage(key) {
    localStorage.removeItem(key)
}


 // Limpiar el localstorage
 localStorage.clear();
 localStorage.setItem("usuario", usuario);
 sessionStorage.apellidos = apellidos;

 sessionStorage.clear();

    Mira el html

    <!doctype html>
<html>
<head>
   <meta charset="utf-8">
   <title>Web Storage</title>
</head>
<body>
   <form name="session">
      Nombre: <input type="text" name="nombre" id="nombre"/><br>
      Apellidos: <input type="text" name="apellidos" id="apellidos"/><br>
      Página web: <input type="text" name="pagina" id="pagina"/><br>
<input type="button" id="guardar_claves_session" value="Guardar claves sessionStorage" onclick="guardar_claves_session()"></input>
   </form>
<input type="button" id="borrar_claves_session" value="Borrar claves sessionStorage" onclick="borrar_claves_session()"></input>
   <br>
   <br>
   <form name="local">
      Usuario: <input type="text" id="usuario"/><br>
      Email: <input type="email" id="email"/><br>
      Contraseña: <input type="password" id="contrasena"/><br>
<input type="button" id="guardar_claves_local" value="Guardar claves localStorage" onclick="guardar_claves_local()"></input>
   </form>
<input type="button" id="borrar_claves_local" value="Borrar claves localStorage" onclick=" localStorage.clear();obtener_claves_local();"></input>

   <script src="js/storage_examples.js"></script>
</body>
</html>

    y las funciones:

    window.onload = function () {
   if (window.sessionStorage != null) {
      //Recuperar claves
      obtener_claves_session();
   }
   if (window.localStorage != null) {
      //Recuperar claves
      obtener_claves_local();
   }
};



function borrar_claves_session() {
   sessionStorage.clear();
   obtener_claves_session();
}
function obtener_claves_session() {
   if (window.sessionStorage != null) {
      //Recuperar claves y escribirlas en los input correspondientes
      var nombre = sessionStorage.getItem("nombre");
      var nombre_object = document.getElementById("nombre");
      nombre_object.value = nombre;
      var apellidos = sessionStorage.apellidos;
      var apellidos_object = document.getElementById("apellidos");
      apellidos_object.value = apellidos;
      var pagina = sessionStorage["pagina"];
      var pagina_object = document.getElementById("pagina");
      pagina_object.value = pagina;
   }
}


function guardar_claves_session() {
   if (window.sessionStorage != null) {
      //Guardar claves con los valores de los inputs
      var nombre_object = document.getElementById("nombre");
      var nomber = nombre_object.value;
      sessionStorage.setItem("nombre", nombre);
      var apellidos_object = document.getElementById("apellidos");
      var apellidos = apellidos_object.value;
      sessionStorage.apellidos = apellidos;
      var pagina_object = document.getElementById("pagina");
      var pagina = pagina_object.value;
      sessionStorage.setItem("pagina", pagina);
   }
}
function borrar_claves_local() {
   localStorage.clear();
   obtener_claves_local();
}
function obtener_claves_local() {
   if (window.localStorage != null) {
      //Recuperar claves y escribirlas en los input correspondientes
      var nombre = localStorage.getItem("nombre");
      var nombre_object = document.getElementById("nombre");
      nombre_object.value = nombre;
      var apellidos = localStorage.apellidos;
      var apellidos_object = document.getElementById("apellidos");
      apellidos_object.value = apellidos;
      var pagina = localStorage["pagina"];
      var pagina_object = document.getElementById("pagina");
      pagina_object.value = pagina;
   }
}

function guardar_claves_local() {
   if (window.localStorage != null) {
      //Guardar claves con los valores de los inputs
      var nombre_object = document.getElementById("nombre");
      var nomber = nombre_object.value;
      localStorage.setItem("nombre", nombre);
      var apellidos_object = document.getElementById("apellidos");
      var apellidos = apellidos_object.value;
      localStorage.apellidos = apellidos;
      var pagina_object = document.getElementById("pagina");
      var pagina = pagina_object.value;
      localStorage.setItem("pagina", pagina);
   }
}









*/
