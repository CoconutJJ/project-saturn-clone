import React from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { ButtonBase, Card, CardContent } from "@material-ui/core";
import pyLogo from "../Media/python-logo.png";
import cLogo from "../Media/c-logo.png";
import videoIcon from "../Media/video-chat.png";
import termIcon from "../Media/code-terminal.png";
function Dashboard() {
    return (
        <div style={{ padding: "2%" }}>
            <Typography variant="h3">Dashboard</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Create a new Project
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    {/* https://www.python.org/community/logos/ */}
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${pyLogo})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "150px",
                                                }}
                                            ></div>
                                            Python 3.XX
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                                <Grid item>
                                    {/* https://iconscout.com/icon/c-programming */}
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${cLogo})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                            ></div>
                                            GCC C
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Quick Actions</Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${videoIcon})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                            ></div>
                                            Video Chat
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                                <Grid item>
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${termIcon})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                            ></div>
                                            Terminal
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;
