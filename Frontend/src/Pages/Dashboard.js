import React, { useEffect, useState, Fragment } from "react";
import { Button, CssBaseline, Grid, Snackbar, Card, CardContent, Typography, ButtonBase } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AccountCircle, LockRounded } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

function Dashboard(props) {
    const history = useHistory();
    const [owned, setOwned] = useState(null);
    const [shared, setShared] = useState(null);
    const [isDisplayOwned, isSetDisplayOwned] = useState(true);
    const [displayData, setDisplayData] = useState(null);
    const [docName, setDocName] = useState("");
    const [userName] = useState(JSON.parse(localStorage.getItem("userName")));

    useEffect(() => {
        const main = async () => {
            const response = await fetch(`/documents/${userName}?relationship=OWNER`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const responseJson = await response.json();
            setOwned(responseJson);
            console.log("owned:", responseJson)

            const response2 = await fetch(`/documents/${userName}?relationship=GUEST`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const responseJson2 = await response2.json();
            setShared(responseJson2);
            console.log("shared:", responseJson2)
        }
        main();
    }, []);

    const displayShared = () => {
        isSetDisplayOwned(false);
    }
    const displayOwned = () => {
        isSetDisplayOwned(true);
    }
    const createDoc = async () => {
        if (!docName) return;
        const response = await fetch("/documents", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: docName, userName })
        })
        window.location.reload();
    }

    const displayDocs = () => {
        const data = (isDisplayOwned) ? owned : shared;
        return (
            data.map((x) => (
                <Card key={x.documentId} variant="outlined">
                    <ButtonBase onClick={() => {
                        history.push(`/documents/${x.documentId}`);//UPDATE DASHBOARD TO AN AUTH ROUTE

                    }}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {x.name}
                            </Typography>
                        </CardContent>
                    </ButtonBase>
                </Card>))
        )
    }
    return (
        <Fragment>
            <h1>Dashboard</h1>
            <Grid container md={12} >
                <Grid item container justify='center' alignItems='center' md={12}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={displayOwned}
                    >
                        OWNED
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={displayShared}
                    >
                        SHARED
                    </Button>
                </Grid>
            </Grid>

            <h2>{isDisplayOwned ? "Your documents" : "Documents shared with you"}</h2>

            <Grid container md={12} >
                <Grid container justify='center' alignItems='center' md={12}>
                    {
                        isDisplayOwned && (
                            <Grid>
                                <Grid>
                                    <TextField
                                        label="Name"
                                        value={docName}
                                        onChange={(e) => setDocName(e.target.value)}
                                    />
                                </Grid>

                                <Grid item container justify='center' alignItems='center' md={12}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={(createDoc)}
                                    >
                                        Create new doc
                                    </Button>

                                </Grid>

                            </Grid>
                        )
                    }
                </Grid>
            </Grid>
            <Grid container md={12} direction="column">
                {
                    owned && shared && (
                        displayDocs()
                    )
                }
            </Grid>
        </Fragment>);
}

export default Dashboard;