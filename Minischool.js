class Alumno {
  constructor(nombre, grado, grupo, numero) {
    this.nombre = nombre;
    this.grado = grado;
    this.grupo = grupo;
    this.numero = numero;
  }
}

class Profesor {
  constructor(nombre) {
    this.nombre = nombre;
    this.catedras = [];
  }

  agregarCatedra(catedra) {
    this.catedras.push(catedra);
  }
}

class Catedra {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Programa {
  constructor(asignatura) {
    this.asignatura = asignatura;
    this.objetivoGeneral = [];
    this.indicacionesGenerales = [];
    this.planTematico = [];
    this.planDeClases = [];
  }

  // Agregar métodos de manipulación para objetivoGeneral, indicacionesGenerales, planTematico y planDeClases
}

// Definición de asignaturas
class Asignatura {
  constructor(nombre, catedra = null) {
    this.nombre = nombre;
    this.contenidos = [];
  }

  agregarPrograma(programa) {
    this.programa = programa;
  }

  agregarContenido(contenido) {
    if (!this.programa) {
      this.programa = new Programa(this);
    }
    this.contenidos.push(contenido);
  }

  /* Sugerencia para ChatGPT:

     Los contenidos y objetivos deben que estan asociados a la asignatura
    para el grado en ese tipo de enseñanza en particular, deben aparecer en el programa
    y no en la clase Asignatura, por lo que debería implementarse
    un método de agregarPrograma() para agregarlos, y la lógica implementada en el
    método agregarContenido pasaría al la esctructura de la clase Programa, esta clase
    entre otras cosas, tiene los siguientes atributos:
    "Objetivo general de la asignatura" = [] (arreglo),
    "Indicaciones generales" = [] (arreglo de recomendaciones, para los profesores)
      Las recomendaciones a su vez, pueden ser de tres tipos:
        -"Indicaciones o directivas generales",
        -"Indicaciones o directivas del consejo",
        -"Orientaciones metodológicas",
    "Plan temático" = [] (arreglo de {unidades: string, objetivos : [], contenidos = [], horasClase : number, recomendaciones : null})
    (Es en el plan temático donde deberían aparecer los contenidos, también pueden aparecer recomendaciones)
    "Plan de clases" = [] (arreglo de clases a impartir, las clases son un tipo de objeto en el que no deben faltar los siguiente momentos o funciones didácticas:
     Puedes valorar la posibilidad de pasar algunos componentes a otra parte estructural.

        1º	Saludo.
        2º	Efemérides, información política u organizacional.
        3º	Unidad.
        4º	Tema (Temática, asunto)
        5º	Control de la asistencia (pase de lista y actualización del registro)
        6º	Objetivo (Define la función formativa {educativa}, instructiva y didáctica, debe estar expresada en la forma infinitivo del verbo, por ejemplo: lograr que, representar tal cosa, resolver, plantear, etc.) y se refiere a los estudiantes por supuesto; responde a: ¿para qué voy a dar la clase?
        7º	Tipo de clase (Tratamiento de la nueva materia, Consolidación, Ejercitación o Control).
        8º	Programas de la Revolución.
        9º	Líneas directrices (Idioma, Matemática, Formación de valores).
        10º	Método (Expositivo, trabajo independiente, problem(át)ico, instructivo final, explicativo-ilustrativo, ejercicios, demostrativo, elaboración conjunta, búsqueda heurística), responde a: ¿cómo voy a dar la clase?
        11º	Procedimiento. (Descripción lógica del proceso de enseñanza)
        12º	Bibliografía.
        13º	Programas directrices.
        14º	Higiene escolar
        15º	Componentes educativos.
        16º	Medios, responde a: ¿con qué voy a dar la clase?
        17º	Organización y control de la disciplina.
        18º	Revisión de la tarea individual, y resolución conjunta.
        19º	Aseguramiento del nivel de partida. Refresca los contenidos anteriores
        20º	Preparación para la nueva materia (motivación), plantea una situación “problémica”, es decir, que los estudiantes no puedan resolver con los conocimientos que tienen, se deben tener en cuenta los casos excepcionales o alumnos aventajados para no perder el flujo de la clase en caso de una respuesta inesperada y crearles un proceso para mantenerlos ocupados.
        21º	OHO (Orientación hacia los objetivos), los estudiantes deben saber que van a aprender o qué tienen que aprenderse.
        22º	Exposición (Introducción de la nueva “materia”, nuevos contenidos, conocimientos).
        23º	Orientación del trabajo a realizar.
        24º	Trabajo independiente bajo la dirección,
        25º	Atención diferenciada, (a deficientes y aventajados) en la clase.
        26º	Fijación (Resolución y explicación de los problemas planteados).
        27º	Comprobación, evaluación y control.
        28º	Conclusiones.
        29º	Orientación del trabajo independiente (tarea).
        30º	Despedida.
    )
   */

}

class Claustro {
  constructor() {
    this.profesores = [];
  }

