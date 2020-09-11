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
                procesarAccID(instruccion, tablaDeSimbolos, ambito);
            }else if(instruccion.sentencia === SENTENCIAS.IF){
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
        const cadena = procesarExpresionCadena(instruccion.valor, tablaDeSimbolos, ambito).valor;
        consola.value += "> " + cadena + "\n";
    }
    function crearSimbolo(var_type, id, data_type, valor, ambito, tablaDeSimbolos, fila, columna){
        //Verificar que no exista en el mismo ámbito
        if(tablaDeSimbolos.existe(id, ambito)){
            consola.value+='>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';  
            throw '>ERROR: El identificador:\"'+id+'\" ya ha sido declarado en este ámbito o en uno superior';
        }
        //Ver que el tipo de símbolo sea el correcto con el del valor o undefined
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
            const valor = procesarExpresionNumerica(expresion.operandoIzq, tablaDeSimbolos).valor;
            return { valor: valor * -1, tipo: "number" };
        } else if (expresion.tipo === TIPO_OPERACION.SUMA) {
            //si valIzq es string devuleve string else number
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
            return { valor: expresion.valor, tipo: "number"};
        }else if (expresion.tipo === TIPO_VALOR.TRUE) {
            return { valor: true, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.FALSE) {
            return { valor: false, tipo: "boolean" };
        } else if (expresion.tipo === TIPO_VALOR.IDENTIFICADOR) {
            return procesarAccID(expresion.valor, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_VALOR.NULL) {
            return { valor: null, tipo: TIPO_DATO.NULL };
        } else if (expresion.data_type === TIPO_DATO.ARRAY) {
            return procesarArray(expresion, tablaDeSimbolos, ambito);
        } else if (expresion.tipo === TIPO_DATO.OBJETO) {
            return procesarObjeto(expresion, tablaDeSimbolos, ambito);
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
        checkForMultyType(JSON.parse(JSON.stringify(temporal)));
        return {tipo:TIPO_DATO.ARRAY, valor:temporal};
    }
    function checkForMultyType(arreglo){
        if(arreglo.length>1){
            let temp = arreglo.pop();
            for(let temporal of arreglo){
                if(temp.tipo!=temporal.tipo){
                    arreglo.push(temp);
                    consola.value+='>ERROR: No se permiten los arreglos multitype->\n'+JSON.stringify(arreglo);  
                    throw '>ERROR: No se permiten los arreglos multitype'+JSON.stringify(arreglo);
                }
            }
        }
    }
    function procesarMetodoID(instruccion, tablaDeSimbolos, ambito){
      //   if()
    }
    function procesarObjeto(instruccion, tablaDeSimbolos, ambito){
        let attb =[];
        let temp = instruccion.atributos;
        while(temp!="Epsilon"){
            attb.push({id:temp.id, valor:procesarExpresionNumerica(temp.valor, tablaDeSimbolos, ambito)});
            temp=temp.next;
        }
        //buscar type
        return attb;
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
                //comprobar que el valor sea del mismo tipo del atributo
                side="both";
            }else if(temp.acc_type==TIPO_ACCESO.POSICION){//B
                //comprobar que sea un array
                if(!Array.isArray(principalValue.valor)){
               // if(principalValue.tipo!=TIPO_DATO.ARRAY){
                    consola.value+='>ERROR: Intento de acceso a posición de array inexistente\n';  
                    throw '>ERROR: Intento de acceso a posición de array inexistente\n';                    
                }
                let valor = procesarExpresionNumerica(temp.index, tablaDeSimbolos, ambito).valor;
                if(valor>=principalValue.valor.length ||valor<0){
                    consola.value+='>ERROR: No existe el elemento '+valor+' en el array\n';  
                    throw '>ERROR: No existe el elemento '+valor+' en el array\n';             
                }
                //comprobar que la posición no sea más larga que el length de la posición.
                principalValue = principalValue.valor[valor];
                side="both"
            }else if(temp.sentencia==SENTENCIAS.POP){//R
                side="right";
                break;
            }else if(temp.sentencia==SENTENCIAS.LENGTH){//R
                side="right";
                break;
            }else if(temp.sentencia==SENTENCIAS.PUSH){//N
                side="none";
                break;
            }
            temp=temp.next_acc;
        }
        return {valor: principalValue, side:side};   
    }
    function SplitAmbitos(name){
        let ambitos=["Global"];
        if(name!="Global"){
            ambitos.push(name.spli("_"));
        }
        return ambitos;
    }
}