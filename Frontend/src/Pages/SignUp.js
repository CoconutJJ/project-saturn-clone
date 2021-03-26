import { Button, CssBaseline, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import brandLogo from "../Media/saturn.png";
import User from "../apis/user"

function SignUp() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState("");
    let [fname, setfname] = useState("");
    let [lname, setlname] = useState("");



    let validEntries = () => {
        return username.length > 0 && password.length > 0;
    };


    let signUp = async () => {

        await User.signUp(fname, lname, username, password, email)

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
                        justify="center"
                    >
                        <div
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <div style={{height: 30}}/>
                            <Grid container justify="center">
                                <h1>Sign Up</h1>
                            </Grid>

                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="First Name"
                                        onChange= {(ev) => {setfname(ev.target.value)}}
                                    />
                                </Grid>
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Last Name"
                                        onChange= {(ev) => {setlname(ev.target.value)}}

                                    />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />

                            <Grid
                                container
                                spacing={1}
                                alignItems="flex-end"
                            ></Grid>
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
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Email"
                                        onChange= {(ev) => {setEmail(ev.target.value)}}

                                    />
                                </Grid>
                            </Grid>

                            <div style={{ height: 20 }} />
                            <Button variant="contained" color="primary">Sign up</Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
}

export default SignUp;
