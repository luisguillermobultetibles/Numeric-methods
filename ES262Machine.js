  class ES262Machine {

    // Luego, ahora no, pudieramos meter esto en una base de datos.
    operators = [
      // Part I: Design time (fundamentals: unificamos tabla de operadores y tabla de símbolos, definir gramática).
      //
      //      .tipos de tokens: _class
      //
      //      .'decl': De declaración: operador, variable, función, palabra reservada (ya en el diseño del lenguaje).
      //       CONTIENEN : campo _class a 'decl'
      //                   nombre, orden de precedencia, tipo de operador, etcétera
      //                   función de reconocimiento en código fuente,
      //                   funciones de creación (por transformación del código fuente), idem de modificación y destrucción en tabla de símbolos.
      //                   función de aplicación (y/o tratamiento de errores).
      //                   etc.
      //
      //      .'impl': De implementación de código fuente (ya en la compilación).
      //            UNA VEZ interpretado el código fuente correctamente, utilizando los operadores definidos anteriormente,
      //            el resultado es un arreglo de tokens, en la notación que se adopte, cada uno de sus elementos es una
      //            instancia de un tipo de declaración de clase o bien un operador o literal, o un espacio o caracter especial.
      //       CONTIENEN : campo _class a 'impl'
      //                   Información del elemento del código del que se trate en el orden que se especifique, por ejemplo:
      //                   index: Un número de consecutivo de orden inicial en cero.
      //                   token: El fragmento de código como tal (limpio, debe coincidir o ser un identificador o espacio).
      //                   leadingSpaces: Espacios en blanco y caracteres de controles a ignorar antes del mismo
      //                   trailingSpaces: Espacios en blanco y caracteres de controles a ignorar después del mismo
      //                   line: línea de código fuente donde se encuentra
      //                   columns: columna del código fuente donde se encuentra
      //                   source: referencia o vínculo al código fuente
      //                   etc.
      //
      // Part II:Run time (fundamentals: compilar, transpilar, e interpretar programas).
      //
      //      A partir de aquí es el tiempo de ejecución o RUN TIME, los tokens anteriores pudieran considerarse del
      //      tiempo de diseño o DESIGN TIME, este incluye todas las fases del proyecto de software: análisis, programación,
      //      compilación, pruebas,... etc, pero al ser este un sistema híbrido: con partes compilador e interprete,
      //      el ciclo de diseño se mantiene vivo a un en el tiempo de corrida o RUN TIME, permitiendo hacer actualizaciones
      //      estructurales a la aplicación en caliente. Si lo anterior es relativo a un compilador, esta sección puede
      //      considerarse el código compilado que el "interprete" es capaz de ejecutar. Y luego, con pequeñas modificaciones, puede
      //      lograrse además, tanto un compilador para una plataforma de procesamiento específica, o bien, un transpiler
      //      o compilador cruzado para llevar de programa o algoritmo de un lenguaje a otro. Por el momento interpretamos.
      //
      //      Solamente con una implementación que nos permita analizar y recorrer una estructura de arbórea
      //      (no tiene que ser binaria), dado una entrada concreta del mismo en la tabla de símbolos, podemos (probablemente
      //      mediante otra estructura de tipo pila o stack), que un proceso determinado pueda definir y encontrar el token
      //      siguiente y el anterior: ya podemos entonces ejecutar el código fuente esto puede hacerse por varias vías,
      //      reorganizando el orden del token del código fuente a rpm y evaluando, para eso ya existen las funciones
      //      implementadas, el código está serializado y accesible a la estructura mediante el objeto Self, que da acceso
      //      a todas sus funciones.
      //
      //      .'object': De declaración de instancia de variable.
      //      .'value': De valor actual de instancia de variable.
      {name: '!', _class: 'decl', type: 'unary operator', precedence: 1, func: (a) => !a},
      {name: '&&', _class: 'decl', type: 'binary operator', precedence: 2, func: (a, b) => a && b},
      {name: '||', _class: 'decl', type: 'binary operator', precedence: 2, func: (a, b) => a || b},
      {name: '&', _class: 'decl', type: 'binary operator', precedence: 2, func: (a, b) => a & b},
      {name: '|', _class: 'decl', type: 'binary operator', precedence: 2, func: (a, b) => a | b},
      {name: 'instanceof', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a instanceof b},
      {name: '===', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a === b},
      {name: '==', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a == b},
      {name: '=', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a = b}, // revisar no sirve para asignar
      {name: '!==', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a !== b},
      {name: '<', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a < b},
      {name: '<=', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a <= b},
      {name: '>', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a > b},
      {name: '>=', _class: 'decl', type: 'binary operator', precedence: 3, func: (a, b) => a >= b},
      {name: '+', _class: 'decl', type: 'binary operator', precedence: 4, func: (a, b) => a + b},
      {name: '-', _class: 'decl', type: 'binary operator', precedence: 4, func: (a, b) => a - b},
      {name: '*', _class: 'decl', type: 'binary operator', precedence: 5, func: (a, b) => a * b},
      {name: 'unary+', _class: 'decl', type: 'binary operator', precedence: 5, func: (a) => -a},
      {name: 'unary-', _class: 'decl', type: 'binary operator', precedence: 5, func: (a) => +a},
      {name: '/', _class: 'decl', type: 'binary operator', precedence: 5, func: (a, b) => a / b},
      {name: '%', _class: 'decl', type: 'binary operator', precedence: 5, func: (a, b) => a % b},
      {name: '^', _class: 'decl', type: 'binary operator', precedence: 6, func: (a, b) => a ^ b},
      {name: 'typeof', _class: 'decl', type: 'binary operator', precedence: 7, func: (a) => typeof a},
      {name: '>>>=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a >>>= b},
      {name: '>>>', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a >>> b},
      {name: '>>=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a >>= b},
      {name: '<<=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a <<= b},
      {name: '++', _class: 'decl', type: 'binary operator', precedence: 7, func: (a) => a++},
      {name: '--', _class: 'decl', type: 'binary operator', precedence: 7, func: (a) => a--},
      {name: '+=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a += b},
      {name: '-=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a -= b},
      {name: '*=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a *= b},
      {name: '/=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a /= b},
      {name: '%=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a %= b},
      {name: '^=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a ^= b},
      {name: '&=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a &= b},
      {name: '!==', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a !== b},
      {name: '|=', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a |= b},
      {name: '&', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a & b},
      {name: '~', _class: 'decl', type: 'binary operator', precedence: 7},
      {name: ';', _class: 'decl', type: 'symbol', precedence: 7},
      {name: ',', _class: 'decl', type: 'symbol', precedence: 7},
      // Every Javascript function is actually a Function object,
      // this can be seen with the code (Function(){}).constructor === true
      {name: '=>', _class: 'decl', type: 'binary operator', precedence: 7, func: (a, b) => a => b}, // Validar
      {
        name: 'Self', _class: 'decl', type: 'reserved word', precedence: 10, func: (un, up) => {
          if (un === this.owner && up === this.password) {
            return this;
          } else {
            throw new Error(`Aunauthorized access intent: subject:${un} recet:${un}`);
          }
        },
      },
      // Aquí incluir los simbolos o grupos de ellos que usas como léxicos, comentarios de línea, de bloque, grupos y tipos de cadena
      {
        name: 'abstract', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'boolean', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'break', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'byte', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'case', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'catch', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'class', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'const', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'do', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'for', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'function', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'if', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'let', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'return', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'var', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'while', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'char', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'continue', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'default', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'do', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'double', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'else', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'extends', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'false', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'final', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'finally', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'float', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'for', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'implements', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'import', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'int', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'interface', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'long', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'native', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'new', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'null', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'package', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'private', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'protected', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'public', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'short', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'static', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'super', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'switch', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'syncronized', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'this', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'throw', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'throws', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'transient', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'true', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'try', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'void', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'volatile', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'rest', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'byvalue', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'cast', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'const', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'future', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'generic', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'goto', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'inner', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'operator', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'outer', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
      {
        name: 'experimental', _class: 'decl', type: 'reserved word', precedence: 10, func: () => {
          return null;
        },
      },
    ];

    constructor(expression, evaluation = true, userName = prompt('User name', 'anonymous'), password = prompt('User password', 'guess')) {

      // Este es un esquema de seguridad ilustrativo el objeto se construye del lado
      // del servidor o del cliente, pero por su usuario owner o administrador.
      this.owner = userName;
      this.password = password; // aquí pudieras implementar un sistema de cifrado, pero así está bien.
      this.status = 'success';

      // ordenar los operadores descendentemente
      this.operators = this.operators.sort((a, b) => a.name.length - b.name.length);
      this.expression = String(expression);
      this.tokens = this.cleanTokenizer(this.expression, this.operators);
      this.postFix = this.infixToPostfix(this.tokens, this.operators);
      this.evaluation = this.evaluatePostfix(this.postFix, this.operators);
      console.log('la evaulación por tokenización es es ', this.evaluation);
    }

    // Tokeniza limpio y todavía no construye el árbol de dependencias.
    cleanTokenizer(code) {

      let operators = this.operators.map(op => op.name);
      console.log('Viejo ', operators);

      // Función auxiliar para contar ocurrencias de un carácter en una cadena
      function countOccurrences(str, char) {
        return str.split(char).length - 1;
      }

      // Función auxiliar para obtener espacios en blanco antes del token
      function getLeadingSpaces(code, position) {
        let result = '';
        let start = position;
        while (start > 0 && code[start - 1] <= ' ') {
          start--;
          result = code[start - 1] + result;
        }
        return result;
      }

      // Función auxiliar para obtener espacios en blanco después del token
      function getTrailingSpaces(code, position) {
        let result = '';
        let end = position + 1;
        while (end < code.length && code[end] <= ' ') {
          end++;
          result += code[end];
        }
        return result;
      }

      let syntaxCheck = (cadena, posicion) => {
        // Actualización de sábado 16 de diciembre de 2023
        // Se corrigen errores en los comentarios de bloque.
        let endComment;
        if (
          !cadena ||
          cadena.length === 0 ||
          posicion < 0 ||
          posicion >= cadena.length
        ) {
          return -1;
        }
        // pares
        const pares = [
          {start: '(', end: ')'},
          {start: '{', end: '}'},
          {start: '[', end: ']'},
        ];
        if (cadena.substring(posicion, posicion + 2) === '//') {
          // Line comment, until CR or EOF
          endComment = cadena.indexOf('\n', posicion + 2);
          if (endComment === -1) {
            return cadena.length - 1;
          }
          return endComment; // hasta cr
        } else if (cadena.substring(posicion, posicion + 2) === '/*') {
          // Block comment, always until */, or error
          endComment = cadena.indexOf('*/', posicion + 2);
          return endComment !== -1 ? endComment + 1 : endComment; // sino, completo.
        }
        // De otro modo
        switch (cadena[posicion]) {
          case '\'': // simples
            return cadena.indexOf('\'', posicion + 1);
          case '`': // francesas
            return (posicion = cadena.indexOf('`', posicion + 1));
          case '"': // dobles
            return cadena.indexOf('"', posicion + 1);
          default: {
            let q;
            for (let i = 0; i < pares.length; i++) {
              if (cadena.substring(posicion, posicion + pares[i].start.length) === pares[i].start) {
                q = posicion + pares[i].start.length; // reubica el puntero
                while (q !== -1 && q < cadena.length) {
                  if (cadena.substring(q, q + pares[i].end.length) === pares[i].end) {
                    return q + pares[i].end.length - 1;
                  } else {
                    q = syntaxCheck(cadena, q);
                    if (q !== -1 && q < cadena.length) {
                      q++;
                    } else {
                      return -1;
                    }
                  }
                }
                return -1;
              }
            }
            // None of them
          }
        }
        // Sino retorna posición y ya...
        return posicion;
      };

      let tokens = [];
      let position = 0;
      let nextPosition = 0;
      let line = 0;
      let column = 0;

      while (position !== -1 && position < code.length) {
        nextPosition = syntaxCheck(code, position);

        let token = code.substring(position, nextPosition + 1);
        tokens.push({
          token: token,
          line: line,
          column: column,
        });

        // Actualizar posición y ubicación
        line += countOccurrences(token, '\n');
        column = (line === 0) ? column + token.length : token.length - token.lastIndexOf('\n') - 1;
        position = nextPosition + 1;
      }
      if (tokens.length === 0) {
        // No hay elementos
        return [];
      }

      console.log('Antes de normalizar', tokens);

    // Normalizar, los tokens sencillos solo tienen longitud 1
    // La misma operación que hacer para ";" se hace para todos los operadores.

      let tokensNormales = [];
      let currentToken = '';

      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].token.length === 1 && !this.operators.some(op => String(op.name).trim() === String(tokens[i].token).trim())) {
          currentToken += tokens[i].token;
        } else {
          if (currentToken !== '') {
            tokensNormales.push({ token: currentToken, line: tokens[i].line, column: tokens[i].column });
            currentToken = '';
          }
          tokensNormales.push(tokens[i]);
        }
      }

      if (currentToken !== '') {
        tokensNormales.push({ token: currentToken, line: tokens[tokens.length - 1].line, column: tokens[tokens.length - 1].column });
      }

      console.log(`Antes de eliminar vacíos:`, tokensNormales);
      console.log(`Primero:`, tokensNormales[0]);
      console.log(`Segundo:`, tokensNormales[1]);
      console.log(`Tercero:`, tokensNormales[2]);

    // Eliminar los tokens vacíos poniéndolos como trailingSpaces
      for (let i = tokensNormales.length - 1; i >= 1; i--) {
        if (String(tokensNormales[i].token).trim() === '') {
          tokensNormales[i - 1].token += tokensNormales[i].token;
          tokensNormales[i - 1].trailingSpaces = tokensNormales[i].token.length;
          tokensNormales.splice(i, 1);
        }
      }

      console.log(`Antes de clasificar:`, tokensNormales);
      console.log(`Primero:`, tokensNormales[0]);
      console.log(`Segundo:`, tokensNormales[1]);
      console.log(`Tercero:`, tokensNormales[2]);

    // Clasificar
      for (let i = 0; i < tokensNormales.length; i++) {
        let tipo = 'Operador';
        tipo = this.operators.find(op => String(op.name).trim() === String(tokensNormales[i].token).trim());
        tokensNormales[i].tipo = tipo ? tipo : 'Operando';
        tokensNormales.splice(i, 1);
      }

    // Actualizar los espacios de cabecera y cola (arreglar)
      for (let i = 0; i < tokensNormales.length; i++) {
        let token = String(tokensNormales[i].token);
        let kantToken = String(token).trim();
        tokensNormales[i].token = kantToken; // Aquí ya se guarda el token en limpio
        let cabecera = '';
        let cola = '';
        if (kantToken !== '') {
          cabecera = getLeadingSpaces(token, token.indexOf(kantToken));
          cola = getTrailingSpaces(token, token.indexOf(kantToken) + kantToken.length);
        }
        tokensNormales[i].leadingSpaces = cabecera;
        tokensNormales[i].trailingSpaces = cola;
      }

    // Luego buscar los hijos en profundidad
      return tokensNormales;
    }

    // Adecua los siguientes
    infixToPostfix(tokens = this.tokens, operators = this.operators) {
      // Implementación del algoritmo Shunting Yard, de Edsger Dijkstra.

      let outputQueue = [];
      let operatorStack = [];
      let precedence = {};

      operators.forEach(op => {
        precedence[op.name] = op.precedence;
      });

      tokens.forEach(function(token) {
        if (parseFloat(token)) {
          outputQueue.push(token);
        } else if (token === '(') {
          operatorStack.push(token);
        } else if (token === ')') {
          while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.pop(); // Pop the '(' from the stack
        } else if (operators.some(op => op.name === token)) {
          while (operatorStack.length > 0 && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) {
            outputQueue.push(operatorStack.pop());
          }
          operatorStack.push(token);
        }
      });

      while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
      }
      return outputQueue;
    }

    evaluatePostfix(postfix = this.postFix, operators = this.operators) {
      let stack = [];
      postfix.forEach(token => {
        if (operators.some(op => op.name === token)) {
          let rhs, lhs;
          if (token === `!`) { // Es decir, si es unario, esa info debe aparecer en operadores, luego, ok.
            // Para resolver el problema unario, se lleva a binario con operador nulo o unitario
            // La solución clásica es agregar un cero a la izquierda en números por ejemplo,
            // y en casos de negaciones lógicas !x se convierten a binarias (solo para evaluar)
            // true y x, o bien: false o x; ambas son equivalentes.
            rhs = stack.pop();
            stack.push(op.func(null, rhs, token));
          } else {
            rhs = stack.pop();
            lhs = stack.pop();
            stack.push(op.func(lhs, rhs, token));
          }
        } else if (token === `true` || token === `false`) {
          stack.push(token === `true`);
        } else {
          let num = parseFloat(token);
          if (!isNaN(num)) {
            stack.push(num);
          } else {
            console.warn(`No se pudo convertir el token a número: ${token}`);
          }
        }
      });
      if (stack.length !== 1) {
        console.warn(`La evaluación no resultó en un único valor en la pila.`);
      }
      return stack.pop();
    }

  }
