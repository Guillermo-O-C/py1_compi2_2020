"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TS = exports.TIPO_DATO = exports.instruccionesAPI = exports.TIPO_VALOR = exports.SENTENCIAS = exports.TIPO_VARIABLE = exports.TIPO_OPERACION = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TIPO_VALOR = {
  NUMERO: 'NUMERO',
  DECIMAL: 'DECIMAL',
  IDENTIFICADOR: 'IDENTIFICADOR',
  CADENA: 'CADENA',
  CARACTER: 'CARACTER',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  OBJETO: 'OBJETO',
  ANONYMOUS_FUNCTION: 'ANONYMOUS_FUNCTION'
};
var TIPO_OPERACION = {
  SUMA: 'SUMA',
  RESTA: 'RESTA',
  MULTIPLICACION: 'MULTIPLICACION',
  DIVISION: 'DIVISION',
  NEGATIVO: 'NEGATIVO',
  POTENCIA: 'POTENCIA',
  MODULO: 'MODULO',
  MAYOR: 'MAYOR',
  MAYOR_IGUAL: 'MAYOR_IGUAL',
  MENOR: 'MENOR',
  MENOR_IGUAL: 'MENOR_IGUAL',
  CONCATENACION: 'CONCATENACION',
  IGUAL_IGUAL: 'IGUAL IGUAL',
  DISTINTO: 'DISTINTO',
  CONDICION: 'CONDICION',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT'
};
var SENTENCIAS = {
  CLASE: 'CLASE',
  ASIGNACION: 'ASIGNACION',
  DECLARACION: 'DECLARACION',
  IMPORT: 'IMPORT',
  IF: 'IF',
  ELSE_IF: 'ELSE_IF',
  ELSE: 'ELSE',
  SWITCH: 'SWITCH',
  WHILE: 'WHILE',
  DO_WHILE: 'DO_WHILE',
  FOR: 'FOR',
  FUNCION: 'FUNCION',
  MAIN: 'MAIN',
  RETURN: 'RETURN',
  CONTINUE: 'CONTINUE',
  BREAK: 'BREAK',
  IMPRIMIR: 'IMPRIMIR',
  COMENTARIO: 'COMENTARIO',
  PARAMETRO: 'PARAMETRO',
  VARIABLE: 'VARIABLE',
  METODO: 'METODO',
  CASE: 'CASE',
  DEFAULT: 'DEFAULT',
  LLAMADA: 'LLAMADA',
  INCREMENTO: 'INCREMENTO',
  DECREMENTO: 'DECREMENTO',
  FOR_OF: 'FOR_OF',
  FOR_IN: 'FOR_IN'
};
var TIPO_DATO = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
  OBJETO: 'OBJETO',
  VOID: 'VOID',
  TYPES: 'TYPES',
  ARRAY: 'ARRAY',
  TYPE: 'TYPE',
  OPERADOR_TERNARIO: 'OPERADOR_TERNARIO'
};
var TIPO_VARIABLE = {
  LET: 'LET',
  CONST: 'CONST'
};

function nuevaOperacion(operandoIzq, OperandoDer, tipo) {
  return {
    operandoIzq: operandoIzq,
    operandoDer: OperandoDer,
    tipo: tipo
  };
}

function crearSimbolo(id, tipo, valor) {
  return {
    id: id,
    tipo: tipo,
    valor: valor
  };
}

function crearFuncion(id, tipo, parametros, accion) {
  return {
    id: id,
    tipo: tipo,
    parametros: parametros,
    accion: accion
  };
}

var TS =
/*#__PURE__*/
function () {
  function TS(simbolos) {
    _classCallCheck(this, TS);

    this._simbolos = simbolos;
  }

  _createClass(TS, [{
    key: "agregar",
    value: function agregar(id, tipo) {
      var nuevoSimbolo = crearSimbolo(id, tipo);

      this._simbolos.push(nuevoSimbolo);
    }
  }, {
    key: "agregarFuncion",
    value: function agregarFuncion(id, tipo, parametros, accion) {
      var nuevaFuncion = crearFuncion(id, tipo, parametros, accion);

      this._simbolos.push(nuevaFuncion);
    }
  }, {
    key: "actualizar",
    value: function actualizar(id, valor) {
      var simbolo = this._simbolos.filter(function (simbolo) {
        return simbolo.id === id;
      })[0];

      if (simbolo.tipo != valor.tipo) throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + simbolo.tipo;
      if (simbolo) simbolo.valor = valor.valor;else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }
  }, {
    key: "obtenerSimbolo",
    value: function obtenerSimbolo(id) {
      var simbolo = this._simbolos.filter(function (simbolo) {
        return simbolo.id === id;
      })[0];

      if (simbolo) return {
        valor: simbolo.valor,
        tipo: simbolo.tipo
      };else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }
  }, {
    key: "obtenerFuncion",
    value: function obtenerFuncion(id) {
      var funcion = this._simbolos.filter(function (simbolo) {
        return simbolo.id === id;
      })[0];

      if (funcion) return {
        tipo: funcion.tipo,
        parametros: funcion.parametros,
        accion: funcion.accion
      };else throw 'ERROR: no existe ninguna función llamada: ' + id + '.';
    }
  }, {
    key: "existe",
    value: function existe(id) {
      var simbolo = this._simbolos.filter(function (simbolo) {
        return simbolo.id === id;
      })[0];

      if (simbolo) return true;else return false;
    }
  }, {
    key: "simbolos",
    get: function get() {
      return this._simbolos;
    }
  }]);

  return TS;
}();

