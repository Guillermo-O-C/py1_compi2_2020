/* Definición del lenguaje */

%lex
%options case-sensitive

%%
"number" return 'R_NUMBER';
"boolean" return 'R_BOOLEAN';
"string" return 'R_STRING';
"let" return 'R_LET';
"const" return 'R_CONST';
"console" return 'R_CONSOLE';
"log" return 'R_LOG';
"false" return 'R_FALSE';
"true" return 'R_TRUE';
"if" return 'R_IF';
"else" return 'R_ELSE';
"switch" return 'R_SWITCH';
"case" return 'R_CASE';
"default" return 'R_DEFAULT';
"break" return 'R_BREAK';
"continue" return 'R_CONTINUE';
"while" return 'R_WHILE';
"do" return 'R_DO';
"for" return 'R_FOR';
"void" return 'R_VOID';
"return" return 'R_RETURN';
"push" return 'R_PUSH';
"pop" return 'R_POP';
"length" return 'R_LENGTH';
"type" return 'R_TYPE';
"of" return 'R_OF';
"in" return 'R_IN';
"function" return 'R_FUNCTION' ;
"null" return 'R_NULL';
"graficar_ts" return "R_GRAFICAR_TS";

\"(\\\"|\\n|\\t|\\r|\\\\|[^\"])*\" { yytext = yytext.substr(1, yyleng-2); return 'CADENA';}
\'(\\\'|\\n|\\t|\\r|\\\\|[^\'])*\' { yytext = yytext.substr(1, yyleng-2); return 'CADENA_CHARS';}
\`(\\\"|\\n|\\t|\\r|\\\\|[^\`])*\` { yytext = yytext.substr(1, yyleng-2); return 'CADENA_EJECUTABLE';}
[0-9]+"."([0-9]+)?\b return 'DECIMAL';
[0-9]+\b return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]* return 'IDENTIFICADOR';
\s+ {}                           //Ignora los espacios en blanco
"//".*                           // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas
"++" return 'INCREMENTO';
"--" return 'DECREMENTO';
"+=" return 'ASIGNACION_SUMA';
"+" return 'MAS';
"-=" return 'ASIGNACION_RESTA';
"-" return 'MENOS';
"**" return 'POTENCIA';
"*" return 'MULTIPLICACION';
"/" return 'DIVISION';
"%" return 'MODULO';
"==" return 'IGUALDAD';
"!=" return 'DISTINTO';
"=" return 'IGUAL';
">=" return 'MAYOR_IGUAL';
">" return 'MAYOR';
"<=" return 'MENOR_IGUAL';
"<" return 'MENOR';
"&&" return 'AND';
"||" return 'OR';
"!" return 'NOT';
"{" return 'ABRIR_LLAVE';
"}" return 'CERRAR_LLAVE';
"(" return 'ABRIR_PARENTESIS';
")" return 'CERRAR_PARENTESIS';
"[" return 'ABRIR_CORCHETE';
"]" return 'CERRAR_CORCHETE';
";" return 'PUNTO_COMA';
":" return 'DOS_PUNTOS';
"." return 'PUNTO';
"," return 'COMA';
"?" return 'OPERADOR_TERNARIO';

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
						 salida.push('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
						 ArrayDeErrores.push({tipo:"léxico", linea:yylloc.first_line, columna:yylloc.first_column, descripcion: yytext});}
/lex


%{
	const TIPO_OPERACION	= require('./instrucciones').TIPO_OPERACION;
	const TIPO_VALOR 		= require('./instrucciones').TIPO_VALOR;
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
	const TIPO_DATO = require('./instrucciones').TIPO_DATO;
	const TS = require('./instrucciones').TS;
	var salida=[];
	var ArrayDeErrores = [];
	var currentType="";
%}

/* Asociación de operadores y precedencia */
%left 'OPERADOR_TERNARIO'
%left 'OR'
%left 'AND'
%left 'IGUALDAD' 'DISTINTO'
%left 'MENOR' 'MENOR_IGUAL' 'MAYOR' 'MAYOR_IGUAL'
%left 'MAS' 'MENOS'
%left 'MULTIPLICACION' 'DIVISION'
%left 'POTENCIA' 'MODULO'
%left UMENOS 'NOT'

%nonassoc 'DECREMENTO' 'INCREMENTO'
%nonassoc 'CERRAR_LLAVE' 'ABRIR_LLAVE'
%nonassoc 'CERRAR_CORCHETE' 'ABRIR_CORCHETE'
%nonassoc 'CERRAR_PARENTESIS' 'ABRIR_PARENTESIS'

%start ini

%% /* Definición de la gramática */

ini
	: instrucciones EOF {
		// cuado se haya reconocido la entrada completa retornamos el AST
		var temporal = salida;
		salida=[];
		var tempAr = ArrayDeErrores;
		ArrayDeErrores = [];
		return {AST: $1, Errores: temporal, ErrArr:tempAr};
	}
;
instrucciones
	: instrucciones instruccion  { $1.push($2); $$ = $1; }
	| instruccion {$$=[$1];}
;
instruccion
	: declaracion {$$=$1;}
	| type {$$=$1;}
	| R_IF ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE elseIf { $$ = instruccionesAPI.nuevoIf($3, $6, $8);}
	| R_CONSOLE PUNTO R_LOG ABRIR_PARENTESIS expresion CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevoImprimir($5);}
	| R_SWITCH ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE cases CERRAR_LLAVE {$$=instruccionesAPI.nuevoSwitch($3, $6);}
	| R_FOR ABRIR_PARENTESIS for_init expresion PUNTO_COMA IDENTIFICADOR for_change CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE { $$ = instruccionesAPI.nuevoFor($3, $4, {id:$6, paso:$7}, $10);}
	| R_FOR ABRIR_PARENTESIS R_LET IDENTIFICADOR R_OF id CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoForOF($4, $6, $9);}
	| R_FOR ABRIR_PARENTESIS R_LET IDENTIFICADOR R_IN id CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoForIn($4, $6, $9);}
	| R_WHILE ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoWhile($3, $6);}
	| R_DO ABRIR_LLAVE sentencias CERRAR_LLAVE R_WHILE ABRIR_PARENTESIS expresion CERRAR_PARENTESIS PUNTO_COMA {$$=instruccionesAPI.nuevoDoWhile($3, $7);}
	| R_FUNCTION IDENTIFICADOR ABRIR_PARENTESIS parametros CERRAR_PARENTESIS DOS_PUNTOS tipo ABRIR_LLAVE instrucciones CERRAR_LLAVE {  $$ = instruccionesAPI.nuevaFuncion($7, $2, $4, $9, @2.first_line, @2.first_column); }
	| IDENTIFICADOR ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevaLlamada($1, $3, @1.first_column, @1.first_line);}
	| R_RETURN retorno PUNTO_COMA{$$=instruccionesAPI.nuevoReturn($2);}
	| id IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaAsignacion($1, $3, @1.first_column, @1.first_line);}
	| id INCREMENTO PUNTO_COMA{$$=instruccionesAPI.nuevoIncremento($1, @1.first_column, @1.first_line);}
	| id DECREMENTO PUNTO_COMA{$$=instruccionesAPI.nuevoDecremento($1, @1.first_column, @1.first_line);}
	| id ASIGNACION_SUMA expresion PUNTO_COMA {$$=instruccionesAPI.nuevoAsignacioSuma($1, $3, @1.first_column, @1.first_line);}
	| id ASIGNACION_RESTA expresion PUNTO_COMA {$$=instruccionesAPI.nuevoAsignacioResta($1, $3, @1.first_column, @1.first_line);}
	| id PUNTO_COMA {$$=instruccionesAPI.nuevoAcceso($1);}
	| R_BREAK PUNTO_COMA{$$=instruccionesAPI.nuevoBreak();}
	| R_CONTINUE PUNTO_COMA {$$=instruccionesAPI.nuevoContinue();}
	| R_GRAFICAR_TS ABRIR_PARENTESIS CERRAR_PARENTESIS PUNTO_COMA {$$=instruccionesAPI.nuevoGraficarTS();}
;
sentencias
	: sentencias sentencia { $1.push($2); $$ = $1; }
	| sentencia               { $$ = [$1]; }
;
sentencia
	: declaracion {$$=$1;}
	//	| type {$$=$1;}
	| R_IF ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE elseIf { $$ = instruccionesAPI.nuevoIf($3, $6, $8);}
	| R_CONSOLE PUNTO R_LOG ABRIR_PARENTESIS expresion CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevoImprimir($5);}
	| R_SWITCH ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE cases CERRAR_LLAVE {$$=instruccionesAPI.nuevoSwitch($3, $6);}
	| R_FOR ABRIR_PARENTESIS for_init expresion PUNTO_COMA IDENTIFICADOR for_change CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE { $$ = instruccionesAPI.nuevoFor($3, $4, {id:$6, paso:$7}, $10);}
	| R_FOR ABRIR_PARENTESIS R_LET IDENTIFICADOR R_OF id CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoForOF($4, $6, $9);}
	| R_FOR ABRIR_PARENTESIS R_LET IDENTIFICADOR R_IN id CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoForIn($4, $6, $9);}
	| R_WHILE ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE {$$=instruccionesAPI.nuevoWhile($3, $6);}
	| R_DO ABRIR_LLAVE sentencias CERRAR_LLAVE R_WHILE ABRIR_PARENTESIS expresion CERRAR_PARENTESIS PUNTO_COMA {$$=instruccionesAPI.nuevoDoWhile($3, $7);}
	| IDENTIFICADOR ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevaLlamada($1, $3, @1.first_column, @1.first_line);}
	| R_RETURN retorno PUNTO_COMA{$$=instruccionesAPI.nuevoReturn($2);}
	| id IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaAsignacion($1, $3, @1.first_column, @1.first_line);}
	| id INCREMENTO PUNTO_COMA{$$=instruccionesAPI.nuevoIncremento($1, $2, @1.first_column, @1.first_line);}
	| id DECREMENTO PUNTO_COMA{$$=instruccionesAPI.nuevoDecremento($1, $2, @1.first_column, @1.first_line);}
	| id ASIGNACION_SUMA expresion PUNTO_COMA {$$=instruccionesAPI.nuevoAsignacioSuma($1, $3, @1.first_column, @1.first_line);}
	| id ASIGNACION_RESTA expresion PUNTO_COMA {$$=instruccionesAPI.nuevoAsignacioResta($1, $3, @1.first_column, @1.first_line);}
	| id PUNTO_COMA {$$=instruccionesAPI.nuevoAcceso($1, @1.first_column, @1.first_line);}
	| R_BREAK PUNTO_COMA{$$=instruccionesAPI.nuevoBreak();}
	| R_CONTINUE PUNTO_COMA {$$=instruccionesAPI.nuevoContinue();}
	| R_GRAFICAR_TS ABRIR_PARENTESIS CERRAR_PARENTESIS PUNTO_COMA {$$=instruccionesAPI.nuevoGraficarTS();}
;
expresion
	: MENOS expresion %prec UMENOS				{ $$ = instruccionesAPI.nuevaOperacionUnaria($2, TIPO_OPERACION.NEGATIVO); }
	| expresion MAS expresion			{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.SUMA); }
	| expresion MENOS expresion		{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.RESTA); }
	| expresion MULTIPLICACION expresion			{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MULTIPLICACION); }
	| expresion DIVISION expresion	{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.DIVISION); }
	| expresion POTENCIA expresion	{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.POTENCIA); }
	| expresion MODULO expresion	{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MODULO); }
    | expresion MAYOR expresion		{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR); }
	| expresion MENOR expresion		{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MENOR); }
	| expresion MAYOR_IGUAL expresion	{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MAYOR_IGUAL); }
	| expresion MENOR_IGUAL expresion	{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.MENOR_IGUAL); }
	| expresion IGUALDAD expresion			{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.IGUAL_IGUAL); }
	| expresion DISTINTO expresion			{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.DISTINTO); }
	| expresion AND expresion     { $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.AND); }
	| expresion OR expresion 		{ $$ = instruccionesAPI.nuevaOperacionBinaria($1, $3, TIPO_OPERACION.OR); }
	| NOT expresion		{$$ =  instruccionesAPI.nuevaOperacionUnaria($2, TIPO_OPERACION.NOT);}
	| ABRIR_PARENTESIS expresion CERRAR_PARENTESIS					{ $$ = $2; }
	| ENTERO											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.NUMERO); }
	| DECIMAL											{ $$ = instruccionesAPI.nuevoValor(Number($1), TIPO_VALOR.DECIMAL); }
	//	| IDENTIFICADOR										{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
	| IDENTIFICADOR	ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS { $$ = instruccionesAPI.nuevaLlamada($1, $3, @1.first_column, @1.first_line); }
	| R_TRUE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.TRUE); }
	| R_FALSE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.FALSE); }
	| CADENA											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
	| CADENA_CHARS { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA_CHARS); }
	| CADENA_EJECUTABLE { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA_EJECUTABLE); }
	| objeto { $$ = instruccionesAPI.nuevoObjeto($1, @1.first_column, @1.first_line); }
	| ABRIR_CORCHETE arrays CERRAR_CORCHETE  { $$ = instruccionesAPI.nuevoArray($2, @2.first_column, @2.first_line); }
	| id {$$=instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR);}
	//	| id PUNTO R_POP ABRIR_PARENTESIS CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPop();}
	//	| id PUNTO R_LENGTH {$$=instruccionesAPI.nuevoLength();}
	| expresion OPERADOR_TERNARIO expresion DOS_PUNTOS expresion {$$=instruccionesAPI.nuevoOperadorTernario($1, $3, $5);}
	| R_NULL {$$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.NULL);}
	//| IDENTIFICADOR ABRIR_CORCHETE expresion CERRAR_CORCHETE array_position {$$=instruccionesAPI.nuevoAccesoAPosicion($1, $3, $5);}
	//| IDENTIFICADOR array_position PUNTO R_POP ABRIR_PARENTESIS CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPop($1, $2);}
	//| IDENTIFICADOR array_position PUNTO R_LENGTH {$$=instruccionesAPI.nuevoLength($1, $2);}
;
argumentos
	: expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($1, $2, @1.first_column, @1.first_line);}
	| {$$ = "Epsilon";}
;
argumentos_P
	: COMA expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($2, $3 , @2.first_column, @2.first_line);}
	| {$$ =  "Epsilon";}
;
/* Definición de la gramática de Typescript*/

declaracion
	: R_LET IDENTIFICADOR definicion_tipo definicion listaID PUNTO_COMA {$$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3, $4, $5, @2.first_line, @2.first_column);}
	| R_CONST IDENTIFICADOR definicion_tipo definicion listaID PUNTO_COMA{$$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3, $4, $5, @2.first_line, @2.first_column);}
	| error  PUNTO_COMA { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
						  salida.push('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);
						  ArrayDeErrores.push({tipo:"sintáctico", linea:this._$.first_line, columna:this._$.first_column, descripcion: yytext});}
;
listaID
	: COMA IDENTIFICADOR definicion_tipo definicion listaID {$$=instruccionesAPI.nuevoID($2,$3, $4,$5, @2.first_line, @2.first_column);}
	| {$$="Epsilon";}
;
//se deja el error de no inicializar una const para el análisis semántico
listaIDConst
	: COMA IDENTIFICADOR definicion_tipo IGUAL expresion listaID {$$=instruccionesAPI.nuevoID($2, $3, $5, $6);}
	| {$$="Epsilon";}
;
definicion
	:IGUAL expresion {$$=$2;}
	| {$$="undefined";}
;
//por ahora no se usa aunque se buscará implementar ese manejo de error
definicion_const
	: IGUAL expresion {$$=$2;}
;
definicion_tipo
	: DOS_PUNTOS tipo {$$=$2;}
	| {$$={tipo:"infer", isArray:false};}
;
tipo
	: R_NUMBER declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
	| R_STRING declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
	| R_BOOLEAN declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
	| IDENTIFICADOR declarar_array { $$ = instruccionesAPI.nuevoTipo($1, $2);}
	| R_VOID {$$=instruccionesAPI.nuevoTipo($1, false);}
;
declarar_array
	: ABRIR_CORCHETE CERRAR_CORCHETE declarar_array{$$=instruccionesAPI.nuevaDimension($3);}
	| {$$=false;}
;
objeto
	: ABRIR_LLAVE obj_atributos CERRAR_LLAVE {$$=$2;}
	| ABRIR_LLAVE CERRAR_LLAVE {$$="Epsilon";}
;
obj_atributos 
	: IDENTIFICADOR DOS_PUNTOS expresion obj_atributos_pr {$$=instruccionesAPI.nuevoObjAtributo($1, $3, $4);}
;
obj_atributos_pr
	: COMA obj_atributos {$$=$2;}
	| {$$="Epsilon";}
;
/**/
//try
arrays
	:  expresion arrays_pr {$$=instruccionesAPI.nuevoDato($1, $2);}
	| {$$="Epsilon";}
;
arrays_pr
	: COMA expresion arrays_pr {$$=instruccionesAPI.nuevoDato($2, $3);}
	| {$$="Epsilon";}
;  
type
	: R_TYPE IDENTIFICADOR IGUAL ABRIR_LLAVE type_atributos CERRAR_LLAVE PUNTO_COMA {$$=instruccionesAPI.nuevoType($2,$5, @2.first_line, @2.first_column);}
;
type_atributos 
	: IDENTIFICADOR definicion_tipo type_atributos_pr {$$=instruccionesAPI.nuevoTypeAtributo($1, $2, $3);}
;
type_atributos_pr
	: COMA type_atributos {$$=$2;}
	| PUNTO_COMA type_atributos {$$=$2;}
	| COMA {$$="Epsilon";}
	| PUNTO_COMA {$$="Epsilon";}
	| {$$="Epsilon";}
;
elseIf
	: R_ELSE elseIf_P { $$ = $2;}
	| { $$ = "Epsilon"; }	//NELSE
;
elseIf_P
	: R_IF ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE sentencias CERRAR_LLAVE elseIf {$$ = instruccionesAPI.nuevoElseIf($3, $6, $8);}
	| ABRIR_LLAVE sentencias CERRAR_LLAVE {$$ =  instruccionesAPI.nuevoElse($2);}
;
cases
	: R_CASE expresion DOS_PUNTOS  sentencias  cases {$$=instruccionesAPI.nuevoCase($2, $4, $5);} 
	| R_DEFAULT DOS_PUNTOS  sentencias  {$$=instruccionesAPI.nuevoDefault($3);}
	| {$$="Epsilon";}
;
for_init	
	: R_LET IDENTIFICADOR definicion_tipo IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3, $5, "Epsilon", @2.first_line, @2.first_column);}
	| id IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaAsignacion($1, $3, @1.first_column, @1.first_line);} 
;
for_change
	: INCREMENTO {$$=$1;}
	| DECREMENTO {$$=$1;}
	| IGUAL expresion {$$=$2;}
;
parametros
	: IDENTIFICADOR definicion_tipo parametros_pr {$$=instruccionesAPI.nuevoParametro($2, $1, $3);}
	| {$$="Epsilon";}
;
parametros_pr
	: COMA IDENTIFICADOR  definicion_tipo parametros_pr {$$=instruccionesAPI.nuevoParametro($3, $2, $4);}
	| {$$="Epsilon";}
;
retorno
	: expresion {$$=$1;}
	| {$$="Epsilon";}
;
array_position
	: ABRIR_CORCHETE expresion CERRAR_CORCHETE array_position {$$=instruccionesAPI.nuevoArrayIndex($2, $4);}
	| {$$="false";}
;
id
	: IDENTIFICADOR id_pr {$$=instruccionesAPI.nuevaReferencia($1, $2, @1.first_column, @1.first_line);}
;
id_pr
	: ABRIR_CORCHETE expresion CERRAR_CORCHETE id_pr {$$=instruccionesAPI.nuevoAccPosicion($2, $4, @1.first_column, @1.first_line);}
	| PUNTO IDENTIFICADOR id_pr {$$=instruccionesAPI.nuevoAccAtributo($2, $3, @2.first_column, @2.first_line);}
	| PUNTO R_POP ABRIR_PARENTESIS CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPop(@2.first_column, @2.first_line);}
	| PUNTO R_LENGTH {$$=instruccionesAPI.nuevoLength(@2.first_column, @2.first_line);}
	| PUNTO R_PUSH ABRIR_PARENTESIS expresion CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPush($4, @2.first_column, @2.first_line);}
	| {$$="Epsilon";}
;