import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Ejecutar(salida, consola, traduccion, printedTable){
   // console.log("this is the output"+  JSON.stringify(salida.AST)); 
   let output="";
   try {
        consola.value="";
        const tsGlobal = new TS([]);
        scanForFunctions(salida.AST, tsGlobal, "Global");
        scanForTypes(salida.AST, tsGlobal);
        procesarBloque(salida.AST, tsGlobal, "Global");
        traduccion.setValue(output);
        setSalida(salida.Errores);
        console.log(tsGlobal);
        sendTable(tsGlobal);
    } catch (e) {
        console.error(e);
        return;
    }
    function procesarBloque(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
            if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
                procesarDeclaracion(instruccion, tablaDeSimbolos, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
                procesarAsigacion(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IMPRIMIR){
                procesarImpresion(instruccion, tablaDeSimbolos, ambito);
            }
        }
    }
    function setSalida(Errores){
        for(let error of Errores){
            consola.value+="> "+error+"\n";
        }
    }
    function sendTable(tablaDeSimbolos){
        printedTable.tsEj=tablaDeSimbolos;
        printedTable.erEj=salida.ErrArr;
    }
    function scanForFunctions(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
                if(instruccion.sentencia==SENTENCIAS.FUNCION){
                    if(ambito=="Global"){   
                            tablaDeSimbolos.agregarFuncion(instruccion.id, procesarDataType(instruccion.tipo), procesarParametros(instruccion.parametros), instruccion.accion, ambito, instruccion.fila, instruccion.columna);
                            scanForFunctions(instruccion.accion, tablaDeSimbolos, instruccion.id);
                    }else{      
                        consola.value+='>ERROR: Funciones anidadas en la función:'+ambito;  
                        throw '>ERROR: Funciones anidadas en la función:'+ambito;
                    } 
                }  
        }    
    }
    function scanForTypes(instrucciones, tablaDeSimbolos){
        for(let instruccion of instrucciones){
            if(instruccion.sentencia==SENTENCIAS.TYPE_DECLARATION){
                tablaDeSimbolos.agregarType(instruccion.id, procesarAtributos(instruccion.atributos), instruccion.fila, instruccion.columna);
            }
        }
    }
    function procesarAtributos(atributos){
        let tempAtributos = [];
        let temp = atributos;
        while(temp!="Epsilon"){
            tempAtributos.push({id:temp.id, data_type:procesarDataType(temp.data_type)});
            temp=temp.next;
        }
        return tempAtributos;
    }
    function procesarDataType(data_description){
        let dimension =0;
        let temp=data_description.isArray;
        while(temp!=false){
            dimension++;
            temp=temp.next_dimension;
        }
        return {type:data_description.tipo, dimensiones:dimension}
    }
    function primitive_Data(tipo){
        if (tipo === TIPO_DATO.NUMBER) {
            return "number";
        }else if (tipo === TIPO_DATO.BOOLEAN) {
            return "boolean";
        }else if (tipo === TIPO_DATO.STRING) {
            return "string";
        }else if (tipo === TIPO_DATO.VOID) {
            return "void";
        }else{
            return tipo;
        }
    }
    function procesarParametros(parametros){
        let temporal=[];
        let temp = parametros;
        while(temp!="Epsilon"){

            temporal.push({id:temp.id, data_type: procesarDataType(temp.tipo)});
            temp=temp.siguiente;
        }
        return temporal;
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        let temp= instruccion;
        while(temp!="Epsilon"){
            crearSimbolo(instruccion.variable_type, temp.id, {tipo:primitive_Data(temp.data_type), isArray:temp.isArray}, temp.expresion, ambito, tablaDeSimbolos, instruccion.fila, instruccion.columna);
            temp=temp.next_declaration;
        }
    }
    function procesarAsigacion(instruccion, tablaDeSimbolos, ambito){

    }
    function procesarImpresion(instruccion, tablaDeSimbolos, ambito){

    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        //Verificar que no exista en el mismo ámbito
        if(tablaDeSimbolos.existe(id, ambito)){
            consola.value+='>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';  
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';
        }
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(valor!="undefined"){
            if(data_type.tipo=="infer"){
                //asignar el tipo de valor a la variable
                valor=procesarExpresionNumerica(valor);
                //data_type=valor.tipo;
            }{
                //compara que está bien el tipo
            }
        }
        //Crear simbolo
        tablaDeSimbolos.agregar(var_type, id, procesarDataType(data_type), valor, ambito, fila, columna);
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
         //   const valor = procesarFuncion(expresion, tablaDeSimbolos);
            //return valor;
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            return { valor: valor * -1, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq + valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq - valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq * valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            if (valorDer == 0) throw 'Error: división entre 0 no está definida.';
            return { valor: valorIzq / valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq ** valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq % valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq > valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq >= valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq < valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq <= valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq == valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq != valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq && valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos).valor;
            return { valor: valorIzq || valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            return { valor: !valorIzq, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return { valor: expresion.valor, tipo: TIPO_VALOR.NUMERO};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return { valor: true, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return { valor: false, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            return tablaDeSimbolos.obtenerSimbolo(expresion.valor, ambito);
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: null, tipo: TIPO_DATO.NULL };
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
}