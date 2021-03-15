import React from "react";
import { hot } from "react-hot-loader/root";
import LogIn from "./Pages/LogIn";
import Home from "./Pages/Home";
import Rooms from "./Pages/Rooms";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./Styles/main.css"
import "./Styles/index.css"
import RoomDetails from "./Pages/RoomDetails";
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
                <Route path="/rooms" exact={true}>
                    <Rooms />
                </Route>
                <Route path="/rooms/:id" exact={true}>
                    <RoomDetails />
                </Route>
            </Switch>
        </Router>
    );
} 

export default hot(App);
