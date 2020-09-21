import { parser } from "./expresiones";
import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Ejecutar(salida, consola, traduccion, printedTable, tablero){
   // console.log("this is the output"+  JSON.stringify(salida.AST)); 
   let output="";
   printedTable.erEj=salida.ErrArr;
   const tsGlobal = new TS([], consola);
   try {
        consola.value="";        
        scanForFunctions(salida.AST, tsGlobal, "Global");
        scanForTypes(salida.AST, tsGlobal);
        let returnedAcction =  procesarBloque(salida.AST, tsGlobal, "Global");
        if(returnedAcction!=undefined){
            if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                consola.value+='>ERROR: Break fuera de un ciclo.';  
                throw '>ERROR: Break fuera de un ciclo.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                consola.value+='>ERROR: Return fuera de una función.';  
                throw '>ERROR:Return fuera de una función.';  
            }else if(returnedAcction.sentencia===SENTENCIAS.CONTINUE){
                consola.value+='>ERROR: Continue fuera de un ciclo.';  
                throw '>ERROR: Continue fuera de un ciclo.';  
            }
        }
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
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                procesarAccID(instruccion.id, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IF){                
                let returnedAcction = procesarIf(instruccion, tablaDeSimbolos, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                let returnedAcction = procesarFor(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                let returnedAcction = procesarForOF(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if (instruccion.sentencia === SENTENCIAS.FOR_IN) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                let returnedAcction = procesarForIn(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if (instruccion.sentencia === SENTENCIAS.WHILE) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                let returnedAcction = procesarWhile(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if (instruccion.sentencia === SENTENCIAS.DO_WHILE) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                let returnedAcction = procesarDoWhile(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){ 
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                procesarLlamada(instruccion, tsFor, ambito);
            }else if(instruccion.sentencia===SENTENCIAS.INCREMENTO){
                procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia===SENTENCIAS.DECREMENTO  ){
                procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_SUMA  ){
                procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia===SENTENCIAS.ASIGNACION_RESTA  ){
                procesarUnicambios(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.SWITCH){ 
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                let returnedAcction =  procesarSwitch(instruccion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    return returnedAcction;
                }
            }else if(instruccion.sentencia===SENTENCIAS.BREAK){
                return {sentencia:SENTENCIAS.BREAK};
            }else if(instruccion.sentencia===SENTENCIAS.CONTINUE){
                return {sentencia:SENTENCIAS.CONTINUE};
            }else if(instruccion.sentencia===SENTENCIAS.RETURN){
                if(instruccion.valor=="Epsilon"){
                    return {sentencia:SENTENCIAS.RETURN, valor:"undefined"};
                }else{
                    return {sentencia:SENTENCIAS.RETURN, valor:procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito)};
                }
            }else if(instruccion.sentencia===SENTENCIAS.GRAFICAR_TS){
                const tsFor = new TS(JSON.parse(JSON.stringify(tablaDeSimbolos.simbolos)), consola);  
                graficar_Ts(tsFor, ambito);
            }
        }
    }
    function setSalida(Errores){
        if(Errores.length>0){
        consola.value+="ALERTA:\nExisten errores, consulta la tabla ade errores para localizarlos.\nNota: Si son errores sintácticos intenta ver las línea superiores para hallar el causante.";
        return;
        }
        for(let error of Errores){
            consola.value+="> "+error+"\n";
        }
    }
    function sendTable(tablaDeSimbolos){
        printedTable.tsEj=tablaDeSimbolos;
    }
    function scanForFunctions(instrucciones, tablaDeSimbolos, ambito){
        for(let instruccion of instrucciones){
                if(instruccion.sentencia==SENTENCIAS.FUNCION){
                    if(ambito=="Global"){ 
                            if(tablaDeSimbolos.existe(instruccion.id, ambito, "funcion")){
                                consola.value+='>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;  
                                throw '>ERROR: No se soporta la sobrecarga de funciones, id repetido :'+instruccion.id;
                            }  
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
            tempAtributos.push({id:temp.id, tipo: procesarDataType(temp.data_type)});
            temp=temp.next;
        }
        return tempAtributos;
    }
    function procesarDataType(data_description){
        let dimension ="";
        let temp=data_description.isArray;
        while(temp!=false){
            dimension+="[]";
            temp=temp.next_dimension;
        }
        return data_description.tipo+dimension;
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
            temporal.push({id:temp.id, tipo: procesarDataType(temp.tipo)});
            temp=temp.siguiente;
        }
        return temporal;
    }
    function procesarDeclaracion(instruccion, tablaDeSimbolos, ambito){
        let temp= instruccion;
        while(temp!="Epsilon"){
            crearSimbolo(instruccion.variable_type, temp.id, {tipo:primitive_Data(temp.data_type), isArray:temp.isArray}, temp.expresion, ambito, tablaDeSimbolos, temp.fila, temp.columna);
            temp=temp.next_declaration;
        }
    }
    function procesarAsigacion(instruccion, tablaDeSimbolos, ambito){
        let assignedValue = procesarExpresionNumerica(instruccion.expresion, tablaDeSimbolos, ambito);
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n>ERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let temp = instruccion.id.acc;
        let side="right";
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                        if(principalValue.valor==null){
                            //no estoy seguro si hacerlo así o solo pasarle el tipo
                            principalValue.valor=assignedValue.valor;
                            principalValue.tipo=assignedValue.tipo;
                            return;
                        }
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    //consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    //throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n'; 
                   /* while(principalValue.valor.length!=valor.valor-1){
                        principalValue.valor.push();
                    }   */         
                    principalValue.valor[valor.valor]=assignedValue;
                    return;
                }
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        if(principalValue.tipo.split("[]")[0]=="undefined"){
            principalValue.valor=assignedValue.valor;
            principalValue.tipo=assignedValue.tipo;
        }else{
            if(principalValue.tipo!=assignedValue.tipo){
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';  
                throw '>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';                
            }else{
                principalValue.valor=assignedValue.valor;
            }
        }
        //obtener el valor a cambiar y ver que  no sea const
        //
    }
    function procesarImpresion(instruccion, tablaDeSimbolos, ambito){
        const cadena = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
                   consola.value += "> " + toString(cadena, tablaDeSimbolos, ambito)+ "\n";
    }
    function toString(cadena, tablaDeSimbolos, ambito){
        let text= "";
        if(cadena.tipo.split("[]").length>1){
            text+="[";
            for(let i = 0;i<cadena.valor.length;i++){
                text+=toString(cadena.valor[i], tablaDeSimbolos, ambito);
                if(i!=cadena.valor.length-1){
                    text+=", ";
                }
            }
            text+="]";
        }else if(tablaDeSimbolos.existe(cadena.tipo, undefined, "type")){
            text+="{";
            for(let i = 0;i<cadena.valor.length;i++){
                if(cadena.valor[i].valor.valor!=null){
                    text+=cadena.valor[i].id+":"+toString(cadena.valor[i].valor, tablaDeSimbolos, ambito);
                }else{
                    text+=cadena.valor[i].id+":null";
                }
                if(i!=cadena.valor.length-1){
                    text+=", ";
                }
            }
            text+="}";
        }else if(cadena.tipo==="string"){
            text+=sustituirEscapes(cadena);
        }else{
            text+=cadena.valor;
        }
        return text;
    }
    function sustituirEscapes(cadena){
        cadena.valor=String(cadena.valor).replace(/\\n/g,'\n')
        cadena.valor=String(cadena.valor).replace(/\\t/g,'\t')
        cadena.valor=String(cadena.valor).replace(/\\r/g,'\r')
        cadena.valor=String(cadena.valor).replace(/\\"/g,'\"')
        cadena.valor=String(cadena.valor).replace(/\\\\"/g,'\\')
        return cadena.valor;
    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        //Verificar que no exista en el mismo ámbito
        if(ambito=="Global"){
            if(tablaDeSimbolos.existe(id, ambito, "variable")){
                consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito.';  
                throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito';
            } 
        }else{
            if(tablaDeSimbolos.existe(id, "Global", "variable")){
                if(tablaDeSimbolos.existe(id, ambito, "variable")){
                consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito.';  
                throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito'; 
                }
            }
        }
        
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(var_type==TIPO_VARIABLE.CONST && valor == "undefined"){
            consola.value+='>f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: La delcaracion de la constante '+id+' debe ser inicializada.\n';  
            throw '>ERROR:La delcaracion de  la constante '+id+' debe ser inicializada.\n';             
        }
        if(valor!="undefined"){
            valor=procesarExpresionNumerica(valor, tablaDeSimbolos, ambito);
            if(data_type.tipo=="infer"){
                data_type=valor.tipo;
            }else{
                //compara que está bien el tipo
                data_type=procesarDataType(data_type);
            }
        }
        if(data_type.tipo=="infer"){
            data_type="undefined";
        }else{
            if(valor=="undefined"){
                data_type=procesarDataType(data_type);
            }else if(data_type.split("[]")[0]=="undefined"){
                //no hay problema, está definido pero es un array sin datos
            }else if(valor.tipo.split("[]")[0]=="undefined"){
                //no hay problema, está definido pero es un array sin datos
            }else if(data_type!=valor.tipo){
                consola.value+='f:'+fila+', c:'+columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type+".\n";
                throw 'ERROR: Incompatibilidad de tipos: ' + valor.tipo + ' no se puede convertir en ' + data_type;
            }
        }
        //Crear simbolo
        tablaDeSimbolos.agregar(var_type, id, data_type, valor.valor, ambito, fila, columna);
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
            const valor = procesarLlamada(expresion, tablaDeSimbolos, ambito);
            return valor;
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            return { valor: valor * -1, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="string"){
                return { valor: valorIzq.valor + toString(valorDer, tablaDeSimbolos, ambito), tipo: "string" };
            }else if(valorDer.tipo=="string"){
                return { valor: valorDer.valor + toString(valorIzq, tablaDeSimbolos, ambito), tipo: "string" };
            }else{
                return { valor: valorIzq.valor + valorDer.valor, tipo: "number" };
            }
        } else if (expresion.tipo === TIPO_OPERACION.RESTA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq - valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MULTIPLICACION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq * valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.DIVISION) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            if (valorDer == 0) throw 'Error: división entre 0 no está definida.';
            return { valor: valorIzq / valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.POTENCIA) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq ** valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MODULO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq % valorDer, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq > valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MAYOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq >= valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MENOR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq < valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.MENOR_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq <= valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.IGUAL_IGUAL) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq == valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.DISTINTO) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq != valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.AND) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq && valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.OR) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: valorIzq || valorDer, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_OPERACION.NOT) {
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            return { valor: !valorIzq, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.NUMERO) {
            return { valor: expresion.valor, tipo: "number"};
        } else if (expresion.tipo === TIPO_VALOR.DECIMAL) {
            return { valor: expresion.valor, tipo: "number"};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return { valor: true, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return { valor: false, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return {valor:valIzq.valor, side:valIzq.side, tipo:valIzq.tipo};
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: null, tipo: TIPO_DATO.NULL };
        //} else if (expresion.data_type === TIPO_DATO.ARRAY) {
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo.split("[]").length>1){
            return procesarArray(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            return { valor: expresion.valor, tipo: "string" };
        } else if (expresion.tipo === TIPO_VALOR.CADENA_CHARS) {
            return { valor: expresion.valor, tipo: "string" };
        } else if (expresion.tipo === TIPO_VALOR.CADENA_EJECUTABLE) {
            return { valor: procesarCadenaEjecutable(expresion.valor, tablaDeSimbolos, ambito), tipo: "string" };
        } else if(expresion.tipo===TIPO_DATO.OPERADOR_TERNARIO){
            let logica =  procesarExpresionNumerica(expresion.logica, tablaDeSimbolos, ambito);
            return logica.valor? procesarExpresionNumerica(expresion.result1, tablaDeSimbolos, ambito):procesarExpresionNumerica(expresion.result2, tablaDeSimbolos, ambito);
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function procesarArray(arreglo, tablaDeSimbolos, ambito){
        let temporal = [];
        let temp = arreglo.dimension;
        let type="";
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.dato, tablaDeSimbolos, ambito);
            temporal.push(valor);
            type=valor.tipo;
            temp=temp.next_data;
        }
        checkForMultyType(JSON.parse(JSON.stringify(temporal)), tablaDeSimbolos, ambito);
        return {tipo:getType(temporal)+calcularDimensiones(temporal), valor:temporal};
    }
    function checkForMultyType(arreglo, tablaDeSimbolos, ambito){
        arreglo = JSON.parse(JSON.stringify(arreglo));
        if(arreglo.length>1){
            let temp = arreglo.pop();
            for(let temporal of arreglo){
                if(temp.tipo!=temporal.tipo){
                    if(temp.tipo.split("[]")[0]=="undefined" && temporal.tipo.split("[]")[0]=="undefined"){
                        //no es error solo están vacíos
                        arreglo.push(temp);
                    }else if(temp.tipo.split("[]")[0]=="undefined"){
                        temp.tipo=temporal.tipo;
                        arreglo.push(temp);
                    }else if(temporal.tipo.split("[]")[0]=="undefined"){
                        temporal.tipo=temp.tipo;
                        arreglo.push(temp);
                    }else{         
                        arreglo.push(temp);               
                        consola.value+='>ERROR: No se permiten los arreglos multitype->'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);  
                        throw '>ERROR: No se permiten los arreglos multitype'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);
                    }
                }
            }
        }
    }
    function getType(valor){
        while(Array.isArray(valor)){
            valor=valor[0];
        }
        if(valor==undefined) return "undefined";
        return valor.tipo;
    }
    function calcularDimensiones(valor){
        let contador="";
        while(Array.isArray(valor)){
            contador+="[]";
            valor=valor[0];
        }
        return contador;
    }
    function procesarObjeto(instruccion, tablaDeSimbolos, ambito){
        let attb =[];
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
            attb.push({id:temp.id, valor:valor, tipo:valor.tipo});
            temp=temp.next;
        }
        //buscar type
        let flag = true;
        let typeID;
        for(let type of tablaDeSimbolos._simbolos){
            if(type.si=="type"){
                if(type.atributos.length==attb.length){
                    for(let attribute of attb){
                        let flag2=true;
                        for(let atb of type.atributos){
                            //para que acepte los null;
                            if(atb.id==attribute.id && atb.tipo==attribute.tipo || atb.id==attribute.id && atb.tipo=="infer" || atb.id==attribute.id && attribute.valor.valor==null){
                                if(attribute.valor.valor==null){
                                    attribute.tipo=atb.tipo;
                                }
                                flag2=true;
                                break;
                            }else{
                                flag2=false;
                            }
                        }
                        if(!flag2){
                            flag=false;
                            break;
                        }else{
                            //para que lleve muestre la coincidencia de type y objeto
                            flag=true;
                        }       
                    }
                    if(flag){
                        typeID=type.id;
                        break;
                    }//SE quita la cláusula else para que revise todos los types existentes;
                    /*else{
                        consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No existe ningún type que coincida con el objeto.\n';  
                        throw '>ERROR: No existe ningún type que coincida con el objeto.\n';                       
                    } */
                }
                
            }
        } 
        if(typeID==undefined){
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No existe ningún type que coincida con el objeto.\n';  
            throw '>ERROR: No existe ningún type que coincida con el objeto.\n';                       
        }       
        return {tipo:typeID, valor:attb};
    }
    function ExistingAttribute(typeID, attributeID, tablaDeSimbolos){
        let type = tablaDeSimbolos.obtenerType(typeID);
        for(let attribute of type.atributos){
            if(attribute.id==attributeID){
                return attribute;
            }
        }
        return false;
    }
    function procesarAccID(instruccion, tablaDeSimbolos, ambito){
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        let temp = instruccion.acc;
        let side="right";
        /*
        side representa el lado de la expresión donde peude estar, siendo el lado derecho el valor asignado y en el lado
        izquierdo el espacio de memoria donde se puede guardar el valor.
        R->RIGHT
        B->BOTH
        N->NONE 
        */
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                //para cuando sean atributos nulos
                if(principalValue.valor==null && tablaDeSimbolos.existe(principalValue.tipo, undefined, "type")){
                    break;
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                        principalValue.tipo=value.tipo;
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }/*
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }*/
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                if(principalValue==undefined){
                    return {valor:undefined, tipo:"undefined"};
                }
                side="both"
            }else if(temp.sentencia==SENTENCIAS.POP){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Pop a un array inexistente.\n';  
                    throw '>ERROR: Intento de Pop a un array inexistente.\n';                    
                }
                if(principalValue.length==0){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Pop a un array vacío.\n';  
                    throw '>ERROR: Intento de Pop a un array vacío.\n'; 
                }
                principalValue=principalValue.valor.pop();
                break;
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Length a un array inexistente.\n';  
                    throw '>ERROR: Intento de Length a un array inexistente.\n';                    
                }
                principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.PUSH){//N
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de Push a un array inexistente.\n';  
                    throw '>ERROR: Intento de Push a un array inexistente.\n';                    
                }
                let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
                principalValue.valor.push(valor);
                checkForMultyType(principalValue.valor, tablaDeSimbolos, ambito);
                side="none";
                break;
            }
            temp=temp.next_acc;
        }
        return {valor: principalValue.valor, side:side, tipo:principalValue.tipo};   
    }
    function SplitAmbitos(name){
        let ar = name.split("_");
        let er =[];
        for(let i =ar.length-1;i>=0;i--){
          let x="";
          for(let e =0;e<=i;e++){
            if(e==0){
              x+=ar[e];
            }else{
              x+="_"+ar[e];
            }    
          }
          er.push(x);
        }
        er.push("Global");
        return er;
    }
    function procesarLlamada(instruccion, tablaDeSimbolos, ambito){
        let funcion = tablaDeSimbolos.obtenerFuncion(instruccion.id, instruccion.fila, instruccion.columna, ambito);
        if(ambito==GetAmbito(instruccion.id) || instruccion.id.split("_").length==1 || instruccion.id==ambito){ //la tercera condición es para que acepte las llamadas recursivas de funciones desasinadas
            if (funcion.parametros.length != 0 && instruccion.parametros == "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                throw 'ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            } else if (funcion.parametros.length == 0 && instruccion.parametros != "Epsilon") {
                consola.value+='f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            }else{
                let argumentos = getArguments(instruccion.parametros, tablaDeSimbolos, ambito);
                const tsFuncion = new TS(tsGlobal.simbolos.slice(), consola);
                for(let i = 0; i < funcion.parametros.length;i++){
                    if(funcion.parametros[i].tipo=="infer" || funcion.parametros[i].tipo==argumentos[i].tipo){
                        //se acepta el argumento para ser usado por los parámetros
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else if(tablaDeSimbolos.existe(funcion.parametros[i].tipo, undefined, "type") && argumentos[i].valor==null){
                        //para que acepte los nulls    
                        tsFuncion.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, funcion.parametros[i].tipo, argumentos[i].valor, instruccion.id, "temp", "temp");
                    }else{
                        consola.value+='ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                        throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                    }
                }               
                let returnedAcction;
                if(instruccion.id.split("_").length>1){
                    returnedAcction = procesarBloque(funcion.accion, tablaDeSimbolos, instruccion.id);
                }else{
                    returnedAcction = procesarBloque(funcion.accion, tsFuncion, instruccion.id);
                }
                if(returnedAcction!=undefined){
                    /*if(returnedAcction.sentencia===SENTENCIAS.BREAK){
                        consola.value+='>ERROR: Break fuera de un ciclo.';  
                        throw '>ERROR: Break fuera de un ciclo.';  
                    }else*/
                    if(returnedAcction.sentencia===SENTENCIAS.RETURN){
                        if(returnedAcction.valor=="undefined" && funcion.tipo=="void"){
                            //todo bien
                        }else if(returnedAcction.valor.tipo!=funcion.tipo){
                            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.';  
                            throw '>ERROR: No se puede asignar '+returnedAcction.valor.tipo+' a '+funcion.tipo+'.'; 
                        } 
                        return returnedAcction.valor; 
                    }
                }
                //declarar parámetros con los valores de los argumentos
            }
        }else{
            consola.value+='>ERROR:f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\n No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n';  
            throw '>ERROR: No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n'; 
        }        
    }
    function GetAmbito(ambito){
        let text="";
        if(ambito!="Global"){
            let temp = ambito.split("_");
            for(let i =0; i<temp.length-1;i++){
                if(i==0){
                    text+=ambito.split("_")[i];
                }else{
                    text+="_"+ambito.split("_")[i];
                }
            }
        }
        return text;
    }
    function getArguments(instruccion, tablaDeSimbolos, ambito){
        let argumentos = [];
        let temp = instruccion;
        while(temp!="Epsilon"){
            argumentos.push(procesarExpresionNumerica(temp.expresion, tablaDeSimbolos, ambito));
            temp=temp.siguiente;
        }
        return argumentos;
    }
    function procesarUnicambios(instruccion, tablaDeSimbolos, ambito){
        let principalValue=getPrincipalValue(instruccion, tablaDeSimbolos, ambito);
        if(principalValue.tipo!="number"){
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: Incompatibilidad de tipos: number no se puede convertir en ' + principalValue.tipo+'\n';  
            throw '>ERROR: Incompatibilidad de tipos: number no se puede convertir en ' + principalValue.tipo+'\n';    
        }else if(instruccion.sentencia==SENTENCIAS.INCREMENTO){
            principalValue.valor++;
        }else if(instruccion.sentencia==SENTENCIAS.DECREMENTO){
            principalValue.valor--;
        }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_SUMA){
            let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
            if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                principalValue.valor+=valor.valor;
            }else{
                consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
            }
        }else if(instruccion.sentencia==SENTENCIAS.ASIGNACION_RESTA){
            let valor = procesarExpresionNumerica(instruccion.valor, tablaDeSimbolos, ambito);
            if(valor.tipo == "string" ||valor.tipo == "number" ||valor.tipo == "boolean"){
                principalValue.valor+=valor.valor;
            }else{
                consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';  
                throw '>ERROR: No se puede hacer una adicción del tipo ' + valor.tipo+'\n';                    
            }        
        }
    }
    function getPrincipalValue(instruccion, tablaDeSimbolos,ambito){
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito), instruccion.fila, instruccion.columna);
        if(principalValue.var_type==TIPO_VARIABLE.CONST && instruccion.id.acc=="Epsilon"){
            consola.value+='>f:'+instruccion.fila+', c:'+instruccion.columna+', ambito:'+ambito+'\nERROR: No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';  
            throw '>ERROR:  No se puede asignar a ' + instruccion.id.id+' porque es una constante.\n';   
        }
        let temp = instruccion.id.acc;
        let side="right";
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No existe el atributo '+temp.atributo+'\n';  
                    throw '>ERROR: No existe el atributo '+temp.atributo+'\n';
                }
                for(let attribute of principalValue.valor){
                    if(attribute.id==temp.atributo){
                        principalValue=attribute.valor;
                    }
                }
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
                // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }/*
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }*/
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else {
                consola.value+='>f:'+temp.fila+', c:'+temp.columna+', ambito:'+ambito+'\nERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        return principalValue;
    }
    function procesarCadenaEjecutable(cadena, tablaDeSimbolos, ambito){
        let text=String(cadena).match(/\$\{[^\}]*\}/);;
        while(text!=null){
            let tempAST = parser.parse(text[0].substring(2, text[0].length-1));
            cadena=String(cadena).replace(text[0], procesarExpresionNumerica(tempAST.AST, tablaDeSimbolos, ambito).valor);
            text =String(cadena).match(/\$\{[^\}]*\}/);
        }
        return cadena;
    }
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito) {
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        if (logica.valor) {
            const tsIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
            let returnedAcction = procesarBloque(instruccion.accion, tsIf, ambito);
            if(returnedAcction!=undefined){
                return returnedAcction;
            }
        } else {
            if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarIf(instruccion.else, tsElIf, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    let returnedAcction = procesarBloque(instruccion.else.accion, tsElse, ambito);
                    if(returnedAcction!=undefined){
                        return returnedAcction;
                    }
                }
            }
        }
    
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito) {
        procesarBloque([instruccion.inicial], tablaDeSimbolos, ambito);
       // const valor = procesarExpresionCadena(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        const valor = procesarExpresionNumerica(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        tablaDeSimbolos.actualizar(instruccion.inicial.id, valor);//, SplitAmbitos(ambito)
        if (instruccion.paso.paso == "++") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)).valor) + 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                        continue;
                    }else{
                        return returnedAcction;
                    } 
                }                
            }
        } else if (instruccion.paso.paso == "--") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)).valor) - 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
        } else {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(procesarExpresionNumerica(instruccion.paso.paso, tablaDeSimbolos, ambito).valor), tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, SplitAmbitos(ambito)).tipo })) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction =  procesarBloque(instruccion.accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                }
            }
    
        }
    
    }
    function procesarForOF(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val of conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, val);
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarForIn(instruccion, tablaDeSimbolos, ambito){
        let conjunto = procesarAccID(instruccion.conjunto, tablaDeSimbolos, ambito);
        if(!Array.isArray(conjunto.valor)){
            consola.value+='>ERROR: '+conjunto.id+' no es un array.\n';  
            throw '>ERROR: '+conjunto.id+' no es un array.\n';               
        }
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefined", ambito, "temp", "temp");
        for(let val in conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, {valor:val, tipo:"number"});
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarWhile(instruccion ,tablaDeSimbolos, ambito){
        while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor){
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }
    }
    function procesarDoWhile(instruccion ,tablaDeSimbolos, ambito){
        do{
            const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
            let returnedAcction = procesarBloque(instruccion.accion, tsFor, ambito);
            if(returnedAcction!=undefined){
                if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                    break;
                }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                    continue;
                }else{
                    return returnedAcction;
                } 
            }
        }while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor);
    }
    function procesarSwitch(instruccion, tablaDeSimbolos, ambito){
        let cases =  getCases(instruccion.cases);
        for(let i = 0;i<cases.length;i++){
            if(cases[i].logica=="default"){
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                let returnedAcction = procesarBloque(cases[i].accion, tsFor, ambito);
                if(returnedAcction!=undefined){
                    if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        break;
                    }else{
                        return returnedAcction;
                    } 
                } 
                break;
            }else{
                let original = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
                let caso= procesarExpresionNumerica(cases[i].logica, tablaDeSimbolos, ambito);
                let returnedAcction;
                if(original.valor==caso.valor){
                    const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola); 
                    for(let e =i;e<cases.length;e++){
                        returnedAcction = procesarBloque(cases[e].accion, tsFor, ambito);
                        if(returnedAcction!=undefined){
                            if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                                break;
                            }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                                continue;
                            }else{
                                return returnedAcction;
                            } 
                        } 
                    }
                    i=cases.length; 
                    if(returnedAcction!=undefined){
                        if(returnedAcction.sentencia==SENTENCIAS.BREAK){
                        }else if(returnedAcction.sentencia==SENTENCIAS.CONTINUE){
                        }else{
                            return returnedAcction;
                        } 
                    }                  
                }
            }
        }
    }
    function getCases(cases){
        let arreglo = [];
        let temp=cases;
        while(temp!="Epsilon"){
            arreglo.push(temp);
            temp=temp.next_case;
            if(temp.logica=="default"){
                arreglo.push(temp);
                break;
            }
        }
        return arreglo;
    }
    //Graficar TS
    function graficar_Ts(tablaDeSimbolos, ambito){
        let tabla = document.createElement("table");
        tabla.bgColor= '#bbe1fa';
        tabla.align="center";
        tabla.width="80%";
        tabla.border="1px solid black";
        var row0 =  tabla.insertRow( tabla.rows.length);
        var celda01 = row0.insertCell(0);
        var celda02 = row0.insertCell(1);
        var celda03 = row0.insertCell(2);
        var celda04 = row0.insertCell(3);
        var celda05 = row0.insertCell(4);
        var celda06 = row0.insertCell(5);
        var celda07 = row0.insertCell(6);
        var celda08 = row0.insertCell(7);
        celda01.innerHTML = "No.";
        celda01.bgColor="#40a8c4";
        celda02.innerHTML = "Sentencia";
        celda02.bgColor="#40a8c4";
        celda03.innerHTML = "ID";
        celda03.bgColor="#40a8c4";
        celda04.innerHTML = "Tipo";
        celda04.bgColor="#40a8c4";
        celda05.innerHTML = "Valor";
        celda05.bgColor="#40a8c4";
        celda06.innerHTML = "Fila";
        celda06.bgColor="#40a8c4";
        celda07.innerHTML = "Columna";
        celda07.bgColor="#40a8c4";
        celda08.innerHTML = "Ambito";
        celda08.bgColor="#40a8c4";
      if(tablaDeSimbolos._simbolos.length!=0){
        let i=0;
        for(let simbolo of tablaDeSimbolos._simbolos) {
        if(simbolo.si=="variable"){
        i++;
          var row = tabla.insertRow( tabla.rows.length);
          var celda1 = row.insertCell(0);
          var celda2 = row.insertCell(1);
          var celda3 = row.insertCell(2);
          var celda4 = row.insertCell(3);
          var celda5 = row.insertCell(4);
          var celda6 = row.insertCell(5);
          var celda7 = row.insertCell(6);
          var celda8 = row.insertCell(7);
          celda1.innerHTML = i;
          celda2.innerHTML = simbolo.si;
          celda3.innerHTML = simbolo.id;
          celda4.innerHTML = simbolo.tipo;
          celda5.innerHTML = toString({valor:simbolo.valor,tipo:simbolo.tipo}, tablaDeSimbolos, ambito);
          celda6.innerHTML = simbolo.fila;
          celda7.innerHTML = simbolo.columna;
          celda8.innerHTML = simbolo.ambito;
        }
        }
      }
      tablero.appendChild(tabla);
    }
}