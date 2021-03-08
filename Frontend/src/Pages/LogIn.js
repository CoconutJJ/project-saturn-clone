
import { Button, CssBaseline, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import React, { Fragment } from "react";
import { hot } from 'react-hot-loader/root';
import brandBackground from '../Media/milkyway.png';
import brandLogo from '../Media/saturn.png';
function LogIn() {
    return (
        <Fragment>
            <CssBaseline />
            <div>
                <Grid container style={{ minHeight: '100vh' }}>
                    <Grid item sm={6}>
                        <img src={brandBackground} style={{ height: '100%', width: '100%', objectFit: 'cover' }} alt="brand picture" />
                    </Grid>
                    <Grid container item sm={6} style={{ padding: 10 }} alignItems="center" direction="column" justify="space-between">
                        <div />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Grid container justify="center">
                                <img src={brandLogo} width={200} alt="brand logo" />
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
                                    <TextField id="input-with-icon-grid" label="Username" />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                    <LockRounded />
                                </Grid>
                                <Grid item>
                                    <TextField id="input-with-icon-grid" label="Password" />
                                </Grid>
                            </Grid>
                            <div style={{ height: 20 }} />
                            <Button color="primary" variant="contained">
                                Log in
                        </Button>
                            <div style={{ height: 20 }} />
                            <Button variant="outlined" >
                                Sign up
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
    )
}

export default hot(LogIn);