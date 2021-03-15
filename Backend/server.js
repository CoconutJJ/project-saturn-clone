const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const bodyParser = require("body-parser");
const qlSchema = buildSchema(fs.readFileSync("api.gql").toString());

const root = {};

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(morgan("dev"));

app.use(bodyParser.json());

app.use("/static", express.static(path.join(__dirname, "../Frontend/dist")));

app.use("/ql", (req, res) =>
    graphqlHTTP({
        schema: qlSchema /* GraphQL Schema */,
        rootValue: root /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);

app.get('/rooms/:id', (req, res) => {
    res.render('room', { roomId: req.params.id })
})

app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId,userId)
        //tell other users we have a new user joined
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId) //tells everyone we connected but ourselves
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

http.listen(8080, () => {
    console.log("Server Running!");
});
