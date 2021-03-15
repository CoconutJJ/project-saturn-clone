//after clicking on a Room in RoomsList.js, it should point to this file which
//returns the rooms/video view
import React from 'react'
import { useParams } from "react-router-dom";
import importScript from './ImportScript';
//import { io } from "socket.io-client";
//const socket = io('/rooms');



const RoomDetails = () => {
    const { id } = useParams();
    //importScript("../src/Pages/Script.js")
    return(
        <div className="video-grid">
        </div>
    );
}

export default RoomDetails;
