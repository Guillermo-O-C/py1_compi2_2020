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
	: expresion EOF {
		// cuado se haya reconocido la entrada completa retornamos el AST
		var temporal = salida;
		salida=[];
		var tempAr = ArrayDeErrores;
		ArrayDeErrores = [];
		return {AST: $1, Errores: temporal, ErrArr:tempAr};
	}
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
	| IDENTIFICADOR	ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS { $$ = instruccionesAPI.nuevaLlamada($1, $3); }
	| R_TRUE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.TRUE); }
	| R_FALSE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.FALSE); }
	| CADENA											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
	| CADENA_CHARS { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA_CHARS); }
	| CADENA_EJECUTABLE { $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA_EJECUTABLE); }
	| objeto { $$ = instruccionesAPI.nuevoObjeto($1); }
	| ABRIR_CORCHETE arrays CERRAR_CORCHETE  { $$ = instruccionesAPI.nuevoArray($2); }
	| id {$$=instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR);}
	| expresion OPERADOR_TERNARIO expresion DOS_PUNTOS expresion {$$=instruccionesAPI.nuevoOperadorTernario($1, $3, $5);}
	| R_NULL {$$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.NULL);}
;
argumentos
	: expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($1, $2);}
	| {$$ = "Epsilon";}
;
argumentos_P
	: COMA expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($2, $3);}
	| {$$ =  "Epsilon";}
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
arrays
	:  expresion arrays_pr {$$=instruccionesAPI.nuevoDato($1, $2);}
	| {$$="Epsilon";}
;
arrays_pr
	: COMA expresion arrays_pr {$$=instruccionesAPI.nuevoDato($2, $3);}
	| {$$="Epsilon";}
;
id
	: IDENTIFICADOR id_pr {$$=instruccionesAPI.nuevaReferencia($1, $2);}
;
id_pr
	: ABRIR_CORCHETE expresion CERRAR_CORCHETE id_pr {$$=instruccionesAPI.nuevoAccPosicion($2, $4);}
	| PUNTO IDENTIFICADOR id_pr {$$=instruccionesAPI.nuevoAccAtributo($2, $3);}
	| PUNTO R_POP ABRIR_PARENTESIS CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPop();}
	| PUNTO R_LENGTH {$$=instruccionesAPI.nuevoLength();}
	| PUNTO R_PUSH ABRIR_PARENTESIS expresion CERRAR_PARENTESIS {$$=instruccionesAPI.nuevoPush($4);}
	| {$$="Epsilon";}
;