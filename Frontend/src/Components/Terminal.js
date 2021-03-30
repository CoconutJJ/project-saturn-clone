import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import { io } from "socket.io-client";
import XTermBuffer from "../apis/xterm-buffer";

const Terminal = () => {
    let socket;
    /**
     * @type {XTermBuffer}
     */
    let buffer;
    const xtermRef = useRef(null);

    useEffect(() => {
        socket = io("ws://localhost:8080/", { path: "/pty" });
        socket.on("response", (data) => {
            xtermRef.current.terminal.write(data);
        });
        buffer = new XTermBuffer(xtermRef.current.terminal);
    }, []);

    /**
     *
     * @param {string} data
     */
    let onData = (data) => {
        const code = data.charCodeAt(0);
        switch (code) {
            case 13:
                socket.emit("command", buffer.line + "\n");
                buffer.newline();
                break;
            case 127:
                buffer.backspace();
                break;
            case 27:
                switch (data.substr(1)) {
                    case "[D":
                        buffer.left();
                        break;
                    case "[C":
                        buffer.right();
                        break;
                    default:
                        break;
                }
                break;
            case 16:
                break;
            default:
                buffer.write(data);
                break;
        }
    };
    return <XTerm ref={xtermRef} onData={onData} />;
};

export default Terminal;
