import {WebSystemObject} from "./system/WebSystemObject.js";

// 2D Matrix class based on the creation of: ¿Código Da vinci?, twitter: @fadi_davenchy
export class Matrix2D extends WebSystemObject {
    constructor(r = 3, c = 3, i = 0) {
        super();
        // create matrix
        if (Array.isArray(r)) this.matrix = r.map(c => c.slice(0)); else if (r instanceof Matrix2D) this.copyOf(r); else this.matrix = this.generateArray(r, c, i);

        // check the matrix
        const rows = this.matrix.length;
        const columns = this.matrix[0].length;
        const columnsLength = this.matrix.filter(c => c.length === columns).length;
        if (columnsLength !== rows) throw new Error(`each column must have the same number of values: ${rows}`);
    }

    get isSquare() {
        return this.rows === this.columns;
    }

    get isInversable() {
        return this.determinate !== 0;
    }

    get determinate() {
        const m = this.clone();
        if (!m.isSquare) throw new Error('matrix must be a square matrix');
        const M = m.getValue.bind(m);
        // handle (1x1) Matrix
        if (m.rows === 1) return M(1, 1);
        // handle (2x2) Matrix
        if (m.rows === 2) return M(1, 1) * M(2, 2) - M(1, 2) * M(2, 1);
        // handle (3x3) or more Matrices
        if (m.rows >= 3) {
            let sum = 0;
            for (let i = 1; i <= m.rows; i++) {
                const det = m.clone().reduce(1, i).determinate;
                sum += Math.pow(-1, i - 1) * M(1, i) * det;
            }
            return sum;
        }

    }

    get rows() {
        return this.matrix.length;
    }

    get columns() {
        return this.matrix[0].length;
    }

    get type() {
        return `(${this.rows} x ${this.columns})`
    }

    reset(i = 0) {
        this.matrix = this.generateArray(this.rows, this.columns, i);
        return this;
    }

    copyOf(m) {
        this.matrix = m.matrix.map(c => c.slice(0));
        return this;
    }

    clone() {
        return new Matrix2D(this.matrix);
    }

    toString() {
        return this.matrix.map(c => c.join('\t')).join('\n');
    }

    isEqualTo(m2) {
        if (!m2 instanceof Matrix2D) throw new Error('need matrix to compare to');
        const m1 = this;
        if (m1.rows !== m2.rows || m1.columns !== m2.columns) return false;
        m1.loop(({ i, j, value }) => {
            if (m2.getValue(i, j) !== value) return false;
        });
        return true;
    }

    setColumn(n, c = []) {
        if (c.length !== this.rows) throw new Error(`column must has ${this.rows} value(s)`);
        if (n > this.columns || n <= 0) throw new Error(`column number must be in range [1, ${this.columns}]`);
        this.matrix.forEach((col, i) => {
            col[n - 1] = c[i];
        });
        return this;
    }

    addColumn(c = []) {
        if (c.length !== this.rows) throw new Error(`column must has ${this.rows} value(s)`);
        this.matrix.forEach((col, i) => {
            col.push(c[i]);
        });
        return this;
    }

    getColumn(c = 1) {
        if (c > this.columns || c <= 0) throw new Error(`column number must be in range [1, ${this.columns}]`);
        return this.matrix.map(r => r[c - 1]);
    }

    removeColumn(c) {
        if (c > this.columns || c <= 0) throw new Error(`column number must be in range [1, ${this.columns}]`);
        this.matrix.forEach(r => r.splice(c - 1, 1));
        return this;
    }

    setRow(n, r = []) {
        if (r.length !== this.columns) throw new Error(`row must has ${this.columns} value(s)`);
        if (n > this.rows || n <= 0) throw new Error(`row number must be in range [1, ${this.rows}]`);
        this.matrix[n - 1] = r;
        return this;
    }

    addRow(r = []) {
        if (r.length !== this.columns) throw new Error(`row must has ${this.columns} value(s)`);
        this.matrix.push(r);
        return this;
    }

    getRow(r = 1) {
        if (r > this.rows || r <= 0) throw new Error(`row number must be in range [1, ${this.rows}]`);
        return this.matrix[r - 1].slice(0);
    }

    removeRow(r) {
        if (r > this.rows || r <= 0) throw new Error(`row number must be in range [1, ${this.rows}]`);
        this.matrix.splice(r - 1, 1);
        return this;
    }

    setValue(r = 1, c = 1, v) {
        this.matrix[r - 1][c - 1] = v;
        return this;
    }

    getValue(r = 1, c = 1) {
        if (r <= 0 || r > this.rows || c <= 0 || c > this.columns) return;
        return this.matrix[r - 1][c - 1];
    }

