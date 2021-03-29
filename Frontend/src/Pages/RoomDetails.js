//after clicking on a Room in RoomsList.js, it should point to this file which
//returns the rooms/video view
import React from 'react'
import { useParams } from "react-router-dom";
import importScript from './ImportScript';
import "../Styles/index.css";
import openSocket from 'socket.io-client';
import { videochat } from './VideoChat';

const RoomDetails = () => {
    const { id } = useParams();
    console.log(id)
    
    const vid = videochat(id, 3);
    console.log(vid);
    


    return(
        
        <div className="video-grid">
        </div>
    );
}

export default RoomDetails;
