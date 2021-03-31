import React from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import pyLogo from "../Media/python-logo.png";
import cLogo from "../Media/c-logo.png";

function ProjectCreate() {

    const [newProjectEnv, setNewProjectEnv] = useState(null);
    const [newProjectName, setNewProjectName] = useState("");

    const handleEnvSelection = (event, newEnv) => {
        setNewProjectEnv(newEnv);
    };
    

    const createProject = async () => {
        if (await Project.createProject(newProjectName, newProjectEnv)) {
            updateProjectDisplay(projectDisplayType);
            setNewProjectName("");
        } else {
            alert("Project creation failed!");
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
                            <ToggleButton value="python">
                                {/* https://iconscout.com/icon/c-programming */}
                                <Paper>
                                    <div
                                        style={{
                                            backgroundImage: `url(${pyLogo})`,
                                            backgroundSize: "contain",
                                            height: "50px",
                                            width: "150px",
                                        }}
                                    ></div>
                                    Python 3.XX
                                </Paper>
                            </ToggleButton>
                            <ToggleButton value="c">
                                {/* https://iconscout.com/icon/c-programming */}
                                <Paper>
                                    <div
                                        style={{
                                            backgroundImage: `url(${cLogo})`,
                                            backgroundSize: "contain",
                                            height: "50px",
                                            width: "50px",
                                        }}
                                    ></div>
                                    GCC C
                                </Paper>
                            </ToggleButton>
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
