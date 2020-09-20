import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import {Tree, treeUtil} from 'react-d3-tree';
/*
var editor = CodeMirror.fromTextArea(document.getElementById('codigo'),{
  lineNumbers: true,
    matchBrackets: true,
    mode: 'text/x-csrc'
});*/
const datos =  {
  "attributes":{
     "sentencia":"DECLARACION",
     "variable_type":"LET",
     "data_type":"infer",
     "isArray":false,
     "id":"a",
     "next_declaration":"Epsilon",
     "fila":1,
     "columna":4
  },
  "children":[
     {
        "name":"expresion",
        "attributes":{
           "tipo":"NUMERO",
           "valor":1
        }
     }
  ]
};
let a = [
  {
attributes:{
      "sentencia": "DECLARACION",
      "variable_type": "LET",
      "data_type": "infer",
      "isArray": false,
      "id": "a",
      
      "next_declaration": "Epsilon",
      "fila": 1,
      "columna": 4
    }
  ,children:[
      {
        name:"expresion",
          attributes:{
            "tipo": "NUMERO",
            "valor": 1,
            },
        
      }
    ],
  }
];
export default function IDE() {
  function parseToNotation(AST){
    let attributes="{", children=[];
    for(let sentencia in AST){
      if(typeof AST[sentencia] === 'object' && AST[sentencia] !== null){
        children.push({name:sentencia,attributes: parseToNotation(AST[sentencia])});
      }else{
        attributes+=sentencia+":"+AST[sentencia]+",";
      }
    }
    if(attributes[attributes.length-1]==','){
      attributes=attributes.substring(0,attributes.length-1)+"}";
    }else{
      attributes+="}";
    }
      console.log(attributes);
    if(children.length>0){
      return {attributes:attributes, children:children};
    }else{
      return {attributes:attributes};
    }
  }

  function prs(AST){
    let temp = {attributes:{} , children:[]};
    for(let sentencia in AST){
        if(typeof AST[sentencia] === 'object' && AST[sentencia] !== null){
          let atb = prs(AST[sentencia]);
          temp.children.push({name:sentencia,attributes: atb.attributes, children:atb.children});
          
        }else{
          temp.attributes[sentencia]=AST[sentencia];
        }
      }
      return temp;
  }
  let test =[
    {
      "sentencia": "FUNCION",
      "tipo": {
        "tipo": "number",
        "isArray": false
      },
      "id": "ackermann",
      "parametros": {
        "tipo": {
          "tipo": "number",
          "isArray": false
        },
        "id": "m",
        "siguiente": {
          "tipo": {
            "tipo": "number",
            "isArray": false
          },
          "id": "n",
          "siguiente": "Epsilon"
        }
      },
      "accion": [
        {
          "sentencia": "IF",
          "logica": {
            "operandoIzq": {
              "tipo": "IDENTIFICADOR",
              "valor": {
                "id": "m",
                "acc": "Epsilon",
                "columna": 12,
                "fila": 2
              }
            },
            "operandoDer": {
              "tipo": "NUMERO",
              "valor": 0
            },
            "tipo": "IGUAL IGUAL"
          },
          "accion": [
            {
              "sentencia": "RETURN",
              "valor": {
                "operandoIzq": {
                  "tipo": "IDENTIFICADOR",
                  "valor": {
                    "id": "n",
                    "acc": "Epsilon",
                    "columna": 20,
                    "fila": 3
                  }
                },
                "operandoDer": {
                  "tipo": "NUMERO",
                  "valor": 1
                },
                "tipo": "SUMA"
              }
            }
          ],
          "else": {
            "sentencia": "ELSE_IF",
            "logica": {
              "operandoIzq": {
                "operandoIzq": {
                  "tipo": "IDENTIFICADOR",
                  "valor": {
                    "id": "m",
                    "acc": "Epsilon",
                    "columna": 19,
                    "fila": 4
                  }
                },
                "operandoDer": {
                  "tipo": "NUMERO",
                  "valor": 0
                },
                "tipo": "MAYOR"
              },
              "operandoDer": {
                "operandoIzq": {
                  "tipo": "IDENTIFICADOR",
                  "valor": {
                    "id": "n",
                    "acc": "Epsilon",
                    "columna": 28,
                    "fila": 4
                  }
                },
                "operandoDer": {
                  "tipo": "NUMERO",
                  "valor": 0
                },
                "tipo": "IGUAL IGUAL"
              },
              "tipo": "AND"
            },
            "accion": [
              {
                "sentencia": "DECLARACION",
                "variable_type": "LET",
                "data_type": "NUMBER",
                "isArray": false,
                "id": "cuatro",
                "expresion": {
                  "sentencia": "LLAMADA",
                  "id": "ackermann",
                  "parametros": {
                    "expresion": {
                      "operandoIzq": {
                        "tipo": "IDENTIFICADOR",
                        "valor": {
                          "id": "m",
                          "acc": "Epsilon",
                          "columna": 43,
                          "fila": 5
                        }
                      },
                      "operandoDer": {
                        "tipo": "NUMERO",
                        "valor": 1
                      },
                      "tipo": "RESTA"
                    },
                    "siguiente": {
                      "expresion": {
                        "tipo": "NUMERO",
                        "valor": 1
                      },
                      "siguiente": "Epsilon",
                      "columna": 50,
                      "fila": 5
                    },
                    "columna": 43,
                    "fila": 5
                  }
                },
                "next_declaration": "Epsilon",
                "fila": 5,
                "columna": 17
              },
              {
                "sentencia": "RETURN",
                "valor": {
                  "tipo": "IDENTIFICADOR",
                  "valor": {
                    "id": "cuatro",
                    "acc": "Epsilon",
                    "columna": 19,
                    "fila": 6
                  }
                }
              }
            ],
            "else": {
              "sentencia": "ELSE",
              "accion": [
                {
                  "sentencia": "DECLARACION",
                  "variable_type": "LET",
                  "data_type": "NUMBER",
                  "isArray": false,
                  "id": "ret",
                  "expresion": {
                    "sentencia": "LLAMADA",
                    "id": "ackermann",
                    "parametros": {
                      "expresion": {
                        "tipo": "IDENTIFICADOR",
                        "valor": {
                          "id": "m",
                          "acc": "Epsilon",
                          "columna": 40,
                          "fila": 8
                        }
                      },
                      "siguiente": {
                        "expresion": {
                          "operandoIzq": {
                            "tipo": "IDENTIFICADOR",
                            "valor": {
                              "id": "n",
                              "acc": "Epsilon",
                              "columna": 43,
                              "fila": 8
                            }
                          },
                          "operandoDer": {
                            "tipo": "NUMERO",
                            "valor": 1
                          },
                          "tipo": "RESTA"
                        },
                        "siguiente": "Epsilon",
                        "columna": 43,
                        "fila": 8
                      },
                      "columna": 40,
                      "fila": 8
                    }
                  },
                  "next_declaration": "Epsilon",
                  "fila": 8,
                  "columna": 16
                },
                {
                  "sentencia": "DECLARACION",
                  "variable_type": "LET",
                  "data_type": "NUMBER",
                  "isArray": false,
                  "id": "nueva",
                  "expresion": {
                    "sentencia": "LLAMADA",
                    "id": "ackermann",
                    "parametros": {
                      "expresion": {
                        "operandoIzq": {
                          "tipo": "IDENTIFICADOR",
                          "valor": {
                            "id": "m",
                            "acc": "Epsilon",
                            "columna": 42,
                            "fila": 9
                          }
                        },
                        "operandoDer": {
                          "tipo": "NUMERO",
                          "valor": 1
                        },
                        "tipo": "RESTA"
                      },
                      "siguiente": {
                        "expresion": {
                          "tipo": "IDENTIFICADOR",
                          "valor": {
                            "id": "ret",
                            "acc": "Epsilon",
                            "columna": 49,
                            "fila": 9
                          }
                        },
                        "siguiente": "Epsilon",
                        "columna": 49,
                        "fila": 9
                      },
                      "columna": 42,
                      "fila": 9
                    }
                  },
                  "next_declaration": "Epsilon",
                  "fila": 9,
                  "columna": 17
                },
                {
                  "sentencia": "RETURN",
                  "valor": {
                    "tipo": "IDENTIFICADOR",
                    "valor": {
                      "id": "nueva",
                      "acc": "Epsilon",
                      "columna": 19,
                      "fila": 10
                    }
                  }
                }
              ]
            }
          }
        }
      ],
      "fila": 1,
      "columna": 10
    }
  ];
//console.log(JSON.stringify(parseToNotation(test)));
//console.log(JSON.stringify(prs(test)));
return(
  <div style={{width: '1000px', height: '1000px'}}>
   <Tree data={prs(test)} />
  </div>
);
}
 /*<CodeMirror 
  value=''
  options={{
      mode: 'javascript',
      theme: 'yonce',
      lineNumbers: true,
      viewportMargin: Infinity
  }}
  onChange={(editor, data, value) => {
  }}
/>*/