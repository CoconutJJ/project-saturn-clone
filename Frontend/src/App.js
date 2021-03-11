import React from "react";
import { hot } from "react-hot-loader/root";
import LogIn from "./Pages/LogIn";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./Styles/main.css"
function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact={true}>
                    <Home />
                </Route>
                <Route path="/login" exact={true}>
                    <LogIn />
                </Route>
            </Switch>
        </Router>
    );
} 

export default hot(App);
