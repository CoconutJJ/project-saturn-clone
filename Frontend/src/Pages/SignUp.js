import {
    Button,
    CssBaseline,
    Grid,
    TextField,
    Container,
} from "@material-ui/core";
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
        lname: "",
    });

    let [isFormFilled, setIsFormFilled] = useState(false);

    let history = useHistory();

    let createFieldUpdate = (field) => (ev) => {
        setFormFields({
            ...formFields,
            [field]: ev.target.value,
        });
    };

    useEffect(() => {
        let { fname, lname, username, password, email } = formFields;

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
        let { fname, lname, username, password, email } = formFields;

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
                        alignItems="center"
                        direction="column"
                        justify="center"
                        spacing={2}
                    >
                        <h1>Sign Up</h1>
                        <Grid item>
                            <TextField
                                id="input-with-icon-grid"
                                label="First Name"
                                value={formFields.fname}
                                onChange={createFieldUpdate("fname")}
                                variant="outlined"
                                style={{ margin: "5px" }}
                            />

                            <TextField
                                id="input-with-icon-grid"
                                label="Last Name"
                                value={formFields.lname}
                                onChange={createFieldUpdate("lname")}
                                variant="outlined"
                                style={{ margin: "5px" }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="input-with-icon-grid"
                                label="Username"
                                value={formFields.username}
                                onChange={createFieldUpdate("username")}
                                variant="outlined"
                                style={{ margin: "5px" }}
                            />

                            <TextField
                                id="input-with-icon-grid"
                                label="Password"
                                value={formFields.password}
                                onChange={createFieldUpdate("password")}
                                variant="outlined"
                                style={{ margin: "5px" }}
                                type="Password"
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="input-with-icon-grid"
                                label="Email"
                                value={formFields.email}
                                onChange={createFieldUpdate("email")}
                                variant="outlined"
                                style={{ margin: "5px" }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!isFormFilled}
                                onClick={signUp}
                            >
                                Sign up
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </Fragment>
    );
}

export default SignUp;
