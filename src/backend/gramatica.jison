/* Definición del lenguaje */

%lex
%options case-sensitive

%%

"int" return 'R_INTEGER';
"double" return 'R_DOUBLE';
"boolean" return 'R_BOOLEAN';
"char" return 'R_CHAR';
"String" return 'R_STRING';
"false" return 'R_FALSE';
"true" return 'R_TRUE';
"class" return 'R_CLASS';
"import" return 'R_IMPORT';
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
"main" return 'R_MAIN';
"System" return 'R_SYSTEM';
"out" return 'R_OUT';
"print" return 'R_PRINT';
"println" return 'R_PRINTLN';

\"(\\\"|\\n|\\t|\\r|\\\\|[^\"])*\" { yytext = yytext.substr(1, yyleng-2); return 'CADENA';}
\'[^\"]?\' { yytext = yytext.substr(1, yyleng-2); return 'CARACTER';}
[0-9]+"."([0-9]+)?\b return 'DECIMAL';
[0-9]+\b return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]* return 'IDENTIFICADOR';
\s+ {}                                                                             //Ignora los espacios en blanco
"//".*                           // comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] // comentario multiple líneas
"++" return 'INCREMENTO';
"--" return 'DECREMENTO';
"+" return "MAS";
"-" return 'MENOS';
"*" return 'MULTIPLICACION';
"/" return 'DIVISION';
"^" return 'POTENCIA';
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

<<EOF>>                 return 'EOF';

.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); salida.push('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);  ArrayDeErrores.push({tipo:"léxico", linea:this._$.first_line, columna:this._$.first_column, descripcion: yytext});}
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

%left 'AND' 'OR'
%left 'IGUALDAD' 'MENOR' 'MENOR_IGUAL' 'MAYOR' 'MAYOR_IGUAL' 'DISTINTO'
%left 'MAS' 'MENOS'
%left 'MULTIPLICACION' 'DIVISION'
%left 'POTENCIA' 'MODULO'
%left UMENOS 'NOT'

%start ini

%% /* Definición de la gramática */

ini
	: sentencias EOF {
		// cuado se haya reconocido la entrada completa retornamos el AST
		var temporal = salida;
		salida=[];
		var tempAr = ArrayDeErrores;
		ArrayDeErrores = [];
		return {AST: $1, Errores: temporal};
	}
;
sentencias
	: sentencias sentencia { $1.push($2); $$ = $1; }
	| sentencia               { $$ = [$1]; }
;
sentencia
	: R_VOID IDENTIFICADOR ABRIR_PARENTESIS parametros CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE  {  $$ = instruccionesAPI.nuevaFuncion($1, $2, $4, $7); }
	| R_VOID R_MAIN ABRIR_PARENTESIS CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE {$$ = instruccionesAPI.nuevoMain($6); } 
	| R_INTEGER  declaracion_p { $$ = $2; currentType=$1;}
	| R_DOUBLE  declaracion_p { $$ = $2; currentType=$1;}
	| R_STRING  declaracion_p { $$ = $2; currentType=$1;}
	| R_BOOLEAN  declaracion_p { $$ = $2; currentType=$1;}
	| R_CHAR  declaracion_p { $$ = $2; currentType=$1;}
;
declaracion_p
	: listaID  defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion( $0, $1, $2); }
	| IDENTIFICADOR ABRIR_PARENTESIS parametros CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE  {$$ = instruccionesAPI.nuevaFuncion( $0, $1, $3, $6); }
;
listaID
	:	IDENTIFICADOR listaID_P { $$ = instruccionesAPI.nuevaListaid($1, $2);}
;
listaID_P
	: COMA IDENTIFICADOR listaID_P {$$ = instruccionesAPI.nuevaListaid($2, $3);}
	| {$$="NM";}
;
parametros
	: R_INTEGER IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($1, $2, $3); }
	| R_DOUBLE IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($1, $2, $3);}
	| R_STRING IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($1, $2, $3); }
	| R_BOOLEAN IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($1, $2, $3); }
	| R_CHAR IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($1, $2, $3); }
	| { $$ = "NA"; }
