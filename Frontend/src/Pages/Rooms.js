import { BluetoothSearchingOutlined } from '@material-ui/icons';
import React from 'react'
import { useState } from 'react';
import RoomsList from "./RoomsList";
import VideoChat from "./VideoChat";
const { v4: uuidV4 } = require('uuid');

const Rooms = () => {
    const [rooms, setRooms] = useState([
        {title: "Room 1", id: uuidV4() },
        {title: "Room 2", id: uuidV4() }
    ])
    return ( 
        <div className="home">
            <RoomsList rooms={rooms} title="All Rooms" />
        </div>
    );
}
 
export default Rooms;