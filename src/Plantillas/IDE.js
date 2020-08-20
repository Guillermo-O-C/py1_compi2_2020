import React from 'react';

    import {Controlled as CodeMirror} from 'react-codemirror2';
 
    export default function IDE() {
return(
    <CodeMirror
      value='hola'
      options={{mode: 'xml',
      theme: 'material',
      lineNumbers: true}}
      onBeforeChange={(editor, data, value) => {
        this.setState({value});
      }}
      onChange={(editor, data, value) => {
      }}
    />);
}