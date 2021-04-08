import {
    ButtonBase,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    Typography,
    ListItemIcon,
    ListItemText,
    Toolbar,
    TextField,
    Button,
    Grid,
    FormControl,
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core/styles";

/**
    Apparently you can't import this using destructuring...
*/
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

import { useHistory, useParams } from "react-router-dom";

import clsx from "clsx";
import React, { useState, useEffect, Fragment } from "react";
import CodePad from "./CodePad";
import Terminal from "./Terminal";
import Document from "../apis/document";
import ProjectAPI from "../apis/project";
import ShareIcon from "@material-ui/icons/Share";
import SaturnCat from "../Media/saturn-cat.jpg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Project() {
    const { id: projectID } = useParams();
    const classes = useStyles();
    const [documents, setDocuments] = useState([]);
    const [guests, setGuests] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const [newGuestUsername, setNewGuestUsername] = useState("");
    const [documentID, setDocumentID] = useState("");
    const [documentName, setDocumentName] = useState("");

    const reloadProject = async () => {
        try {
            let documentData = await Document.get(parseInt(projectID));
            setDocuments(documentData);
            let guestData = await ProjectAPI.getGuests(parseInt(projectID));
            setGuests(guestData);
        } catch (e) {
            document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }))
        }
    };

    useEffect(() => {
        reloadProject();
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />

            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <List>
                        <ListItem>Create a New Document</ListItem>
                        <ListItem>
                            <FormControl>
                                <TextField
                                    value={newDocumentName}
                                    label="Document name"
                                    variant="outlined"
                                    onChange={(e) =>
                                        setNewDocumentName(e.target.value)
                                    }
                                />
                                <Button
                                    disabled={!newDocumentName}
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        try {
                                            await Document.createDocument(
                                                newDocumentName,
                                                parseInt(projectID)
                                            );
                                            reloadProject();
                                        } catch (e) {
                                            document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }))
                                        }
                                    }}
                                >
                                    Create
                                </Button>
                            </FormControl>
                        </ListItem>
                        <ListItem>
                            <code>~/workdir</code>
                        </ListItem>
                        {documents.map(({ name, id }) => (
                            <ListItem
                                button
                                key={name}
                                onClick={() => {
                                    setDocumentID(id);
                                    setDocumentName(name);
                                }}
                            >
                                <ListItemText primary={name} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem>Share this Document</ListItem>
                        <ListItem>
                            <FormControl>
                                <TextField
                                    value={newGuestUsername}
                                    label="Guest username"
                                    variant="outlined"
                                    onChange={(e) =>
                                        setNewGuestUsername(e.target.value)
                                    }
                                />
                                <Button
                                    disabled={!newGuestUsername}
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        try {
                                            await ProjectAPI.shareProject(
                                                newGuestUsername,
                                                parseInt(projectID)
                                            );
                                            reloadProject();
                                        } catch (e) {
                                            document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }))
                                        }
                                    }}
                                >
                                    Share
                                </Button>
                            </FormControl>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem>Participants</ListItem>
                        {guests.map(({ uname }) => (
                            <ListItem key={uname}>
                                <ListItemText primary={uname} />
                                <IconButton onClick={() => {
                                    document.dispatchEvent(new CustomEvent("custom-showDialog",
                                        {
                                            detail: {
                                                dialogTitle: "Remove Participant",
                                                dialogMessage: `Are you sure you want to remove participant ${uname}?`,
                                                dialogAgree: async () => {
                                                    console.log("i agree");
                                                    await reloadProject()
                                                },
                                                dialogDisAgree: async () => {
                                                    console.log("i disagree");
                                                    await reloadProject();
                                                }
                                            }
                                        }))
                                }}  >
                                    <CloseIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
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
