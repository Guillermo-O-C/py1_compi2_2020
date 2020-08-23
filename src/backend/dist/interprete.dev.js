"use strict";

var consola = "";

function Ejecutar(entrada, salida) {
  try {
    consola = "";
    var tsGlobal = new TS([]);
    Variables_Funciones_GB(entrada, tsGlobal);
    entrada.forEach(function (instruccion) {
      if (instruccion.sentencia === SENTENCIAS.MAIN) {
        procesarBloque(instruccion.accion, tsGlobal, "NA");
      }
    });
    salida.value = consola;
  } catch (e) {
    console.error(e);
    return;
  }
}

function Variables_Funciones_GB(instrucciones, tablaDeSimbolos) {
  instrucciones.forEach(function (instruccion) {
    if (instruccion.sentencia === SENTENCIAS.FUNCION) {
      procesarDeclararFuncion(instruccion, tablaDeSimbolos);
    }

    if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
      procesarDeclaracion({
        tipo: instruccion.tipo,
        id: instruccion.id.id
      }, tablaDeSimbolos);
      if (instruccion.expresion != "null") procesarAsignacion(instruccion.id.id, instruccion.expresion, tablaDeSimbolos);
      var temporalFollow = instruccion.id.siguiente;

      while (temporalFollow != "NM") {
        procesarDeclaracion({
          tipo: instruccion.tipo,
          id: temporalFollow.id
        }, tablaDeSimbolos);
        if (instruccion.expresion != "null") procesarAsignacion(temporalFollow.id, instruccion.expresion, tablaDeSimbolos);
        temporalFollow = temporalFollow.siguiente;
      }
    } else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
      procesarAsignacion(instruccion.id, instruccion.expresion, tablaDeSimbolos);
    }
  });
}

function procesarBloque(instrucciones, tablaDeSimbolos, returnValue) {
  var returnedValue;
  instrucciones.forEach(function (instruccion) {
    if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
      procesarDeclaracion({
        tipo: instruccion.tipo,
        id: instruccion.id.id
      }, tablaDeSimbolos);
      if (instruccion.expresion != "null") procesarAsignacion(instruccion.id.id, instruccion.expresion, tablaDeSimbolos);
      var temporalFollow = instruccion.id.siguiente;

      while (temporalFollow != "NM") {
        procesarDeclaracion({
          tipo: instruccion.tipo,
          id: temporalFollow.id
        }, tablaDeSimbolos);
        if (instruccion.expresion != "null") procesarAsignacion(temporalFollow.id, instruccion.expresion, tablaDeSimbolos);
        temporalFollow = temporalFollow.siguiente;
      }
    } else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
      procesarAsignacion(instruccion.id, instruccion.expresion, tablaDeSimbolos);
    } else if (instruccion.sentencia === SENTENCIAS.IMPRIMIR) {
      procesarImprimir(instruccion, tablaDeSimbolos);
    } else if (instruccion.sentencia === SENTENCIAS.IF) {
      procesarIf(instruccion, tablaDeSimbolos, returnValue);
    } else if (instruccion.sentencia === SENTENCIAS.FOR) {
      var tsFor = new TS(tablaDeSimbolos.simbolos.slice());
      procesarFor(instruccion, tsFor, returnValue);
    } else if (instruccion.sentencia === SENTENCIAS.LLAMADA) {
      var tsfunction = new TS(tablaDeSimbolos.simbolos.slice());
      procesarFuncion(instruccion, tsfunction);
    } else if (instruccion.sentencia === SENTENCIAS.RETURN) {
      console.log("el valor de retorno es" + procesarReturn(instruccion, tablaDeSimbolos, returnValue));
      returnedValue = procesarReturn(instruccion, tablaDeSimbolos, returnValue);
    } else {
      throw 'ERROR: tipo de instrucción no válido: ' + instruccion;
    }
  });
  return returnedValue;
}

