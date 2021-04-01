import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";

import ReconnectingWebSocket from "reconnecting-websocket";
import StringBinding from "sharedb-string-binding";
import sharedb from "sharedb/lib/client";

function CodePad({ projectID, documentID }) {
    let socket;
    /**
     * @type {sharedb.Connection}
     */
    let connection;
    const uuid = document.cookie.toString();
    const [code, setCode] = useState("");
    const [editor, setEditor] = useState(null);
    const textArea = useRef(null);

    useEffect(() => {

        window.addEventListener("resize", () => {
            editor.layout();
        })

    }, [])

    useEffect(() => {
        if (!editor) return;
        const cursorBefore = editor.getSelections();
        if (editor.getValue() !== code) editor.setValue(code);
        editor.setSelections(cursorBefore);
    }, [code]);

    useEffect(() => {
        socket = new ReconnectingWebSocket(`ws://${window.location.host}`);
        connection = new sharedb.Connection(socket);
        subscribeDoc();
        return () => {
            connection.close();
            socket.close();
        };
    }, [projectID, documentID]);

    function subscribeDoc() {
    
        let doc = connection.get(projectID.toString(), documentID.toString());
        doc.subscribe(function (err) {
            if (err) throw err;

            setCode(doc.data.content);

            doc.on("op", function (op, source) {
                if (source === uuid) return;
                setCode(doc.data.content);
            });

            var binding = new StringBinding(textArea.current, doc, ["content"]);

            binding.setup();
        });
    }

    function onChange(newValue, e) {
        textArea.current.value = newValue;
        textArea.current.dispatchEvent(new Event("input"));
    }

    function editorDidMount(editor_, monaco_) {
        setEditor(editor_);
        editor_.focus();
        editor_.layout();
    }

    return (
        <div key={documentID}>
            <div>
                <MonacoEditor
                    width="100%"
                    height="45vh"
                    language="javascript"
                    theme="vs-dark"
                    onChange={onChange}
                    editorDidMount={editorDidMount}
                />
                <textarea
                    style={{
                        display: "none",
                    }}
                    ref={textArea}
                />
            </div>
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
