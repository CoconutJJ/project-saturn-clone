import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    
`;

const StyledVideo = styled.video`
    display: block;
    height: 20vh;
    padding-top: 20px;
`;

// const Container = styled.div`
//     padding: 20px;
//     display: flex;
//     height: 50vh;
//     width: 20%;
//     margin: auto;
//     flex-wrap: wrap;
// flex-direction: column;
// `;

// const StyledVideo = styled.video`
//     height: 40%;
//     width: 50%;
//     padding-top: 20px;
// `;

const Video = (props) => {
    const ref = useRef();
    console.log("hi")

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef(io("http://localhost:8080", { path: '/video', autoConnect: false }));
    const [stream, setStream] = useState();
    const roomID = props.id;
    const userVideo = useRef();

    useEffect(() => {
        if (!props.videoflag) return;

        // Relaying handshakes from simple-peer
        socketRef.current.on("receiving returned signal", payload => {
            const item = peers.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        return () => {
            socketRef.current.off("receiving returned signal");
        };
    }, [ peers, props.videoflag ]);

    useEffect(() => {
        // If the current state of the room is no video, theres nothing for us to do
        if (!props.videoflag || !stream) return;

        socketRef.current.connect();
        socketRef.current.emit("join room", roomID);
        userVideo.current.srcObject = stream;

        return () => {
            socketRef.current.disconnect();
            setPeers([]);
        };
    }, [ props.videoflag, stream, roomID ]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: videoConstraints, audio: false })
            .then(
                stream => {
                    // Initialization step
                    socketRef.current.on("all users", users => {
                        console.log("owo", users);
                        setPeers(users.map(peerID => {
                            const peer = createPeer(peerID, socketRef.current.id, stream);
                            return { peerID, peer };
                        }));
                    });
        
                    // New user while code is still running
                    socketRef.current.on("user joined", payload => {
                        console.log("uwu", payload);
                        const peer = addPeer(payload.signal, payload.callerID, stream);
                        const peerObj = {
                            peerID: payload.callerID,
                            peer
                        };
                        setPeers(users => [...users, peerObj]);
                    });

                    // Cleaning up people leaving
                    socketRef.current.on("user left", userID => {
                        setPeers(_peers => {
                            const newPeers = _peers.filter(p => {
                                console.log(userID, p.peerID);
                                const isPeer = p.peerID === userID;
                                if (isPeer) {
                                    p.peer.destroy();
                                }
                                return !isPeer;
                            });

                            if (newPeers.length === _peers.length) {
                                return _peers;
                            }
                            return newPeers;
                        });
                    });

                    setStream(stream);
                },
                (err) => {
                    console.error('Media error: ', err);
                },
            );
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });
        
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID });
        });

        peer.signal(incomingSignal);
        return peer;
    }

    return (
        
        <Container>
            {props.videoflag ? (
                <>
                    <StyledVideo muted ref={userVideo} autoPlay playsInline />
                    {peers.map((peer) => {
                        return (
                            <Video key={peer.peerID} peer={peer.peer} />
                        );
                    })}
                </>
            ) : (
                <h1>No video</h1>
            )}
        </Container>
    );
};

export default Room;