const socket = io('/') //where our server is set up (its set up at our root path)
//create video grid
const videoGrid = document.getElementById('video-grid')
//peer connects diff user and gives us id
const myPeer = new Peer(undefined, {
    host: "/",
    port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true; //mutes the video and voice for ourselves so we dont hear ourselves
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)
    //answer their call and send our stream
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        //send our video stream to the new user who joined the room
        connectToNewUser(userId, stream) 
    })
})

socket.on('user-disconnected', userId => {
    if(peers[userId]) {
        peers[userId]
    }
})
//join the room after generating the userid
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    //the user sends back their stream
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    //remove video when closed
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    //once video is loaded, play it
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}