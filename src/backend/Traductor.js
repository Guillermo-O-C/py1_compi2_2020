import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Traducir(salida, consola, traduccion, tablaDeSalida){
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
                output+="\n";
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION) {
                procesarAsigacion(instruccion);
                output+="\n";
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION_SUMA) {
                procesarAsigacionSuma(instruccion);
                output+="\n";
            }else if (instruccion.sentencia === SENTENCIAS.ASIGNACION_RESTA) {
                procesarAsigacionResta(instruccion);
                output+="\n";
            }else if (instruccion.sentencia === SENTENCIAS.TYPE_DECLARATION) {
                procesarTypeDeclaration(instruccion, tablaDeSimbolos, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.IF){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarIf(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.IMPRIMIR){
                procesarImpresion(instruccion);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.SWITCH){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarSwitch(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.FOR){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarFor(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.FOR_IN){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarForIn(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.FOR_OF){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procecsarForOf(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.WHILE){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarWhile(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.DO_WHILE){
                const tsTemporal = new TS(tablaDeSimbolos.simbolos.slice());
                procesarDoWhile(instruccion, tsTemporal, ambito);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){
                output+=procesarLLamada(instruccion)+";\n";
            }else if(instruccion.sentencia === SENTENCIAS.RETURN){
                procesarReturn(instruccion);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.BREAK){
                output+="break;\n"
            }else if(instruccion.sentencia === SENTENCIAS.CONTINUE){
                output+="continue;\n";
            }else if(instruccion.sentencia === SENTENCIAS.INCREMENTO){
                procesarIncremento(instruccion);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.DECREMENTO){
                procesarDecremento(instruccion);
                output+="\n";
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                procesarIdentificador(instruccion.id);
            }else if(instruccion.sentencia === SENTENCIAS.FUNCION){
                procesarFuncion(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion==";"){
                console.log("En esta posición hay un error sintáctico.");
                //se ignora esta acción
            }
        }
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        output+=Variable_Type(instruccion.variable_type)+" ";
        let temp = instruccion;
        let data_type = "";
        while(temp!="Epsilon"){
            if(temp!=instruccion) output+=",";
                if(temp.data_type==="infer"){
                    output+=temp.id; 
                    tablaDeSimbolos.agregar(instruccion.variable_type,temp.id, "undefined", "undefined", ambito, temp.fila, temp.columna);
            
                }else{                
                    output+=temp.id+":"+Data_Type(temp.data_type);
                    if(temp.isArray!=false){
                        let temporal = temp.isArray;
                        while(temporal.dimension===true){
                            output+="[]";
                            temporal=temporal.next_dimension;
                        }
                    } 
                    tablaDeSimbolos.agregar(instruccion.variable_type,temp.id, {tipo:temp.data_type, isArray:temp.isArray}, "undefined", ambito, temp.fila, temp.columna);
            
                }
            if(temp.expresion!="undefined"){
                output+="="+procesarExpresionNumerica(temp.expresion);
            }
           temp=temp.next_declaration;
        }
        output+=";";       
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
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq);
            return "(-"+valorIzq+")";
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
            return procesarIdentificador(expresion.valor);
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
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            return "\'"+expresion.valor+"\'";
        } else if (expresion.tipo === TIPO_VALOR.CADENA_EJECUTABLE) {
            return "\`"+expresion.valor+"\`";
        }else if (expresion.tipo === TIPO_VALOR.NULL) {
            return "null";
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
        output+="\n};";
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
    }
    function procesarImpresion(instruccion){
        output+="console.log("+procesarExpresionNumerica(instruccion.valor)+");";
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
        output+="\n}";
    }
    function procesarIdentificador(identificador){
        let text="";
        text+=identificador.id;
        let temp = identificador.acc;
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){
                text+="."+temp.atributo;
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){
                text+="["+procesarExpresionNumerica(temp.index)+"]";
            }else if(temp.sentencia==SENTENCIAS.LENGTH){
                text+=".length";
                break;
            }else if(temp.sentencia==SENTENCIAS.PUSH){
                text+=".push("+procesarExpresionNumerica(temp.valor)+")";
                break;
            }else if(temp.sentencia==SENTENCIAS.POP){
                text+=".pop()";
                break;
            }
            temp=temp.next_acc;
        }
        return text;
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito){
        output+="for(";
        if(instruccion.inicial.sentencia==SENTENCIAS.ASIGNACION){
            output+=instruccion.inicial.id+"="+procesarExpresionNumerica(instruccion.inicial.expresion);
        }else if(instruccion.inicial.sentencia==SENTENCIAS.DECLARACION){
            procesarDeclaracion(instruccion.inicial, tablaDeSimbolos, ambito);
        }
        output+=procesarExpresionNumerica(instruccion.final)+";";
        if(instruccion.paso.paso=="++"){
            output+=instruccion.paso.id+"++){\n";
        }else  if(instruccion.paso.paso=="--"){
            output+=instruccion.paso.id+"--){\n";
        }else {
            output+=instruccion.paso.id+"="+procesarExpresionNumerica(instruccion.paso.paso)+"){\n";
        }
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}";//se le quitó el \n porque cada sentencia lleva un salto de línea al final
    }
    function procesarAsigacion(instruccion){
        output+=procesarIdentificador(instruccion.id)+"="+procesarExpresionNumerica(instruccion.expresion)+";";
    }
    function procecsarForOf(instruccion, tablaDeSimbolos, ambito){
        output+="for(let "+instruccion.variable+" of "+instruccion.conjunto+"){\n";
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}";
    }
    function procesarForIn(instruccion, tablaDeSimbolos, ambito){
        output+="for(let "+instruccion.variable+" in "+instruccion.conjunto+"){\n";
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}";
    }
    function procesarWhile(instruccion, tablaDeSimbolos, ambito){
        output+="while("+procesarExpresionNumerica(instruccion.logica)+"){\n";
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}"
    }
    function procesarDoWhile(instruccion, tablaDeSimbolos, ambito){
        output+="do{\n";
        procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        output+="}"+"while("+procesarExpresionNumerica(instruccion.logica)+");";
    }
    function procesarReturn(instruccion){
        output+="return "+procesarExpresionNumerica(instruccion.valor)+";";
    }
    function procesarIncremento(instruccion){
        output+=instruccion.id+"++;";
    }
    function procesarDecremento(instruccion){
        output+=instruccion.id+"--;";
    }
    function procesarFuncion(instrucciones, tablaDeSimbolos, ambito){
            let funciones=[];
            output+=(ambito=="Global")?"function "+instrucciones.id+"("+procesarParametros(instrucciones.parametros)+"):"+procesarTipo(instrucciones.tipo)+"{\n":"function "+ambito+"_"+instrucciones.id+"("+procesarParametros(instrucciones.parametros)+"):"+procesarTipo(instrucciones.tipo)+"{\n";
            if(ambito!="Global")tablaDeSimbolos.updateFuncionID(instrucciones.id, ambito+"_"+instrucciones.id);
            instrucciones.id=(ambito=="Global")?instrucciones.id:ambito+"_"+instrucciones.id;
            for(let instruccion of instrucciones.accion){
                if(instruccion.sentencia==SENTENCIAS.FUNCION){
                    funciones.push(instruccion);
                    output+="//origen de la función "+instruccion.id+"\n";
                }else{
                    procesarBloque([instruccion], tablaDeSimbolos, instrucciones.id);
                }
            }
            output+="}\n"
            for(let funcion of  funciones){
                procesarFuncion(funcion, tablaDeSimbolos, instrucciones.id);
            }
            //imprimir todas las funciones justo después de salir de la función padre
            //recorrer la función que se acaba de sacar para que saque a sus hijos
    }
    function scanForFunctions(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
            if(instruccion.sentencia==SENTENCIAS.FUNCION){
                tablaDeSimbolos.agregarFuncion(instruccion.id, instruccion.tipo, null, null, ambito, instruccion.fila, instruccion.columna);
                scanForFunctions(instruccion.accion, tablaDeSimbolos, instruccion.id);
            }
        }
    }
    function scanForTypes(instrucciones, tablaDeSimbolos){
        for(let instruccion of instrucciones){
            if(instruccion.sentencia==SENTENCIAS.TYPE_DECLARATION){
                tablaDeSimbolos.agregarType(instruccion.id, null, instruccion.fila, instruccion.columna);
            }
        }
    }
    function sendTable(tablaDeSimbolos){
        tablaDeSalida.tsTr=tablaDeSimbolos;
        tablaDeSalida.erTr=salida.ErrArr;
    }
    function procesarParametros(parametros){
        let text="";
        let temp = parametros;
        while(temp!="Epsilon"){
            if(temp!=parametros)text+=", ";
            text+=(temp.tipo.tipo=="infer")?temp.id:temp.id+":"+procesarTipo(temp.tipo);
            temp=temp.siguiente;
        }
        return text;
    }
    function procesarTipo(tipo){
        let text=tipo.tipo;
        if(tipo.isArray!=false){
            let temporal = tipo.isArray;
            while(temporal.dimension===true){
                text+="[]";
                temporal=temporal.next_dimension;
            }
        }
        return text;   
    }
    function lookForMethods(id){
        //se realiza este método para verificar que no vengan push, pop o length en la parte izquierda de ua igualdad 
        //se realiza también para saber que no viene un push en la parte derecha
        //se realiza en los métodos no en procesarBloque
    }
    function procesarAsigacionSuma(instruccion){
        output+=procesarIdentificador(instruccion.id)+"+="+procesarExpresionNumerica(instruccion.valor)+";";
    }
    function procesarAsigacionResta(instruccion){
        output+=procesarIdentificador(instruccion.id)+"-="+procesarExpresionNumerica(instruccion.valor)+";";
    }
    function setSalida(Errores){
        for(let error of Errores){
            consola.value+="> "+error+"\n";
        }
    } 
}
