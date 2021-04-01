import React from "react";
import {
    ButtonBase,
    Card,
    CardContent,
    Typography
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";

function ProjectCard({name, owner, env, id}) {
    const history = useHistory();



    return (
        <ButtonBase
            key={id}
            onClick={() => {
                history.push(`/projects/${id}`);
            }}
        >
            <Card>
                <CardContent>
                    <Typography>{`Name: ${name}`}</Typography>
                    <Typography>{`Owner: ${owner}`}</Typography>
                    <Typography>{`Environment: ${env}`}</Typography>
                </CardContent>
            </Card>
        </ButtonBase>
    );

}

export default ProjectCard;