function Data_Type(tipo) {
  console.log(tipo);

  if (tipo === "number") {
    return TIPO_DATO.NUMBER;
  } else if (tipo === "boolean") {
    return TIPO_DATO.BOOLEAN;
  } else if (tipo === "string") {
    return TIPO_DATO.STRING;
  } else if (tipo === "void") {
    return TIPO_DATO.VOID;
  } else {
    return tipo;
  }
}

function Variable_Type(tipo) {
  if (tipo === "let") {
    return TIPO_VARIABLE.LET;
  }

  if (tipo === "const") {
    return TIPO_VARIABLE.CONST;
  }
}

var instruccionesAPI = {
  nuevaOperacionBinaria: function nuevaOperacionBinaria(Izq, Der, tipo) {
    return nuevaOperacion(Izq, Der, tipo);
  },
  nuevaOperacionUnaria: function nuevaOperacionUnaria(izq, tipo) {
    return nuevaOperacion(izq, undefined, tipo);
  },
  nuevoValor: function nuevoValor(valor, tipo) {
    return {
      tipo: tipo,
      valor: valor
    };
  },
  nuevaDeclaracion: function nuevaDeclaracion(variable_type, id, data_type, valor, next_declaration) {
    return {
      sentencia: SENTENCIAS.DECLARACION,
      variable_type: Variable_Type(variable_type),
      data_type: Data_Type(data_type.tipo),
      isArray: data_type.isArray,
      id: id,
      expresion: valor,
      next_declaration: next_declaration
    };
  },
  nuevoID: function nuevoID(id, data_type, valor, next_declaration) {
    return {
      data_type: Data_Type(data_type.tipo),
      isArray: data_type.isArray,
      id: id,
      expresion: valor,
      next_declaration: next_declaration
    };
  },
  nuevoObjeto: function nuevoObjeto(atributos) {
    return {
      tipo: TIPO_VALOR.OBJETO,
      atributos: atributos
    };
  },
  nuevoObjAtributo: function nuevoObjAtributo(id, valor, next) {
    return {
      id: id,
      valor: valor,
      next: next
    };
  },
  nuevoTypeAtributo: function nuevoTypeAtributo(id, data_type, next) {
    return {
      id: id,
      data_type: Data_Type(data_type),
      next: next
    };
  },
  nuevaDimension: function nuevaDimension(next_dimension) {
    return {
      dimension: true,
      next_dimension: next_dimension
    };
  },
  nuevoTipo: function nuevoTipo(tipo, isArray) {
    return {
      tipo: tipo,
      isArray: isArray
    };
  },
  nuevoArray: function nuevoArray(dimension) {
    return {
      data_type: TIPO_DATO.ARRAY,
      dimension: dimension
    };
  },
  nuevoDato: function nuevoDato(dato, next_data) {
    return {
      dato: dato,
      next_data: next_data
    };
  },
  nuevoType: function nuevoType(id, atributos) {
    return {
      data_type: TIPO_DATO.TYPE,
      id: id,
      atributos: atributos
    };
  },
  nuevoOperadorTernario: function nuevoOperadorTernario(logica, result1, result2) {
    return {
      data_type: TIPO_DATO.OPERADOR_TERNARIO,
      logica: logica,
      result1: result1,
      result2: result2
    };
  },
  nuevaAsignacion: function nuevaAsignacion(id, ArrayPosition, valor) {
    return {
      sentencia: SENTENCIAS.ASIGNACION,
      id: id,
      ArrayPosition: ArrayPosition,
      expresion: valor
    };
  },
  nuevoImprimir: function nuevoImprimir(valor) {
    return {
      sentencia: SENTENCIAS.IMPRIMIR,
      valor: valor
    };
  },
  nuevoIf: function nuevoIf(logica, sentencias, elseT) {
    return {
      sentencia: SENTENCIAS.IF,
      logica: logica,
      accion: sentencias,
      "else": elseT
    };
  },
  nuevoElseIf: function nuevoElseIf(logica, sentencias, elseT) {
    return {
      sentencia: SENTENCIAS.ELSE_IF,
      logica: logica,
      accion: sentencias,
      "else": elseT
    };
  },
  nuevoElse: function nuevoElse(sentencias) {
    return {
      sentencia: SENTENCIAS.ELSE,
      accion: sentencias
    };
  },
  nuevoSwitch: function nuevoSwitch(logica, cases) {
    return {
      sentencia: SENTENCIAS.SWITCH,
      logica: logica,
      cases: cases
    };
  },
  nuevoCase: function nuevoCase(logica, accion, next_case) {
    return {
      logica: logica,
      accion: accion,
      next_case: next_case
    };
  },
  nuevoDefault: function nuevoDefault(accion) {
    return {
      logica: 'default',
      accion: accion //podía llevar casos después pero aún no lo he hecho

    };
  },
  nuevoFor: function nuevoFor(inicial, _final, paso, sentencias) {
    return {
      sentencia: SENTENCIAS.FOR,
      inicial: inicial,
      "final": _final,
      paso: paso,
      accion: sentencias
    };
  },
  nuevoForOF: function nuevoForOF(variable, conjunto, accion) {
    return {
      sentencia: SENTENCIAS.FOR_OF,
      conjunto: conjunto,
      variable: variable,
      accion: accion
    };
  },
  nuevoForIn: function nuevoForIn(variable, conjunto, accion) {
    return {
      sentencia: SENTENCIAS.FOR_IN,
      conjunto: conjunto,
      variable: variable,
      accion: accion
    };
  },
  nuevoWhile: function nuevoWhile(logica, accion) {
    return {
      sentencia: SENTENCIAS.WHILE,
      logica: logica,
      accion: accion
    };
  },
  nuevoDoWhile: function nuevoDoWhile(accion, logica) {
    return {
      sentencia: SENTENCIAS.DO_WHILE,
      logica: logica,
      accion: accion
    };
  },
  nuevaFuncion: function nuevaFuncion(tipo, id, parametros, accion) {
    return {
      sentencia: SENTENCIAS.FUNCION,
      tipo: Data_Type(tipo),
      id: id,
      parametros: parametros,
      accion: accion
    };
  },
  nuevaListaid: function nuevaListaid(id, siguiente) {
    return {
      id: id,
      siguiente: siguiente
    };
  },
  nuevaLlamada: function nuevaLlamada(id, parametros) {
    return {
      sentencia: SENTENCIAS.LLAMADA,
      id: id,
      parametros: parametros
    };
  },
  nuevoArgumento: function nuevoArgumento(expresion, siguiente) {
    return {
      expresion: expresion,
      siguiente: siguiente
    };
  },
  nuevoParametro: function nuevoParametro(tipo, id, siguiente, opcional) {
    return {
      tipo: Data_Type(tipo),
      id: id,
      siguiente: siguiente,
      opcional: opcional
    };
  },
  nuevoReturn: function nuevoReturn(valor) {
    return {
      sentencia: SENTENCIAS.RETURN,
      valor: valor
    };
  },
  nuevoArrayIndex: function nuevoArrayIndex(index, next_index) {
    return {
      index: index,
      next_index: next_index
    };
  },
  nuevoAccesoAPosicion: function nuevoAccesoAPosicion(index, next_index) {
    return {
      index: index,
      next_index: next_index
    };
  }
};
var _TIPO_OPERACION = TIPO_OPERACION;
exports.TIPO_OPERACION = _TIPO_OPERACION;
var _TIPO_VARIABLE = TIPO_VARIABLE;
exports.TIPO_VARIABLE = _TIPO_VARIABLE;
var _SENTENCIAS = SENTENCIAS;
exports.SENTENCIAS = _SENTENCIAS;
var _TIPO_VALOR = TIPO_VALOR;
exports.TIPO_VALOR = _TIPO_VALOR;
var _instruccionesAPI = instruccionesAPI;
exports.instruccionesAPI = _instruccionesAPI;
var _TIPO_DATO = TIPO_DATO;
exports.TIPO_DATO = _TIPO_DATO;
var _TS = TS;
exports.TS = _TS;