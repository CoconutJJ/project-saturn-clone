import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import brandLogo from "../Media/saturn.png";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import TypeIt from "typeit-react";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },

    actionButton: {
        borderColor: "white",
        color: "white"
    }

}));

function Home() {
    const classes = useStyles();

    const history = useHistory();

    let toLoginPage = () => {
        history.push("/login");
    };

    return (
        <>
            <div
                style={{
                    backgroundImage: "url(" + brandLogo + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "100vh",
                    color: "white",
                }}
            >
                <AppBar position="static" style={{ backgroundColor: "black" }}>
                    <Toolbar>
                        {/* <IconButton
                            edge="start"
                            color="inherit"
                            className={classes.menuButton}
                            aria-label="menu"
                        >
                            <MenuIcon />
                        </IconButton> */}
                        <Typography variant="h6" className={classes.title}>
                            SATURN
                        </Typography>
                        <Button color="inherit" onClick={toLoginPage}>
                            Login
                        </Button>
                        <Button color="inherit">Sign Up</Button>
                    </Toolbar>
                </AppBar>
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
