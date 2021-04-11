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
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
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
import { FunctionsTwoTone } from "@material-ui/icons";

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
    const [displayDialog, setDisplayDialog] = useState(false);
    const [dialogTitle,setDialogTitle] = useState("");
    const [dialogMessage,setDialogMessage] = useState("");
    const [dialogAgree,setDialogAgree] = useState(()=>()=>setDisplayDialog(false));
    const [dialogDisAgree,setDialogDisAgree] = useState(()=>()=>setDisplayDialog(false));
    useEffect(() => {
        const showDialog = (event) =>{
            setDialogTitle(event.detail.dialogTitle);
            setDialogMessage(event.detail.dialogMessage);
            setDialogAgree(() => async()=>{
                await event.detail.dialogAgree();
                setDisplayDialog(false);
            });
            setDialogDisAgree(() => async()=>{
                await event.detail.dialogDisAgree();
                setDisplayDialog(false);
            });
            setDisplayDialog(true);
        }
        const showError = (event) => {
            setErrorMessage(event.detail.error.message)
            setDisplayError(true);
        }
        document.addEventListener("custom-onError", showError);
        document.addEventListener("custom-showDialog", showDialog);
        return () => {
            document.removeEventListener("custom-onError", showError);
            document.removeEventListener("custom-showDialog", showDialog);
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
                <Dialog
                    open={displayDialog}
                    onClose={() => setDisplayDialog(false)}
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>dialogDisAgree()} color="primary">
                            No
                        </Button>
                        <Button onClick={()=>dialogAgree()} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
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