;
parametros_p
	: COMA R_INTEGER IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($2, $3, $4); }
	| COMA R_DOUBLE IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($2, $3, $4);}
	| COMA R_STRING IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($2, $3, $4);}
	| COMA R_BOOLEAN IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($2, $3, $4);}
	| COMA R_CHAR IDENTIFICADOR parametros_p { $$ = instruccionesAPI.nuevoParametro($2, $3, $4); }
	| { $$ = "NM"; }
;
instrucciones
	: instrucciones instruccion { $1.push($2); $$ = $1; }
	| instruccion               { $$ = [$1]; }
;
instruccion
   	: IDENTIFICADOR IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaAsignacion($1, $3);}
	| IDENTIFICADOR ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevaLlamada($1, $3);}
	| R_INTEGER listaID defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3); }
	| R_DOUBLE listaID defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3);}
	| R_STRING listaID defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3);}
	| R_BOOLEAN listaID defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3); }
	| R_CHAR listaID defincion_var PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $3); }
	| R_PRINT ABRIR_PARENTESIS expresion CERRAR_PARENTESIS PUNTO_COMA {$$ = instruccionesAPI.nuevoImprimir($3);}
	| R_IF ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE elseIf { $$ = instruccionesAPI.nuevoIf($3, $6, $8);}
    | R_FOR ABRIR_PARENTESIS for_init expresion PUNTO_COMA IDENTIFICADOR for_change CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE { $$ = instruccionesAPI.nuevoFor($3, $4, $7, $10);}
	| R_RETURN expresion PUNTO_COMA{$$=instruccionesAPI.nuevoReturn($2);}
	| error  { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column);	salida.push('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); ArrayDeErrores.push({tipo:"sintáctico", linea:this._$.first_line, columna:this._$.first_column, descripcion: yytext});}
;
defincion_var
	: IGUAL expresion { $$ = $2; }
	| { $$ = "null"; }
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
	| IDENTIFICADOR										{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.IDENTIFICADOR); }
	| IDENTIFICADOR	ABRIR_PARENTESIS argumentos CERRAR_PARENTESIS { $$ = instruccionesAPI.nuevaLlamada($1, $3); }
	| CARACTER											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CARACTER); }
	| R_TRUE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.TRUE); }
	| R_FALSE											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.FALSE); }
	| CADENA											{ $$ = instruccionesAPI.nuevoValor($1, TIPO_VALOR.CADENA); }
;
elseIf
	: R_ELSE elseIf_P { $$ = $2;}
	| { $$ = "NELSE"; }	
;
elseIf_P
	: R_IF ABRIR_PARENTESIS expresion CERRAR_PARENTESIS ABRIR_LLAVE instrucciones CERRAR_LLAVE elseIf {$$ = instruccionesAPI.nuevoElseIf($3, $6, $8);}
	| ABRIR_LLAVE instrucciones CERRAR_LLAVE {$$ =  instruccionesAPI.nuevoElse($2);}
;
for_init	
	: R_INTEGER IDENTIFICADOR IGUAL expresion PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $4);}
	| R_DOUBLE IDENTIFICADOR IGUAL expresion PUNTO_COMA { $$ = instruccionesAPI.nuevaDeclaracion($1, $2, $4);}
	| IDENTIFICADOR IGUAL expresion PUNTO_COMA {$$ = instruccionesAPI.nuevaAsignacion($1, $3);} 
;
for_change
	: INCREMENTO {$$=$1;}
	| DECREMENTO {$$=$1;}
	| IGUAL expresion {$$=$2;}
;
argumentos
	: expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($1, $2);}
	| {$$ = "NA";}
;
argumentos_P
	: COMA expresion argumentos_P {$$ = instruccionesAPI.nuevoArgumento($2, $3);}
	| {$$ =  "NM";}
;