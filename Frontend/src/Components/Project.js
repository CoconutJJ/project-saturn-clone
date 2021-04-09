import {
    CssBaseline,
    Divider,
    Grid,
    Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SaturnCat from "../Media/saturn-cat.jpg";
import CodePad from "./CodePad";
import SideMenu from "./SideMenu";
import Terminal from "./Terminal";
import Room from "./Room";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    content: {
        marginLeft:70,
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Project() {
    const { id: projectID } = useParams();
    const classes = useStyles();
    const [documentID, setDocumentID] = useState("");
    const [documentName, setDocumentName] = useState("");

    const [startVideo, setStartVideo] = React.useState(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <SideMenu projectID={projectID} setDocumentID={setDocumentID} setDocumentName={setDocumentName} />
            <main className={classes.content}>
                {projectID && documentID ? (
                    <>
                        <Typography variant="h3">{documentName}</Typography>
                        <Divider light />
                        <Grid item xs={12} md={12} sm={12}>
                            <CodePad
                                projectID={projectID}
                                documentID={documentID}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                            <Terminal
                                projectID={projectID}
                                documentID={documentID}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                            <Room
                                id={projectID}
                                videoflag={startVideo}
                            />
                        </Grid>
                    </>
                ) : (
                        <>
                            <Grid container justify="center">
                                <Grid item>
                                    <img src={SaturnCat} width="400" />
                                </Grid>
                            </Grid>
                        </>
                    )}
            </main>
        </div>
    );
}

//Citation
// Styles and layout are modifications from the Responsive Drawer example
/***************************************************************************************
 *    Title: Material UI Responsive Drawer
 *    Author: mui-org
 *    Date: 202-04-21
 *    Availability: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/components/drawers/ResponsiveDrawer.js
 *
 ***************************************************************************************/
