import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Redirect,
} from "react-router-dom";

import { Grid, Typography, AppBar, Toolbar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import LogIn from "./Pages/LogIn";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Project from "./Components/Project";
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

    let loggedIn = User.isLoggedIn();
    console.log(loggedIn);
    return (
        <>
            <div className={classes.root}>
                <Grid container>
                    <Grid item sm={12}>
                        <AppBar
                            position="relative"
                            style={{ backgroundColor: "black", zIndex: 1400 }}
                        >
                            <Toolbar>
                                <Typography
                                    variant="h6"
                                    className={classes.title}
                                >
                                    SATURN
                                </Typography>
                                {!loggedIn ? (
                                    <>
                                        <Button
                                            color="inherit"
                                            onClick={toLoginPage}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            color="inherit"
                                            onClick={toSignUpPage}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                ) : null}
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid sm={12} item>
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
                                {loggedIn ? <Dashboard /> : <Redirect to="/" />}
                            </Route>
                            <Route path="/projects/:id">
                                {loggedIn ? <Project /> : <Redirect to="/" />}
                            </Route>
                            <Route path="/projects" exact={true}>
                                {loggedIn ? <Project /> : <Redirect to="/" />}
                            </Route>
                        </Switch>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default App;
