// Modalidades ontológicas, deónticas, etc...

import {WebSystemObject} from './WebSystemObject';


// Definición de base de conocimientos
class Concept extends WebSystemObject {
  // Una representación o modelo mental de un objeto
  // TIPOS DE CONCEPTOS
  static conceptoSingular = 1;
  static conceptoGeneral = 2;

  constructor(name, type = Concept.conceptoGeneral) {
    super();
    this.nombre = name;
    this.tipo = type;
  }
}

// De las clases (nadie mas hereda de concepto, está cerrado para uso interno):
// Un concepto concreto (objeto)
class ConcreteObject extends Concept {
}

// Un concepto abstracto
class AbstractObject extends Concept {
}

// De los conceptos concretos:
// Una hipótesis
class Hypothesis extends ConcreteObject {
}

// Una tésis
class Thesis extends ConcreteObject {
}

// De los conceptos abstractos:
// Un objeto analitico (de lo general a lo particular), por ejemplo el concepto de número
class Analysis extends AbstractObject {
}

// Un objeto sintético o inducido (de lo particular a lo general), por ejemplo una cantidad, que no es lo mismo...
class Synthesis extends AbstractObject {
}

// Un objeto hipostático (abstracción que resulta de elevar una clase, relación o propiedad a calidad de objeto)
class Hypostasis extends AbstractObject {
}

// De los conceptos hipostáticos:
// Las propiedades
class Property extends Hypostasis {
  /*
      Las clases quedan descritas por las propiedades, es decir, lo que hace que una clase sea una clase, es la presencia
     o ausencia de determinada propiedad. y la forma en que se establece el cumplimiento de esta propiedad es lo que hace
     que la división de los conceptos sean dicótomos, especificadores, jerárquicos., etc.
    */
  constructor() {
    super(...arguments);
  }
}

// Las relaciones:
// Las relaciones se dividen en restricciones y condiciones
// Relaciones = Condiciones U Restricciones
class Relation extends Hypostasis {

  static Condition = class extends Relation {
    /*  Definición de Condición.
        Las condiciones reflejan la relación del objeto con los fenómenos que le rodean,
        sin los cuales no puede existir, a diferencia de la causa, que engendra directamente
        al objeto, la condición es el medio donde este puede surgir, las mismas pueden
        definirse matemáticamente en forma de relaciones que pueden o no cumplirse,
        mientras que las restricciones son relaciones que obligatoriamente han de hacerlo
        o no, es decir, definen la forma en que el objeto se relaciona; mientras una de
        ellas tiene forma inquisitiva la otra es imperativa; las condiciones y las
        restricciones son, a mi entender, los dos tipos especiales de relaciones.
    */
    constructor(name) {
      super();
      this.name = name;
    }
  };

  static Restriction = class extends Relation {
    constructor(name) {
      super();
      this.name = name;
    }
  };

  // Relation constructor
  constructor(name) {
    super();
    this.name = name;
  }

}

// Modalidades deónticas (outside Relation class)

// Polimórfica, debe heredar de Relation cuando se implemente
class DeonticModality extends Relation.Restriction {
  static RestrictionRelation = class extends DeonticModality {
  };
  static Prohibition = class extends DeonticModality.RestrictionRelation {
  };
  static Obligation = class extends DeonticModality.RestrictionRelation {
  };

  static PermissionRelation = class extends DeonticModality {
  };
  static Alternative = class extends DeonticModality.PermissionRelation {
  };
  static Option = class extends DeonticModality.PermissionRelation {
  };

  constructor(name) {
    super();
    this.name = name;
  }
}

// Las clases en sí ()
// Y en el límite de las clasificaciones, se encuentran las categorías...
// (Esto, entre otras cosas puede ayudar a evitar que la estructura de conceptos aumente desproporcionalmente, ver tipos de datos)
class Class extends Hypostasis {
  constructor() {
    super(...arguments);
  }
}

// De las propiedades (especiales), que representan comportamientos.
// los métodos que nos dicen cómo hacer algo, generalmente una función que puede o no (procedure ó void)
// devolver resultados, y que puede recibir parámetros.
class Method extends Property {
  constructor(nombre, codigo) {
    super();
  }
}

// Y los eventos, que son métodos con la particularidad de que están orientados a que el usuarios los invoque, sino que
// se generan (disparan) ante determinadas situaciones (condiciones internas o relaciones externas) del objeto con otros.
class Event extends Method {
  constructor(nombre, codigo, condicion) {
    super();
  }

