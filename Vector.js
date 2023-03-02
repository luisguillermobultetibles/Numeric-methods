// basado en una vieja idea con algunas interfaces de https://gist.github.com/jjgrainger
class Vector extends WebSystemObject {
    constructor(...components) {
        super();
        this.dimmensions = [];
        this.kind = "planar";
        if (arguments.length > 0) {
            if (arguments[0] instanceof Array) {
                this.dimmensions = arguments[0]; // done
            } else if (arguments[0] instanceof String || typeof arguments[0] === "string") {
                this.asString = components; // done
            } else {
                this.dimmensions = arguments; // done
            }
        }
    }

    // Número de dimensiones u orden del vector
    get order() {
        return this.dimmensions.length;
    }

    set order(order) {
        this.dimmensions.length = order;
    }

    // The obvious
    get coords() {
        return this.dimmensions;
    }

    set coords(d) {
        this.dimmensions = d;
    }

    // alias for dommensions components
    get x() {
        return this.dimmensions[0];
    }

    set x(x) {
        this.dimmensions[0] = x;
    }

    get y() {
        return this.dimmensions[1];
    }

    set y(y) {
        this.dimmensions[1] = y;
    }

    get z() {
        return this.dimmensions[2];
    }

    set z(z) {
        this.dimmensions[2] = z;
    }

    get t() {
        return this.dimmensions[3];
    }

    set t(t) {
        this.dimmensions[3] = t;
    }

    // return the angle of the vector in radians
    get direction() {
        if (this.order >= 2) {
            return Math.atan2(this.y, this.x);
        }
        return 0;
    };

    // set the direction of the vector in radians
    set direction(angle) {
        if (this.order >= 1) {
            if (this.order >= 2) {
                this.x = Math.cos(angle) * this.magnitude;
                this.y = Math.sin(angle) * this.magnitude;
                return Math.atan2(this.y, this.x);
            }
            return Math.sign(this.x) * 2 * Math.PI;
        }
    };

    // get the elevation of the second point of vector, respect the first
    get elevation() {
        let shadowSquare = this.x * this.x + this.y + this.y;
        return Math.sqrt(Math.pow(this.norm, 2) - shadowSquare);
    };

    // set the elevation of the ... keeping the direction.
    set elevation(elevation) {
        this.norm = Math.sqrt(this.norm * this.norm - this.elevation * this.elevation + elevation * elevation)
    };

    // get the elevation of the second point of vector, respect the first
    get colattitude() {
        return Math.PI / 2 - this.elevation;
    };

    // set the elevation of the ... keeping the direction.
    set colattitude(colattitude) {
        this.elevation = colattitude - Math.PI / 2;
    };

    // Module, length, or magnitude of vector (in spanglish: number of dimmensions).
    get norm() {
        let catetsSquares = 0;
        this.dimmensions.forEach(component => catetsSquares += component * component);
        return Math.sqrt(catetsSquares);
    };

    // set the magnitude of the vector
    set norm(module) {
        let before = this.norm;
        this.dimmensions = this.dimmensions.map(component => component * module / before);
    };

    // common alias
    get magnitude() {
        return this.norm;
    }

    set magnitude(module) {
        this.norm = module;
    };

    get module() {
        return this.norm;
    }

    set module(module) {
        this.norm = module;
    };

    // en of alias


    get asString() {
        return "(" + [...this.dimmensions].join(", ") + ")";
    };

    set asString(v) {
        let tmp = String(v).trim();
        if (tmp.length < 2 || (tmp.length > 2 && tmp[0] !== "(" && tmp[tmp.length - 1] !== ")")) {
            throw new Error(`"${v}", do not looks alike a vector, don't seems to me.`);
        } else {
            tmp = tmp.replaceAll(" ", "");
            let elementos = tmp.substring(1, tmp.length - 1).split(",");
            this.dimmensions = [].concat(elementos.map(x => Number(x)));
        }
    }

