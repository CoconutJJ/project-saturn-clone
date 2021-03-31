import React from "react";
import { Card, CardContent } from "@material-ui/core";
import Project from "../apis/project";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ProjectCard from "./ProjectCard";

function ProjectList() {
    const [projectDisplayType, setProjectDisplayType] = useState("owned");
    const [projectDisplayData, setProjectDisplayData] = useState(null);

    const updateProjectDisplay = async (type) => {
        let data = await Project.get(type);
        setProjectDisplayData(data);
    };

    const handleProjectDisplayTypeChange = async (event, newType) => {
        if (!newType) return;
        await updateProjectDisplay(newType);
        setProjectDisplayType(newType);
    };

    useEffect(() => {
        updateProjectDisplay(projectDisplayType);
    }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Your Projects</Typography>
                <Grid container>
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
                    {projectDisplayData &&
                        projectDisplayData.map(({ name, owner, env, id }) => {
                            <ProjectCard
                                name={name}
                                owner={owner}
                                env={env}
                                id={id}
                            />;
                        })}
                </Grid>
            </CardContent>
        </Card>
    );
}
export default ProjectList;
