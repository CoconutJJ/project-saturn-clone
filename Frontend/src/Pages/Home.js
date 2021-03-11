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

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Home() {
    const classes = useStyles();

    const history = useHistory();

    let toLoginPage = () => {
        history.push("/login");
    }

    return (
        <>
            <div
                style={{
                    backgroundImage: "url(" + brandLogo + ")",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "100vh",
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
                        <Typography variant="h6" className={classes.title}>SATURN</Typography>
                        <Button color="inherit" onClick={toLoginPage}>Login</Button>
                        <Button color="inherit">Sign Up</Button>

                    </Toolbar>
                </AppBar>
            </div>
        </>
    );
}

export default Home;
