import { TS, TIPO_DATO, SENTENCIAS, TIPO_VARIABLE, TIPO_OPERACION, TIPO_VALOR, TIPO_ACCESO } from "./instrucciones";

export default function Ejecutar(salida, consola, traduccion, printedTable){
   // console.log("this is the output"+  JSON.stringify(salida.AST)); 
   let output="";
   try {
        consola.value="";
        const tsGlobal = new TS([], consola);
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
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                procesarAccID(instruccion.id, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IF){                
                procesarIf(instruccion, tablaDeSimbolos, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                procesarFor(instruccion, tsFor, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                procesarForOF(instruccion, tsFor, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.FOR_IN) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                procesarForIn(instruccion, tsFor, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.WHILE) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                procesarWhile(instruccion, tsFor, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.DO_WHILE) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                procesarDoWhile(instruccion, tsFor, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.LLAMADA){ 
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice(), consola);               
                procesarLlamada(instruccion, tsFor, ambito);
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
            crearSimbolo(instruccion.variable_type, temp.id, {tipo:primitive_Data(temp.data_type), isArray:temp.isArray}, temp.expresion, ambito, tablaDeSimbolos, instruccion.fila, instruccion.columna);
            temp=temp.next_declaration;
        }
    }
    function procesarAsigacion(instruccion, tablaDeSimbolos, ambito){
        let assignedValue = procesarExpresionNumerica(instruccion.expresion, tablaDeSimbolos, ambito);
        let principalValue = tablaDeSimbolos.getSimbol(instruccion.id.id, SplitAmbitos(ambito));
        let temp = instruccion.id.acc;
        let side="right";
        while(temp!="Epsilon"){
            if(temp.acc_type==TIPO_ACCESO.ATRIBUTO){//B
                //comprobar que exista la propiedad
                let value = ExistingAttribute(principalValue.tipo, temp.atributo, tablaDeSimbolos);
                //comprobar que el valor sea del mismo tipo del atributo o null
                if(value == false){
                    consola.value+='>ERROR: No existe el atributo '+temp.atributo+'\n';  
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
                    consola.value+='>ERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>ERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else {
                consola.value+='>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';  
                throw '>ERROR: No se puede asignar esta accion en esta asignación: '+temp+'\n';
            }
            temp=temp.next_acc;
        }
        if(principalValue.tipo.split("[]")[0]=="undefined"){
            principalValue.valor=assignedValue.valor;
            principalValue.tipo=assignedValue.tipo;
        }else{
            if(principalValue.tipo!=assignedValue.tipo){
                consola.value+='>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';  
                throw '>ERROR: Incompatibilidad de tipos: ' + assignedValue.tipo + ' no se puede convertir en ' + principalValue.tipo+'\n';                
            }else{
                principalValue.valor=assignedValue.valor;
            }
        }
        //obtener el valor a cambiar y ver que  no sea const
        //
    }
    function procesarExpresionCadena(expresion, tablaDeSimbolos, ambito) {
        if (expresion.tipo === TIPO_OPERACION.SUMA) {
            const cadIzq = procesarExpresionCadena(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            const cadDer = procesarExpresionCadena(expresion.operandoDer, tablaDeSimbolos, ambito).valor;
            return { valor: cadIzq + cadDer, tipo: "string" };
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            return { valor: expresion.valor, tipo: "string" };
        } else {
            return procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito);
        }
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
                text+=cadena.valor[i].id+":"+toString(cadena.valor[i].valor, tablaDeSimbolos, ambito);
                if(i!=cadena.valor.length-1){
                    text+=", ";
                }
            }
            text+="}";
        }else{
            text+=cadena.valor;
        }
        return text;
    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        //Verificar que no exista en el mismo ámbito
        if(ambito=="Global"){
            if(tablaDeSimbolos.existe(id, ambito, "variable")){
                consola.value+='>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';  
                throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';
            } 
        }else{
            if(tablaDeSimbolos.existe(id, "Global", "variable")){
                if(tablaDeSimbolos.existe(id, ambito, "variable")){
                consola.value+='>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';  
                throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior'; 
                }
            }
        }
        
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
        if(var_type==TIPO_VARIABLE.CONST && valor == "undefined"){
            consola.value+='>ERROR: La delcaracion de la constante '+id+' debe ser inicializada.\n';  
            throw '>ERROR:La delcaracion de  la constante '+id+' debe ser inicializada.\n';             
        }
        if(valor!="undefined"){
            valor=procesarExpresionNumerica(valor, tablaDeSimbolos, ambito);
            if(data_type.tipo=="infer"){
                //asignar el tipo de valor a la variable
                /*
                -comprobar si es array
                -comprobar si todos los elementos del array son del mismo tipo,  hay tipo ARRAY
                    -método recursivo para todos los elementos del array multidimensional
                -si es array se cuentan las dimensiones, si no es array se pone dimension 0
                -para sasber las dimensiones del array basat con entrar recursivamente al valor de la primera casilla hasta que el elemento no sea tipo array puesto que todos los elementos son del mismo tipo y eso se verificó previamente
                */
                data_type=valor.tipo;
            }else{
                //compara que está bien el tipo
                data_type=procesarDataType(data_type);
            }
        }
        if(data_type.tipo=="infer"){
            data_type="undefined";
        }
        //Crear simbolo
        tablaDeSimbolos.agregar(var_type, id, data_type, valor.valor, ambito, fila, columna);
    }
    function procesarExpresionNumerica(expresion, tablaDeSimbolos, ambito) {
        if (expresion.sentencia === SENTENCIAS.LLAMADA) {
         //   const valor = procesarFuncion(expresion, tablaDeSimbolos);
            //return valor;
        } else if (expresion.tipo === TIPO_OPERACION.NEGATIVO) {
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito).valor;
            return { valor: valor * -1, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
            const valorIzq = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos, ambito);
            const valorDer = procesarExpresionNumerica(expresion.operandoDer, tablaDeSimbolos, ambito);
            if(valorIzq.tipo=="string"){
                return { valor: valorIzq.valor + toString(valorDer, tablaDeSimbolos, ambito), tipo: "string" };
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
            return { valor: expresion.valor, tipo: "string" };
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
                            if(atb.id==attribute.id && atb.tipo==attribute.tipo){
                                flag2=true;
                                break;
                            }else{
                                flag2=false;
                            }
                        }
                        if(!flag2){
                            flag=false;
                            break;
                        }       
                    }
                    if(flag){
                        typeID=type.id;
                        break;
                    }else{
                        consola.value+='>ERROR: No existe ningún type que coincida con el objeto.\n';  
                        throw '>ERROR: No existe ningún type que coincida con el objeto.\n';                       
                    } 
                }
                
            }
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
        let principalValue = tablaDeSimbolos.obtenerSimbolo(instruccion.id, SplitAmbitos(ambito));
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
                    consola.value+='>ERROR: No existe el atributo '+temp.atributo+'\n';  
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
                    consola.value+='>ERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito);
                if(valor.tipo!="number"){
                    consola.value+='>ERROR: No se reconoce la expresion '+valor.valor+' como un index.\n';  
                    throw '>ERROR:No se reconoce la expresion '+valor.valor+' como un index.\n';                      
                }
                if(valor.valor>=principalValue.valor.length ||valor.valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor.valor+' en el array.\n';  
                    throw '>ERROR: No existe el elemento '+valor.valor+' en el array.\n';             
                }
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor.valor];
                side="both"
            }else if(temp.sentencia==SENTENCIAS.POP){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>ERROR: Intento de Pop a un array inexistente.\n';  
                    throw '>ERROR: Intento de Pop a un array inexistente.\n';                    
                }
                if(principalValue.length==0){
                    consola.value+='>ERROR: Intento de Pop a un array vacío.\n';  
                    throw '>ERROR: Intento de Pop a un array vacío.\n'; 
                }
                principalValue=principalValue.valor.pop();
                break;
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                side="right";
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>ERROR: Intento de Length a un array inexistente.\n';  
                    throw '>ERROR: Intento de Length a un array inexistente.\n';                    
                }
                principalValue={valor:principalValue.valor.length, tipo:"number"};
                break;
            }else if(temp.sentencia==SENTENCIAS.PUSH){//N
                if(!Array.isArray(principalValue.valor)){
                    // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>ERROR: Intento de Push a un array inexistente.\n';  
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
        let er=[];
        let ar = name.split("_");
        for(let i =1;i<=ar.length;i++){
            let x="";
            for(let e =1;e<=i;e++){
                if(e==1){
                    x=ar[ar.length-e]
                }else{          
                    x=ar[ar.length-e]+"_"+x;
                }              
            }
            er.push(x);
        }
            er.push("Global")
        return er;
    }
    function procesarLlamada(instruccion, tablaDeSimbolos, ambito){
        let funcion = tablaDeSimbolos.obtenerFuncion(instruccion.id);
        if(ambito==GetAmbito(instruccion.id) || instruccion.id.split("_").length==1){
            if (funcion.parametros.length != 0 && instruccion.parametros == "Epsilon") {
                consola.value+='ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                throw 'ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            } else if (funcion.parametros.length == 0 && instruccion.parametros != "Epsilon") {
                consola.value+='ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
                throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados.';
            }else{
                let argumentos = getArguments(instruccion.parametros, tablaDeSimbolos, ambito);
                for(let i = 0; i < funcion.parametros.length;i++){
                    if(funcion.parametros[i].tipo=="infer" || funcion.parametros[i].tipo==argumentos[i].tipo){
                        //se acepta el argumento para ser usado por los parámetros
                        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, funcion.parametros[i].id, argumentos[i].tipo, argumentos[i].valor, ambito, "temp", "temp");
                    }else{
                        consola.value+='ERROR: La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                        throw 'ERROR:La función ' + instruccion.id + ' no puede ser ejecutado con los parámetros dados, error de tipos.';
                    }
                }
                procesarBloque(funcion.accion, tablaDeSimbolos, instruccion.id);
                //declarar parámetros con los valores de los argumentos
            }
        }else{
            consola.value+='>ERROR: No se puede ejecutar '+instruccion.id+' desde el ámbito '+ambito+'.\n';  
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
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito) {
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        if (logica.valor) {
            const tsIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
            procesarBloque(instruccion.accion, tsIf, ambito);
        } else {
            if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    procesarIf(instruccion.else, tsElIf, ambito);
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice(), consola);
                    procesarBloque(instruccion.else.accion, tsElse, ambito);
                }
            }
        }
    
    }
    function procesarFor(instruccion, tablaDeSimbolos, ambito) {
        procesarBloque([instruccion.inicial], tablaDeSimbolos, ambito);
       // const valor = procesarExpresionCadena(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        const valor = procesarExpresionNumerica(instruccion.inicial.expresion, tablaDeSimbolos, ambito);
        tablaDeSimbolos.actualizar(instruccion.inicial.id, valor);
        if (instruccion.paso.paso == "++") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).valor) + 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).tipo })) {
                procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
            }
        } else if (instruccion.paso.paso == "--") {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).valor) - 1, tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).tipo })) {
                procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
            }
        } else {
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(procesarExpresionNumerica(instruccion.paso.paso, tablaDeSimbolos, ambito).valor), tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).tipo })) {
                procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
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
            procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
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
            procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        }
    }
    function procesarWhile(instruccion ,tablaDeSimbolos, ambito){
        while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor){
            procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        }
    }
    function procesarDoWhile(instruccion ,tablaDeSimbolos, ambito){
        do{
            procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        }while(procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito).valor);
    }
}