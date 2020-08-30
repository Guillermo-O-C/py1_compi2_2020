"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Traducir;

var _instrucciones = require("./instrucciones");

function Traducir(salida, consola, traduccion) {
  // console.log("this is the output"+  JSON.stringify(salida.AST)); 
  var output = "";

  try {
    consola.value = "";
    var tsGlobal = new _instrucciones.TS([]);
    procesarBloque(salida.AST, tsGlobal, "Global");
    traduccion.setValue(output);
  } catch (e) {
    console.error(e);
    return;
  }

  function procesarBloque(instrucciones, tablaDeSimbolos, ambito) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = instrucciones[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var instruccion = _step.value;

        if (instruccion.sentencia === _instrucciones.SENTENCIAS.DECLARACION) {
          procesarDeclaracion(instruccion, tablaDeSimbolos);
        } else if (instruccion.sentencia === _instrucciones.SENTENCIAS.TYPE_DECLARATION) {
          procesarTypeDeclaration(instruccion, tablaDeSimbolos, ambito);
        } else if (instruccion.sentencia === _instrucciones.SENTENCIAS.IF) {
          procesarIf(instruccion, tablaDeSimbolos, ambito);
        } else if (instruccion.sentencia === _instrucciones.SENTENCIAS.IMPRIMIR) {
          procesarImpresion(instruccion);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function procesarDeclaracion(instruccion, tablaDeSimbolos, ambitos) {
    output += Variable_Type(instruccion.variable_type) + " ";
    var temp = instruccion;

    while (temp != "Epsilon") {
      if (temp != instruccion) output += ",";

      if (temp.data_type === "infer") {
        output += temp.id;
      } else {
        output += temp.id + ":" + Data_Type(temp.data_type);

        if (temp.isArray != false) {
          var temporal = temp.isArray;

          while (temporal.dimension === true) {
            output += "[]";
            temporal = temporal.next_dimension;
          }
        }
      }

      if (temp.expresion != "undefined") {
        output += "=" + procesarExpresionNumerica(temp.expresion);
      }

      temp = temp.next_declaration;
    }

    output += ";\n";
  }

  function Data_Type(tipo) {
    if (tipo === _instrucciones.TIPO_DATO.NUMBER) {
      return "number";
    } else if (tipo === _instrucciones.TIPO_DATO.BOOLEAN) {
      return "boolean";
    } else if (tipo === _instrucciones.TIPO_DATO.STRING) {
      return "string";
    } else if (tipo === _instrucciones.TIPO_DATO.VOID) {
      return "void";
    } else {
      return tipo;
    }
  }

  function Variable_Type(tipo) {
    if (tipo === _instrucciones.TIPO_VARIABLE.LET) {
      return "let";
    }

    if (tipo === _instrucciones.TIPO_VARIABLE.CONST) {
      return "const";
    }
  }

  function procesarExpresionNumerica(expresion) {
    if (expresion.sentencia === _instrucciones.SENTENCIAS.LLAMADA) {
      return procesarLLamada(expresion);
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.NEGATIVO) {
      return "(-" + expresion + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.SUMA) {
      var valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
      var valorDer = procesarExpresionNumerica(expresion.operandoDer);
      return "(" + valorIzq + "+" + valorDer + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.RESTA) {
      var _valorIzq = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq + "-" + _valorDer + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MULTIPLICACION) {
      var _valorIzq2 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer2 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq2 + "*" + _valorDer2 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.DIVISION) {
      var _valorIzq3 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer3 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq3 + "/" + _valorDer3 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.POTENCIA) {
      var _valorIzq4 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer4 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq4 + "**" + _valorDer4 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MODULO) {
      var _valorIzq5 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer5 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq5 + "%" + _valorDer5 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MAYOR) {
      var _valorIzq6 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer6 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq6 + ">" + _valorDer6 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MAYOR_IGUAL) {
      var _valorIzq7 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer7 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq7 + ">=" + _valorDer7 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MENOR) {
      var _valorIzq8 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer8 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq8 + "<" + _valorDer8 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.MENOR_IGUAL) {
      var _valorIzq9 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer9 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq9 + "<=" + _valorDer9 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.IGUAL_IGUAL) {
      var _valorIzq10 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer10 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq10 + "==" + _valorDer10 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.DISTINTO) {
      var _valorIzq11 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer11 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq11 + "!=" + _valorDer11 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.AND) {
      var _valorIzq12 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer12 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq12 + "&&" + _valorDer12 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.OR) {
      var _valorIzq13 = procesarExpresionNumerica(expresion.operandoIzq);

      var _valorDer13 = procesarExpresionNumerica(expresion.operandoDer);

      return "(" + _valorIzq13 + "||" + _valorDer13 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_OPERACION.NOT) {
      var _valorIzq14 = procesarExpresionNumerica(expresion.operandoIzq);

      return "(!" + _valorIzq14 + ")";
    } else if (expresion.tipo === _instrucciones.TIPO_VALOR.NUMERO) {
      return expresion.valor;
    } else if (expresion.tipo === _instrucciones.TIPO_VALOR.TRUE) {
      return "true";
    } else if (expresion.tipo === _instrucciones.TIPO_VALOR.FALSE) {
      return "false";
    } else if (expresion.tipo === _instrucciones.TIPO_VALOR.IDENTIFICADOR) {
      return expresion.valor;
    } else if (expresion.tipo === _instrucciones.TIPO_VALOR.OBJETO) {
      return procesarObjeto(expresion);
    } else if (expresion.data_type === _instrucciones.TIPO_DATO.ARRAY) {
      return procesarArreglo(expresion);
    } else if (expresion.data_type === _instrucciones.TIPO_DATO.OPERADOR_TERNARIO) {
      return procesarOperadorTernario(expresion);
    } else if (expresion.sentencia === _instrucciones.SENTENCIAS.ACCESO_POSICION) {
      return procesarAccesoAPosicion(expresion);
    } else {
      throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
    }
  }

  function procesarLLamada(llamada) {
    var text = llamada.id + "(";
    text += procesarArgumentos(llamada.parametros);
    text += ")";
    return text;
  }

  function procesarArgumentos(argumentos) {
    var text = "";
    var temp = argumentos;

    while (temp != "Epsilon") {
      if (temp != argumentos) text += ",";
      text += procesarExpresionNumerica(temp.expresion);
      temp = temp.siguiente;
    }

    return text;
  }

  function procesarObjeto(objeto) {
    var text = "{\n";
    var temp = objeto.atributos;

    while (temp != "Epsilon") {
      text += temp.id + ":" + procesarExpresionNumerica(temp.valor) + "\n";
      temp = temp.next;
    }

    return text + "}";
  }

  function procesarArreglo(arreglo) {
    var text = "";
    text += "[";

    if (arreglo.dimension != "Epsilon") {
      text += procesarElementosDeArray(arreglo.dimension);
    }

    return text + "]";
  }

  function procesarElementosDeArray(datos) {
    var text = "";
    var temp = datos;

    while (temp != "Epsilon") {
      if (temp != datos) text += ",";
      text += procesarExpresionNumerica(temp.dato);
      temp = temp.next_data;
    }

    return text;
  }

  function procesarOperadorTernario(operacion) {
    var text = "";
    text += procesarExpresionNumerica(operacion.logica) + "?";
    text += procesarExpresionNumerica(operacion.result1) + ":";
    text += procesarExpresionNumerica(operacion.result2);
    return text;
  }

  function procesarAccesoAPosicion(acceso) {
    var text = acceso.id;
    var temp = acceso;

    while (temp != "false") {
      text += "[" + procesarExpresionNumerica(temp.index) + "]";
      temp = temp.next_index;
    }

    return text;
  }

  function procesarTypeDeclaration(declaracion, tablaDeSimbolos) {
    output += "type " + declaracion.id + "={\n";
    var temp = declaracion.atributos;

    while (temp != "Epsilon") {
      if (temp != declaracion.atributos) output += ",\n";

      if (temp.data_type.tipo === "infer") {
        output += temp.id;
      } else {
        output += temp.id + ":" + Data_Type(temp.data_type.tipo);

        if (temp.isArray != false) {
          var temporal = temp.data_type.isArray;

          while (temporal.dimension === true) {
            output += "[]";
            temporal = temporal.next_dimension;
          }
        }
      }

      temp = temp.next;
    }

    output += "\n};\n";
  }

  function procesarIf(instruccion, tablaDeSimbolos, ambito) {
    output += "if(" + procesarExpresionNumerica(instruccion.logica) + "){\n";
    procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
    output += "}";

    if (instruccion["else"] != "Epsilon") {
      var temp = instruccion["else"];

      while (temp.sentencia != _instrucciones.SENTENCIAS.ELSE && temp != "Epsilon") {
        output += "else if(" + procesarExpresionNumerica(temp.logica) + "){\n";
        procesarBloque(temp.accion, tablaDeSimbolos, ambito);
        output += "}";
        temp = temp["else"];
      }

      if (temp.sentencia == _instrucciones.SENTENCIAS.ELSE) {
        output += "else{\n";
        procesarBloque(temp.accion, tablaDeSimbolos, ambito);
        output += "}";
      }
    }

    output += "\n";
  }

  function procesarImpresion(instruccion) {
    output += "console.log(" + procesarExpresionNumerica(instruccion.valor) + ");\n";
  }
}