  agregarProfesor(profesor) {
    this.profesores.push(profesor);
  }
}

class Grado {
  constructor(nombre, enseñanza = null) {
    this.nombre = nombre;
    this.grupos = [];
    this.enseñanza = enseñanza;
  }

  agregarGrupo(grupo) {
    this.grupos.push(grupo);
  }
}

class Grupo {
  constructor(nombre) {
    this.nombre = nombre;
    this.alumnos = [];
  }

  agregarAlumno(alumno) {
    this.alumnos.push(alumno);
  }
}

class Matricula {
  constructor() {
    this.grados = [];
  }

  agregarGrado(grado) {
    this.grados.push(grado);
  }
}

// Ejemplo de uso
const matricula = new Matricula();

// //////////////////////////////////////////////////////////////////////

class Facultad {
  constructor(nombre) {
    this.nombre = nombre;
    this.catedras = [];
  }

  agregarCatedra(catedra) {
    this.catedras.push(catedra);
  }
}

class TipoEnsenanza {
  constructor(nombre) {
    this.nombre = nombre;
    this.facultades = [];
  }

  agregarFacultad(facultad) {
    this.facultades.push(facultad);
  }
}

// Esta clase servirá para definir momentos específicos dentro de una clase, como saludos, efemérides, etc.


class Momento {
  constructor(titulo, descripcion) {
    this.titulo = titulo;
    this.descripcion = descripcion;
  }
}

// La clase Actividad representará una actividad específica dentro de la clase, con un objetivo y un método asociado.

class Actividad {
  constructor(objetivo, tipo, metodo) {
    this.objetivo = objetivo;
    this.tipo = tipo;
    this.metodo = metodo;
    this.procedimiento = null; // Describe cómo se llevará a cabo
  }

  definirProcedimiento(procedimiento) {
    this.procedimiento = procedimiento;
  }
}

// Estructura didáctica de la clase
class Clase {
  constructor(unidad, tema) {
    this.saludo = new Momento('Saludo', '');
    this.efemerides = new Momento('Efemérides', '');
    this.unidad = unidad;
    this.tema = tema;
    this.asistencia = new Momento('Control de asistencia', '');
    this.objetivo = ''; // Deberá ser definido con verbos en infinitivo
    this.tipoClase = ''; // Nuevo material, consolidación, etc.
    this.programasRevolucion = []; // Puede ser insertado directamente o a través de métodos
    this.lineasDirectrices = [];
    this.metodo = ''; // Expositivo, etc.
    this.procedimiento = '';
    this.bibliografia = [];
    this.programasDirectrices = []; // Especiales para la clase
    this.higieneEscolar = new Momento('Higiene escolar', '');
    this.componentesEducativos = [];
    this.medios = [];
    this.organizacionDisciplina = new Momento('Organización y control de la disciplina', '');
    this.revisionTareas = new Momento('Revisión de tareas', '');
    this.nivelPartida = new Momento('Aseguramiento del nivel de partida', '');
    this.preparacionMateria = new Momento('Preparación para la materia nueva', '');
    this.OHO = ''; // Orientación hacia los objetivos
    this.exposicion = new Momento('Exposición de nuevo contenido, siguiendo un orden lógico', '');
    this.orientacionTrabajo = new Momento('Orientación del trabajo a realizar', '');
    this.trabajoIndependiente = new Actividad('', '', '');
    this.atencionDiferenciada = new Actividad('', '', '');
    this.fijacion = new Actividad('', '', '');
    this.comprobacion = new Actividad('', '', '');
    this.conclusiones = new Momento('Conclusiones', '');
    this.tareaIndependiente = new Momento('Orientación de tarea independiente', '');
    this.despedida = new Momento('Despedida', '');

    // Qué actividades se realizarán en cada tipo de clase
    this.actividadesPorTipo = {
      'Tratamiento de nueva materia': [],
      'Consolidación': [],
      'Ejercitación': [],
      'Control': [],
    };
  }

