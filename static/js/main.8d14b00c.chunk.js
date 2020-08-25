(this.webpackJsonppy1_compi2=this.webpackJsonppy1_compi2||[]).push([[0],{28:function(e,t,n){"use strict";n.r(t),function(e){var t=n(47),a=n(48),i={NUMERO:"NUMERO",DECIMAL:"DECIMAL",IDENTIFICADOR:"IDENTIFICADOR",CADENA:"CADENA",CARACTER:"CARACTER",TRUE:"TRUE",FALSE:"FALSE",OBJETO:"OBJETO"},r={CLASE:"CLASE",ASIGNACION:"ASIGNACION",DECLARACION:"DECLARACION",IMPORT:"IMPORT",IF:"IF",ELSE_IF:"ELSE_IF",ELSE:"ELSE",SWITCH:"SWITCH",WHILE:"WHILE",DO_WHILE:"DO_WHILE",FOR:"FOR",FUNCION:"FUNCION",MAIN:"MAIN",RETURN:"RETURN",CONTINUE:"CONTINUE",BREAK:"BREAK",IMPRIMIR:"IMPRIMIR",COMENTARIO:"COMENTARIO",PARAMETRO:"PARAMETRO",VARIABLE:"VARIABLE",METODO:"METODO",CASE:"CASE",DEFAULT:"DEFAULT",LLAMADA:"LLAMADA",INCREMENTO:"INCREMENTO",DECREMENTO:"DECREMENTO"},s={NUMBER:"NUMBER",BOOLEAN:"BOOLEAN",STRING:"STRING",OBJETO:"OBJETO",VOID:"VOID",TYPES:"TYPES",ARRAY:"ARRAY"},o="LET",c="CONST";function l(e,t,n){return{operandoIzq:e,operandoDer:t,tipo:n}}var u=function(){function e(n){Object(t.a)(this,e),this._simbolos=n}return Object(a.a)(e,[{key:"agregar",value:function(e,t){var n=function(e,t,n){return{id:e,tipo:t,valor:n}}(e,t);this._simbolos.push(n)}},{key:"agregarFuncion",value:function(e,t,n,a){var i=function(e,t,n,a){return{id:e,tipo:t,parametros:n,accion:a}}(e,t,n,a);this._simbolos.push(i)}},{key:"actualizar",value:function(e,t){var n=this._simbolos.filter((function(t){return t.id===e}))[0];if(n.tipo!=t.tipo)throw"ERROR: Incompatibilidad de tipos: "+t.tipo+" no se puede convertir en "+n.tipo;if(!n)throw"ERROR: variable: "+e+" no ha sido declarada.";n.valor=t.valor}},{key:"obtenerSimbolo",value:function(e){var t=this._simbolos.filter((function(t){return t.id===e}))[0];if(t)return{valor:t.valor,tipo:t.tipo};throw"ERROR: variable: "+e+" no ha sido declarada."}},{key:"obtenerFuncion",value:function(e){var t=this._simbolos.filter((function(t){return t.id===e}))[0];if(t)return{tipo:t.tipo,parametros:t.parametros,accion:t.accion};throw"ERROR: no existe ninguna funci\xf3n llamada: "+e+"."}},{key:"existe",value:function(e){return!!this._simbolos.filter((function(t){return t.id===e}))[0]}},{key:"simbolos",get:function(){return this._simbolos}}]),e}();function h(e){return"number"===e?s.NUMBER:"boolean"===e?s.BOOLEAN:"string"===e?s.STRING:"void"===e?s.VOID:void 0}var E={nuevaOperacionBinaria:function(e,t,n){return l(e,t,n)},nuevaOperacionUnaria:function(e,t){return l(e,void 0,t)},nuevoValor:function(e,t){return{tipo:t,valor:e}},nuevaDeclaracion:function(e,t,n,a){return{sentencia:r.DECLARACION,variable_type:(i=e,"let"===i?o:"const"===i?c:void 0),data_type:h(a.tipo),isArray:a.isArray,id:t,expresion:n};var i},nuevoObjeto:function(e){return{tipo:i.OBJETO,atributos:e}},nuevoAtributo:function(e,t,n){return{id:e,data_type:h(t),next:n}},nuevaDimension:function(e){return{dimension:!0,next_dimension:e}},nuevoTipo:function(e,t){return{tipo:e,isArray:t}},nuevoArray:function(e){return{data_type:s.ARRAY,dimension:e}},nuevosDatosDeDimension:function(e,t){return{datos:e,next_dimension:t}},nuevoDato:function(e,t){return{dato:e,next_data:t}},nuevaAsignacion:function(e,t){return{sentencia:r.ASIGNACION,id:e,expresion:t}},nuevoImprimir:function(e){return{sentencia:r.IMPRIMIR,valor:e}},nuevoIf:function(e,t,n){return{sentencia:r.IF,logica:e,accion:t,else:n}},nuevoElseIf:function(e,t,n){return{sentencia:r.ELSE_IF,logica:e,accion:t,else:n}},nuevoElse:function(e){return{sentencia:r.ELSE,accion:e}},nuevoFor:function(e,t,n,a){return{sentencia:r.FOR,inicial:e,final:t,paso:n,accion:a}},nuevoMain:function(e){return{sentencia:r.MAIN,accion:e}},nuevaFuncion:function(e,t,n,a){return{sentencia:r.FUNCION,tipo:h(e),id:t,parametros:n,accion:a}},nuevaListaid:function(e,t){return{id:e,siguiente:t}},nuevaLlamada:function(e,t){return{sentencia:r.LLAMADA,id:e,parametros:t}},nuevoArgumento:function(e,t){return{expresion:e,siguiente:t}},nuevoParametro:function(e,t,n){return{tipo:h(e),id:t,siguiente:n}},nuevoReturn:function(e){return{sentencia:r.RETURN,valor:e}}};e.exports.TIPO_OPERACION={SUMA:"SUMA",RESTA:"RESTA",MULTIPLICACION:"MULTIPLICACION",DIVISION:"DIVISION",NEGATIVO:"NEGATIVO",POTENCIA:"POTENCIA",MODULO:"MODULO",MAYOR:"MAYOR",MAYOR_IGUAL:"MAYOR_IGUAL",MENOR:"MENOR",MENOR_IGUAL:"MENOR_IGUAL",CONCATENACION:"CONCATENACION",IGUAL_IGUAL:"IGUAL IGUAL",DISTINTO:"DISTINTO",CONDICION:"CONDICION",AND:"AND",OR:"OR",NOT:"NOT"},e.exports.SENTENCIAS=r,e.exports.TIPO_VALOR=i,e.exports.instruccionesAPI=E,e.exports.TIPO_DATO=s,e.exports.TS=u}.call(this,n(77)(e))},45:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},46:function(e,t,n){(function(e,a){var i=function(){var e=function(e,t,n,a){for(n=n||{},a=e.length;a--;n[e[a]]=t);return n},t=[1,7],a=[1,5],i=[1,6],r=[2,5,38,42],s=[2,40],o=[1,14],c=[1,25],l=[1,26],u=[1,27],h=[1,28],E=[1,29],y=[1,30],p=[1,31],O=[1,32],m=[1,33],f=[1,34],A=[1,36],I=[1,37],R=[41,43,53,55],_=[2,45],b=[1,39],d=[1,44],g=[1,43],N=[1,45],v=[1,46],T=[1,47],C=[1,48],S=[1,49],k=[1,50],L=[1,51],D=[1,52],M=[1,53],x=[1,54],U=[1,55],P=[1,56],$=[9,10,11,12,13,14,15,16,17,18,19,20,21,22,25,37,41,55],B=[1,65],w=[2,55],F=[9,10,15,16,17,18,19,20,21,22,25,37,41,55],G=[9,10,11,12,15,16,17,18,19,20,21,22,25,37,41,55],V=[15,16,17,18,19,20,21,22,25,37,41,55],j=[21,22,25,37,41,55],Y=[2,57],H=[1,93],W=[2,53],z=[1,97],J={trace:function(){},yy:{},symbols_:{error:2,ini:3,sentencias:4,EOF:5,sentencia:6,declaracion:7,expresion:8,MENOS:9,MAS:10,MULTIPLICACION:11,DIVISION:12,POTENCIA:13,MODULO:14,MAYOR:15,MENOR:16,MAYOR_IGUAL:17,MENOR_IGUAL:18,IGUALDAD:19,DISTINTO:20,AND:21,OR:22,NOT:23,ABRIR_PARENTESIS:24,CERRAR_PARENTESIS:25,ENTERO:26,DECIMAL:27,IDENTIFICADOR:28,argumentos:29,CARACTER:30,R_TRUE:31,R_FALSE:32,CADENA:33,objeto:34,ABRIR_CORCHETE:35,arrays:36,CERRAR_CORCHETE:37,R_LET:38,definicion_tipo:39,definicion:40,PUNTO_COMA:41,R_CONST:42,IGUAL:43,definicion_const:44,DOS_PUNTOS:45,tipo:46,R_NUMBER:47,declarar_array:48,R_STRING:49,R_BOOLEAN:50,ABRIR_LLAVE:51,obj_atributos:52,CERRAR_LLAVE:53,obj_atributos_pr:54,COMA:55,inner_values:56,arrays_pr:57,inner_values_pr:58,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",9:"MENOS",10:"MAS",11:"MULTIPLICACION",12:"DIVISION",13:"POTENCIA",14:"MODULO",15:"MAYOR",16:"MENOR",17:"MAYOR_IGUAL",18:"MENOR_IGUAL",19:"IGUALDAD",20:"DISTINTO",21:"AND",22:"OR",23:"NOT",24:"ABRIR_PARENTESIS",25:"CERRAR_PARENTESIS",26:"ENTERO",27:"DECIMAL",28:"IDENTIFICADOR",29:"argumentos",30:"CARACTER",31:"R_TRUE",32:"R_FALSE",33:"CADENA",35:"ABRIR_CORCHETE",37:"CERRAR_CORCHETE",38:"R_LET",41:"PUNTO_COMA",42:"R_CONST",43:"IGUAL",45:"DOS_PUNTOS",47:"R_NUMBER",49:"R_STRING",50:"R_BOOLEAN",51:"ABRIR_LLAVE",53:"CERRAR_LLAVE",55:"COMA"},productions_:[0,[3,2],[4,2],[4,1],[6,1],[8,2],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,2],[8,3],[8,1],[8,1],[8,1],[8,4],[8,1],[8,1],[8,1],[8,1],[8,1],[8,3],[7,5],[7,6],[7,2],[40,2],[40,0],[44,2],[44,1],[39,2],[39,0],[46,2],[46,2],[46,2],[48,3],[48,0],[34,3],[34,2],[52,3],[54,2],[54,0],[36,4],[57,5],[57,0],[56,2],[56,0],[58,3],[58,0]],performAction:function(e,t,n,a,i,r,s){var o=r.length-1;switch(i){case 1:var c=Q;Q=[];return X=[],{AST:r[o-1],Errores:c};case 2:r[o-1].push(r[o]),this.$=r[o-1];break;case 3:this.$=[r[o]];break;case 4:case 35:case 37:case 39:case 49:this.$=r[o];break;case 5:this.$=Z.nuevaOperacionUnaria(r[o],K.NEGATIVO);break;case 6:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.SUMA);break;case 7:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.RESTA);break;case 8:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MULTIPLICACION);break;case 9:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.DIVISION);break;case 10:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.POTENCIA);break;case 11:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MODULO);break;case 12:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MAYOR);break;case 13:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MENOR);break;case 14:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MAYOR_IGUAL);break;case 15:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.MENOR_IGUAL);break;case 16:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.IGUAL_IGUAL);break;case 17:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.DISTINTO);break;case 18:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.AND);break;case 19:this.$=Z.nuevaOperacionBinaria(r[o-2],r[o],K.OR);break;case 20:this.$=Z.nuevaOperacionUnaria(r[o],K.NOT);break;case 21:this.$=r[o-1];break;case 22:this.$=Z.nuevoValor(Number(r[o]),q.NUMERO);break;case 23:this.$=Z.nuevoValor(Number(r[o]),q.DECIMAL);break;case 24:this.$=Z.nuevoValor(r[o],q.IDENTIFICADOR);break;case 25:this.$=Z.nuevaLlamada(r[o-3],r[o-1]);break;case 26:this.$=Z.nuevoValor(r[o],q.CARACTER);break;case 27:this.$=Z.nuevoValor(r[o],q.TRUE);break;case 28:this.$=Z.nuevoValor(r[o],q.FALSE);break;case 29:this.$=Z.nuevoValor(r[o],q.CADENA);break;case 30:this.$=Z.nuevoObjeto(r[o]);break;case 31:this.$=Z.nuevoArray(r[o-1]);break;case 32:this.$=Z.nuevaDeclaracion(r[o-4],r[o-3],r[o-1],r[o-2]);break;case 33:this.$=Z.nuevaDeclaracion(r[o-5],r[o-4],r[o-1],r[o-3]),console.log(r[o-2]);break;case 36:this.$="undefined";break;case 38:console.error("Error sint\xe1ctico: "+e+", en la linea: "+this._$.first_line+", en la columna: "+this._$.first_column+" la declaraci\xf3n de un const tiene que ser inicializado.");break;case 40:this.$="infer";break;case 41:case 42:case 43:this.$=Z.nuevoTipo(r[o-1],r[o]);break;case 44:this.$=Z.nuevaDimension(r[o]);break;case 45:this.$=!1;break;case 46:this.$=r[o-1];break;case 47:case 55:this.$="NA";break;case 48:this.$=Z.nuevoAtributo(r[o-2],r[o-1],r[o]);break;case 50:case 53:case 57:this.$="NM";break;case 51:case 52:this.$=Z.nuevosDatosDeDimension(r[o-2],r[o]);break;case 54:case 56:this.$=Z.nuevoDato(r[o-1],r[o])}},table:[{2:t,3:1,4:2,6:3,7:4,38:a,42:i},{1:[3]},{2:t,5:[1,8],6:9,7:4,38:a,42:i},e(r,[2,3]),e(r,[2,4]),{28:[1,10]},{28:[1,11]},{41:[1,12]},{1:[2,1]},e(r,[2,2]),e([41,43],s,{39:13,45:o}),{39:15,43:s,45:o},e(r,[2,34]),{40:16,41:[2,36],43:[1,17]},{46:18,47:[1,19],49:[1,20],50:[1,21]},{43:[1,22]},{41:[1,23]},{8:24,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},e(R,[2,39]),e(R,_,{48:38,35:b}),e(R,_,{48:40,35:b}),e(R,_,{48:41,35:b}),{8:42,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},e(r,[2,32]),{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x,21:U,22:P,41:[2,35]},{8:57,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:58,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:59,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},e($,[2,22]),e($,[2,23]),e($,[2,24],{24:[1,60]}),e($,[2,26]),e($,[2,27]),e($,[2,28]),e($,[2,29]),e($,[2,30]),{35:[1,62],36:61},{28:B,52:63,53:[1,64]},e(R,[2,41]),{37:[1,66]},e(R,[2,42]),e(R,[2,43]),{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x,21:U,22:P,41:[1,67]},{8:68,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:69,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:70,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:71,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:72,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:73,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:74,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:75,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:76,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:77,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:78,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:79,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:80,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{8:81,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},e($,[2,5]),e($,[2,20]),{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x,21:U,22:P,25:[1,82]},{29:[1,83]},{37:[1,84]},{8:86,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,37:w,51:I,56:85},{53:[1,87]},e($,[2,47]),e([53,55],s,{39:88,45:o}),e(R,_,{48:89,35:b}),e(r,[2,33]),e(F,[2,6],{11:N,12:v,13:T,14:C}),e(F,[2,7],{11:N,12:v,13:T,14:C}),e(G,[2,8],{13:T,14:C}),e(G,[2,9],{13:T,14:C}),e($,[2,10]),e($,[2,11]),e(V,[2,12],{9:d,10:g,11:N,12:v,13:T,14:C}),e(V,[2,13],{9:d,10:g,11:N,12:v,13:T,14:C}),e(V,[2,14],{9:d,10:g,11:N,12:v,13:T,14:C}),e(V,[2,15],{9:d,10:g,11:N,12:v,13:T,14:C}),e(V,[2,16],{9:d,10:g,11:N,12:v,13:T,14:C}),e(V,[2,17],{9:d,10:g,11:N,12:v,13:T,14:C}),e(j,[2,18],{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x}),e(j,[2,19],{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x}),e($,[2,21]),{25:[1,90]},e($,[2,31]),{37:[1,91]},{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x,21:U,22:P,37:Y,55:H,58:92},e($,[2,46]),{53:[2,50],54:94,55:[1,95]},e(R,[2,44]),e($,[2,25]),{37:W,55:z,57:96},{37:[2,54]},{8:98,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,51:I},{53:[2,48]},{28:B,52:99},{37:[2,51]},{35:[1,100]},{9:d,10:g,11:N,12:v,13:T,14:C,15:S,16:k,17:L,18:D,19:M,20:x,21:U,22:P,37:Y,55:H,58:101},{53:[2,49]},{8:86,9:c,23:l,24:u,26:h,27:E,28:y,30:p,31:O,32:m,33:f,34:35,35:A,37:w,51:I,56:102},{37:[2,56]},{37:[1,103]},{37:W,55:z,57:104},{37:[2,52]}],defaultActions:{8:[2,1],92:[2,54],94:[2,48],96:[2,51],99:[2,49],101:[2,56],104:[2,52]},parseError:function(e,t){if(!t.recoverable){var n=new Error(e);throw n.hash=t,n}this.trace(e)},parse:function(e){var t=this,n=[0],a=[null],i=[],r=this.table,s="",o=0,c=0,l=0,u=2,h=1,E=i.slice.call(arguments,1),y=Object.create(this.lexer),p={yy:{}};for(var O in this.yy)Object.prototype.hasOwnProperty.call(this.yy,O)&&(p.yy[O]=this.yy[O]);y.setInput(e,p.yy),p.yy.lexer=y,p.yy.parser=this,"undefined"==typeof y.yylloc&&(y.yylloc={});var m=y.yylloc;i.push(m);var f=y.options&&y.options.ranges;function A(e){n.length=n.length-2*e,a.length=a.length-e,i.length=i.length-e}"function"===typeof p.yy.parseError?this.parseError=p.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var I,R,_,b,d,g,N,v,T,C=function(){var e;return"number"!==typeof(e=y.lex()||h)&&(e=t.symbols_[e]||e),e},S={};;){if(_=n[n.length-1],this.defaultActions[_]?b=this.defaultActions[_]:(null!==I&&"undefined"!=typeof I||(I=C()),b=r[_]&&r[_][I]),"undefined"===typeof b||!b.length||!b[0]){var k,L=function(e){for(var t=n.length-1,a=0;;){if(u.toString()in r[e])return a;if(0===e||t<2)return!1;e=n[t-=2],++a}},D="";if(l)R!==h&&(k=L(_));else{for(g in k=L(_),T=[],r[_])this.terminals_[g]&&g>u&&T.push("'"+this.terminals_[g]+"'");D=y.showPosition?"Parse error on line "+(o+1)+":\n"+y.showPosition()+"\nExpecting "+T.join(", ")+", got '"+(this.terminals_[I]||I)+"'":"Parse error on line "+(o+1)+": Unexpected "+(I==h?"end of input":"'"+(this.terminals_[I]||I)+"'"),this.parseError(D,{text:y.match,token:this.terminals_[I]||I,line:y.yylineno,loc:m,expected:T,recoverable:!1!==k})}if(3==l){if(I===h||R===h)throw new Error(D||"Parsing halted while starting to recover from another error.");c=y.yyleng,s=y.yytext,o=y.yylineno,m=y.yylloc,I=C()}if(!1===k)throw new Error(D||"Parsing halted. No suitable error recovery rule available.");A(k),R=I==u?null:I,I=u,_=n[n.length-1],b=r[_]&&r[_][u],l=3}if(b[0]instanceof Array&&b.length>1)throw new Error("Parse Error: multiple actions possible at state: "+_+", token: "+I);switch(b[0]){case 1:n.push(I),a.push(y.yytext),i.push(y.yylloc),n.push(b[1]),I=null,R?(I=R,R=null):(c=y.yyleng,s=y.yytext,o=y.yylineno,m=y.yylloc,l>0&&l--);break;case 2:if(N=this.productions_[b[1]][1],S.$=a[a.length-N],S._$={first_line:i[i.length-(N||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(N||1)].first_column,last_column:i[i.length-1].last_column},f&&(S._$.range=[i[i.length-(N||1)].range[0],i[i.length-1].range[1]]),"undefined"!==typeof(d=this.performAction.apply(S,[s,c,o,p.yy,b[1],a,i].concat(E))))return d;N&&(n=n.slice(0,-1*N*2),a=a.slice(0,-1*N),i=i.slice(0,-1*N)),n.push(this.productions_[b[1]][0]),a.push(S.$),i.push(S._$),v=r[n[n.length-2]][n[n.length-1]],n.push(v);break;case 3:return!0}}return!0}},K=n(28).TIPO_OPERACION,q=n(28).TIPO_VALOR,Z=n(28).instruccionesAPI,Q=(n(28).TIPO_DATO,n(28).TS,[]),X=[],ee={EOF:1,parseError:function(e,t){if(!this.yy.parser)throw new Error(e);this.yy.parser.parseError(e,t)},setInput:function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},unput:function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var a=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===a.length?this.yylloc.first_column:0)+a[a.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(e){this.unput(this.match.slice(e))},pastInput:function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?"...":"")+e.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var e=this.pastInput(),t=new Array(e.length+1).join("-");return e+this.upcomingInput()+"\n"+t+"^"},test_match:function(e,t){var n,a,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),(a=e[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=a.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:a?a[a.length-1].length-a[a.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var r in i)this[r]=i[r];return!1}return!1},next:function(){if(this.done)return this.EOF;var e,t,n,a;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),r=0;r<i.length;r++)if((n=this._input.match(this.rules[i[r]]))&&(!t||n[0].length>t[0].length)){if(t=n,a=r,this.options.backtrack_lexer){if(!1!==(e=this.test_match(n,i[r])))return e;if(this._backtrack){t=!1;continue}return!1}if(!this.options.flex)break}return t?!1!==(e=this.test_match(t,i[a]))&&e:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var e=this.next();return e||this.lex()},begin:function(e){this.conditionStack.push(e)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(e){return(e=this.conditionStack.length-1-Math.abs(e||0))>=0?this.conditionStack[e]:"INITIAL"},pushState:function(e){this.begin(e)},stateStackSize:function(){return this.conditionStack.length},options:{"case-sensitive":!0},performAction:function(e,t,n,a){switch(n){case 0:return 47;case 1:return 50;case 2:return 49;case 3:return 38;case 4:return 42;case 5:return"R_CONSOLE";case 6:return"R_LOG";case 7:return 32;case 8:return 31;case 9:return"R_CLASS";case 10:return"R_IMPORT";case 11:return"R_IF";case 12:return"R_ELSE";case 13:return"R_SWITCH";case 14:return"R_CASE";case 15:return"R_DEFAULT";case 16:return"R_BREAK";case 17:return"R_CONTINUE";case 18:return"R_WHILE";case 19:return"R_DO";case 20:return"R_FOR";case 21:return"R_VOID";case 22:return"R_RETURN";case 23:return t.yytext=t.yytext.substr(1,t.yyleng-2),33;case 24:return t.yytext=t.yytext.substr(1,t.yyleng-2),30;case 25:return 27;case 26:return 26;case 27:return 28;case 28:case 29:case 30:break;case 31:return"INCREMENTO";case 32:return"DECREMENTO";case 33:return"MAS";case 34:return 9;case 35:return 11;case 36:return 12;case 37:return 13;case 38:return 14;case 39:return 19;case 40:return 20;case 41:return 43;case 42:return 17;case 43:return 15;case 44:return 18;case 45:return 16;case 46:return 21;case 47:return 22;case 48:return 23;case 49:return 51;case 50:return 53;case 51:return 24;case 52:return 25;case 53:return 35;case 54:return 37;case 55:return 41;case 56:return 45;case 57:return"PUNTO";case 58:return 55;case 59:return 5;case 60:console.error("Este es un error l\xe9xico: "+t.yytext+", en la linea: "+t.yylloc.first_line+", en la columna: "+t.yylloc.first_column),Q.push("Este es un error l\xe9xico: "+t.yytext+", en la linea: "+t.yylloc.first_line+", en la columna: "+t.yylloc.first_column),X.push({tipo:"l\xe9xico",linea:this._$.first_line,columna:this._$.first_column,descripcion:t.yytext})}},rules:[/^(?:number\b)/,/^(?:boolean\b)/,/^(?:string\b)/,/^(?:let\b)/,/^(?:const\b)/,/^(?:console\b)/,/^(?:log\b)/,/^(?:false\b)/,/^(?:true\b)/,/^(?:class\b)/,/^(?:import\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:void\b)/,/^(?:return\b)/,/^(?:"(\\"|\\n|\\t|\\r|\\\\|[^\"])*")/,/^(?:'[^\"]?')/,/^(?:[0-9]+\.([0-9]+)?\b)/,/^(?:[0-9]+\b)/,/^(?:([a-zA-Z])[a-zA-Z0-9_]*)/,/^(?:\s+)/,/^(?:\/\/.*)/,/^(?:[\/][*][^*]*[*]+([^\/*][^*]*[*]+)*[\/])/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:\^)/,/^(?:%)/,/^(?:==)/,/^(?:!=)/,/^(?:=)/,/^(?:>=)/,/^(?:>)/,/^(?:<=)/,/^(?:<)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?::)/,/^(?:\.)/,/^(?:,)/,/^(?:$)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],inclusive:!0}}};function te(){this.yy={}}return J.lexer=ee,te.prototype=J,J.Parser=te,new te}();t.parser=i,t.Parser=i.Parser,t.parse=function(){return i.parse.apply(i,arguments)},t.main=function(a){a[1]||(console.log("Usage: "+a[0]+" FILE"),e.exit(1));var i=n(78).readFileSync(n(79).normalize(a[1]),"utf8");return t.parser.parse(i)},n.c[n.s]===a&&t.main(e.argv.slice(1))}).call(this,n(44),n(76)(e))},65:function(e,t,n){e.exports=n(85)},70:function(e,t,n){},71:function(e,t,n){},85:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(7),s=n.n(r);n(70),n(45),n(71);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var o=n(58),c=n(120),l=n(87),u=n(122),h=n(124),E=n(126),y=n(134),p=n(52),O=n.n(p),m=n(51),f=n.n(m),A=n(53),I=n.n(A),R=n(55),_=n.n(R),b=n(54),d=n.n(b),g=n(56),N=n.n(g),v=n(33),T=(n(72),n(73),n(74),n(75),n(46)),C=n.n(T),S=n(133),k=n(131),L=n(137),D=n(130),M=n(132),x=n(127),U=n(128),P=n(129),$=n(37),B=n(57),w=n.n(B),F=n(135),G=Object(c.a)((function(e){return{root:{flexGrow:1},paper:{padding:e.spacing(2),textAlign:"center",color:e.palette.text.secondary},absolute:{position:"absolute",bottom:e.spacing(55),right:e.spacing(50)},absolute2:{position:"absolute",bottom:e.spacing(50),right:e.spacing(45)},absolute3:{position:"absolute",bottom:e.spacing(45),right:e.spacing(40)},absolute4:{position:"absolute",bottom:e.spacing(40),right:e.spacing(35)},absolute5:{position:"absolute",bottom:e.spacing(35),right:e.spacing(30)},absolute6:{position:"absolute",bottom:e.spacing(30),right:e.spacing(25)},appBar:{position:"relative"},title:{marginLeft:e.spacing(2),flex:1}}})),V=i.a.forwardRef((function(e,t){return i.a.createElement(F.a,Object.assign({direction:"up",ref:t},e))}));function j(){var e;var t=G(),n=i.a.useState(!1),a=Object(o.a)(n,2),r=a[0],s=a[1],c=function(){s(!1)};return i.a.createElement("div",{className:t.root},i.a.createElement(u.a,{container:!0,spacing:2},i.a.createElement(u.a,{item:!0,xs:6},i.a.createElement(h.a,null),i.a.createElement(l.a,{className:t.paper},"IDE "),i.a.createElement(v.UnControlled,{value:"",options:{mode:"javascript",theme:"mbo",lineNumbers:!0},onChange:function(t,n,a){e=a}})),i.a.createElement(u.a,{item:!0,xs:6},i.a.createElement(l.a,{className:t.paper},"Traducci\xf3n"),i.a.createElement(v.UnControlled,{className:t.cdm,value:"var a =3;",options:{mode:"javascript",theme:"cobalt",lineNumbers:!0,readOnly:!0},onChange:function(e,t,n){}}))),i.a.createElement(u.a,{container:!0,spacing:1},i.a.createElement(u.a,{item:!0,xs:6},i.a.createElement(l.a,{className:t.paper},"CONSOLA"),i.a.createElement("textarea",{disabled:!0,id:"original",name:"original",style:{width:"100%",height:"50vh",resize:"none",backgroundColor:"#0f4c75"}})),i.a.createElement(u.a,null,i.a.createElement(y.a,{title:"Ejecutar","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute,onClick:function(){!function(e){var t;try{t=C.a.parse(e),console.log(JSON.stringify(t,null,2))}catch(n){return console.log(n),n}}(e)}},i.a.createElement(f.a,null))),i.a.createElement(y.a,{title:"Traducir","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute2},i.a.createElement(O.a,null))),i.a.createElement(y.a,{title:"Tabla de S\xedmbolos de Traudcci\xf3n","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute3,onClick:function(){s(!0)}},i.a.createElement(I.a,null))),i.a.createElement(y.a,{title:"Errores de Traducci\xf3n","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute4},i.a.createElement(d.a,null))),i.a.createElement(y.a,{title:"Tabla de S\xedmbolos de Ejecuci\xf3n","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute5},i.a.createElement(_.a,null))),i.a.createElement(y.a,{title:"Errores de Ejecuci\xf3n","aria-label":"add"},i.a.createElement(E.a,{color:"secondary",className:t.absolute6},i.a.createElement(N.a,null))))),i.a.createElement(S.a,{fullScreen:!0,open:r,onClose:c,TransitionComponent:V},i.a.createElement(x.a,{className:t.appBar},i.a.createElement(U.a,null,i.a.createElement(P.a,{edge:"start",color:"inherit",onClick:c,"aria-label":"close"},i.a.createElement(w.a,null)),i.a.createElement($.a,{variant:"h6",className:t.title},"Sound"))),i.a.createElement(D.a,null,i.a.createElement(L.a,{button:!0},i.a.createElement(k.a,{primary:"Phone ringtone",secondary:"Titania"})),i.a.createElement(M.a,null),i.a.createElement(L.a,{button:!0},i.a.createElement(k.a,{primary:"Default notification ringtone",secondary:"Tethys"})))))}s.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(j,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[65,1,2]]]);
//# sourceMappingURL=main.8d14b00c.chunk.js.map