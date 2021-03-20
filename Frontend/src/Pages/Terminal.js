import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import { io } from "socket.io-client";
const TermPage = () => {
    const xtermRef = useRef(null);

    let socket;

    useEffect(() => {
        socket = io("ws://localhost:8080/", { path: "/pty" });
        socket.on("response", (data) => {
            xtermRef.current.terminal.write(data);
        });
        console.log("effect");
    }, []);

    let cmd = "";

    let onKey = ({ key, domEvent }) => {
        if (key.charCodeAt(0) == 13) {
            xtermRef.current.terminal.write("\n");
            socket.emit("command", cmd + "\n");
            cmd = "";
        } else {
            xtermRef.current.terminal.write(key);
            cmd = cmd + key;
            console.log(cmd);
        }
    };

    return <XTerm ref={xtermRef} onKey={onKey} />;
};

export default TermPage;
