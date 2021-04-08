import {
    CardContent,
    Typography,
    Card,
    List,
    ListItem,
    Divider,
    Box,
} from "@material-ui/core";
import React from "react";
import { hot } from "react-hot-loader/root";

function Credits() {
    return (
        <div style={{ padding: "2%" }}>
            <Typography variant="h3">Credits</Typography>
            <Box style={{ marginBottom: "5px" }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Images Used</Typography>
                        <List>
                            <ListItem>
                                Saturn Cat Image from{" "}
                                <a href="https://bit.ly/31ZjWcA">Threadless</a>
                            </ListItem>
                            <ListItem>
                                Photo by{" "}
                                <a href="https://unsplash.com/@nasa?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                                    NASA
                                </a>{" "}
                                on{" "}
                                <a href="https://unsplash.com/s/photos/saturn?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                                    Unsplash
                                </a>
                            </ListItem>
                            <ListItem>
                                Photo by{" "}
                                <a href="https://unsplash.com/@npigossi?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                                    Nelson Pigossi Jr
                                </a>{" "}
                                on{" "}
                                <a href="https://unsplash.com/s/photos/milk-way?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                                    Unsplash
                                </a>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box style={{ marginBottom: "5px" }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Icons Used</Typography>
                        <List>
                            <ListItem>
                                C Programming Language Logo from{" "}
                                <a href="https://iconscout.com/icon/c-programming">
                                    Iconscout
                                </a>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box style={{ marginBottom: "5px" }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Notable Technology Used</Typography>
                        <List>
                            <ListItem>
                                ShareDB for Live Code Editor Collaboration
                            </ListItem>
                            <ListItem>
                                XTerm.js for in-browser terminal emulation 
                            </ListItem>
                            <ListItem>
                                Docker for Sandbox Environments
                            </ListItem>
                            <ListItem>
                                
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box style={{ marginBottom: "5px" }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Authors</Typography>
                        Saturn was created by David Yue, Mark Chen and Shruti Mistry.
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}
export default hot(Credits);
