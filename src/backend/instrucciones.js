const TIPO_VALOR = {
    NUMERO: 'NUMERO',
    DECIMAL: 'DECIMAL',
    IDENTIFICADOR: 'IDENTIFICADOR',
    CADENA: 'CADENA',
    CARACTER: 'CARACTER',
    TRUE: 'TRUE',
    FALSE: 'FALSE',
    OBJETO: 'OBJETO'
};
const TIPO_OPERACION = {
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
const SENTENCIAS = {
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
const TIPO_DATO = {
    NUMBER: 'NUMBER',
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    OBJETO: 'OBJETO',
    VOID:'VOID',
    TYPES:'TYPES',
    ARRAY: 'ARRAY',
    TYPE: 'TYPE',
    OPERADOR_TERNARIO: 'OPERADOR_TERNARIO'
};
const TIPO_VARIABLE ={
    LET: 'LET',
    CONST: 'CONST'
};
function nuevaOperacion(operandoIzq, OperandoDer, tipo) {
    return {
        operandoIzq: operandoIzq,
        operandoDer: OperandoDer,
        tipo: tipo
    }
}

function crearSimbolo(id, tipo, valor) {
    return {
        id: id,
        tipo: tipo,
        valor: valor
    }
}

function crearFuncion(id, tipo, parametros, accion) {
    return {
        id: id,
        tipo: tipo,
        parametros: parametros,
        accion: accion
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = simbolos;
    }

    agregar(id, tipo) {
        const nuevoSimbolo = crearSimbolo(id, tipo);
        this._simbolos.push(nuevoSimbolo);
    }

    agregarFuncion(id, tipo, parametros, accion) {
        const nuevaFuncion = crearFuncion(id, tipo, parametros, accion);
        this._simbolos.push(nuevaFuncion);
    }

    actualizar(id, valor) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo.tipo != valor.tipo) throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + simbolo.tipo;
        if (simbolo) simbolo.valor = valor.valor;
        else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }

    obtenerSimbolo(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) return { valor: simbolo.valor, tipo: simbolo.tipo };
        else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }
    obtenerFuncion(id) {
        const funcion = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (funcion) return { tipo: funcion.tipo, parametros: funcion.parametros, accion: funcion.accion };
        else throw 'ERROR: no existe ninguna función llamada: ' + id + '.';
    }

    existe(id) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) return true;
        else return false;
    }

    get simbolos() {
        return this._simbolos;
    }
}

