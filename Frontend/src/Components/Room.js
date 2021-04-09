import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
    flex-direction: column;
    
    
`;

const StyledVideo = styled.video`
    display: block;
    height: 40%;
    width: 50%;
    padding-top: 20px;
`;

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
    //const [videoflag, setVideoFlag] = useState(props.videoflag);
    let [socket, setSocket] = useState(null);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    console.log("props", props)
    const roomID = props.id;
    console.log("roomID", roomID);
    useEffect(() => {console.log("useeffect", peers) });
    
    useEffect(() => {console.log("videoflag", props.videoflag) });

    console.log("hi")
    useEffect(() => {
        console.log("useeffect entered")
        
        if(props.videoflag == true) {
            socketRef.current = io.connect("http://localhost:8080", {path: '/video'});
            console.log("video flag is true")
            console.log(socketRef.current)
            //socketRef.current.on('connection', () => {
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
                userVideo.current.srcObject = stream;
                console.log("join the room")
                socketRef.current.emit("login");
                socketRef.current.emit("join room", roomID);
                
                console.log("finished joining")
    
                socketRef.current.on("all users", users => {
                    const peers = [];
                    console.log("usersss in front", users)
                    users.forEach(userID => {
                        console.log("userID", userID)
                        console.log("current id", socketRef.current.id)
                        const peer = createPeer(userID, socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                    })
                    console.log("peeers in front", peers)
                    setPeers(peers);
                })
    
                socketRef.current.on("user joined", payload => {
                    console.log("------ users joined ------", payload)
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                    const peerObj = {
                        peerID: payload.callerID,
                        peer
                    }
                    console.log("paylod caller id", payload.callerID)
                    setPeers(users => [...users, peerObj]);
                    //setPeers(users => [...new Set(users.push(peerObj))]);
                    console.log("peeers in front 2", peerObj)
                });
    
                socketRef.current.on("receiving returned signal", payload => {
                    console.log("-----receving return signal-----", payload)
                    console.log("---peers ref---", peersRef)
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    console.log("----found item----", item)
                    item.peer.signal(payload.signal);
                });

                socketRef.current.on("user left", userID => {
                    console.log("videflag false")
                    // socketRef.current.on("user left", userID => {
                        console.log("frontend disconnect");
                        const item = peersRef.current.filter(p => p.peerID === userID);
                        for (var i = 0; i < item.length; i++) {
                            if(item[i]) {
                                item[i].peer.destroy();
                                
                            }

                        }
                        
                        const peers = peersRef.current.filter(p => p.peerID !== userID);
                        peersRef.current = peers;
                        setPeers(peers);
    
    
                    // });
                });
            });
            //});

        } else {
            console.log("videflag false")
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
            
            //replace peersRef with empty
            peersRef.current = [];
            
            
            

            
        }
        
        

    },[props.videoflag]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            console.log("usertosignal", userToSignal)
            console.log("callerID", callerID)
            console.log("create peer signal passed in", signal)
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        console.log("incomingsignal", incomingSignal)
        console.log("callerID", callerID)
        
        peer.on("signal", signal => {
            console.log("add peer signal passed in", signal)
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        
        <Container>
            {props.videoflag  ? (
                <>
                    <StyledVideo muted ref={userVideo} autoPlay playsInline />
                        {peers.map((peer) => {
                            return (
                                <Video key={peer.peerID} peer={peer.peer} />
                            );
                        })}
                </>
            ) : (
                <>
                    <h1>No video</h1>
                </>
            )}
        </Container>
    );
};

export default Room;