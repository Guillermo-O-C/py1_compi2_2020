"use strict";

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
  OBJETO: 'OBJETO'
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
  DECREMENTO: 'DECREMENTO'
};
var TIPO_DATO = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
  OBJETO: 'OBJETO',
  VOID: 'VOID',
  TYPES: 'TYPES',
  ARRAY: 'ARRAY'
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
  if (tipo === "number") {
    return TIPO_DATO.NUMBER;
  }

  if (tipo === "boolean") {
    return TIPO_DATO.BOOLEAN;
  }

  if (tipo === "string") {
    return TIPO_DATO.STRING;
  }

  if (tipo === "void") {
    return TIPO_DATO.VOID;
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
  nuevaDeclaracion: function nuevaDeclaracion(variable_type, id, valor, data_type) {
    return {
      sentencia: SENTENCIAS.DECLARACION,
      variable_type: Variable_Type(variable_type),
      data_type: Data_Type(data_type.tipo),
      isArray: data_type.isArray,
      id: id,
      expresion: valor
    };
  },
  nuevoObjeto: function nuevoObjeto(atributos) {
    return {
      tipo: TIPO_VALOR.OBJETO,
      atributos: atributos
    };
  },
  nuevoAtributo: function nuevoAtributo(id, data_type, next) {
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
  nuevosDatosDeDimension: function nuevosDatosDeDimension(datos, next_dimension) {
    return {
      datos: datos,
      next_dimension: next_dimension
    };
  },
  nuevoDato: function nuevoDato(dato, next_data) {
    return {
      dato: dato,
      next_data: next_data
    };
  },
  nuevaAsignacion: function nuevaAsignacion(id, valor) {
    return {
      sentencia: SENTENCIAS.ASIGNACION,
      id: id,
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
  nuevoFor: function nuevoFor(inicial, _final, paso, sentencias) {
    return {
      sentencia: SENTENCIAS.FOR,
      inicial: inicial,
      "final": _final,
      paso: paso,
      accion: sentencias
    };
  },
  nuevoMain: function nuevoMain(sentencias) {
    return {
      sentencia: SENTENCIAS.MAIN,
      accion: sentencias
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
  nuevoParametro: function nuevoParametro(tipo, id, siguiente) {
    return {
      tipo: Data_Type(tipo),
      id: id,
      siguiente: siguiente
    };
  },
  nuevoReturn: function nuevoReturn(valor) {
    return {
      sentencia: SENTENCIAS.RETURN,
      valor: valor
    };
  }
};
module.exports.TIPO_OPERACION = TIPO_OPERACION;
module.exports.SENTENCIAS = SENTENCIAS;
module.exports.TIPO_VALOR = TIPO_VALOR;
module.exports.instruccionesAPI = instruccionesAPI;
module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;