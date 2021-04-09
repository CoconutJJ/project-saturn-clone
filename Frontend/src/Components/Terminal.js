import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import { io } from "socket.io-client";
import XTermBuffer from "../apis/xterm-buffer";
import { FitAddon } from "xterm-addon-fit";
const Terminal = ({ projectID, documentID }) => {
    let [socket, setSocket] = useState(null);
    /**
     * @type {XTermBuffer} buffer
     */
    let [buffer, setBuffer] = useState(null);
    const xtermRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        socket.on("response", (data) => {
            buffer.set(data);
        });
        socket.on("disconnect", () => {
            buffer.set("Lost Connection to Server");
        });

        return () => {
            socket.close();
        };
    }, [socket]);

    useEffect(() => {
        
        setSocket(io.connect("ws://" + window.location.host, { path: "/pty" }));

        setBuffer(new XTermBuffer(xtermRef.current.terminal));
        let fit = new FitAddon();
        xtermRef.current.terminal.loadAddon(fit);
        fit.fit();

        window.addEventListener("resize", () => {
            fit.fit();
        });
    }, []);

    /**
     *
     * @param {string} data
     */
    let onData = (data) => {
        const code = data.charCodeAt(0);
        switch (code) {
            case 13:
                socket.emit("setfs", projectID)
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
