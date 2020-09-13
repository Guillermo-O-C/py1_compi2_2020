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
            }else if(instruccion.sentencia === SENTENCIAS.ACCESO){
                procesarAccID(instruccion.id, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IF){                
                procesarIf(instruccion, tablaDeSimbolos, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.FOR) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice());
                procesarFor(instruccion, tsFor, ambito);
            }else if (instruccion.sentencia === SENTENCIAS.FOR_OF) {
                const tsFor = new TS(tablaDeSimbolos.simbolos.slice());
                procesarForOF(instruccion, tsFor, ambito);
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
        if(cadena.tipo==TIPO_DATO.ARRAY){
            text+="[";
            for(let i = 0;i<cadena.valor.length;i++){
                text+=toString(cadena.valor[i], tablaDeSimbolos, ambito);
                if(i!=cadena.valor.length-1){
                    text+=", ";
                }
            }
            text+="]";
        }else if(tablaDeSimbolos.existeType(cadena.tipo)){
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
        if(tablaDeSimbolos.existe(id, ambito)){
            consola.value+='>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';  
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';
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
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return { valor: true, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return { valor: false, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            const valIzq=procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
            return {valor:valIzq.valor, side:valIzq.side, tipo:valIzq.tipo};
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: null, tipo: TIPO_DATO.NULL };
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_VALOR.CADENA) {
            return { valor: expresion.valor, tipo: "string" };
        } else {
            throw 'ERROR: expresión numérica no válida: ' + expresion.valor;
        }
    }
    function procesarArray(arreglo, tablaDeSimbolos, ambito){
        let temporal = [];
        let temp = arreglo.dimension;
        while(temp!="Epsilon"){
            temporal.push(procesarExpresionNumerica(temp.dato, tablaDeSimbolos, ambito));
            temp=temp.next_data;
        }
        checkForMultyType(JSON.parse(JSON.stringify(temporal)), tablaDeSimbolos, ambito);
        return {tipo:TIPO_DATO.ARRAY, valor:temporal};
    }
    function checkForMultyType(arreglo, tablaDeSimbolos, ambito){
        if(arreglo.length>1){
            let temp = arreglo.pop();
            for(let temporal of arreglo){
                if(temp.tipo!=temporal.tipo){
                    arreglo.push(temp);
                    consola.value+='>ERROR: No se permiten los arreglos multitype->'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);  
                    throw '>ERROR: No se permiten los arreglos multitype'+toString({valor:arreglo, tipo:TIPO_DATO.ARRAY}, tablaDeSimbolos, ambito);
                }
            }
        }
    }
    function procesarMetodoID(instruccion, tablaDeSimbolos, ambito){
      //   if()
    }
    function calcularDimensiones(valor){
        let contador=0;
        while(Array.isArray(valor)){
            valor=valor[0];
        }
        return contador;
    }
    function procesarObjeto(instruccion, tablaDeSimbolos, ambito){
        let attb =[];
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            let valor = procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito);
            attb.push({id:temp.id, valor:valor, data_type:{type:valor.tipo, dimensiones:calcularDimensiones(valor.valor)}});
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
                            if(atb.id==attribute.id && atb.data_type.type==attribute.data_type.type&& atb.data_type.dimensiones==attribute.data_type.dimensiones/**/){
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
        let ambitos=["Global"];
        if(name!="Global"){
            ambitos.push(name.spli("_"));
        }
        return ambitos;
    }
    //SENTENCIAS DE CONTROL 
    function procesarIf(instruccion, tablaDeSimbolos, ambito) {
        const logica = procesarExpresionNumerica(instruccion.logica, tablaDeSimbolos, ambito);
        if (logica.valor) {
            const tsIf = new TS(tablaDeSimbolos.simbolos.slice());
            procesarBloque(instruccion.accion, tsIf, ambito);
        } else {
            if (instruccion.else != "Epsilon") {
                if (instruccion.else.sentencia === SENTENCIAS.ELSE_IF) {
                    const tsElIf = new TS(tablaDeSimbolos.simbolos.slice());
                    procesarIf(instruccion.else, tsElIf, ambito);
                } else {
                    const tsElse = new TS(tablaDeSimbolos.simbolos.slice());
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
            for (var i = tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito); procesarExpresionNumerica(instruccion.final, tablaDeSimbolos, ambito).valor; tablaDeSimbolos.actualizar(instruccion.inicial.id, { valor: Number(procesarExpresionNumerica(instruccion.paso, tablaDeSimbolos, ambito).valor), tipo: tablaDeSimbolos.obtenerSimbolo(instruccion.inicial.id, ambito).tipo })) {
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
        tablaDeSimbolos.agregar(TIPO_VARIABLE.LET, instruccion.variable, "infer",  "undefinied", ambito, "temp", "temp");
        for(let val of conjunto.valor){
            tablaDeSimbolos.actualizarAndType(instruccion.variable, val);
            procesarBloque(instruccion.accion, tablaDeSimbolos, ambito);
        }
    }
}