import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { ButtonBase, Card, CardContent, TextField, Button } from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import pyLogo from "../Media/python-logo.png";
import cLogo from "../Media/c-logo.png";
import videoIcon from "../Media/video-chat.png";
import termIcon from "../Media/code-terminal.png";
import Project from "../apis/project"
function Dashboard() {
    const history = useHistory();
    const [newProjectEnv, setNewProjectEnv] = useState(null);
    const [newProjectName, setNewProjectName] = useState("");
    const [projectDisplayType, setProjectDisplayType] = useState("owned");
    const [projectDisplayData, setProjectDisplayData] = useState(null);

    const updateProjectDisplay = async (type) => {
        let data = await Project.get(type);
        setProjectDisplayData(data);
    }

    const handleEnvSelection = (event, newEnv) => {
        setNewProjectEnv(newEnv);
    };

    const handleProjectDisplayTypeChange = async (event, newType) => {
        if (!newType) return;
        await updateProjectDisplay(newType);
        setProjectDisplayType(newType);
    };

    useEffect(() => {
        updateProjectDisplay(projectDisplayType);
    }, [])

    const ProjectCard = (name, owner, env,id) => {
        return (
            <ButtonBase key={id} onClick={()=>{
                history.push(`/projects/${id}`);
            }}>
                <Card>
                    <CardContent>
                        <Typography>{`Name: ${name}`}</Typography>
                        <Typography>{`Owner: ${owner}`}</Typography>
                        <Typography>{`Environment: ${env}`}</Typography>
                    </CardContent>
                </Card>
            </ButtonBase>
        )
    }

    return (
        <div style={{ padding: "2%" }}>
            <Typography variant="h3">Dashboard</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Create a new Project
                            </Typography>
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
                                        onClick={() => {
                                            Project.createProject(newProjectName, newProjectEnv)
                                            updateProjectDisplay(projectDisplayType);
                                            setNewProjectName("");
                                        }}
                                    >
                                        Create project
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Your Projects
                            </Typography>
                            <Grid container >
                                <ToggleButtonGroup
                                    value={projectDisplayType}
                                    exclusive
                                    onChange={handleProjectDisplayTypeChange}
                                    aria-label="Your projects"
                                >
                                    <ToggleButton value="owned">
                                        <Typography>Owned by me</Typography>
                                    </ToggleButton>
                                    <ToggleButton value="shared">
                                        <Typography>Shared with me</Typography>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid container>
                                {
                                    projectDisplayData && (
                                        projectDisplayData.map(({ name, owner, env,id }) => ProjectCard(name, owner, env,id))
                                        // null
                                    )
                                }
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Quick Actions</Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${videoIcon})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                            ></div>
                                            Video Chat
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                                <Grid item>
                                    <ButtonBase>
                                        <Paper>
                                            <div
                                                style={{
                                                    backgroundImage: `url(${termIcon})`,
                                                    backgroundSize: "contain",
                                                    height: "50px",
                                                    width: "50px",
                                                }}
                                            ></div>
                                            Terminal
                                        </Paper>
                                    </ButtonBase>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Dashboard;
