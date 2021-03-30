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
import React, { useState, useEffect } from "react";
import CodePad from "./CodePad";
import Terminal from "./Terminal";
import { useParams } from "react-router-dom";
import Document from '../apis/document';
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
    const [newDocumentName, setNewDocumentName] = useState("");
    const [documentID, setDocumentID] = useState("");
    const reloadProject = async () => {
        let data = await Document.get(parseInt(projectID));
        setDocuments(data);
    }
    useEffect(() => {
        reloadProject();
    }, [])



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
                <List>
                    <ListItem>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText>
                            <TextField
                                value={newDocumentName}
                                label="New document name"
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
            </Drawer>
            <Drawer variant="permanent">
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    <ListItem>
                        <ButtonBase onClick={() => setDrawerOpen((x) => !x)}>
                            <InsertDriveFileIcon />
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

            {/* <main className={classes.content}>
                <div className={classes.toolbar} />
                <CodePad />
                <Terminal/>
            </main> */}
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
