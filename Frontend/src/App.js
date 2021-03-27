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
import Dashboard from "./Pages/Dashboard";
import User from "./apis/user";
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
        history.push("/signup");
    };

    let test=()=>{
        const result = User.isLoggedIn();
        console.log(result);
        return result;
    }

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static" style={{ backgroundColor: "black" }}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            SATURN
                        </Typography>
                        {!test() ? (
                            <>
                                <Button color="inherit" onClick={toLoginPage}>
                                    Login
                                </Button>
                                <Button color="inherit" onClick={toSignUpPage}>
                                    Sign Up
                                </Button>
                            </>
                        ) : null}
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path="/" exact={true}>
                        <Home />
                    </Route>
                    <Route path="/login" exact={true}>
                        <LogIn />
                    </Route>
                    <Route path="/signup" exact={true}>
                        <SignUp />
                    </Route>
                    <Route path="/dashboard" exact={true}>
                        <Dashboard />
                    </Route>
                </Switch>
            </div>
        </>
    );
}

export default App;