    get asObject() {
        let result = {};
        if (this.order >= 1) {
            if (this.kind === "geographical") {
                result["lon"] = this.x;
            } else {
                result["x"] = this.x;
            }
        }
        if (this.order >= 2) {
            if (this.kind === "geographical") {
                result["lat"] = this.y;
            } else {
                result["y"] = this.y;
            }
        }
        if (this.order >= 3) {
            if (this.kind === "geographical") {
                result["alt"] = this.z;
            } else {
                result["z"] = this.z;
            }
        }
        if (this.order >= 4) {
            result["t"] = this.t;
        }
        if (this.order > 4) {
            for (let index = 0; index < this.order; index++) {
                result["d" + (index + 1).toFixed(0)] = this.dimmensions[index];
            }
        }
        return result;
    };

    set asObject(o) {
        let result = {};
        for (const key in o) {
            if (key === "lat" || key === "latitude" || key === "lon" || key === "longitude" || key === "alt" || key === "altitude") {
                this.kind = "geographical";
            }
            if (o.hasOwnProperty(key)) {
                this.setComponent(key, o[key]);
            }
        }
    };

    isD(n) {
        return this.order === n;
    }

    is2D() {
        return this.order === 2;
    }

    is3D() {
        return this.order === 3;
    }

    clone() {
        return new Vector(...this.dimmensions);
    }

    // get components by argument
    getComponent(name) {
        switch (name) {
            case "lon":
            case "longitude":
            case "x":
                return this.x;
            case "lat":
            case "lattitude":
            case "y":
                return this.y;
            case "z":
                return this.z;
            case "t":
                return this.t;
            default: {
                if (name.length < 2 || (name.length >= 2 && name[0] !== "d")) {
                    let result = this.dimmensions[Number(name.substring(1))];
                    return result ? result : 0;
                }
            }
        }
    }

    // for monday: need to rotate a point, (and whena i said a point, i meam: not a vector) over a multidimensional axis

    // need to know indexed properties on javascript
    setComponent(name, value) {
        switch (name) {
            case "lon": {
                this.x = value;
                this.kind = "geographical";
                return
            }
            case "longitude": {
                this.x = value;
                this.kind = "geographical";
                return
            }
            case "lat": {
                this.y = value;
                this.kind = "geographical";
                return
            }
            case "latitude": {
                this.y = value;
                this.kind = "geographical";
                return
            }
            case "x": {
                this.x = value;
                return
            }
            case "y": {
                this.y = value;
                return
            }
            case "alt": {
                this.z = value;
                this.kind = "geographical";
                return
            }
            case "z": {
                this.z = value;
                return
            }
            case "t": {
                this.t = value;
                return
            }
            default: {
                if (name.length < 2 || (name.length >= 2 && name[0] !== "d")) {
                    this.dimmensions[Number(name.substring(1))] = value;
                }
            }
        }
    }

    // return unitary vector, same direction but module equals 1.
    unitary() {
        let result = this.clone();
        if (result.module === 0) {
            console.log("Warning: the vector is null, probably cannot identify a direction.");
        }
        return this.division(this.module);
    }

    // As point abstraction: return the distance % me and 2nd component of a given one.
    distance(anotherVector, vectorialSpace = null) {
        let metric;
        if (!vectorialSpace) { // Métrica (o norma) euclidiana si no se especifica alguna otra.
            metric = (p1, p2) => {
                let result = 0;
                for (let i = 0; i < Math.min(p1.order, p2.order); i++) {
                    result += Math.pow(p1.dimmensions[i] - p2.dimmensions[i], 2);
                }
                return Math.sqrt(result);
            }
        } else {
            metric = vectorialSpace.metric;
        }
        return metric(this, anotherVector);
    }

    // this is the angle with another vector .
    angle(anotherVector) {
        // Ley de los cosenos c¹ = a² + b² - 2ab cos α
        let a_normal = this.unitary();
        let b_normal = anotherVector.unitary();
        let c_normal = a_normal.distance(b_normal);
        // than a = 1, b = 1, c is above module
        return Math.acos((2 - Math.pow(c_normal.module * c_normal.module, 2)) / 2);
        // Otra forma de encontrar el ángulo entre dos vectores mediante el producto escalar,
        // igual por definición a: |a|·|b| cos α = ∑ (i = 1 to n) ai · bi, de allí que
        // cos α = [ ∑ (i = 1 to n) ai · bi ]  / [ |a|·|b| ]
        // por tanto α = Acos([ ∑ (i = 1 to n) ai · bi ]  / [ |a|·|b| ])
        // as is showed in the next item
    }

