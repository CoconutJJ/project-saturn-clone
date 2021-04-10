import Editor from "@monaco-editor/react";
import React, { useEffect } from "react";
import ShareDBMonaco from "sharedb-monaco";

const envToLang = { "python": "Python", "c": "C++" }
function CodePad({ projectID, documentID, env }) {
    function handleEditorDidMount(editor) {
        let binding = new ShareDBMonaco({ id: documentID.toString(), namespace: projectID.toString(), wsurl: `ws://${window.location.host}/codepad` });
        binding.on("ready", () => {
            binding.add(editor, "content");
        });
    }
    useEffect(() => console.log(env));
    return (
        <div key={documentID.toString() + projectID.toString() + env.toString()} style={{ width: "100%" }} >
            <Editor
                height="90vh"
                defaultLanguage={env}
                onMount={handleEditorDidMount}
            />
        </div>

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

 // @monaco-editor/react Usage
/***************************************************************************************
 *    Title: @monaco-editor/react README
 *    Author: Portatolova
 *    Date: 2021-04-02
 *    Availability: https://github.com/suren-atoyan/monaco-react/blob/master/#readme
 ***************************************************************************************/
