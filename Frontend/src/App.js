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
import Project from "./Components/Project";
import User from "./apis/user";
import { Grid } from '@material-ui/core';
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

    let test = () => {
        const result = User.isLoggedIn();
        console.log(result);
        return result;
    }

    return (
        <>
            <div className={classes.root}>
                <Grid container>
                    <Grid item sm={12}>
                        <AppBar position="relative" style={{ backgroundColor: "black", zIndex:1400}}>
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
                                <Dashboard />
                            </Route>
                            <Route path="/projects/:id" exact={true}>
                                <Project />
                            </Route>
                            <Route path="/projects" exact={true}>
                                <Project />
                            </Route>
                        </Switch>

                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default App;