    // Producto escalar (igual por definición a: A × Β = | A | | B | Cos θ).
    dotProduct({components}) {
        return components.reduce((acc, component, index) => acc + component * this.component[index], 0);
    }

    /* todo Producto cruzado, A × Β = | A | | B | Sin θ
       El resultado es otra cantidad vectorial. El vector resultante es perpendicular a ambos vectores.
       Su dirección se puede determinar utilizando la regla de la mano derecha.
       Se deben considerar las siguientes reglas al calcular el producto cruzado:

            i × j = k
            J × k = i
            k × i = j

        Donde i, j y k son los vectores unitarios en las direcciones x, y y z, respectivamente.
     */
    crossProduct({components}) {
        return components.reduce((acc, component, index) => acc + component * this.component[index], 0);
    }

    // Solamente para vectores 3D, probar con este...
    crossProduct3D({components}) {
        return new Vector(this.component[1] * components[2] - this.component[2] * components[1], this.component[2] * components[0] - this.component[0] * components[2], this.component[0] * components[1] - this.component[1] * components[0])
    }

    haveSameDirectionWith(other, EPSILON = 0.00000001) {
        const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;
        const dotProduct = this.normalize().dotProduct(other.normalize());
        return areEqual(dotProduct, 1);
    }

    haveOppositeDirectionTo(other, EPSILON = 0.00000001) {
        const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;
        const dotProduct = this.normalize().dotProduct(other.normalize())
        return areEqual(dotProduct, -1);
    }

    isPerpendicularTo(other, EPSILON = 0.00000001) {
        const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;
        const dotProduct = this.normalize().dotProduct(other.normalize())
        return areEqual(dotProduct, 0);
    }

    // return the acimut of the vector in radians
    getAcimut() {
        if (this.order >= 2) {
            return Math.PI / 2 - Math.atan2(this.y, this.x);
        }
    };

    // set the acimut of the vector in radians
    setAcimut(angle) {
        let magnitude = this.magnitude;
        this.x = Math.cos(Math.PI / 2 - angle) * magnitude;
        this.y = Math.sin(Math.PI / 2 - angle) * magnitude;
    };

    // add two vectors together and return a new one
    addition(v2) {
        let result = this.clone();
        for (let i = 0; i < Math.min(this.order, v2.order); i++) {
            result.dimmensions[i] = this.dimmensions[i] + v2.dimmensions[i];
        }
        return result;
    };

    // subtract two vectors together and return a new one
    subtraction(v2) {
        let result = this.clone();
        for (let i = 0; i < Math.min(this.order, v2.order); i++) {
            result.dimmensions[i] = this.dimmensions[i] - v2.dimmensions[i];
        }
        return result;
    };

    // add a vector to this one
    additMe(v2) {
        for (let i = 0; i < Math.min(this.order, v2.order); i++) {
            this.dimmensions[i] = this.dimmensions[i] + v2.dimmensions[i];
        }
    };

    // subtract me a vectors
    subtractMe(v2) {
        for (let i = 0; i < Math.min(this.order, v2.order); i++) {
            this.dimmensions[i] = this.dimmensions[i] - v2.dimmensions[i];
        }
    };

    // multiply this vector by a scalar and return a new one
    multiplication(scalar) {
        let result = this.clone();
        for (let i = 0; i < this.order; i++) {
            result.dimmensions[i] *= scalar;
        }
        return result;
    };

    // multiply this vector by the scalar
    multiplyMe(scalar) {
        for (let i = 0; i < this.order; i++) {
            this.dimmensions[i] *= scalar;
        }
    };

    // scale this vector
    division(scalar) {
        let result = this.clone();
        for (let i = 0; i < this.order; i++) {
            result.dimmensions[i] /= scalar;
        }
        return result;
    };

    // scale this vector
    divideMe(scalar) {
        for (let i = 0; i < this.order; i++) {
            this.dimmensions[i] /= scalar;
        }
    };