    loop(cb) {
        const self = this;
        const { rows, columns } = this;
        let counter = 0;
        for (let i = 1; i <= rows; i++) for (let j = 1; j <= columns; j++) {
            const tools = {
                self,
                i,
                j,
                clone: self.clone(),
                sign: Math.pow(-1, counter),
                counter: counter++,
                value: self.getValue(i, j),
                setValue: v => self.setValue(i, j, v),
                column: self.getColumn(j),
                row: self.getRow(i),
            }

            try {
                tools.determinate = self.determinate;
            } catch (_) {
                tools.determinate = null;
            }
            tools.reduce = () => tools.clone.reduce(i, j);
            tools.inverse = () => tools.clone.inverse();
            tools.transpose = () => tools.clone.transpose();
            tools.adjacency = () => tools.clone.adjacency();
            tools.identity = () => tools.clone.identity();

            cb(tools);
        }
        return this;
    }

    multiply(...matrices) {
        const m1 = this;
        matrices.forEach(m2 => {
            if (m1.columns !== m2.rows) throw new Error('can not multiply the 2 matrices');
            const temp = new Matrix2D(m1.rows, m2.columns);
            temp.loop(({ i, j, setValue }) => {
                const product = this.vectorDotProduct(m1.getRow(i), m2.getColumn(j));
                setValue(product);
            });
            m1.copyOf(temp);
        });
        return this;
    }

    addNumber(n) {
        const self = this;
        const { rows, columns } = this;
        this.loop(t => t.setValue(t.value + n));
        return this;
    }

    subtractNumber(n) {
        const self = this;
        const { rows, columns } = this;
        this.loop(t => t.setValue(t.value - n));
        return this;
    }

    multiplyNumber(n) {
        const self = this;
        const { rows, columns } = this;
        this.loop(t => t.setValue(t.value * n));
        return this;
    }

    divideNumber(n) {
        if (n === 0) throw new Error('can not divide by zero');
        const self = this;
        const { rows, columns } = this;
        this.loop(t => t.setValue(t.value / n));
        return this;
    }

    transpose() {
        const mat = Array(this.columns).fill(0);
        this.matrix = mat.map((r, i) => this.getColumn(i + 1));
        return this;
    }

    inverse() {
        const delta = Math.pow(this.determinate, -1);
        this.adjacency().multiplyNumber(delta);
        return this;
    }

    adjacency() {
        if (!this.isInversable) throw new Error('matrix determinate value equal to zero');
        if (!this.isSquare) throw new Error('must be a square matrix');

        // 1x1 Matrix
        if (this.rows === 1) this.setValue(1, 1, Math.pow(this.getValue(1, 1), -1));
        // 2x2 Matrix
        else if (this.rows === 2) {
            const temp = this.getValue(1, 1);
            this.setValue(1, 2, this.getValue(1, 2) * -1);
            this.setValue(2, 1, this.getValue(2, 1) * -1);
            this.setValue(1, 1, this.getValue(2, 2));
            this.setValue(2, 2, temp);
        }
        // 3x3 or more Matrices
        else if (this.rows >= 3) {
            const temp = this.clone().reset();
            this.loop(({ i, j, reduce, sign }) => {
                temp.setValue(i, j, reduce().determinate * sign)
            }).copyOf(temp.transpose());
        }

        return this;
    }

    identity() {
        const m = this;
        if (!m.isSquare) throw new Error('must be a square matrix');
        const n = m.rows;
        const i = new Matrix2D(n, n);
        for (let a = 1; a <= n; a++) {
            i.setValue(a, a, 1);
        }
        return i;
    }

    reduce(r, c) {
        this.removeRow(r).removeColumn(c);
        return this;
    }

    generateArray(r = 3, c = 3, i = 0) {
        return Array(r).map(r => Array(c).map(c => i));
    };

    vectorDotProduct(a, b) {
        if (a.length !== b.length) throw new Error(`length of 'a' not equal length of 'b'`);
        return a.map((x, i) => x * b[i]).reduce((a, b) => a + b);
    }

    //
    // Matrices de transformación de coordenadas.
    // Pueden multiplicarse por un vector para transformar o entre sí para obtener composiciones.

    //
    // Sección 2D (XY)
    traslacion2D(punto) {
         // solve
        return new Matrix2D(2, 2, 1);
    }

    rotacion2DOrigen(phi) {
        let result = new Matrix2D(2, 2, 1);
        result.setRow([Math.cos(phi), -Math.sin(phi)]);
        result.setRow([Math.cos(phi), -Math.sin(phi)]);
        return result;
    }

    rotacion2DPunto(phi, centro) {
        return new Matrix2D(2, 2, 1); // solve
    }

    //
    // Sección 3D (XYZ)
    rotacion3DEjeX(phi) { // to rev
        let result = new Matrix2D(2, 2, 1);
        result.setRow([1, 0, 0]);
        result.setRow([0, Math.cos(phi), -Math.sin(phi)]);
        result.setRow([0, Math.sin(phi), Math.cos(phi)]);
        return result;
    }

