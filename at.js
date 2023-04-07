class Atom {
    // El neutrón tiene una masa de 939,56563 MeV/c², un 0,14% mayor que la masa del protón (938,27231 MeV/c²)
    // y unas 1839 veces mayor que la masa del electrón (0,51099906 MeV/c²). La diferencia de masas entre
    // el neutrón y el protón es de 2,53 veces la masa del electrón.9 abr 2015
    static particula(nombre, simbolo, masa_MeV_sobre_cc, carga_e_minus, spin, life_seconds) {
        return {
            nombre: nombre,
            symbol: simbolo,
            mass: masa_MeV_sobre_cc,
            charge: carga_e_minus,
            spin: spin,
            life: life_seconds
        }
    }

    static particulas = [Atom.particula("neutrón", "N", 939.56563, 1, 0, 900), Atom.particula("protón", "P", 938.27201323, 1, 1, Infinity), Atom.particula("electrón", "e", 0, 51099906, 1, 1 / 2, Infinity),]
    static magicNumbers = [2, 8, 20, 28, 50, 82, 126];
    static elements = [
        {Z: 1, N: 0, name: "Hidrógeno", symbol: "H", minN: 0, maxN: 6}, // n:1 Protio, n:2 Deuterio, n: 3 Tritio
        {Z: 1, N: 2, name: "Helio", symbol: "He", minN: 2, maxN: 8}, {
            Z: 1,
            N: 4,
            name: "Litio",
            symbol: "Li",
            minN: 1,
            maxN: 9
        }, // Mas o menos la idea pero cada isótopo tiene su nombre, propio peso específico, spin y semiperiodo e semidesintegración... ¿Qué hacer, mas campos al registro?
        // También algo que se llama: estabilidad, abundancia con respecto,
        {Z: 2, N: 2, name: "Berilio", symbol: "Be"}, {Z: 2, N: 3, name: "Boro", symbol: "Bo"}, {
            Z: 3,
            N: 3,
            name: "Carbono",
            symbol: "C"
        }, {Z: 3, N: 7, name: "Nitrógeno", symbol: "N"}, {Z: 4, N: 8, name: "Oxígeno", symbol: "O"}, {
            Z: 4,
            N: 10,
            name: "Fluor",
            symbol: "F"
        }, {Z: 5, N: 10, name: "Neón", symbol: "Ne"}, {Z: 5, N: 6, name: "Sodio", symbol: "Na"}, {
            Z: 6,
            N: 6,
            name: "Magnesio",
            symbol: "Mg"
        }, {Z: 6, N: 7, name: "Aluminio", symbol: "Al"}, {Z: 7, N: 7, name: "Silicio", symbol: "Si"}, {
            Z: 7,
            N: 8,
            name: "Fósforo",
            symbol: "P"
        }, {Z: 8, N: 8, name: "Azufre", symbol: "S"}, {Z: 8, N: 19, name: "Cloro", symbol: "Cl"}, {
            Z: 9,
            N: 22,
            name: "Argón",
            symbol: "Ar"
        }, {Z: 9, N: 10, name: "Potasio", symbol: "K"}, {Z: 10, N: 10, name: "Calcio", symbol: "Ca"}, {
            Z: 10,
            N: 11,
            name: "Escandio",
            symbol: "Sc"
        }, {Z: 10, N: 12, name: "Titanio", symbol: "Ti"}, {Z: 11, N: 12, name: "Vanadio", symbol: "V"}, {
            Z: 11,
            N: 13,
            name: "Cromo",
            symbol: "Cr"
        }, {Z: 12, N: 13, name: "Manganeso", symbol: "Mn"}, {Z: 12, N: 14, name: "Hierro", symbol: "Fe"}, {
            Z: 13,
            N: 14,
            name: "Cobalto",
            symbol: "Co"
        }, {Z: 13, N: 15, name: "Niquel", symbol: "Ni"}, {Z: 14, N: 15, name: "Cobre", symbol: "Cu"}, {
            Z: 14,
            N: 16,
            name: "Zinc",
            symbol: "Zn"
        }, {Z: 15, N: 39, name: "Galio", symbol: "Gs"}, {Z: 15, N: 17, name: "Germanio", symbol: "Ge"}, {
            Z: 15,
            N: 18,
            name: "Arsénico",
            symbol: "As"
        }, {Z: 16, N: 18, name: "Selenio", symbol: "Se"}, {Z: 16, N: 45, name: "Bromo", symbol: "Br"}, {
            Z: 17,
            N: 48,
            name: "Kriptón",
            symbol: "Kr"
        }, {Z: 17, N: 20, name: "Rubidio", symbol: "Rb"}, {Z: 18, N: 20, name: "Estroncio", symbol: "Sr"}, {
            Z: 18,
            N: 21,
            name: "Itrio",
            symbol: "Y"
        }, {Z: 19, N: 21, name: "Zirconio", symbol: "Zr"}, {Z: 19, N: 22, name: "Niobio", symbol: "Nb"}, {
            Z: 19,
            N: 23,
            name: "Molibdeno",
            symbol: "Mo"
        }, {Z: 20, N: 23, name: "Tecnecio", symbol: "Tc"}, {Z: 20, N: 24, name: "Rutenio", symbol: "Ru"}, {
            Z: 21,
            N: 24,
            name: "Rodio",
            symbol: "Rh"
        }, {Z: 21, N: 25, name: "Paladio", symbol: "Pd"}, {Z: 22, N: 25, name: "Plata", symbol: "Ag"}, {
            Z: 22,
            N: 26,
            name: "Cadmio",
            symbol: "Cd"
        }, {Z: 22, N: 27, name: "Indio", symbol: "In"}, {Z: 23, N: 27, name: "Estaño", symbol: "Sn"}, {
            Z: 23,
            N: 28,
            name: "Antimonio",
            symbol: "Sb"
        }, {Z: 24, N: 28, name: "Teluro", symbol: "Te"}, {Z: 24, N: 29, name: "Yodo", symbol: "I"}, {
            Z: 25,
            N: 77,
            name: "Xenón",
            symbol: "Xe"
        }, {Z: 25, N: 78, name: "Cesio", symbol: "Cs"}, {Z: 25, N: 31, name: "Bario", symbol: "Ba"}, {
            Z: 26,
            N: 31,
            name: "Lantano",
            symbol: "La"
        }, {Z: 26, N: 32, name: "Cerio", symbol: "Ce"}, {Z: 27, N: 32, name: "Praseodimio", symbol: "Pr"}, {
            Z: 27,
            N: 33,
            name: "Neodimio",
            symbol: "Nd"
        }, {Z: 28, N: 33, name: "Prometio", symbol: "Pm"}, {Z: 28, N: 34, name: "Samario", symbol: "Sm"}, {
            Z: 28,
            N: 35,
            name: "Europio",
            symbol: "Eu"
        }, {Z: 29, N: 35, name: "Gadolinio", symbol: "Gd"}, {Z: 29, N: 36, name: "Terbio", symbol: "Tb"}, {
            Z: 30,
            N: 36,
            name: "Disprosio",
            symbol: "Dy"
        }, {Z: 30, N: 37, name: "Holmio", symbol: "Ho"}, {Z: 30, N: 38, name: "Erbio", symbol: "Er"}, {
            Z: 31,
            N: 38,
            name: "Tulio",
            symbol: "Tm"
        }, {Z: 31, N: 39, name: "Iterbio", symbol: "Yb"}, {Z: 32, N: 39, name: "Lutecio", symbol: "Lu"}, {
            Z: 32,
            N: 40,
            name: "Hafnio",
            symbol: "Hf"
        }, {Z: 32, N: 41, name: "Tantalio", symbol: "Ta"}, {Z: 33, N: 41, name: "Wolframio", symbol: "W"}, {
            Z: 33,
            N: 42,
            name: "Renio",
            symbol: "Re"
        }, {Z: 34, N: 42, name: "Osmio", symbol: "Os"}, {Z: 34, N: 43, name: "Iridio", symbol: "Ir"}, {
            Z: 35,
            N: 43,
            name: "Platino",
            symbol: "Pt"
        }, {Z: 35, N: 44, name: "Oro", symbol: "Au"}, {Z: 35, N: 121, name: "Mercurio", symbol: "Hg"}, {
            Z: 36,
            N: 45,
            name: "Talio",
            symbol: "Tl"
        }, {Z: 36, N: 46, name: "Plomo", symbol: "Pb"}, {Z: 37, N: 46, name: "Bismuto", symbol: "Bi"}, {
            Z: 37,
            N: 47,
            name: "Polonio",
            symbol: "Po"
        }, {Z: 37, N: 48, name: "Astato", symbol: "At"}, {Z: 38, N: 136, name: "Radón", symbol: "Rn"}, {
            Z: 38,
            N: 136,
            name: "Francio",
            symbol: "Fr"
        }, {Z: 39, N: 49, name: "Radio", symbol: "Ra"}, {Z: 39, N: 50, name: "Actinio", symbol: "Ac"}, {
            Z: 39,
            N: 51,
            name: "Torio",
            symbol: "Th"
        }, {Z: 40, N: 51, name: "Protactinio", symbol: "Pa"}, {Z: 40, N: 52, name: "Uranio", symbol: "U"}, {
            Z: 41,
            N: 52,
            name: "Neptunio",
            symbol: "Np"
        }, {Z: 41, N: 53, name: "Plutonio", symbol: "Pu"}, {Z: 41, N: 54, name: "Americio", symbol: "Am"}, {
            Z: 42,
            N: 54,
            name: "Curio",
            symbol: "Cm"
        }, {Z: 42, N: 55, name: "Berkelio", symbol: "Bk"}, {Z: 43, N: 55, name: "Californio", symbol: "Cr"}, {
            Z: 43,
            N: 56,
            name: "Einstenio",
            symbol: "Es"
        }, {Z: 43, N: 57, name: "Fermio", symbol: "Fm"}, {Z: 44, N: 57, name: "Mendelevio", symbol: "Md"}, {
            Z: 44,
            N: 58,
            name: "Nobelio",
            symbol: "No"
        }, {Z: 45, N: 149, name: "Laurencio", symbol: "Lr", minN: 149, maxN: 163}, {
            Z: 157,
            N: 59,
            name: "Rutherfordio",
            symbol: "Rf"
        }, {Z: 157, N: 60, name: "Dubnio", symbol: "H"}, {Z: 156, N: 60, name: "Seaborgio", symbol: "Sg"}, {
            Z: 155,
            N: 61,
            name: "Bohrio",
            symbol: "Bh"
        }, {Z: 157, N: 62, name: "Hassio", symbol: "Hs"}, {Z: 157, N: 62, name: "Meitnerio", symbol: "Mt"}, {
            Z: 161,
            N: 63,
            name: "Darmstadtio",
            symbol: "Ds"
        }, {Z: 161, N: 63, name: "Roentgenio", symbol: "Rg"}, {
            Z: 160,
            N: 64,
            name: "Copernicio",
            symbol: "Cn"
        }, {Z: 170, N: 65, name: "Nihonio", symbol: "Nh"}, {Z: 171, N: 65, name: "Flerovio", symbol: "Fl"}, {
            Z: 173,
            N: 66,
            name: "Moscovio",
            symbol: "Mc"
        }, {Z: 173, N: 66, name: "Livermorio", symbol: "Lv"}, {Z: 174, N: 67, name: "Teneso", symbol: "Ts"}, {
            Z: 175,
            N: 67,
            name: "Oganesón",
            symbol: "Og"
        }
    ];

    constructor(z, n) {
        // Arreglo de elementos químicos
        this._Z = z;
        this._N = n;
    }

    get Z() {
        return this._Z;
    }

    set Z(v) {
        this._Z = v;
    }

    get N() {
        return this._N;
    }

    set N(v) {
        this._N = v;
    }

    get A() {
        return this.Z + this.N;
    }

    set A(v) {
        let locatedel = Atom.elements.findIndex((element) => element.Z + element.N === v);
        if (locatedel !== -1) {
            this._Z = Atom.elements[locatedel].Z;
            this._N = Atom.elements[locatedel].N;
        } else {
            throw new Error(`No está registrado el elemento químico (A = ${this.A}).`);
        }
    }

    get name() {
        let locatedel = Atom.elements.findIndex((element) => element.Z === this.Z);
        if (locatedel !== -1) {
            return Atom.elements[locatedel].name;
        } else {
            throw new Error(`No está registrado el elemento químico (A = ${this.A}).`);
        }
    }

    get symbol() {
        let locatedel = Atom.elements.findIndex((element) => element.Z === this.Z);
        if (locatedel !== -1) {
            return Atom.elements[locatedel].symbol;
        } else {
            throw new Error(`No está registrado el elemento químico (A = ${this.A}).`);
        }
    }

    private_z_estimated(a) {
        return Math.round(a / (1.98 + 0.015 * (Math.pow(a, 2 / 3))));
    }

    tieneExcesoDeProtones() {
        let normal_z = this.private_z_estimated(this.A);
        return (this.Z > normal_z);
    }

    tieneExcesoDeNeutrones() {
        let normal_z = this.private_z_estimated(this.A);
        return (this.Z < normal_z);
    }

    fisible() {
        return Math.pow(this.Z, 2) / this.A > 47;
    }

    estabilidad() {
        if (Atom.magicNumbers.indexOf(this.Z) !== -1 || Atom.magicNumbers.indexOf(this.N) !== -1) return true;
        if (this.Z <= 20 && Math.round(this.N / this.Z) === 1) return true; // revisar, creo que está bien redondeando
        if (this.Z > 20 && this.Z < 84 && Math.round(this.N / this.Z) >= 1 && Math.round(this.N / this.Z) <= 1.5) return true; // revisar, creo que está bien redondeando
        // Otros criterios
        // Los núcleos con Z menor a 82 son más estables que los que tienen Z mayor a 82.
        // Todos los núcleos con números de nucleones pares son más estables que los impares.
    }

    // radio del núcleo atómico en metros (sus dimensiones son de 10^-15 a 10^-14 metros).
    radio() {
        let ro = 1.25e-15; // Varía desde 1.25 a ± 0.2 fm, en función del peso específica de los núclidos.
        return ro * Math.pow(this.A, 1 / 3);
    }

    // densidad de carga a una distancia r del centro del núcleo
    densidad_de_carga(r) {
        // es aproximadamente constante hasta la distancia de su radio medio y luego decae rápidamente hasta prácticamente 0
        let ams = 10e-10; // 1  Å = 10^-10 m
        return this.Z / (1 + Math.exp((r - this.radio()) / (0.228 * ams)));
    }

    // Lo normal que pueden ocurrirle
    emitirParticulaAlfa() {
        this.Z = this.Z - 2;
        this.N = this.N - 2;
    }

    desintegracionBetaMenos() {
        throw new Error("Esta desintegración solamente puede ocurrir en neutrones libres.");
        this.Z = this.Z + 1;
        this.N = this.N - 1; // N -> P, e-, ve, en neutrones libres en 885.7(8) segundos
    }

    desintegracionBetaMas() {
        this.Z = this.Z - 1;
        this.N = this.N + 1; // P -> N, e+, ve, (decae un protón, emite un positrón y aumenta en un neutrón).
    }

    // Transformaciones nucleares comunes

    // Desintegraciones típicas
    //  cadena del torio,
    //  neptunio,
    //  urario 238 y
    //  uranio 235)

    // Fisión
    //  Escisión

    // Fusión
    // Procesos de nucleosíntesis estelar
    //  Proceso CNO (ciclo carbono-nitrógeno-oxigeno)
    //  Proceso pp (1, 2 , 3 y 4)
    //  Proceso pep
    //  Proceso triple alfa
    // Fusión autosostenida (Lo que ocurre en en Sol y las estrellas)
    //  Combustión del carbono
    //  Oxígeno
    //  Neón
    //  Silicio
    // Producción de elementos más pesados que el hierro:
    //   Absorción de neutrones
    //   Activación de neutrones
    //   El proceso s
    //   El proceso r


}

class EssayTube { }
