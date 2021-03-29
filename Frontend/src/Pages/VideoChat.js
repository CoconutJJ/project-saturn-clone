import React from 'react'
import { useParams } from "react-router-dom";
import importScript from './ImportScript';
import "../Styles/index.css";
import openSocket from 'socket.io-client';
import Peer from 'peerjs';


function videochat(roomId, userId, cb) {
    //const io = require('socket.io')(server)
    //const socket = io('localhost:8080')
    const socket = openSocket('http://localhost:8080');
    socket.emit('join-room', roomId, userId);

    socket.on('user-connected', userId => {
        //send our video stream to the new user who joined the room
        console.log("user connected", userId)
    })
    //create video grid
    // const videoGrid = document.getElementById('video-grid');
    // const myVideo = document.createElement('video')
    //myVideo.muted = true; //mutes the video and voice for ourselves so we dont hear ourselves
    // const myPeer = new Peer({
    //     host: "localhost:8080",
    //     port: '3001',
    //     path: '/rooms/:id'
    // })
    // const peers = {};

    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then(stream => 
    //     addVideoStream(myVideo, stream)
    //     //answer their call and send our stream
    //     myPeer.on('call', call => {
    //         call.answer(stream)
    //         const video = document.createElement('video')
    //         console.log("video", video)
    //         console.log("stream", stream)
    //         call.on('stream', userVideoStream => {
    //             addVideoStream(video, userVideoStream)
    //         })
    //     })
    //     socket.on('user-connected', userId => {
    //         //send our video stream to the new user who joined the room
    //         connectToNewUser(userId, stream) 
    //     })
    // })
    
    // socket.on('user-disconnected', userId => {
    //     if(peers[userId]) {
    //         peers[userId]
    //     }
    // })
    // //join the room after generating the userid
    // myPeer.on('open', id => {
    //     console.log("idddd",id)
    //     socket.emit('join-room', roomId, id)
    // })
    
    
    // function connectToNewUser(userId, stream) {
    //     const call = myPeer.call(userId, stream)
    //     const video = document.createElement('video')
    //     //the user sends back their stream
    //     call.on('stream', userVideoStream => {
    //         addVideoStream(video, userVideoStream)
    //     })
    //     //remove video when closed
    //     call.on('close', () => {
    //         video.remove()
    //     })
    
    //     peers[userId] = call;
    // }
    
    // function addVideoStream(video, stream) {
    //     console.log("video 2nd", video)
    //     console.log("stream 2nd", stream)
    //     //once video is loaded, play it
    //     video.srcObject = stream
    //     video.addEventListener('loadedmetadata', () => {
    //         video.play()
    //     })
    //     videoGrid.append(video)
    // }

    // console.log(myVideo);
    // console.log(videoGrid);
    // return myVideo;

}

export { videochat };