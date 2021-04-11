import { Button, CssBaseline, Grid, Snackbar } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import brandLogo from "../Media/saturn.png";
import User from "../apis/user"

function LogIn() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    
    let [isError, setError] = useState(false);

    let validEntries = () => {
        return username.length > 0 && password.length > 0;
    };

    let login = async () => {
        try {

            if (await User.login(username, password)) {
                window.location.href = "/dashboard";
            }
        } catch (e) {
            document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }))
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
                                <h1>Log In</h1>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <TextField
                                        error={isError}
                                        label="Username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <TextField
                                        error={isError}
                                        label="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        variant="outlined"
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
