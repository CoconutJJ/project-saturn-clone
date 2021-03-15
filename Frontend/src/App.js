import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";

import LogIn from "./Pages/LogIn";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import "./Styles/main.css";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));
    
function App() {
    
    const classes = useStyles();
    const history = useHistory();

    let toLoginPage = () => {
        history.push("/login");
    };

    let toSignUpPage = () => {
        history.push("/signup")
    }

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static" style={{ backgroundColor: "black" }}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            SATURN
                        </Typography>
                        <Button color="inherit" onClick={toLoginPage}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={toSignUpPage}>Sign Up</Button>
                    </Toolbar>
                </AppBar>
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

export default App;
