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
import Rooms from "./Pages/Rooms";
import RoomDetails from "./Pages/RoomDetails";
import importScript from "./Pages/ImportScript";
import "./Styles/main.css";
//import { Room } from "@material-ui/icons";
import Room from "./Pages/Room";
import CreateRoom from "./Pages/CreateRoom";


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
    //importScript("https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js");
    let toLoginPage = () => {
        history.push("/login");
    };

    let toSignUpPage = () => {
        history.push("/signup");
    };

    return (
        <>
            <Router>
                <div className={classes.root}>
                    <AppBar
                        position="static"
                        style={{ backgroundColor: "black" }}
                    >
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                SATURN
                            </Typography>
                            <Button color="inherit" onClick={toLoginPage}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={toSignUpPage}>
                                Sign Up
                            </Button>
                        </Toolbar>
                    </AppBar>
                </div>
                <Switch>
                    <Route path="/" exact={true}>
                        <Home />
                    </Route>
                    <Route path="/login" exact={true}>
                        <LogIn />
                    </Route>
                    <Route path="/rooms" exact component={CreateRoom} />
                    <Route path="/room/:roomID" component={Room} />
                </Switch>
            </Router>
        </>
    );
}

export default App;