function procesarDeclararFuncion(instruccion, tablaDeSimbolos) {
  if (tablaDeSimbolos.existe("f_" + instruccion.id)) throw 'ERROR: función: ' + instruccion.id + ' ya ha sido declarada.';

  if (instruccion.tipo === TIPO_DATO.INT) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.INT, instruccion.parametros, instruccion.accion);
  }

  if (instruccion.tipo === TIPO_DATO.DOUBLE) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.DOUBLE, instruccion.parametros, instruccion.accion);
  }

  if (instruccion.tipo === TIPO_DATO.STRING) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.STRING, instruccion.parametros, instruccion.accion);
  }

  if (instruccion.tipo === TIPO_DATO.BOOLEAN) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.BOOLEAN, instruccion.parametros, instruccion.accion);
  }

  if (instruccion.tipo === TIPO_DATO.CHAR) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.CHAR, instruccion.parametros, instruccion.accion);
  }

  if (instruccion.tipo === TIPO_DATO.VOID) {
    tablaDeSimbolos.agregarFuncion("f_" + instruccion.id, TIPO_DATO.VOID, instruccion.parametros, instruccion.accion);
  }
}

function procesarDeclaracion(instruccion, tablaDeSimbolos) {
  if (tablaDeSimbolos.existe(instruccion.id)) throw 'ERROR: variable: ' + instruccion.id + ' ya ha sido declarada.';

  if (instruccion.tipo === TIPO_DATO.INT) {
    tablaDeSimbolos.agregar(instruccion.id, TIPO_DATO.INT);
  }

  if (instruccion.tipo === TIPO_DATO.DOUBLE) {
    tablaDeSimbolos.agregar(instruccion.id, TIPO_DATO.DOUBLE);
  }

  if (instruccion.tipo === TIPO_DATO.STRING) {
    tablaDeSimbolos.agregar(instruccion.id, TIPO_DATO.STRING);
  }

  if (instruccion.tipo === TIPO_DATO.BOOLEAN) {
    tablaDeSimbolos.agregar(instruccion.id, TIPO_DATO.BOOLEAN);
  }

  if (instruccion.tipo === TIPO_DATO.CHAR) {
    tablaDeSimbolos.agregar(instruccion.id, TIPO_DATO.CHAR);
  } //if (instruccion.expresion != "null") procesarAsignacion(instruccion, tablaDeSimbolos);

}

function procesarAsignacion(id, expresion, tablaDeSimbolos) {
  if (!tablaDeSimbolos.existe(id)) throw 'ERROR: variable: ' + id + ' no ha sido declarada.';

  if (tablaDeSimbolos.obtenerSimbolo(id).tipo === TIPO_DATO.INT) {
    var valor = procesarExpresionNumerica(expresion, tablaDeSimbolos);
    tablaDeSimbolos.actualizar(id, valor);
    console.log(id + "=" + valor.valor);
  }

  if (tablaDeSimbolos.obtenerSimbolo(id).tipo === TIPO_DATO.DOUBLE) {
    var _valor = procesarExpresionNumerica(expresion, tablaDeSimbolos);

    tablaDeSimbolos.actualizar(id, _valor);
    console.log(id + "=" + _valor.valor);
  }

  if (tablaDeSimbolos.obtenerSimbolo(id).tipo === TIPO_DATO.STRING) {
    var _valor2 = procesarExpresionCadena(expresion, tablaDeSimbolos);

    tablaDeSimbolos.actualizar(id, _valor2);
    console.log(id + "=" + _valor2.valor);
  }

  if (tablaDeSimbolos.obtenerSimbolo(id).tipo === TIPO_DATO.BOOLEAN) {
    var _valor3 = procesarExpresionNumerica(expresion, tablaDeSimbolos);

    tablaDeSimbolos.actualizar(id, _valor3);
    console.log(id + "=" + _valor3.valor);
  }

  if (tablaDeSimbolos.obtenerSimbolo(id).tipo === TIPO_DATO.CHAR) {
    var _valor4 = procesarExpresionCaracter(expresion, tablaDeSimbolos);

    tablaDeSimbolos.actualizar(id, _valor4);
    console.log(id + "=" + _valor4.valor);
  }
}