  // Métodos para manipular los componentes de la clase
  // Como agregar programas de la Revolución, línea directriz, bibliografía, etc.
}

// Crear facultades
const facultadHumanidades = new Facultad('Humanidades');
const facultadCienciasSociales = new Facultad('Ciencias Sociales');
const facultadCienciasExactas = new Facultad('Ciencias Exactas');
const facultadCienciasNaturales = new Facultad('Ciencias Naturales');

// Agregar cátedras a las facultades
facultadHumanidades.agregarCatedra(catedraLiteratura);
facultadCienciasSociales.agregarCatedra(catedraHistoria);
facultadCienciasExactas.agregarCatedra(catedraMatematicas);
facultadCienciasNaturales.agregarCatedra(catedraBiologia);

// Crear tipos de enseñanza
const ensenanzaInfanciaPreescolar = new TipoEnsenanza('Enseñanza de la Primera Infancia y Preescolar');
const ensenanzaPrimaria = new TipoEnsenanza('Enseñanza Primaria');
const ensenanzaSecundaria = new TipoEnsenanza('Enseñanza Secundaria');
const ensenanzaPreuniversitaria = new TipoEnsenanza('Enseñanza Preuniversitaria');
const ensenanzaAdultos = new TipoEnsenanza('Enseñanza de Adultos');
const ensenanzaUniversitario = new TipoEnsenanza('Enseñanza Universitario');
const ensenanzaPostgrado = new TipoEnsenanza('Enseñanza de Postgrado');

// Agregar facultades a los tipos de enseñanza
ensenanzaPrimaria.agregarFacultad(facultadHumanidades);
ensenanzaSecundaria.agregarFacultad(facultadCienciasSociales);
ensenanzaUniversitario.agregarFacultad(facultadCienciasExactas);
ensenanzaUniversitario.agregarFacultad(facultadCienciasNaturales);

// Aquí los grados

// Agregar grados y grupos
// grados de la enseñanza

// Pre escolar
const circuloInfantil = new Grado('Pre escolar', ensenanzaInfanciaPreescolar);
const preEscolar = new Grado('Pre escolar', ensenanzaInfanciaPreescolar);
// Primaria
const primerGrado = new Grado('Primer Grado', ensenanzaPrimaria);
const segundoGrado = new Grado('Segundo Grado', ensenanzaPrimaria);
const tercerGrado = new Grado('Tercer Grado', ensenanzaPrimaria);
const cuartoGrado = new Grado('Cuarto Grado', ensenanzaPrimaria);
const quintoGrado = new Grado('Quinto Grado', ensenanzaPrimaria);
const sextoGrado = new Grado('Sexto Grado', ensenanzaPrimaria);
// Secundaria
const septimoGrado = new Grado('Séptimo Grado', ensenanzaSecundaria);
const octavoGrado = new Grado('Octavo Grado', ensenanzaSecundaria);
const novenoGrado = new Grado('Noveno Grado', ensenanzaSecundaria);
// Pre universitaria
const decimoGrado = new Grado('Décimo Grado', ensenanzaPreuniversitaria);
const undecimoGrado = new Grado('Undécimo Grado', ensenanzaPreuniversitaria);
const duodecimoGrado = new Grado('Duodécimo Grado', ensenanzaPreuniversitaria);
// Universitaria, superior, técnica o profesional
const primerAñoUniversidad = new Grado('Primer año', ensenanzaUniversitario);
const segundoAñoUniversidad = new Grado('Segundo año', ensenanzaUniversitario);
const tercerAñoUniversidad = new Grado('Tercero año', ensenanzaUniversitario);
const cuartoAñoUniversidad = new Grado('Cuarto año', ensenanzaUniversitario);
const quintoAñoUniversidad = new Grado('Quinto año', ensenanzaUniversitario);
const sextoAñoUniversidad = new Grado('Sexto año', ensenanzaUniversitario);


const grupoA = new Grupo('A');
const grupoB = new Grupo('B');

const alumno1 = new Alumno('Alumno 1', primerGrado, grupoA, 1);
const alumno2 = new Alumno('Alumno 2', primerGrado, grupoB, 1);

grupoA.agregarAlumno(alumno1);
grupoB.agregarAlumno(alumno2);

primerGrado.agregarGrupo(grupoA);
primerGrado.agregarGrupo(grupoB);

matricula.agregarGrado(primerGrado);
matricula.agregarGrado(segundoGrado);

// Agregar profesores, catedras y claustro
const catedraMatematicas = new Catedra('Matemáticas');
const catedraCiencias = new Catedra('Ciencias');

const profesorA = new Profesor('Profesor A');
const profesorB = new Profesor('Profesor B');

profesorA.agregarCatedra(catedraMatematicas);
profesorB.agregarCatedra(catedraCiencias);

const claustro = new Claustro();
claustro.agregarProfesor(profesorA);
claustro.agregarProfesor(profesorB);

// Acceder a la información jerárquica
console.log('Información de Matrícula:', matricula);
console.log('Información de Claustro:', claustro);

// Puedes seguir expandiendo esta estructura según tus necesidades específicas.

// Creación de asignaturas
const asignaturaMatematica = new Asignatura('Matemática');
const asignaturaEspanolLiteratura = new Asignatura('Español-Literatura');
const asignaturaFisica = new Asignatura('Física');
const asignaturaBiologia = new Asignatura('Biología');
const asignaturaHistoria = new Asignatura('Historia');
const asignaturaEducacionCivica = new Asignatura('Educación Cívica');
const asignaturaEducacionFisica = new Asignatura('Educación Física');
// Agregar más asignaturas según sea necesario

// Agregar asignaturas a las cátedras
catedraMatematica.agregarAsignatura(asignaturaMatematica);
catedraLiteratura.agregarAsignatura(asignaturaEspanolLiteratura);
catedraBiologia.agregarAsignatura(asignaturaBiologia);
catedraHistoria.agregarAsignatura(asignaturaHistoria);
// Agregar más asignaturas a las cátedras según sea necesario


