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

%nonassoc 'DECREMENTO' 'INCREMENTO'
%nonassoc 'CERRAR_LLAVE' 'ABRIR_LLAVE'
%nonassoc 'CERRAR_CORCHETE' 'ABRIR_CORCHETE'
%nonassoc 'CERRAR_PARENTESIS' 'ABRIR_PARENTESIS'

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
	: declaracion {$$=$1;}
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
	| objeto { $$ = instruccionesAPI.nuevoObjeto($1); }
	| ABRIR_CORCHETE inner_values CERRAR_CORCHETE  { $$ = instruccionesAPI.nuevosDatosDeDimension($2, "undefined"); }
;


/* Definición de la gramática de Typescript*/

declaracion
	: R_LET IDENTIFICADOR definicion_tipo definicion PUNTO_COMA {$$ = instruccionesAPI.nuevaDeclaracion($1, $2, $4, $3);}
	| R_CONST IDENTIFICADOR definicion_tipo IGUAL expresion PUNTO_COMA{$$ = instruccionesAPI.nuevaDeclaracion($1, $2, $5, $3); console.log($4)}
	| error PUNTO_COMA
;
definicion
	:IGUAL expresion {$$=$2;}
	| {$$="undefined";}
;
//por ahora no se usa aunque se buscará implementar ese manejo de error
definicion_const
	: IGUAL expresion {$$=$2;}
	| error { console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column+' la declaración de un const tiene que ser inicializado.');	}
;
definicion_tipo
	: DOS_PUNTOS tipo {$$=$2;}
	| {$$="infer";}
;
tipo
	: R_NUMBER declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
	| R_STRING declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
	| R_BOOLEAN declarar_array { $$=instruccionesAPI.nuevoTipo($1,$2); }
;
declarar_array
	: ABRIR_CORCHETE CERRAR_CORCHETE declarar_array{$$=instruccionesAPI.nuevaDimension($3);}
	| {$$=false;}
;
objeto
	: ABRIR_LLAVE obj_atributos CERRAR_LLAVE {$$=$2;}
	| ABRIR_LLAVE CERRAR_LLAVE {$$="NA";}
;
obj_atributos 
	: IDENTIFICADOR definicion_tipo obj_atributos_pr {$$=instruccionesAPI.nuevoAtributo($1, $2, $3);}
;
obj_atributos_pr
	: COMA obj_atributos {$$=$2;}
	| {$$="NM";}
;
array
	: ABRIR_CORCHETE inner_values CERRAR_CORCHETE array {$$=instruccionesAPI.nuevosDatosDeDimension($2, $4);}
;
inner_values
	: expresion inner_values_pr {$$=instruccionesAPI.nuevoDato($1, $2);}
	| {$$="NA";}
;
inner_values_pr
	: COMA expresion inner_values_pr {$$=instruccionesAPI.nuevoDato($2, $3);}
	| {$$="NM";}
;