function procesarExpresionNumerica(expresion, tablaDeSimbolos) {
  if (expresion.sentencia === SENTENCIAS.LLAMADA) {
    var valor = procesarFuncion(expresion, tablaDeSimbolos);
    return valor;
  } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
    var _valor5 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    return {
      valor: _valor5 * -1,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
    var valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: valorIzq + valorDer,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
    var _valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq - _valorDer,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
    var _valorIzq2 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer2 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq2 * _valorDer2,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
    var _valorIzq3 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer3 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    if (_valorDer3 == 0) throw 'Error: división entre 0 no está definida.';
    return {
      valor: _valorIzq3 / _valorDer3,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
    var _valorIzq4 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer4 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: Math.pow(_valorIzq4, _valorDer4),
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
    var _valorIzq5 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer5 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq5 % _valorDer5,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
    var _valorIzq6 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer6 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq6 > _valorDer6,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
    var _valorIzq7 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer7 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq7 >= _valorDer7,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
    var _valorIzq8 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer8 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq8 < _valorDer8,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
    var _valorIzq9 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer9 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq9 <= _valorDer9,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
    var _valorIzq10 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer10 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq10 == _valorDer10,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
    var _valorIzq11 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer11 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq11 != _valorDer11,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.AND) {
    var _valorIzq12 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer12 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq12 && _valorDer12,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.OR) {
    var _valorIzq13 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    var _valorDer13 = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: _valorIzq13 || _valorDer13,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_OPERACION.NOT) {
    var _valorIzq14 = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
    return {
      valor: !_valorIzq14,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
    return {
      valor: expresion.valor,
      tipo: TIPO_DATO.INT
    };
  } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
    return {
      valor: expresion.valor,
      tipo: TIPO_DATO.DOUBLE
    };
  } else if (expresion.tipo === TIPO_VALOR.TRUE) {
    return {
      valor: true,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_VALOR.FALSE) {
    return {
      valor: false,
      tipo: TIPO_DATO.BOOLEAN
    };
  } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
    return tablaDeSimbolos.obtenerSimbolo(expresion.valor);
  } else {
    throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
  }
}

function procesarExpresionCadena(expresion, tablaDeSimbolos) {
  if (expresion.tipo === TIPO_OPERACION.SUMA) {
    var cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos).valor;
    var cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos).valor;
    return {
      valor: cadIzq + cadDer,
      tipo: TIPO_DATO.STRING
    };
  } else if (expresion.tipo === TIPO_VALOR.CADENA) {
    return {
      valor: expresion.valor,
      tipo: TIPO_DATO.STRING
    };
  } else {
    return procesarExpresionNumerica(expresion, tablaDeSimbolos);
  }
}

function procesarExpresionCaracter(expresion, tablaDeSimbolos) {
  if (expresion.tipo === TIPO_VALOR.CARACTER) {
    return expresion.valor;
  } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
    return tablaDeSimbolos.obtenerSimbolo(expresion.valor);
  } else {
    throw 'ERROR: Caracter no válido: ' + expresion;
  }
}

function procesarImprimir(instruccion, tablaDeSimbolos) {
  var cadena = procesarExpresionCadena(instruccion.valor, tablaDeSimbolos).valor;
  consola += "> " + cadena + "\n";
}

function procesarIf(instruccion, tablaDeSimbolos, returnValue) {
  var logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos);

  if (logica.valor) {
    var tsIf = new TS(tablaDeSimbolos.simbolos.slice());
    procesarBloque(instruccion.accion, tsIf, returnValue);
  } else {
    if (instruccion["else"] != "NELSE") {
      if (instruccion["else"].sentencia === SENTENCIAS.ELSE_IF) {
        var tsElIf = new TS(tablaDeSimbolos.simbolos.slice());
        procesarIf(instruccion["else"], tsElIf, returnValue);
      } else {
        var tsElse = new TS(tablaDeSimbolos.simbolos.slice());
        procesarBloque(instruccion["else"].accion, tsElse, returnValue);
      }
    }
  }
}

