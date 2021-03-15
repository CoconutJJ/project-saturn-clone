import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router} from "react-router-dom";


var mountNode = document.getElementById("app");
ReactDOM.render(<Router><App/></Router>, mountNode);