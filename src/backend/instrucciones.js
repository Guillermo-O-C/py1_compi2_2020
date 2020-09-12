const TIPO_VALOR = {
    NUMERO: 'NUMERO',
    DECIMAL: 'DECIMAL',
    IDENTIFICADOR: 'IDENTIFICADOR',
    CADENA: 'CADENA',
    CARACTER: 'CARACTER',
    TRUE: 'TRUE',
    FALSE: 'FALSE',
    OBJETO: 'OBJETO',
    ANONYMOUS_FUNCTION: 'ANONYMOUS_FUNCTION',
    CADENA_EJECUTABLE: 'CADENA_EJECUTABLE',
    CADENA_CHARS:'CADENA_CHARS',
    NULL:'NULL'
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
    DECREMENTO: 'DECREMENTO',
    FOR_OF:'FOR_OF',
    FOR_IN:'FOR_IN',
    ACCESO_POSICION:'ACCESO_POSICION',
    TYPE_DECLARATION:'TYPE_DECLARATION',
    PUSH:'PUSH',
    POP:'POP',
    LENGTH:'LENGTH',
    ACCESO:'ACCESO',
    GRAFICAR_TS:'GRAFICAR_TS',
    ASIGNACION_SUMA:'ASIGNACION_SUMA',
    ASIGNACION_RESTA:'ASIGNACION_RESTA'
};
const TIPO_DATO = {
    NUMBER: 'NUMBER',
    BOOLEAN: 'BOOLEAN',
    STRING: 'STRING',
    OBJETO: 'OBJETO',
    VOID:'VOID',
    ARRAY: 'ARRAY',
    TYPE: 'TYPE',
    OPERADOR_TERNARIO: 'OPERADOR_TERNARIO'
};
const TIPO_ACCESO={
    ATRIBUTO:'ATRIBUTO',
    POSICION:'POSICION'
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

function crearSimbolo(var_type, id, tipo, valor, ambito, fila, columna) {
    return {
        si:'variable',
        var_type:var_type,
        id: id,
        tipo: tipo,
        valor: valor,
        ambito:ambito,
        fila:fila,
        columna:columna
    }
}

function crearFuncion(id, tipo, parametros, accion,ambito, fila, columna) {
    return {
        si:'funcion',
        id: id,
        tipo: tipo,
        parametros: parametros,
        accion: accion,
        ambito:ambito,
        fila:fila,
        columna:columna
    }
}

function crearType(id, atributos, fila, columna){
    return{
        si:'type',
        id:id,
        atributos:atributos,
        fila:fila,
        columna:columna
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = simbolos;
    }

    agregar(var_type, id, tipo, valor, ambito, fila, columna) {
        const nuevoSimbolo = crearSimbolo(var_type, id, tipo, valor, ambito, fila, columna);
        this._simbolos.push(nuevoSimbolo);
    }

    agregarFuncion(id, tipo, parametros, accion, ambito, fila, columna) {
        const nuevaFuncion = crearFuncion(id, tipo, parametros, accion, ambito, fila, columna);
        this._simbolos.push(nuevaFuncion);
    }

    agregarType(id, atributos, fila, columna){
        const nuevoType= crearType(id, atributos, fila, columna);
        this._simbolos.push(nuevoType);
    }

    actualizar(id, valor) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo.tipo != valor.tipo) throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + simbolo.tipo;
        if (simbolo) simbolo.valor = valor.valor;
        else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }

    obtenerSimbolo(id, ambito) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id && ambito.includes(simbolo.ambito))[0];
        if (simbolo) return { valor: simbolo.valor, tipo: simbolo.tipo };
        else throw 'ERROR: variable: ' + id + ' no ha sido declarada.';
    }
    obtenerFuncion(id) {
        const funcion = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (funcion) return { tipo: funcion.tipo, parametros: funcion.parametros, accion: funcion.accion };
        else throw 'ERROR: no existe ninguna función llamada: ' + id + '.';
    }
    obtenerType(id) {
        const type = this._simbolos.filter(simbolo => simbolo.id === id && simbolo.si=="type")[0];
        if (type) return { atributos:type.atributos };
        else throw 'ERROR: no existe ningun type llamado: ' + id + '.';
    }
    existeType(id){
        const type = this._simbolos.filter(simbolo => simbolo.id === id && simbolo.si=="type")[0];
        if (type) return true;
    }
    updateFuncionID(id,  newID) {
        const funcion = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (funcion) {
            funcion.oldID=funcion.id;
            funcion.id=newID;
            return true;
        }
        else throw 'ERROR: no existe ninguna función llamada: ' + id + '.';
    }
    changeOldIDCall(id){
        const funcion = this._simbolos.filter(simbolo => simbolo.oldID === id)[0];
        if (funcion) {
            return funcion.id;
        }
        else throw 'ERROR: no existe ninguna función llamada: ' + id + '.';
    }
    existe(id, ambito) {
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id && ambito == simbolo.ambito)[0];
        if (simbolo) return true;
        else return false;
    }

    get simbolos() {
        return this._simbolos;
    }
}

