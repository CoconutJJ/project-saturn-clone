import React from "react";
import {
    ButtonBase,
    Card,
    CardContent,
    Typography,
    Paper,
    Divider,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import pyLogo from "../Media/python-logo.png";
import cLogo from "../Media/c-logo.png";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import TitleIcon from "@material-ui/icons/Title";
import { envToLabel, envToIcon } from "./ProjectCreate";

function ProjectCard({ name, owner, env, id }) {
    const history = useHistory();

    return (
        <ButtonBase
            key={id}
            onClick={() => {
                history.push(`/projects/${id}`);
            }}
            style={{margin:10}}
        >
            <Card>
                <CardContent>
                    <Paper style={{ marginBottom: "10px" }}>
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
                    <Typography
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "wrap",
                            fontWeight: "bold",
                        }}
                    >
                        {`${name}`}
                    </Typography>
                    <Typography
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <AccountBoxIcon /> {`${owner}`}
                    </Typography>
                </CardContent>
            </Card>
        </ButtonBase>
    );
}

export default ProjectCard;
