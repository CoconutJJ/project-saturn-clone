import { Button, CssBaseline, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import brandLogo from "../Media/saturn.png";
import User from "../apis/user";

function SignUp() {

    let [formFields, setFormFields] = useState({
        username: "",
        password: "",
        email: "",
        fname: "",
        lname: ""
    })

    let [isFormFilled, setIsFormFilled] = useState(false);

    let history = useHistory();


    let createFieldUpdate = (field) => (ev) => {
        setFormFields({
            ...formFields,
            [field]: ev.target.value
        })
    }

    useEffect(() => {

        let {fname, lname, username, password, email} = formFields;

        let validations = [
            username.length > 0,
            password.length > 0,
            fname.length > 0,
            lname.length > 0,
            email.length > 0,
        ];

        setIsFormFilled(
            validations.reduce((acc, v) => acc + v) == validations.length
        );

    }, [formFields]);

    let signUp = async () => {

        let {fname, lname, username, password, email} = formFields;

        if (await User.signUp(fname, lname, username, password, email)) {
            history.push("/dashboard");
        } else {
        }
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
                            <div style={{ height: 30 }} />
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
                                        value={formFields.fname}
                                        onChange={createFieldUpdate("fname")}
                                    />
                                </Grid>
                                <Grid item>
                                    <AccountCircle />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="input-with-icon-grid"
                                        label="Last Name"
                                        value={formFields.lname}
                                        onChange={createFieldUpdate("lname")}
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
                                        value={formFields.username}
                                        onChange={
                                            createFieldUpdate("username")
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
                                        value={formFields.password}
                                        onChange={
                                            createFieldUpdate("password")
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
                                        value={formFields.email}
                                        onChange={
                                            createFieldUpdate("email")
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <div style={{ height: 20 }} />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!isFormFilled}
                                onClick={signUp}
                            >
                                Sign up
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
}

export default SignUp;
