import { Button, CssBaseline, Grid, Snackbar } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import React, { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import brandLogo from "../Media/saturn.png";
import User from "../apis/user"
import * as Global from "../apis/reducer";
function LogIn() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    
    let {state, dispatch} = useContext(Global.default.GlobalContext);

    const history = useHistory();

    let validEntries = () => {
        return username.length > 0 && password.length > 0;
    };

    let login = async () => {

        if (await User.login(username, password)) {
            history.push("/dashboard");
        } else {
            console.log("hello");
            dispatch({type: "DIALOG_PROMPT", dialogMessage: "Login Failed", dialogShown: true})
        }

    }

    return (
        <Fragment>
            <CssBaseline />

            <div>
                <Grid container style={{ minHeight: "100vh" }}>
                    <Grid item sm={6}>
                        <img
                            src={brandLogo}
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                            }}
                            alt="brand picture"
                        />
                    </Grid>
                    <Grid
                        container
                        item
                        sm={6}
                        style={{ padding: 10 }}
                        alignItems="center"
                        direction="column"
                        justify="space-between"
                    >
                        <div />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Grid container justify="center">
                                {/* <img src={brandLogo} width={200} alt="brand logo" /> */}

                                <h1>Log In</h1>
                            </Grid>
                            {/* <TextField label="Username" margin="normal" id="standard-basic"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField label="Password" margin="normal" id="standard-basic"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockRounded />
                                    </InputAdornment>
                                ),
                            }} /> */}
                            <div style={{ height: 20 }} />
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <LockRounded />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        type="Password"
                                    />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Button
                                color="primary"
                                variant="contained"
                                disabled={!validEntries()}
                                onClick={login}
                            >
                                Log in
                            </Button>
                        </div>
                        <div />
                        {/* <Grid container justify="center">
                        <Button>Credits</Button>
                    </Grid> */}
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
}

export default LogIn;
