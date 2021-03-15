//import { Link } from 'react-router-dom';
import React from 'react'
import { Link } from 'react-router-dom';
const RoomList = ({ rooms, title }) => {
  return (
    <div className="blog-list">
      <h2> { title } </h2>
      {rooms.map(room => (
        <div className="blog-preview" key={room.id} >
            <Link to={`/rooms/${room.id}`}>
              <h2>{ room.title }</h2>
            </Link>
        </div>
      ))}
    </div>
  );
}
 
export default RoomList;