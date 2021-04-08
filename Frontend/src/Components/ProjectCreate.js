import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Paper
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import pyLogo from "../Media/python-logo.png";
import cLogo from "../Media/c-logo.png";
import Project from "../apis/project";

export const envToIcon = { "python": pyLogo, "c": cLogo }
export const envToLabel = { "python": "PYTHON 3.XX", "c": "GCC C" }

function ProjectCreate() {

    const [newProjectEnv, setNewProjectEnv] = useState(null);
    const [newProjectName, setNewProjectName] = useState("");

    const handleEnvSelection = (event, newEnv) => {
        setNewProjectEnv(newEnv);
    };


    const createProject = async () => {
        try {
            await Project.createProject(newProjectName, newProjectEnv)
            setNewProjectName("");
            document.dispatchEvent(new CustomEvent("custom-onCreateProject"));
        } catch (e) {
            document.dispatchEvent(new CustomEvent("custom-onError", { detail: { error: e } }));
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Create a new Project</Typography>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            label="Project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                        />
                    </Grid>
                    <Grid item container direction="column">
                        <Typography>Project environment</Typography>

                        <ToggleButtonGroup
                            value={newProjectEnv}
                            exclusive
                            onChange={handleEnvSelection}
                            aria-label="New project environment"
                        >
                            {
                                Object.keys(envToIcon).map((env) => {
                                    return (
                                        <ToggleButton value={env} key={env}>
                                            {/* https://iconscout.com/icon/c-programming */}
                                            {/* https://iconscout.com/icon/c-programming */}
                                            <Paper>
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${envToIcon[env]})`,
                                                        backgroundSize: "contain",
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "center",
                                                        height: "50px",
                                                        width: "150px",
                                                    }}
                                                ></div>
                                                {envToLabel[env]}
                                            </Paper>
                                        </ToggleButton>
                                    )
                                })
                            }
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={!(newProjectName && newProjectEnv)}
                            onClick={createProject}
                        >
                            Create project
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default ProjectCreate;
