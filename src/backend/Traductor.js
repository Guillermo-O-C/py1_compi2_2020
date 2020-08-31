import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR } from "./instrucciones";

export default function Traducir(salida, consola, traduccion){
   // console.log("this is the output"+  JSON.stringify(salida.AST)); 
   let output="";
   try {
        consola.value="";
        const tsGlobal = new TS([]);
        procesarBloque(salida.AST, tsGlobal, "Global");
        traduccion.setValue(output);
    } catch (e) {
        console.error(e);
        return;
    }
    function procesarBloque(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
            if (instruccion.sentencia === SENTENCIAS.DECLARACION) {
                procesarDeclaracion(instruccion, tablaDeSimbolos, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.TYPE_DECLARATION) {
                procesarTypeDeclaration(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IF){
                procesarIf(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IMPRIMIR){
                procesarImpresion(instruccion);
            }else if(instruccion.sentencia === SENTENCIAS.SWITCH){
                procesarSwitch(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion==";"){
                console.log("En esta posición hay un error sintáctico.")
            }
        }
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        output+=Variable_Type(instruccion.variable_type)+" ";
        let temp = instruccion;
        while(temp!="Epsilon"){
            if(temp!=instruccion) output+=",";
                if(temp.data_type==="infer"){
                    output+=temp.id;
                }else{                
                    output+=temp.id+":"+Data_Type(temp.data_type);
                    if(temp.isArray!=false){
                        let temporal = temp.isArray;
                        while(temporal.dimension===true){
                            output+="[]";
                            temporal=temporal.next_dimension;
                        }
                    }
                }
            if(temp.expresion!="undefined"){
                output+="="+procesarExpresionNumerica(temp.expresion);
            }
            temp=temp.next_declaration;
        }
        output+=";\n";       
    }
    function Data_Type(tipo){
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
    function Variable_Type(tipo) {
        if (tipo === TIPO_VARIABLE.LET) {
            return "let";
        }
        if (tipo === TIPO_VARIABLE.CONST) {
            return "const";
        }
    }
    function procesarExpresionNumerica(expresion){
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            return procesarLLamada(expresion);
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            return "(-"+expresion+")";
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"+"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"-"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"*"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"/"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"**" +valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq+ "%" +valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq+ ">"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +">=" +valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"<"+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"<="+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"=="+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"!="+ valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq +"&&" +valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer);
            return "("+valorIzq+ "||" +valorDer+")";
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            return "(!"+valorIzq+")";
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return expresion.valor;
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return "true";
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return "false";
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            return expresion.valor;
        } else if (expresion.tipo === TIPO_VALOR.OBJETO) {
            return procesarObjeto(expresion);
        }else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArreglo(expresion);
        }else if (expresion.data_type === TIPO_DATO.OPERADOR_TERNARIO) {
            return procesarOperadorTernario(expresion);
        }else if (expresion.sentencia === SENTENCIAS.ACCESO_POSICION) {
            return procesarAccesoAPosicion(expresion);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            return "\""+expresion.valor+"\"";
        }else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function procesarLLamada(llamada){
        let text=llamada.id+"(";
        text+=procesarArgumentos(llamada.parametros);
        text+=")";
        return text;
    }
    function procesarArgumentos(argumentos){
        let text="";
        let temp = argumentos;
        while(temp!="Epsilon"){
            if(temp!=argumentos) text+=",";
            text+=procesarExpresionNumerica(temp.expresion);
            temp=temp.siguiente;
        }
        return text;
    }
    function procesarObjeto(objeto){
        let text="{\n";
        let temp = objeto.atributos;
        while(temp!="Epsilon"){
            text+=temp.id+":"+procesarExpresionNumerica(temp.valor)+"\n";
            temp=temp.next;
        }
        return text+"}";
    }
    function procesarArreglo(arreglo){
         let text="";
         text+="[";
         if(arreglo.dimension!="Epsilon"){
            text+=procesarElementosDeArray(arreglo.dimension);
         }
         return text+"]";
    }
    function procesarElementosDeArray(datos){
        let text="";
        let temp=datos;
        while(temp!="Epsilon"){
            if(temp!=datos) text+=",";
            text+=procesarExpresionNumerica(temp.dato);
            temp=temp.next_data;
        }
        return text;
    }
    function procesarOperadorTernario(operacion){
        let text="";
        text+=procesarExpresionNumerica(operacion.logica)+"?";
        text+=procesarExpresionNumerica(operacion.result1)+":";
        text+=procesarExpresionNumerica(operacion.result2);
        return text;
    }
    function procesarAccesoAPosicion(acceso){
        let text=acceso.id;
        let temp = acceso;
        while(temp!="false"){
            text+="["+procesarExpresionNumerica(temp.index)+"]";
            temp=temp.next_index;
        }
        return text;
    }
    function procesarTypeDeclaration(declaracion, tablaDeSimbolos){
        output+="type "+declaracion.id+"={\n";
        let temp=declaracion.atributos;
        while(temp!="Epsilon"){
            if(temp!=declaracion.atributos) output+=",\n";
            if(temp.data_type.tipo==="infer"){
                output+=temp.id;
            }else{                
                output+=temp.id+":"+Data_Type(temp.data_type.tipo);
                if(temp.isArray!=false){
                    let temporal = temp.data_type.isArray;
                    while(temporal.dimension===true){
                        output+="[]";
                        temporal=temporal.next_dimension;
                    }
                }
            }           
            temp=temp.next;
        }
        output+="\n};\n";
    }
    function procesarIf(instruccion, tablaDeSimbolos, ambito){
        output+="if("+procesarExpresionNumerica(instruccion.logica)+"){\n";
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}";
        if(instruccion.else!="Epsilon"){
            let temp = instruccion.else;
            while(temp.sentencia!=SENTENCIAS.ELSE && temp != "Epsilon"){
                output+="else if("+procesarExpresionNumerica(temp.logica)+"){\n";
                procesarBloque(temp.accion, tablaDeSimbolos, ambito);
                output+="}";
                temp=temp.else;
            }
            if(temp.sentencia==SENTENCIAS.ELSE){
                output+="else{\n";
                procesarBloque(temp.accion, tablaDeSimbolos, ambito);
                output+="}"
            }
        }
        output+="\n";
    }
    function procesarImpresion(instruccion){
        output+="console.log("+procesarExpresionNumerica(instruccion.valor)+");\n";
    }
    function procesarSwitch(instruccion, tablaDeSimbolos, ambito){
        output+="switch("+procesarExpresionNumerica(instruccion.logica)+"){\n";
        let temp = instruccion.cases;
        while(temp!="Epsilon"){
            if(temp.logica=="default"){
                output+="default:{\n";
                procesarBloque(temp.accion);
                output+="}";
                break;
            }else{
                output+="case "+procesarExpresionNumerica(temp.logica)+":{\n";
                procesarBloque(temp.accion);
                output+="}";
            }
            temp=temp.next_case;
        }
        output+="\n}\n";
    }
}
