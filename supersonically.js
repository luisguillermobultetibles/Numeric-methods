'use strict';
// this is the class for multitasking

// global access method name
import {SimpleParse} from './Parse';
import {SuperScalar} from './Superescalar';

export const onmessage = (instructions, initialAccumulator = 0) => {
  console.log('Llega.');
  let enqueue = [];
  let result = initialAccumulator;
  for (let i = 0; i < instructions.length(); i++) {
    let parseo = new SimpleParse();
    let resultado = parseo.parsear();
    if (resultado.length > 0) {
      switch (SuperScalar.Task.validInstructions.some(String(resultado[0].op).toLocaleUpperCase())) {
        case 'ADD': {
          result = resultado.resultado[0].args[0];
          result = SuperScalar.coreAdd(result, resultado.resultado[0].args[1]);
          break;
        }
        case 'SUB': {
          result = resultado.resultado[0].args[0];
          result = SuperScalar.coreSubtract(result, resultado.resultado[0].args[1]);
          break;
        }
        case 'MUL': {
          result = resultado.resultado[0].args[0];
          result = SuperScalar.coreMultiply(resultado.resultado[0].args[0], resultado.resultado[0].args[1]);
          break;
        }
        case 'DIV': {
          result = resultado.resultado[0].args[0];
          result = SuperScalar.coreDivide(resultado.resultado[0].args[0], resultado.resultado[0].args[1]);
          break;
        }
        case 'LOAD': {
          result = resultado.resultado[0].args[0];
          break;
        }
        case 'STORE': {
          result = tal; // ¿?
          break;
        }
      }
    }
  }
  return result;
};

