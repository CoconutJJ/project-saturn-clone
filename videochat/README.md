# videochat_demo

## Tech

`npm i express ejs socket.io`: Server

`npm i uuid` : Creates dynamic URLs with unique UUids for the specific rooms

`npm i -g peer`: https://peerjs.com - Allows us to run Peer Server which connects different user and gives us dynamic user Ids

## Setup

### Terminal 1
`npm run devStart`

### Terminal 2

`peerjs --port 3001`

Visiting `localhost:3000` will setup your video and the id generated at the end of the url `localhost:3000` is a `roomid`, open up a new tab and `localhots:3000` will generate a *new User Id* and a *new Room Id* , simply change the `roomId` at the end of the URL to match the first tab's and you will see 2 videos on both tabs meaning that 2 users are in one room.
