import MonacoEditor from "react-monaco-editor";
import React, { Fragment, useEffect } from "react";
import ShareDBMonaco from "sharedb-monaco";

const envToLang = { "python": "python", "c": "cpp" }
function CodePad({ projectID, documentID, env }) {
    function handleEditorDidMount(editor) {
        let binding = new ShareDBMonaco({ id: documentID.toString(), namespace: projectID.toString(), wsurl: `ws://${window.location.host}/codepad` });
        binding.on("ready", () => {
            binding.add(editor, "content");
        });
    }
    return (
        <MonacoEditor
            key={documentID.toString() + projectID.toString() + env.toString()}
            width="100%"
            height="80vh"
            language={envToLang[env]}
            theme="vs-dark"
            editorDidMount={handleEditorDidMount}
        />
    );
}
export default CodePad;
//Citation

// ShareDBMonaco Usage
/***************************************************************************************
 *    Title: ShareDBMonaco README
 *    Author: Portatolova
 *    Date: 2021-01-15
 *    Availability: https://github.com/codecollab-io/sharedb-monaco#readme
 ***************************************************************************************/