    // opposite to this vector
    opposition(scalar) {
        let result = this.clone();
        for (let i = 0; i < this.order; i++) {
            result.dimmensions[i] = -this.dimmensions[i];
        }
        return result;
    };

    // oppose this vector
    opposeMe(scalar) {
        for (let i = 0; i < this.order; i++) {
            this.dimmensions[i] = -this.dimmensions[i];
        }
    };

    // probar
    avancePolar(direccion, pasos) {
        // Avanzar cierta cantidad de pasos Plano XY, en esa dirección (en grados).
        if (direccion instanceof Vector) {
            return this.avancePolar(this.angle(direccion), pasos);
        }
        this.x = this.x + pasos * Math.cos((direccion * Math.PI) / 180);
        this.y = this.y + pasos * Math.sin((direccion * Math.PI) / 180);
        return this;
    }

    // probar
    avanzarHacia(punto, pasos = 1, desviacion = 0) {
        // Avanzar cierta cantidad de pasos Plano XY, en esa dirección (en grados).
        let direccion = this.angle(punto) + desviacion;
        this.x = this.x + pasos * Math.cos((direccion * Math.PI) / 180);
        this.y = this.y + pasos * Math.sin((direccion * Math.PI) / 180);
        return this;
    }

    // probar
    alejarseDe(punto, pasos = 1, desviacion = 0) {
        // Avanzar cierta cantidad de pasos Plano XY, en esa dirección (en grados).
        let direccion = this.angle(punto) + desviacion;
        this.x = this.x + pasos * Math.cos((direccion * Math.PI) / 180);
        this.y = this.y + pasos * Math.sin((direccion * Math.PI) / 180);
        return this;
    }

    // Rotaciones en los tres ejes de coordenadas
    rotarEnEjeZ(angulo, centro = new Vector(0, 0, 0)) { // done, validated
        // Rotación en el plano XY (con eje Z).

        let ax = this.x - centro.x;
        let ay = this.y - centro.y;
        let az = this.z - centro.z;

        angulo = (angulo * Math.PI) / 180;
        let tmpx = ax * Math.cos(angulo) - ay * Math.sin(angulo);
        let tmpy = ax * Math.sin(angulo) + ay * Math.cos(angulo);
        let tmpz = az;

        this.x = tmpx + centro.x;
        this.y = tmpy + centro.y;
        this.z = tmpz + centro.z;

        return this;
    }

    // validar
    rotarEnEjeX(angulo, centro = new Vector(0, 0, 0)) {
        // Rotación en el plano ZY (con eje X).

        let ax = this.x - centro.x;
        let ay = this.y - centro.y;
        let az = this.z - centro.z;

        angulo = (angulo * Math.PI) / 180;
        let tmpx = ax;
        let tmpy = ay * Math.cos(angulo) - az * Math.sin(angulo);
        let tmpz = ay * Math.sin(angulo) + az * Math.cos(angulo);


        this.x = tmpx + centro.x;
        this.y = tmpy + centro.y;
        this.z = tmpz + centro.z;

        return this;
    }

    // validar
    rotarEnEjeY(angulo, centro = new Vector(0, 0, 0)) {
        // Rotación en el plano ZX (con eje Y).

        let ax = this.x - centro.x;
        let ay = this.y - centro.y;
        let az = this.z - centro.z;

        angulo = (angulo * Math.PI) / 180;
        let tmpy = ay;
        let tmpx = ax * Math.cos(angulo) + az * Math.sin(angulo);
        let tmpz = -ax * Math.sin(angulo) + az * Math.cos(angulo);

        this.x = tmpx + centro.x;
        this.y = tmpy + centro.y;
        this.z = tmpz + centro.z;

        return this;
    }

    // Rotación (tomando como eje cualquier vector)
    rotarEnEjeArbitrario(eje, angulo) {
        // Vectores canónicos...
        let ejeX = new Vector(1, 0, 0);
        let ejeY = new Vector(0, 1, 0);
        let ejeZ = new Vector(0, 0, 1);
        // Bastan dos, para qué el tercero (Rho es ángulo con eje z, y sita con eje x)
        let rho = ejeX.angle(eje);
        let sita = ejeY.angle(eje);
        // terminar
    }

}