function Data_Type(tipo) {
    console.log(tipo);
    if (tipo === "number") {
        return TIPO_DATO.NUMBER;
    }else if (tipo === "boolean") {
        return TIPO_DATO.BOOLEAN;
    }else if (tipo === "string") {
        return TIPO_DATO.STRING;
    }else if (tipo === "void") {
        return TIPO_DATO.VOID;
    }else{
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
const instruccionesAPI = {
    nuevaOperacionBinaria: function(Izq, Der, tipo) {
        return nuevaOperacion(Izq, Der, tipo);
    },
    nuevaOperacionUnaria: function(izq, tipo) {
        return nuevaOperacion(izq, undefined, tipo);
    },
    nuevoValor: function(valor, tipo) {
        return {
            tipo: tipo,
            valor: valor
        };
    },
    nuevaDeclaracion: function(variable_type, id, valor, data_type) {
        console.log(data_type);
        return {
            sentencia: SENTENCIAS.DECLARACION,
            variable_type:Variable_Type(variable_type),
            data_type: Data_Type(data_type.tipo),
            isArray:data_type.isArray,
            id: id,
            expresion: valor
        };
    },
    nuevoObjeto:function(atributos){
        return{
            tipo:TIPO_VALOR.OBJETO,
            atributos:atributos
        };
    },
    nuevoAtributo:function(id, data_type, next){
        return{
            id:id,
            data_type:Data_Type(data_type),
            next:next
        };
    },
    nuevaDimension:function(next_dimension){
      return{
          dimension:true,
          next_dimension:next_dimension
        };
    },
    nuevoTipo: function (tipo, isArray) {
      return{
          tipo:tipo,
          isArray:isArray
      };  
    },
    nuevoArray: function(dimension){
        return{
            data_type:TIPO_DATO.ARRAY,
            dimension:dimension
        };
    },
    nuevoDato: function (dato, next_data) {
      return{
          dato:dato,
          next_data:next_data
      };  
    },
    nuevoType: function(id, atributos){
        return{
            data_type:TIPO_DATO.TYPE,
            id:id,
            atributos:atributos
        };
    },
    nuevoOperadorTernario:function(condicion, result1, result2){
        return{
            data_type:TIPO_DATO.OPERADOR_TERNARIO,
            condicion:condicion,
            result1:result1,
            result2:result2
        };
    },
    nuevaAsignacion: function(id, valor) {
        return {
            sentencia: SENTENCIAS.ASIGNACION,
            id: id,
            expresion: valor
        };
    },
    nuevoImprimir: function(valor) {
        return {
            sentencia: SENTENCIAS.IMPRIMIR,
            valor: valor
        };
    },
    nuevoIf: function(logica, sentencias, elseT) {
        return {
            sentencia: SENTENCIAS.IF,
            logica: logica,
            accion: sentencias,
            else: elseT
        };
    },
    nuevoElseIf: function(logica, sentencias, elseT) {
        return {
            sentencia: SENTENCIAS.ELSE_IF,
            logica: logica,
            accion: sentencias,
            else: elseT
        };
    },
    nuevoElse: function(sentencias) {
        return {
            sentencia: SENTENCIAS.ELSE,
            accion: sentencias
        };
    },
    nuevoSwitch: function(logica, cases){
        return{
            sentencia:SENTENCIAS.SWITCH,
            logica:logica,
            cases:cases
        };
    },
    nuevoCase: function(condicion, accion, next_case){
        return{
            condicion:condicion,
            accion:accion,
            next_case:next_case
        };
    },
    nuevoDefault: function(accion){
        return{
            condicion:'default',
            accion:accion
            //podía llevar casos después pero aún no lo he hecho
        };
    },
    nuevoFor: function(inicial, final, paso, sentencias) {
        return {
            sentencia: SENTENCIAS.FOR,
            inicial: inicial,
            final: final,
            paso: paso,
            accion: sentencias
        };
    },
    nuevoMain: function(sentencias) {
        return {
            sentencia: SENTENCIAS.MAIN,
            accion: sentencias
        };
    },
    nuevaFuncion: function(tipo, id, parametros, accion) {
        return {
            sentencia: SENTENCIAS.FUNCION,
            tipo: Data_Type(tipo),
            id: id,
            parametros: parametros,
            accion: accion
        }
    },
    nuevaListaid: function(id, siguiente) {
        return {
            id: id,
            siguiente: siguiente
        };
    },
    nuevaLlamada: function(id, parametros) {
        return {
            sentencia: SENTENCIAS.LLAMADA,
            id: id,
            parametros: parametros
        };
    },
    nuevoArgumento: function(expresion, siguiente) {
        return {
            expresion: expresion,
            siguiente: siguiente
        };
    },
    nuevoParametro: function(tipo, id, siguiente) {
        return {
            tipo: Data_Type(tipo),
            id: id,
            siguiente: siguiente
        };
    },
    nuevoReturn: function(valor) {
        return {
            sentencia: SENTENCIAS.RETURN,
            valor: valor
        };
    }
};

const _TIPO_OPERACION = TIPO_OPERACION;
export { _TIPO_OPERACION as TIPO_OPERACION };
const _TIPO_VARIABLE = TIPO_VARIABLE;
export { _TIPO_VARIABLE as TIPO_VARIABLE };
const _SENTENCIAS = SENTENCIAS;
export { _SENTENCIAS as SENTENCIAS };
const _TIPO_VALOR = TIPO_VALOR;
export { _TIPO_VALOR as TIPO_VALOR };
const _instruccionesAPI = instruccionesAPI;
export { _instruccionesAPI as instruccionesAPI };
const _TIPO_DATO = TIPO_DATO;
export { _TIPO_DATO as TIPO_DATO };
const _TS = TS;
export { _TS as TS };