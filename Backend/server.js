const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const bodyParser = require("body-parser");
const qlSchema = buildSchema(fs.readFileSync("api.gql").toString());
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const User = require("./models/user");

var ExpressPeerServer = require('peer').ExpressPeerServer;

var options = {
    debug: true
}

const root = {
    loginUser: async ({ username, password }, context) => {
        try {
            if (await User.authenticate(username, password)) {
                session.username = username;
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            throw Error("Internal Server Error");
        }
    },
    signUpUser: async ({ firstname, lastname, username, password, email }) => {
        try {
            await User.create(firstname, lastname, username, password, email);
            session.username = username;
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
};

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(morgan("dev"));

app.use((req, res, next) => {
    if (session.username == undefined || session.username == null) {

        console.log(req.cookies);
        res.cookie("userdata", "", { maxAge: 0, sameSite: "strict" });
    } else {
        res.cookie(
            "userdata",
            JSON.stringify({
                username: session.username,
            }),
            {
                maxAge: 10e9,
                sameSite: "strict",
            }
        );
    }
    next();
});

app.use(
    session({
        store: new MySQLStore({
            host: "localhost",
            user: "root",
            password: "1234",
            database: "saturn",
        }),
        secret: "this is top secret!",
        resave: false,
        saveUninitialized: false,
        key: "saturn-sessid",
    })
);

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

//app.use('/rooms/:id', ExpressPeerServer(http, options));

// io.on('connection', socket => {
//     socket.on('join-room', (roomId, userId) => {
//         console.log(roomId,userId)
//         //tell other users we have a new user joined
//         console.log(socket.join(roomId))
//         console.log(socket.to(roomId))
//         socket.to(roomId).broadcast.emit('user-connected', userId) //tells everyone we connected but ourselves
        
//         // socket.on('disconnect', () => {
//         //     socket.to(roomId).broadcast.emit('user-disconnected', userId)
//         // })
//     })
// })
const users = {};

const socketToRoom = {};
io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        console.log("users in server, ", users)
        console.log("usersinthis roomm ", usersInThisRoom)
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});


http.listen(8080, () => {
    console.log("Server Running!");
});
