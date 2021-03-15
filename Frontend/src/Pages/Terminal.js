
import React, { useEffect, useRef } from "react";
import {XTerm} from "xterm-for-react";

const TermPage = () => {

    const xtermRef = useRef(null);

    let onType = (data) => {
        xtermRef.current.terminal.write(data)
        
    }

    let newLine = (data) => {
        console.log("new line")
    }

    return (
        <XTerm ref={xtermRef} onData={onType} onLineFeed={newLine}/>
    )


}


export default TermPage;