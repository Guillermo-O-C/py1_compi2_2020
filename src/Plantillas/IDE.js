import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import {Tree, treeUtil} from 'react-d3-tree';
/*
var editor = CodeMirror.fromTextArea(document.getElementById('codigo'),{
  lineNumbers: true,
    matchBrackets: true,
    mode: 'text/x-csrc'
});*/
const datos = {
  "AST": [
    {
      "sentencia": "DECLARACION",
      "variable_type": "LET",
      "data_type": "infer",
      "isArray": "undefinied",
      "id": "a",
      "expresion": {
        "tipo": "NUMERO",
        "valor": 1
      },
      "next_declaration": "Epsilon"
    },
    {
      "sentencia": "ASIGNACION",
      "id": "a",
      "ArrayPosition": "false",
      "expresion": {
        "tipo": "NUMERO",
        "valor": 2
      }
    },
    {
      "sentencia": "IMPRIMIR",
      "valor": {
        "tipo": "IDENTIFICADOR",
        "valor": "b"
      }
    }
  ],
  "Errores": []
}; 

const salida={out:undefined};
function componentWillMount() {
  treeUtil.parseCSV('https://raw.githubusercontent.com/bkrem/react-d3-tree/master/docs/examples/data/csv-example.csv')
  .then((data) => {
    salida.out= data
  })
  .catch((err) => console.error(err));
}
export default function IDE() {

componentWillMount();
return(
  <div>
   <Tree data={salida.out} />
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