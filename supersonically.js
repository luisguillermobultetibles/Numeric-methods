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
    let parseo = new SimpleParse(SuperScalar.validSentences);
    let resultado = parseo.parsear();
    switch (String(resultao.op).toLocaleUpperCase()) {
      case 'ADD': {
        result =
        break;
      }
      case 'SUB': {
        break;
      }
      case 'MUL': {
        break;
      }
      case 'DIV': {
        break;
      }
      case 'LOAD': {
        let tal = result;
        break;
      }
      case 'STORE': {
        result = tal;
        break;
      }
    }
  }
  return result;
};