function procesarFor(instruccion, tablaDeSimbolos, returnValue) {
  procesarBloque([instruccion.inicial], tablaDeSimbolos, returnValue);
  var valor = procesarExpresionCadena(instruccion.inicial.expresion, tablaDeSimbolos);
  tablaDeSimbolos.actualizar(instruccion.inicial.id, valor);

  if (instruccion.paso == "++") {
    for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id); procesarExpresionNumerica(instruccion["final"], tablaDeSimbolos).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, {
      valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id).valor) + 1,
      tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id).tipo
    })) {
      procesarBloque(instruccion.accion, tablaDeSimbolos, returnValue);
    }
  } else if (instruccion.paso == "--") {
    for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id); procesarExpresionNumerica(instruccion["final"], tablaDeSimbolos).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, {
      valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id).valor) - 1,
      tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id).tipo
    })) {
      procesarBloque(instruccion.accion, tablaDeSimbolos, returnValue);
    }
  } else {
    for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id); procesarExpresionNumerica(instruccion["final"], tablaDeSimbolos).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, {
      valor: Number(procesarExpresionNumerica(instruccion.paso, tablaDeSimbolos).valor),
      tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id).tipo
    })) {
      procesarBloque(instruccion.accion, tablaDeSimbolos, returnValue);
    }
  }
}

function procesarFuncion(instruccion, tablaDeSimbolos) {
  var funcion = tablaDeSimbolos.obtenerFuncion("f_" + instruccion.id);

  if (funcion.parametros != "NA" && instruccion.parametros == "NA") {
    throw 'ERROR: el método ' + instruccion.id + ' no peude ser ejecutado con los parámetros dados.';
  } else if (funcion.parametros == "NA" && instruccion.parametros != "NA") {
    throw 'ERROR: el método ' + instruccion.id + ' no peude ser ejecutado con los parámetros dados.';
  } else if (funcion.parametros != "NA" && instruccion.parametros != "NA") {
    //declarar variables de parametros
    var parametros = [];
    procesarParametros(funcion.parametros, tablaDeSimbolos, parametros); //asignar valores

    var instanceValues = instruccion.parametros;
    var x = 0;

    while (instanceValues != "NM") {
      instanceValues = instanceValues.siguiente;
      x++;
    }

    if (x != parametros.length) throw 'ERROR: el método ' + instruccion.id + ' no puede ser aplicado con los parámetros obtenidos.\nrequeridos: ' + parametros.length + '\nobtenidos: ' + x;
    instanceValues = instruccion.parametros;
    x = 0;

    while (instanceValues != "NM") {
      tablaDeSimbolos.actualizar(parametros[x], procesarExpresionCadena(instanceValues.expresion));
      instanceValues = instanceValues.siguiente;
      x++;
    } //ejecutar acciones


    return procesarBloque(funcion.accion, tablaDeSimbolos, funcion.tipo); //ver si retorna o no un valor
    //verificar el tipo de retorno
  } else {
    //ejectuar funcion
    return procesarBloque(funcion.accion, tablaDeSimbolos, funcion.tipo);
  }
}

function procesarParametros(instruccion, tablaDeSimbolos, IdArray) {
  while (instruccion != "NM") {
    procesarDeclaracion(instruccion, tablaDeSimbolos);
    IdArray.push(instruccion.id);
    instruccion = instruccion.siguiente;
  }
}

function procesarReturn(instrucciones, tablaDeSimbolos, returnValue) {
  if (returnValue === TIPO_DATO.STRING) {
    var valor = procesarExpresionCadena(instrucciones.valor, tablaDeSimbolos);
    if (returnValue !== valor.tipo) throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + returnValue;
    return valor;
  } else {
    var _valor6 = procesarExpresionNumerica(instrucciones.valor, tablaDeSimbolos);

    if (returnValue !== _valor6.tipo) throw 'ERROR: Incompatibilidad de tipos: ' + _valor6.tipo + ' no se puede convertir en ' + returnValue;
    return _valor6;
  }
}