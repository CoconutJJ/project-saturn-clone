import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Button, CssBaseline, Grid, Snackbar, TextField } from "@material-ui/core";

// Open WebSocket connection to ShareDB server
import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from "sharedb/lib/client";

import StringBinding from 'sharedb-string-binding';
import { useParams } from "react-router-dom";

var socket = new ReconnectingWebSocket(`ws://${window.location.host}`);
var connection = new sharedb.Connection(socket);
const uuid = localStorage.getItem("userName");

function CodePad() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [editor, setEditor] = useState(null);
  const textArea = useRef(null);
  const [guestUsername, setGuestUsername] = useState("");
  const shareDoc = async () => {
    setGuestUsername("");
    const response = await fetch(`/documents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestUserName: guestUsername, id })
    })
  }
  useEffect(() => {
    if (!editor) return;
    if (editor.getValue() !== code) editor.setValue(code);
  }, [code])

  function subscribeDoc() {
    let doc = connection.get('documents', id);
    console.log(id, doc, connection);
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
        display: 'none'
      }} ref={textArea} />
      <Grid>
        <Grid>
          <TextField
            label="Guest username"
            value={guestUsername}
            onChange={(e) => setGuestUsername(e.target.value)}
          />
        </Grid>

        <Grid item container justify='center' alignItems='center' md={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={(shareDoc)}
          >
            Share this document
          </Button>

        </Grid>

      </Grid>
    </div>
  );
}
export default CodePad;

//Citation

//wss configurations are modifications from the shareDB textarea example
/***************************************************************************************
*    Title: Collaborative Textarea with ShareDB
*    Author: Alec Gibson
*    Date: 202-04-20
*    Availability: https://github.com/share/sharedb/tree/master/examples/textarea
*
***************************************************************************************/