    rotacion3DEjeY(phi) { // to rev
        let result = new Matrix2D(2, 2, 1);
        result.setRow([Math.cos(phi), 0, Math.sin(phi)]);
        result.setRow([0, 1, 0]);
        result.setRow([-Math.sin(phi), 0, Math.cos(phi)]);
        return result;
    }

    rotacion3DEjeZ(phi) { // to rev
        let result = new Matrix2D(2, 2, 1);
        result.setRow([Math.cos(phi), -Math.sin(phi), 0]);
        result.setRow([Math.sin(phi), Math.cos(phi), 0]);
        result.setRow([0, 0, 1]);
        return result;
    }

    rotacion3DEjeArbirtario(vec, phi) { // to rev
        let result = new Matrix2D(2, 2, 1);
        let u = vec.unitary;
        result.setRow([Math.cos(phi) + Math.pow(u.x, 2) * (1 - Math.cos(phi)), u.x * u.y * (1 - Math.cos(phi)) - u.z * Math.sin(phi), u.x * u.z * (1 - Math.cos(phi)) - u.y * Math.sin(phi)]);
        result.setRow([u.y * u.x * (1 - Math.cos(phi)) - u.z * Math.sin(phi), Math.cos(phi) + Math.pow(u.y, 2) * (1 - Math.cos(phi)), u.y * u.z * (1 - Math.cos(phi)) - u.x * Math.sin(phi)]);
        result.setRow([u.z * u.x * (1 - Math.cos(phi)) - u.y * Math.sin(phi), u.z * u.y * (1 - Math.cos(phi)) - u.x * Math.sin(phi), Math.cos(phi) + Math.pow(u.z, 2) * (1 - Math.cos(phi))]);
        return result;
    }

    //
    // Sección 4D (XYZ) Cuaterniones (Revisar contra los documentos del profesor Hektor).
    // Se introduce una nueva columna para comprender a la traslación como una nueva transformación.
    traslacion4D(punto) {
        let result = new Matrix2D(2, 2, 1); // rev
        result.setRow([1, 0, 0, punto.x]);
        result.setRow([0, 1, 0, punto.y]);
        result.setRow([0, 0, 1, punto.z]);
        result.setRow([0, 0, 0, 1]);
        return result;
    }

    // También se le llama escalado
    homotecia4D(prop) {
        let result = new Matrix2D(2, 2, 1);
        let u = prop.unitary;
        result.setRow([u.x, 0, 0, 0]);
        result.setRow([0, u.y, 0, 0]);
        result.setRow([0, 0, u.z, 0]);
        result.setRow([0, 0, 0, 1]);
        return result;
    }

    rotacion4DEjeX(phi) {
        let result = new Matrix2D(2, 2, 1);
        result.setRow([1, 0, 0, 0]);
        result.setRow([0, Math.cos(phi), -Math.sin(phi), 0]);
        result.setRow([0, Math.sin(phi), Math.cos(phi), 0]);
        result.setRow([0, 0, 0, 1]);
        return result;
    }

    rotacion4DEjeY(phi) {
        let result = new Matrix2D(2, 2, 1);
        result.setRow([Math.cos(phi), 0, Math.sin(phi), 0]);
        result.setRow([0, 1, 0, 0]);
        result.setRow([-Math.sin(phi), 0, Math.cos(phi), 0]);
        result.setRow([0, 0, 0, 1]);
        return result;
    }

    rotacion4DEjeZ(phi) {
        let result = new Matrix2D(2, 2, 1);
        result.setRow([Math.cos(phi), -Math.sin(phi), 0, 0]);
        result.setRow([Math.sin(phi), Math.cos(phi), 0, 0]);
        result.setRow([0, 0, 1, 0]);
        result.setRow([0, 0, 0, 1]);
        return result;
    }

    rotacion4DEjeArbirtario(vec, phi) { // to rev
        let result = new Matrix2D(2, 2, 1);
        let u = vec.unitary;
        result.setRow([Math.cos(phi) + Math.pow(u.x, 2) * (1 - Math.cos(phi)), u.x * u.y * (1 - Math.cos(phi)) - u.z * Math.sin(phi), u.x * u.z * (1 - Math.cos(phi)) - u.y * Math.sin(phi)]);
        result.setRow([u.y * u.x * (1 - Math.cos(phi)) - u.z * Math.sin(phi), Math.cos(phi) + Math.pow(u.y, 2) * (1 - Math.cos(phi)), u.y * u.z * (1 - Math.cos(phi)) - u.x * Math.sin(phi)]);
        result.setRow([u.z * u.x * (1 - Math.cos(phi)) - u.y * Math.sin(phi), u.z * u.y * (1 - Math.cos(phi)) - u.x * Math.sin(phi), Math.cos(phi) + Math.pow(u.z, 2) * (1 - Math.cos(phi))]);
        return result;
    }

}
