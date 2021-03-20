import { Button, CssBaseline, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import React, { Fragment, useState } from "react";
import brandLogo from "../Media/saturn.png";
import { useHistory } from "react-router-dom";
function SignUp() {
    const history = useHistory();

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");


    let validEntries = () => {
        return username.length > 0 && password.length > 0;
    };

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
                                    />
                                </Grid>
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Last Name"
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
                                        onChange={(e) =>{
                                            setPassword(e.target.value)
                                            console.log(password)
                                        }
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
                                    />
                                </Grid>
                            </Grid>

                            <div style={{ height: 20 }} />
                            <Button variant="contained" color="primary" onClick={async ()=>{

                                const response = await fetch("/signup",{
                                    method:'POST',
                                    headers:{'Content-Type': 'application/json'},
                                    body: JSON.stringify({userName:username,password,firstName:'',lastName:'',email:''})
                                })
                                if (response.status===200){
                                    localStorage.setItem('userName', JSON.stringify(username));
                                    history.push("/dashboard");//UPDATE DASHBOARD TO AN AUTH ROUTE
                                }
                                
                            }}>Sign up</Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
}

export default SignUp;
