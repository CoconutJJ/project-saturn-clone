import React from "react";
import {
    Card,
    CardContent,
    ButtonBase,
    Typography,
    Paper,
    Grid,
} from "@material-ui/core";
import videoIcon from "../Media/video-chat.png";
import termIcon from "../Media/code-terminal.png";

function QuickActions() {
    return (
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
    );
}
export default QuickActions;