  handler(informacion, propagacion) { // virtual
    /*
      la variable o parámetro información contiene los datos que generaron el evento... por ejemplo, el código de la tecla que se oprimió.
      Este es el manipulador (driver, chofer o handler) de la interrupción, es implementado por el usuario y es el que se ejecuta
      cada vez que se genera la actividad, la variable propagación me dice si es fue primero en atender.
      Y debe retornar true, para que se realice otra propagación...
      O false para que se termine la atención a la interrupción...
      */
  }

  stopPropagation(target) {
    target.stopPropagation();
  }
}

class AleatoryEvent extends Event {
  static solamenteimpredecible = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };
  static solamenteIrrelevante = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };
  static impredecibleIrrelevante = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };

  constructor() {
    super(...arguments);
  }

  constructor() {
    super(...arguments);
  }
}

class NonAleatoryEvent extends Event {
  static hechoNormal = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };
  static consecuenciaDisipativa = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };
  static variableOculta = class extends NonAleatoryEvent {
    constructor() {
      super(...arguments);
    }
  };

  constructor() {
    super(...arguments);
  }
}

// De las clases algunos oximorones

/*
*   Todos los animales que vuelan no son aves.
*   Algunos mamíferos y peces, lo hacen.
*   Todos los animales que viven el el mar, no son peces;
*   Por ejemplo, los delfines, pertenecen a la clase de los mamíferos.
*   Existe una excepción de los mamíferos que ponen huevos.
*   Los delfines, al igual que los homo sapiens, hacen el amor por placer.
*   No solamente para reproducirse.
*   Etc...
*
* */

// Los objetos hipostáticos (métodos y propiedades) tienen a su vez algunas propiedades especiales que les pueden ser comunes y los describen:
// por ejemplo: tienen visibilidad (privado, público), si son (concretos o abstractos) esto es, si ya están implementados
// o si el compilador o intérprete ya tiene resueltas las referencias a ellos desde el principio.

// Aquí comienza el capítulo de lógica, necesita análisis pues en algunos manuales las operaciones se consideran relaciones, también se debe armar el concepto de función... etc...

class Juicio extends Relation {
  // TIPOS DE ARGUMENTOS (Se usan poco, y van bien grandes porque son esenciales).
  static tipoJuicioLEY_AXIOMA_O_POSTULADO = 1; // Por ejemplo, las leyes de la robótica, las carta de derechos de las naciones unidas (exceptuando los vetos), luego la constitución de la república, las leyes que se derivan, las necesidades básicas personales, los estados de necesidad, sin intermedios y en ese orden., luego the user, then homo sapien, humano, nacido, cubano, vivo, por último, las tortugas, nosotros, los salvavidas y desarrolladores.
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_LA_SOCIEDAD_O_LA_COMUNIDAD_CIENTIFICA = 2;
  static tipoJuicioDEFINICION = 3;
  static tipoJuicioTEOREMA = 4;
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_EL_USUARIO = 5; // Que lo vió con estos ojos que tengo aquí...
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_OTROS_USUARIOS = 6; // Que fulano o mengano y sutano lo dijeron...
  static tipoJuicioHECHO_SINGULAR_CERTIFICADO_POR_OTROS_SISTEMAS = 7; // Que salió por tal periódico... (en todos caso siempre es bueno agregar una referencia al origen de la inf.)
  constructor() {
    super(...arguments);
  }
}


// TIPOS DE CUANTIFICADORES
const cuantificadorExiste = 1;			// Cuantificador existencial
const cuantificadorParaTodo = 2;	// ... universal

// TIPOS DE CÓPULAS (forma en que se relacionan dos o más conceptos) REVISA LAS NUEVAS...
const copulaObservacion = 1; // es una observación hecha a
const copulaDefinicion = 2; // es una definición de, equivale a la cópula es
const copulaDescripcion = 3; // es una descripción de
const copulaIdentidad = 4; // es idéntico a
const copulaEquilalencia = 5; // equivale a
const copulaContencion = 6; // contiene a (es un superconjunto de)
const copulaMuestra = 7; // es un ejemplo de (es una muestra de)
const copulaSignificado = 8; // significa según (en el caso de una relación ternaria) a segun b, significa c
const copulaPertenencia = 9; // pertenece a
const copulaContencion = 10; // está contenido en (es un subconjunto de)
const copulaSuperconcepto = 11; // es el concepto superior de (es el padre o superclase de)
const copulaSubconcepto = 12; // es un subconcepto de (es un hijo o subclase de)
const copulaQuedaDefinido = 13; // queda definido por
const copulaQuedaDescrito = 14; // queda descrito por
const copulaQuedaDemostrado = 15; // queda demostrado por (se ejemplifica en)
const copulaSinonimo = 16; // es sinónimo de
const copulaAntonimo = 17; // es antónimo de
const copulaFigurado = 18; // en un sentido figurado de

