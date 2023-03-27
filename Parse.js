// Se queda así, es un producto CASI terminado para un decompilador que reconozca otras cosas.
const tokenTypeUnkKnown = 'Token desconocido';
const tokenTypeLineComent = 'Comentario de línea';
const tokenTypeBlockComent = 'Comentario de bloque';
const tokenTypeSimpleQuotes = 'Comillas simples';
const tokenTypeDoubleQuotes = 'Comillas dobles';
const tokenTypeFrenchQuotes = 'Comillas francesas';
const tokenTypeBrackets = 'Corchetes';
const tokenTypeBraces = 'Llaves';
const tokenTypeParenthesis = 'Paréntesis';
const tokenTypeOperator = 'Operador';
const tokenTypeSymbol = 'Símbolo';

// Conjuntos de caracteres (Se utiliza en sub-clases).
const characterSetConsonantes = [
  'b',
  'c',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'm',
  'n',
  'ñ',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'x',
  'y',
  'z',
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'Ñ',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'V',
  'X',
  'Y',
  'Z',
];
const characterSetVocales = [
  'a',
  'e',
  'i',
  'o',
  'u',
  'á',
  'é',
  'í',
  'ó',
  'ú',
  'ü',
  'A',
  'E',
  'I',
  'O',
  'U',
  'Á',
  'É',
  'Í',
  'Ó',
  'Ú',
  'Ü',
];
const characterDigits = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

function genericParse(v, options = {
  functionCallback: null,
  variableCallbak: null,
}) {
  const result = [];
  let token = '';
  let counter;
  const pushToken = (type = tokenTypeUnkKnown) => {
    const tmp = token;
    token = '';
    const tok = {source: tmp, content: tmp, type: type}; // as obj
    if (tok.type === tokenTypeBraces || tok.type === tokenTypeBrackets || tok.type === tokenTypeParenthesis || tok.type === tokenTypeSimpleQuotes || tok.type === tokenTypeDoubleQuotes || tok.type === tokenTypeFrenchQuotes) {
      tok.content = tmp.substring(1, tmp.length - 1);
      if (tok.type === tokenTypeBraces || tok.type === tokenTypeBrackets || tok.type === tokenTypeParenthesis) { // incluir el caso de ajax's
        tok.entry = genericParse(tmp.substring(1, tmp.length - 1));
      }
    } else if (tok.type === tokenTypeOperator) {
      tok.content = tmp.trim();
    }
    result.push(tok);
    return tmp.length;
  };
  const classOpeners = ['(', '{', '[', '"', '\'', '`', '/'];
  const classClosers = [')', '}', ']', '"', '\'', '`', '/'];
  const classSymbols = [';', '.', '@', '#', '$', '%', '^', '&', '*', '~', ':', '{', '}', '=', '[', ']', ',', '>', '<'];
  const classOperators = ['instanceof', 'typeof', '>>>=', '>>>', '>>=', '<>=', '===', '!==', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '^=', '&=', '!=', '|=', '&', '|', '^', '<', '>', '!', '~', '+', '-', '*', '/', '%', ';', ',', '=>'];
  const isOperatorAt = (so, p = 0, _class = classOperators) => {
    return _class.some((operador) => {
      return so.indexOf(operador, p) === p;
    });
  };
  const type = (so, p = 0) => {
    if (isOperatorAt(so, p)) {
      return tokenTypeOperator;
    }
    const char = classOpeners.indexOf(so[p]);
    switch (char) {
      case 0:
        return tokenTypeParenthesis;
      case 1:
        return tokenTypeBraces;
      case 2:
        return tokenTypeBrackets;
      case 3:
        return tokenTypeDoubleQuotes;
      case 4:
        return tokenTypeFrenchQuotes;
      case 5:
        return tokenTypeSimpleQuotes;
      case 6:
        if (char === classOpeners.indexOf(so[p + 1])) {
          return tokenTypeLineComent;
        } else {
          return tokenTypeBlockComent;
        }
      default: {
        return tokenTypeUnkKnown;
      }
    }
  };
  const instr = (str, pos, cant) => {
    const tmp = String(str);
    return tmp.substring(pos, cant);
  };
  // Sintactical analizer (next to where the operator in position ends).
  const sintaxCheck = (cadena, posicion) => {
    // Si es una línea de comentarios debe devolver la posición de la siguiente línea.
    if (posicion === -1 || posicion >= cadena.length) {
      return false;
    }
    // pares
    const pares = [{start: '(', end: ')'},
      {start: '{', end: '}'},
      {start: '[', end: ']'}];
    if (cadena.substr(posicion, 2) === '//') { // Line comment, until CR or EOF
      const endComment = cadena.indexOf('\n', posicion + 2);
      if (endComment === -1) {
        return cadena.length + 1; // y se devuelve hasta el retorno del carro.
      }
      return endComment + 1;
    } else if (cadena.substr(posicion, 2) === '/*') { // Block comment, always until */, or error
      const endComment = cadena.indexOf('*/', posicion);
      if (endComment !== -1) {
        posicion = endComment + 1; // son dos caracteres
      } else {
        return -1;
      }
    } else {
      // De otro modo
      const isString = false;
      switch (cadena[posicion]) {
        case '\'': { // simples
          posicion = cadena.indexOf('\'', posicion + 1);
          break;
        }
        case '`': { // francesas
          posicion = cadena.indexOf('`', posicion + 1);
          break;
        }
        case '"': { // dobles
          posicion = cadena.indexOf('"', posicion + 1);
          break;
        }
        default: {
          for (let i = 0; i < pares.length; i++) {
            if (cadena.substr(posicion, pares[i].start.length) === pares[i].start) {
              posicion = posicion + pares[i].start.length; // reubica el puntero
              while ((posicion !== -1) && (posicion < cadena.length)) {
                if (cadena.substr(posicion, pares[i].end.length) === pares[i].end) {
                  return posicion + pares[i].end.length;
                }
                posicion = sintaxCheck(cadena, posicion);
                if (posicion === -1 || posicion >= cadena.length) {
                  break;
                }
              }
            }
          }
        }
      }
    }
    let res;
    if (posicion === -1 || posicion >= cadena.length) {
      res = -1;
    } else {
      res = posicion + 1;
    }
    return res;
  };
  // First pass, generic parse
  counter = 0;
  while (counter < v.length) {
    const j = counter;
    counter = sintaxCheck(v, counter);
    if (!isOperatorAt(v, j) && counter !== -1 && counter > j + 1 && (classOpeners.indexOf(v[j]) !== classClosers.indexOf(v[j + 1]))) {
      if (token !== '') {
        pushToken(type(token));
        token = '';
      }
      token = instr(v, j, counter);
      pushToken(type(v, j));
      token = '';
    } else {
      counter = j;
      token += v[counter];
    }
    counter++;
    console.log(`parsing process ${counter} in "${v[counter]}" --> ${JSON.stringify(result)} token = ${token}`);
  }
  if (token.trim() !== '') {
    pushToken();
  }
  // Second pass, specific parse
  return result;
}

// Para probar
console.log(genericParse('1+2+3+4+sum(1,2,3)+avg(1+1+2+3+4)+apellidos("Luis Guillermo Bultet " + `Ibles`, 1+1)'));
// Faltan los operadores, símbolos y palabras reservadas.
// Recuerda probar con objetos, vacíos, es decir, {}, (), [] porsia pero debe parsear bien... allá por la línea 145.
