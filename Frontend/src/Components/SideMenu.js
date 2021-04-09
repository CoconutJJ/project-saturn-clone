import {
    Button,
    Divider,
    Drawer,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Toolbar,
    ButtonBase
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState, Fragment } from "react";
import Document from "../apis/document";
import ProjectAPI from "../apis/project";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ShareIcon from "@material-ui/icons/Share";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerContainer: {
        marginLeft:50,
        overflow: "auto",
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
}));


export default function SideMenu({ projectID, setDocumentID, setDocumentName }) {
    const classes = useStyles();
    const [documents, setDocuments] = useState([]);
    const [guests, setGuests] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const [newGuestUsername, setNewGuestUsername] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerState, setDrawerState] = useState("");
    useEffect(() => {
        console.log(drawerOpen, drawerState);
    })

    const updateDrawer = (newState) => {
        setDrawerOpen(!(newState == drawerState && drawerOpen));
        setDrawerState(newState);
    };

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

    const renderDrawerDocuments = () => {
        return (
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
                                    await reloadProject();
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
        )
    }

    const renderDrawerShare = () => {
        return (
            <Fragment>
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
                                        setNewGuestUsername("");
                                        await reloadProject();
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
                                                try {
                                                    await ProjectAPI.unShareProject(uname, parseInt(projectID));
                                                    await reloadProject()
                                                } catch (e) {
                                                    document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }))
                                                }
                                            },
                                            dialogDisAgree: async () => {
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
            </Fragment>
        )
    }

    const drawerStateToRender = {
        documents: renderDrawerDocuments,
        share: renderDrawerShare,
        "": () => null,
    };

    return (
        <Fragment>
            {
                drawerOpen && (
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
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
                        <div className={classes.drawerContainer}>
                            {drawerOpen &&
                                (drawerStateToRender[drawerState]())
                            }
                        </div>
                    </Drawer>
                )
            }
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
        </Fragment>
    )
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
