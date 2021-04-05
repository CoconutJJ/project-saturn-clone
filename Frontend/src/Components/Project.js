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
    Grid,
} from "@material-ui/core";
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
        padding: "1%",
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

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const [documents, setDocuments] = useState([]);

    const [guests, setGuests] = useState([]);
    const [newDocumentName, setNewDocumentName] = useState("");
    const [newGuestUsername, setNewGuestUsername] = useState("");

    const [documentID, setDocumentID] = useState("");

    const reloadProject = async () => {
        try {
            let documentData = await Document.get(parseInt(projectID));
            setDocuments(documentData);
            let guestData = await ProjectAPI.getGuests(parseInt(projectID));
            console.log(guestData);
            setGuests(guestData);
        } catch (e) {
            alert(e)
        }
    };
    const [drawerState, setDrawerState] = useState("");

    const updateDrawer = (newState) => {
        setDrawerOpen(!(newState == drawerState && drawerOpen));
        setDrawerState(newState);
    };
    useEffect(() => {
        reloadProject();
    }, []);

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
                        <Button
                            disabled={!newDocumentName}
                            onClick={async () => {
                                try {

                                    await Document.createDocument(
                                        newDocumentName,
                                        parseInt(projectID)
                                    );
                                    reloadProject();
                                } catch (e) {
                                    alert(e);
                                }
                            }}
                        >
                            Create
                        </Button>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {documents.map(({ name, id }) => (
                        <ListItem
                            button
                            key={name}
                            onClick={() => {
                                setDocumentID(id);
                            }}
                        >
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    };
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
                        <Button
                            disabled={!newGuestUsername}
                            onClick={async() => {
                                try{
                                    
                                    await ProjectAPI.shareProject(
                                        newGuestUsername,
                                        parseInt(projectID)
                                    );
                                    reloadProject();
                                } catch(e){
                                    alert(e);
                                }
                            }}
                        >
                            Share
                        </Button>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {guests.map(({ uname }) => (
                        <ListItem key={uname}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={uname} />
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    };

    const drawerStateToRender = {
        documents: renderDrawerDocuments,
        share: renderDrawerShare,
        "": () => null,
    };

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

            <Grid container>
                {projectID && documentID ? (
                    <>
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
                            <div style={{ margin: "auto" }}>
                                <Typography variant="h3">
                                    No Projects Open
                            </Typography>
                                <img src={SaturnCat} width="400" style={{ margin: "auto" }} />
                                {/* source: https://cdn-images.threadless.com/threadless-media/artist_shops/shops/riddlebee/products/235158/shirt-1495735761-9c0aa522a90f664edddda3706643e243.png?v=3&d=eyJvbmx5X21ldGEiOiBmYWxzZSwgImZvcmNlIjogZmFsc2UsICJvcHMiOiBbWyJ0cmltIiwgW2ZhbHNlLCBmYWxzZV0sIHt9XSwgWyJyZXNpemUiLCBbXSwgeyJ3aWR0aCI6IDk5Ni4wLCAiYWxsb3dfdXAiOiBmYWxzZSwgImhlaWdodCI6IDk5Ni4wfV0sIFsiY2FudmFzX2NlbnRlcmVkIiwgWzEyMDAsIDEyMDBdLCB7ImJhY2tncm91bmQiOiAiMDExOTJjIn1dLCBbInJlc2l6ZSIsIFs4MDBdLCB7fV0sIFsiY2FudmFzX2NlbnRlcmVkIiwgWzgwMCwgODAwLCAiI2ZmZmZmZiJdLCB7fV0sIFsiZW5jb2RlIiwgWyJqcGciLCA4NV0sIHt9XV19 */}
                            </div>
                        </>
                    )}
            </Grid>
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