class Proposicion extends Juicio {
  // Proposición lógica
  // TIPOS DE PROPOSICIÓN
  static proposicionAtributiva = 1; // Se afirma o se niega que un objeto posee ciertas propiedades, estados o tipos de actividad, siguen el esquema: "S es P" o "S no es P". (la rosa es roja).
  static proposicionRelacional = 2; // Se refieren a las relaciones entre los objetos, siguen el esquema: "A R P" o "S no R P". ef (a > b, x=2, "el protón es mas pesado que el neutrón").
  static proposicionExistencial = 3; // Afirman o niegan la existencia de otros objetos (sucesos o fenómenos).
  constructor(
    nombre,
    tipo,
    texto,
    modo,
    argumento,
    fuente,
    cuantificador,
    sujeto,
    copula,
    predicado,
  ) {
    super();
    this.nombre = nombre;
    this.tipo = tipo;
    this.texto = texto; // La oración o frase a partir de la cual se construyó la proposición.
    this.valorDeVerdad = modo;
    this.argumento = argumento;
    this.fuente = fuente; // Referencia al documento, lugar, fecha u hora o persona, que confirme el argumento.
    this.cuantificador = cuantificador; // Cuantificador existencial
    this.conceptoSujeto = sujeto; // Aquí se espera un TConcepto (el objeto de la proposición)
    this.copula = copula; // Aquí se espera una cópula
    this.conceptoPredicado = predicado; // Aquí se espera otro TConcepto (lo que se dice del objeto)
  }

  /*
    Juicios universales
        .Afirmativo
        Todo a es b
        Todo a, b                               (con o sin coma)
        Para cada a, b                          (con o sin coma)
        Para cada a, existe b                   (con o sin coma)
        Cada a, b                               (con o sin coma)
        A cada a, b                             (con o sin coma)
        Todos los a son b
        A todos los a, b                        (con o sin coma)
        .Negativo
        No todo a es b
        No todos los a son b
    Juicios particulares
        .Afirmativo
        Existe un a que es b
        Existe un solo a que es b
        Existe un único a que es b
        Existe exactamente un a que es b
        Hay un a que es b
        Hay un solo a que es b
        Hay un único a que es b
        Tan solo un a es b
        .Negativo
        Ningún a es b
        Ningún a, b                             (con o sin coma)
        Nunguno de los a, b                     (con o sin coma)
        Nunguno de los a es b
        No existe un a que sea b                (existe, hay, se puede encontrar, se verifica, se halla, se cumple)
        No existe ni un solo a que sea b        (ni un solo, ni tan solo, ni un mero, ni un mísero)
        No existe ni un único a que sea b
        No existe ni siquiera un a que sea b
        Ni tan solo un a es b
        Ni tan solo un a, b                     (con o sin coma)
        Ni siquiera hay un a que b
        Ni siquiera hay un a que sea b
    Jucios singulares
        .Afirmativo
        a, b (con o sin coma)
        a es b
        a cumple b
        a cumple que b
        a se define como b
        la definición de a es b
        a significa b
        a quiere decir b
        el significado de a es b
        Este, tal, mas cual (pronombre) es b
        .Negativo
        a, no b (con o sin coma)
        a no es b
        a no cumple b
        a no cumple que b
        a no se define como b
        la definición de a no es b
        a no significa b
        a no quiere decir b
        el significado de a no es b
        Este, tal, algún, algunos, mas cual (pronombre) no es b

    Desde luego que todos las posiblidades deben quedar cubiertas por
    sistema de sinónimos y reconocimiento de patrones del español,
*/

  establecerValorDeVerdad(x) {
    this.valorDeVerdad = x;
    return x;
  }

  obtenerValorDeVerdad() {
    return this.valorDeVerdad;
  }

  negar() {
    // Negar el valor
    establecerValorDeVerdad(!obtenerValorDeVerdad());
    // también se niega el cuantificador
    if (this.cuantificador === cuantificadorExiste) {
      this.cuantificador = cuantificadorParaTodo;
    } else if (this.cuantificador === cuantificadorParaTodo) {
      this.cuantificador = cuantificadorExiste;
    }
  }

  esCierto() {
    return obtenerValorDeVerdad();
  }

  esFalso() {
    return !obtenerValorDeVerdad();
  }

  conjuncion(c) {
    var t = c;
    if (t instanceof Juicio) {
      t = c.obtenerValorDeVerdad();
    }
    return obtenerValorDeVerdad() && t;
  }

  y(c) {
    return conjuncion(c);
  }

  disyuncion(c) {
    var t = c;
    if (t instanceof Juicio) {
      t = c.obtenerValorDeVerdad();
    }
    return obtenerValorDeVerdad() || t;
  }

