import React from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2';
/*
var editor = CodeMirror.fromTextArea(document.getElementById("codigo"),{
  lineNumbers: true,
    matchBrackets: true,
    mode: "text/x-csrc"
});*/

export default function IDE() {
return(
  <div>
    <textarea id="codigo">
      
    </textarea>
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