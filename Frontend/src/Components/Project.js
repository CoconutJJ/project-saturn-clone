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
    TextField,
    Button,
    Grid
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import clsx from "clsx";
import React, { useState, useEffect, Fragment } from "react";
import CodePad from "./CodePad";
import Terminal from "./Terminal";
import { useParams } from "react-router-dom";
import Document from '../apis/document';
import ProjectAPI from '../apis/project';
import ShareIcon from '@material-ui/icons/Share';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        padding: "1%"
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7),
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function Project() {
    const { id: projectID } = useParams();
    const classes = useStyles();
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [documents, setDocuments] = useState([]);
    const [guests, setGuests] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const [newGuestUsername, setNewGuestUsername] = useState("");
    const [documentID, setDocumentID] = useState("");
    const reloadProject = async () => {
        let documentData = await Document.get(parseInt(projectID));
        setDocuments(documentData);
        let guestData = await ProjectAPI.getGuests(parseInt(projectID));
        console.log(guestData);
        setGuests(guestData);
    }
    const [drawerState, setDrawerState] = useState("");

    const updateDrawer = (newState) => {
        setDrawerOpen(!(newState == drawerState && drawerOpen));
        setDrawerState(newState);
    }
    useEffect(() => {
        reloadProject();
    }, [])

    const renderDrawerDocuments = () => {
        return (
            <Fragment>
                <List>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText>
                            <TextField
                                value={newDocumentName}
                                label="Document name"
                                onChange={(e) =>
                                    setNewDocumentName(e.target.value)
                                }
                            />
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <Button disabled={!newDocumentName}
                            onClick={() => {
                                Document.createDocument(newDocumentName, parseInt(projectID))
                                reloadProject();
                            }}>
                            Create
                            </Button>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {documents.map(({ name, id }) => (
                        <ListItem button key={name} onClick={() => {
                            setDocumentID(id)
                        }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    }
    const renderDrawerShare = () => {
        return (

            <Fragment>
                <List>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText>
                            <TextField
                                value={newGuestUsername}
                                label="Guest username"
                                onChange={(e) =>
                                    setNewGuestUsername(e.target.value)
                                }
                            />
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <Button disabled={!newGuestUsername}
                            onClick={() => {
                                ProjectAPI.shareProject(newGuestUsername, parseInt(projectID))
                                reloadProject();
                            }}>
                            Share
                    </Button>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {guests.map(({ uname }) => (
                        <ListItem key={uname} >
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={uname} />
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    }

    const drawerStateToRender = { "documents": renderDrawerDocuments, "share": renderDrawerShare, "": () => null }



    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={() => setDrawerOpen((x) => !x)}>
                        {!drawerOpen ? (
                            <ChevronRightIcon />
                        ) : (
                                <ChevronLeftIcon />
                            )}
                    </IconButton>
                </div>
                <Divider />
                {drawerStateToRender[drawerState]()}
            </Drawer>
            <Drawer variant="permanent">
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <ListItem>
                        <ButtonBase onClick={() => updateDrawer("documents")}>
                            <InsertDriveFileIcon />
                        </ButtonBase>
                    </ListItem>
                    <ListItem>
                        <ButtonBase onClick={() => updateDrawer("share")}>
                            <ShareIcon />
                        </ButtonBase>
                    </ListItem>
                </List>
            </Drawer>

            <main className={classes.content}>
                <div className={classes.toolbar} />

                <Grid container direction="column">
                    <Grid item xs={6}>
                        <CodePad projectID={projectID} documentID={documentID} />
                    </Grid>
                    <Grid item xs={6}>
                        <Terminal />
                    </Grid>
                </Grid>
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