  o(c) {
    return disyuncion(c);
  }
}

// TIPOS DE VINCULO ENTRE LOS OPERADORES
const vinculoCasual = 1;
/*
El nexo entre a y b es puramente casual, entre ellos no hay una conexión evidente de causa-efecto, y al no convenir expresar la
operación en forma de implicación; no se aplican las inferencias: 4, 5, 6, 7, 8, 9 y 12,
*/
const vinculoNecesario = 2;
/*
El nexo entre a y b es necesario, entre ellos hay una conexión causa-efecto, y al convenir expresar la
operación en forma de implicación; pueden aplicarse las 20 formas de inferencia.
*/

// OPERACION LOGICA
class OperacionLogica extends Juicio {

  // TIPOS DE OPERACIONES LOGICAS
  static operacionIdentidad = 1;
  static operacionNegacion = 2;
  static operacionConjuncion = 3;
  static operacionDisyuncion = 4;

  constructor(tipoDeOperacion, argumentos, vinculo) {
    super();
    this.tipo = tipoDeOperacion;
    this.vinculo = vinculo;
    this.operadores = [];
    if (argumentos instanceof Array) {
      this.operadores.push(argumentos[0]);
      this.operadores.push(argumentos[1]);
    } else {
      this.operadores.push(argumentos);
    }
  }

  establecerValorDeVerdad(x) {
    switch (this.tipo) {
      case operacionIdentidad: {
        this.operadores[0].establecerValorDeVerdad(x);
      }
        break;
      case operacionNegacion: {
        this.operadores[0].establecerValorDeVerdad(!x);
      }
        break;
      case operacionConjuncion: {
        if (!x) {
          this.tipo = operacionDisyuncion; // Por la ley de Morgan
          this.operadores[0].negar();
          this.operadores[1].negar();
        }
      }
        break;
      case operacionDisyuncion: {
        if (!x) {
          this.tipo = operacionConjuncion; // Ídem
          this.operadores[0].negar();
          this.operadores[1].negar();
        }
      }
        break;
    }
  }

  obtenerValorDeVerdad() {
    switch (this.tipo) {
      case operacionIdentidad: {
        return this.operadores[0].obtenerValorDeVerdad();
      }
        break;
      case operacionNegacion: {
        return !this.operadores[0].obtenerValorDeVerdad();
      }
        break;
      case operacionConjuncion: {
        return (
          this.operadores[0].obtenerValorDeVerdad() &&
          this.operadores[1].obtenerValorDeVerdad()
        );
      }
        break;
      case operacionDisyuncion: {
        return (
          this.operadores[0].obtenerValorDeVerdad() ||
          this.operadores[1].obtenerValorDeVerdad()
        );
      }
        break;
    }
  }
}


class Oracion extends Relation {
  // TIPOS DE ORACIONES
  static tipoOracionEcunciativa = 1; // Se le puede asignar un valor de verdad
  static tipoOracionDeclarativa = 2; // Idem
  static tipoOracionImperativa = 3; // Manda (No tiene valor de verdad)
  static tipoOracionExhortativa = 3; // Idem
  static tipoOracionExclamativa = 4; // Tampoco tienen valor de verdad, tienen finalidad expresiva
  static tipoOracionInterrogativa = 5; // Tampoco... sirven para solicitar información.
  static tipoOracionDubitativa = 6; // Expresan una suposición o probabilidad.
  static tipoOracionOptativa = 7; // Expresan un deseo, se pueden pronunciar de forma exclamativa.
  static tipoOracionDesiderativa = 7; // Idem

  constructor(oracion) {
    super();
    this.oracion;
  }

  analizarOracion() {
    /*
            Esta función debe construir una proposición o juicio a partir del texto original de la oración, es decir:
            Sustantivo (o nombre del sujeto, si es necesario, construye el concepto)
            Adjetivo
            Artículo
            Pronombre
            Verbo
            Adverbio
            Interjección
            Preposición
            Conjunción

            algo así..., creo que se adecua bastante bien el siguiente modelo:
            La estructura de la gramática de una oración puede ser la siguiente:

            Sujeto
                Sujeto principal
                Frase preposicional
                Cláusula relativa
                    Verbo
                    Sujeto relativo
                    Frase preposicional
            Predicado
                Verbo
                Objeto principal
                Frase preposicional
                Cláusula relativa
                    Verbo
                    Sujeto relativo
                    Frase preposicional
               Frase adjetival (complemento directo)
               Frase adverbial (complemento indirecto)


        */
    this.sujeto = new Concept('tal', conceptoSingular);
    this.predicado = new Concept('masCual', conceptoGeneral);
    this.copula = copulaDefinicion;
  }
}

// Para el compilador




