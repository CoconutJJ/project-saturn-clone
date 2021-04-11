import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ProjectCreate from "../Components/ProjectCreate";
import ProjectList from "../Components/ProjectList";
import QuickActions from "../Components/QuickActions";

function Dashboard() {

    return (
        <div style={{ padding: "2%" }}>
            <Typography variant="h3">Dashboard</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ProjectCreate/>
                </Grid>
                <Grid item xs={12}>
                    <ProjectList/>
                </Grid>
                <Grid item xs={12}>
                    {/* <QuickActions/> */}
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;