function Data_Type(tipo) {
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
    nuevaDeclaracion: function(variable_type, id, data_type, valor, next_declaration, fila, columna) {
        return {
            sentencia: SENTENCIAS.DECLARACION,
            variable_type:Variable_Type(variable_type),
            data_type: Data_Type(data_type.tipo),
            isArray:data_type.isArray,
            id: id,
            expresion: valor,
            next_declaration:next_declaration,
            fila:fila,
            columna:columna
        };
    },
    nuevoID:function( id, data_type, valor,  next_declaration, fila, columna){
      return{
        data_type: Data_Type(data_type.tipo),
        isArray:data_type.isArray,
        id: id,
        expresion: valor,
        next_declaration:next_declaration,
        fila:fila,
        columna:columna
      };  
    },
    nuevoObjeto:function(atributos){
        return{
            tipo:TIPO_VALOR.OBJETO,
            atributos:atributos
        };
    },
    nuevoObjAtributo:function(id, valor, next){
        return{
            id:id,
            valor:valor,
            next:next
        };
    },
    nuevoTypeAtributo:function(id, data_type, next){
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
    nuevoType: function(id, atributos, fila, columna){
        return{
            sentencia:SENTENCIAS.TYPE_DECLARATION,
            data_type:TIPO_DATO.TYPE,
            id:id,
            atributos:atributos,
            fila:fila,
            columna:columna
        };
    },
    nuevoOperadorTernario:function(logica, result1, result2){
        return{
            data_type:TIPO_DATO.OPERADOR_TERNARIO,
            logica:logica,
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
    nuevoCase: function(logica, accion, next_case){
        return{
            logica:logica,
            accion:accion,
            next_case:next_case
        };
    },
    nuevoDefault: function(accion){
        return{
            logica:'default',
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
    nuevoForOF:function(variable,conjunto,  accion){
        return{
            sentencia:SENTENCIAS.FOR_OF,
            conjunto:conjunto,
            variable:variable,
            accion:accion
        };
    },
    nuevoForIn:function(variable,conjunto,  accion){
        return{
            sentencia:SENTENCIAS.FOR_IN,
            conjunto:conjunto,
            variable:variable,
            accion:accion
        };
    },
    nuevoWhile:function(logica, accion){
      return{
          sentencia:SENTENCIAS.WHILE,
          logica:logica,
          accion:accion
      };  
    },
    nuevoDoWhile:function(accion, logica){
        return{
            sentencia:SENTENCIAS.DO_WHILE,
            logica:logica,
            accion:accion
        };  
      },
    nuevaFuncion: function(tipo, id, parametros, accion,fila,columna) {
        return {
            sentencia: SENTENCIAS.FUNCION,
            tipo: Data_Type(tipo),
            id: id,
            parametros: parametros,
            accion: accion,
            fila:fila,
            columna:columna
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
    nuevoParametro: function(tipo, id, siguiente, opcional) {
        return {
            tipo: Data_Type(tipo),
            id: id,
            siguiente: siguiente,
            opcional:opcional
        };
    },
    nuevoReturn: function(valor) {
        return {
            sentencia: SENTENCIAS.RETURN,
            valor: valor
        };
    },
    nuevoArrayIndex: function(index, next_index){
        return{
            index:index,
            next_index:next_index
        };
    },
    nuevoAccesoAPosicion: function(id, index, next_index){
        return{
            sentencia:SENTENCIAS.ACCESO_POSICION,
            id:id,
            index:index,
            next_index:next_index
        };
    },
    nuevoDecremento: function(id){
        return{
            sentencia:SENTENCIAS.DECREMENTO,
            id:id
        };
    },
    nuevoIncremento: function(id){
        return{
            sentencia:SENTENCIAS.INCREMENTO,
            id:id
        };
    },
    nuevoPush: function(valor){
        return{
            sentencia:SENTENCIAS.PUSH,
            valor:valor
        };
    },
    nuevoPop: function(){
        return{            
            sentencia:SENTENCIAS.POP
        };
    },
    nuevoLength: function(){
        return{            
            sentencia:SENTENCIAS.LENGTH
        };
    },
    nuevaReferencia:function(id, acc){
        return{
            id:id,
            acc:acc
        };
    },
    nuevoAccPosicion:function(index, next_acc){
        return{
            acc_type:TIPO_ACCESO.POSICION,
            index:index,
            next_acc:next_acc
        };
    },
    nuevoAccAtributo:function(atributo, next_acc){
        return{
            acc_type:_TIPO_ACCESO.ATRIBUTO,
            atributo:atributo,
            next_acc:next_acc
        };
    },
    nuevoContinue:function(){
        return{
            sentencia:SENTENCIAS.CONTINUE
        };
    },
    nuevoBreak:function(){
        return{
            sentencia:SENTENCIAS.BREAK
        };
    },
    nuevoAcceso: function(id){
        return{
            sentencia:SENTENCIAS.ACCESO,
            id:id
        };
    },
    nuevoGraficarTS:function(){
        return{
            sentencia:SENTENCIAS.GRAFICAR_TS
        };
    },
    nuevoAsignacioSuma:function(id, valor){
        return{
            sentencia:SENTENCIAS.ASIGNACION_SUMA,
            id:id,
            valor:valor
        };
    },
    nuevoAsignacioResta:function(id, valor){
        return{
            sentencia:SENTENCIAS.ASIGNACION_RESTA,
            id:id,
            valor:valor
        };
    },

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
const _TIPO_ACCESO = TIPO_ACCESO;
export {_TIPO_ACCESO as TIPO_ACCESO};