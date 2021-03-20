import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
// import * as monaco from 'monaco-editor'
// monaco.editor.create(document.getElementById('container'), {
//     value: 'console.log("Hello, world")',
//     language: 'javascript'
// });

var mountNode = document.getElementById("app");
ReactDOM.render(<Router><App /></Router>, mountNode);