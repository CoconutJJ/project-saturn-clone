import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

// Open WebSocket connection to ShareDB server
import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from "sharedb/lib/client";

import StringBinding from 'sharedb-string-binding';

const PORT = 8080;
var socket = new ReconnectingWebSocket(`ws://localhost:${PORT}`);
var connection = new sharedb.Connection(socket);
const path = ['content'];
const uuid = Math.random();

console.log("uuid:", uuid)

function CodePad() {
  const [code, setCode] = useState("");
  const [editor, setEditor] = useState(null);
  const textArea = useRef(null);

  useEffect(()=>{
    if(!editor) return;
    if(editor.getValue() !== code) editor.setValue(code);
  },[code])

  function subscribeDoc() {
    let doc = connection.get('examples', 'textarea');
    doc.subscribe(function (err) {
      if (err) throw err;
      setCode(doc.data.content);
      doc.on('op', function (op, source) {
        if (source === uuid) return;
        setCode(doc.data.content);
      });
      var binding = new StringBinding(textArea.current, doc, ['content']);
      binding.setup();
    });
  }

  function onChange(newValue, e) {
    textArea.current.value = newValue
    textArea.current.dispatchEvent(new Event("input"));
  }

  function editorDidMount(editor_, monaco_) {
    setEditor(editor_);
    subscribeDoc();
    editor_.focus()
  }

  return (
    <div>
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
      <textarea style={{
        display:'none'
      }} ref={textArea} />
    </div>
  );
}
export default CodePad;