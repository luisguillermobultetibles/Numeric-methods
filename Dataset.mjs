import {Arreglo} from "./Arreglo.mjs";
export class DataSet extends Arreglo {
    constructor(datasource) {
        super();
        if (datasource) {
            this.open(datasource);
        } else {
            this.open([]);
        }
        this.#filename = null;
    }

    // Cargar de un formato .json clásico
    loadFromFile(filename) {
        if (filename && !this.#filename) {
            this.#filename = filename;
        }
        if (this.#filename) {
            const data = super.readFromFile(filename);
            const content = JSON.parse(data);
            this._array = content["RECORDS"];
        } else {
            throw new Error('You must specify a file name at lest once time.');
        }
    }

    writeToFile(fileName) {
        if (filename && !this.#filename) {
                this.#filename = filename;
            }
        if (this.#filename) {
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
            this._relations = new DataSet({
                localKey: primaryKey, foreignName: foreignName, foreignKey: foreignKey, foreign: foreign,
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
        const selection = new DataSet();
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
