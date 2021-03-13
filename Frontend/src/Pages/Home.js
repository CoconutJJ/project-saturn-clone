import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import brandLogo from "../Media/saturn.png";
import { makeStyles } from "@material-ui/core/styles";
import TypeIt from "typeit-react";

const useStyles = makeStyles((theme) => ({
    actionButton: {
        borderColor: "white",
        color: "white"
    }
}));

function Home() {
    const classes = useStyles();
    return (
        <>
            <div
                style={{
                    backgroundImage: "url(" + brandLogo + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "95vh",
                    color: "white",
                }}
            >
                <div style={{padding:"5%"}}>
                    <Typography variant="h3">Saturn is <TypeIt
                        options={{
                            strings: ["Jupyter with Rings", "A Code Editor", "Collaboration Software", "The 6th planet in our Solar System"],
                            speed: 80,
                            waitUntilVisible: true,
                            breakLines: false,
                            loop: true
                        }}
                    />
                    </Typography>
                    <br/>
                    <Button color="primary" variant="outlined" size="large" className={classes.actionButton}>Get Started</Button>
                </div>
            </div>
        </>
    );
}

export default Home;
