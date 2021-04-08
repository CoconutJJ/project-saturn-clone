import React, { useReducer, useContext, useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Redirect,
} from "react-router-dom";

import {
    Grid,
    Typography,
    AppBar,
    Toolbar,
    Button,
    Collapse,
    IconButton
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from '@material-ui/lab';

import LogIn from "./Pages/LogIn";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Project from "./Components/Project";
import User from "./apis/user";
import "./Styles/main.css";
import Credits from "./Pages/Credits";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));

function App() {
    const [displayError, setDisplayError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        const showError = (event) => {
            console.log(event.detail.error.message);
            setErrorMessage(event.detail.error.message)
            setDisplayError(true);
        }
        document.addEventListener("custom-onError", showError);
        return () => {
            document.removeEventListener("custom-onError", showError);
        }
    }, []);
    const classes = useStyles();
    const history = useHistory();

    let toLoginPage = () => {
        history.push("/login");
    };

    let toSignUpPage = () => {
        history.push("/signup");
    };

    let toDashboardPage = () => {
        history.push("/dashboard");
    }

    let toCreditsPage = () => {
        history.push("/credits");
    }

    let logout = async () => {
        await User.logout();
        window.location.href = "/";
    }

    let loggedIn = User.isLoggedIn();

    return (
        <>
            <div className={classes.root}>
                <Grid container>
                    <Grid item sm={12}>
                        <AppBar
                            position="relative"
                            style={{
                                backgroundColor: "black",
                                zIndex: 1400,
                            }}
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
                                        <Button
                                            color="inherit"
                                            onClick={toCreditsPage}
                                        >
                                            Credits
                                        </Button>
                                    </>
                                ) : (
                                        <>
                                            <Button
                                                color="inherit"
                                                onClick={toDashboardPage}
                                            >
                                                Dashboard
                                        </Button>
                                            <Button
                                                color="inherit"
                                                onClick={logout}
                                            >
                                                Log Out
                                        </Button>
                                        </>
                                    )}
                            </Toolbar>
                        </AppBar>
                        <Collapse in={displayError}>
                            <Alert
                                severity="error"
                                style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                {errorMessage}
                                <IconButton onClick={() => setDisplayError(false)}  >
                                    <CloseIcon />
                                </IconButton>
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid sm={12} item>
                        <Switch>
                            <Route path="/" exact={true}>
                                <Home />
                            </Route>
                            <Route path="/login" exact={true}>
                                {!loggedIn ? (
                                    <LogIn />
                                ) : (
                                        <Redirect to="/dashboard" />
                                    )}
                            </Route>
                            <Route path="/signup" exact={true}>
                                {!loggedIn ? (
                                    <SignUp />
                                ) : (
                                        <Redirect to="/dashboard" />
                                    )}
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
                            <Route path="/credits" exact={true}>
                                <Credits />
                            </Route>
                        </Switch>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default App;
