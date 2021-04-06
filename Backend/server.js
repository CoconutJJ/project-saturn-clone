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

const http = require('http');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const User = require("./models/user");
const Project = require("./models/project");
const Document = require("./models/document");

const Sandbox = require('./models/sandbox');
const sharedsession = require("express-socket.io-session");
const mysqlOptions = {
    db: {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "saturn",
        connectionLimit: 5
    },
    ops_table: 'shareDbOps', snapshots_table: 'shareDbSnapShots', debug: true
};
const mySQLDB = require('sharedb-mysql')(mysqlOptions);

const shareDb = new ShareDB({ db: mySQLDB })

function createDocInShareDb(projectID, documentID) {
    var connection = shareDb.connect();
    var doc = connection.get(projectID.toString(), documentID.toString());
    doc.fetch(function (err) {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({ content: '' });
        }
    });

}

const root = {
    loginUser: async ({ username, password }, context) => {
        try {
            if (await User.authenticate(username, password)) {
                context.req.session.username = username;
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            throw Error("Internal Server Error");
        }
    },
    loggedIn: ({ }, context) => {
        return (
            context.req.session.username !== undefined &&
            context.req.session.username !== null
        );
    },
    signUpUser: async ({ firstname, lastname, username, password, email }, context) => {
        try {
            if(await User.create(firstname, lastname, username, password, email)){
                context.req.session.username = username;
                return true;
            }else{
                return false;
            }
        } catch (e) {
            console.log(e);
            throw Error("Internal Server Error");
        }
    },
    createProject: async ({name,env}, context) => {
        try {
            if (context.req.loggedIn) {
                return await Project.create(name, env, context.req.session.username);
            } else {
                return false;
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
    shareProject: async ({uname,projectID}, context) => {
        try {
            if (context.req.loggedIn) {
                return await Project.share(uname,projectID);
            } else {
                return false;
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
    createDocument: async ({ name, projectID }, context) => {
        try {
            if (context.req.loggedIn) {
                let result = await Document.create(name, projectID);
                if (result.isCreated) {
                    createDocInShareDb(projectID, result.documentID);
                }
                return true;
            } else {
                return false;
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
    getProjectGuests: async ({ projectID }, context) => {
        try {
            if (context.req.loggedIn) {
                return await Project.getGuests(projectID);
            } else {
                return [];
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
    getProjects: async ({ relationship }, context) => {
        try {
            if (context.req.loggedIn) {
               let data= await Project.get(relationship, context.req.session.username);
                console.log(data);
                return data;
            } else {
                return [];
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
    getDocuments: async ({ projectID }, context) => {
        try {
            if (context.req.loggedIn) {
                return await Document.get(projectID);
            } else {
                return [];
            }
        } catch (e) {
            throw Error("Internal Server Error");
        }
    }
};


app.use(morgan("dev"));
app.use(bodyParser.json());

var newsession = session({
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
 
app.use(
    newsession
);


// app.use(
//     session({
//         store: new MySQLStore({
//             host: "localhost",
//             user: "root",
//             password: "1234",
//             database: "saturn",
//         }),
//         secret: "this is top secret!",
//         resave: false,
//         saveUninitialized: false,
//         key: "saturn-sessid",
//     })
// );

app.use((req, res, next) => {
    if (req.session.username == undefined || req.session.username == null) {
        res.cookie("userdata", "", { maxAge: 0, sameSite: "strict" });
        req.loggedIn = false;
    } else {
        req.loggedIn = true;
        res.cookie(
            "userdata",
            JSON.stringify({
                username: req.session.username,
            }),
            {
                maxAge: 10e9,
                sameSite: "strict",
            }
        );
    }
    next();
});

app.use("/static", express.static(path.join(__dirname, "../Frontend/dist")));

app.use("/ql", (req, res) =>
    graphqlHTTP({
        schema: qlSchema /* GraphQL Schema */,
        rootValue: root /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);
const webServer = http.createServer(app);

const { Server } = require("socket.io")

const io_term = new Server(null, {path: "/pty"});
const io_video = new Server(null, {path: "/video"});

io_term.attach(webServer);
io_video.attach(webServer);
io_video.use(sharedsession(newsession));

const wss = new WebSocket.Server({ noServer: true, path: "/codepad"});


webServer.on("upgrade", (request, socket, head) => {
    //console.log(request, socket, head)
    // if (request.url.startsWith("/pty")) {
    //     io_term.handleUpgrade(request, socket, head, (ws) => {
    //         io_term.emit("connection", ws, request)
    //     })

    // }
    // else if (request.url.startsWith("/video")) {
    //     io_video.handleUpgrade(request, socket, head, (ws) => {
    //         io_video.emit("connection", ws, request)
    //     })
 
    // }
    if (request.url.startsWith("/codepad")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request)
        })

    }
})





const users = {};

const socketToRoom = {};

const loggedin = {};

io_term.on("connection", async (socket) => {
    
    console.log("new connection");

    let sb = new Sandbox("alpine-sandbox");

    let stream = await sb.launchSHShell();

    stream.on("data", (data) => {
        socket.emit("response", data.toString());
    })

    socket.on("command", (cmd) => {
        console.log(cmd);
        stream.write(cmd);
    })

    socket.on("makedir", (dirname) => {
        sb.makeMountDir(dirname);
    })

    socket.on("makefile", (filename) => {
        sb.createMountFile(filename, "");
    })

    

    
    socket.on("disconnect", () => {
        sb.destroy();
        socket.disconnect();
    })


})


io_video.on('connection', socket => {
    console.log("new room connection")
    // let username = socket.handshake.session.username;
    // socket.on("join room", roomID => {
    //     console.log("users", users)
    //     if (users[roomID]) {
    //         if(users[roomID].indexOf(username) == -1) {
    //             users[roomID].push(username);
    //         }
            
    //     } else {
    //         users[roomID] = [username];
    //     }
    //     socketToRoom[username] = roomID;
    //     console.log("sockettoroom", socketToRoom)
    //     // const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
    //     const usersInThisRoom = users[roomID];
    //     console.log("users in server, ", users)
    //     console.log("usersinthis roomm ", usersInThisRoom)
    //     socket.emit("all users", usersInThisRoom);
    // });

    // socket.on("sending signal", payload => {
    //     console.log("sending signal", payload.callerID)
    //     io_video.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    // });

    // socket.on("returning signal", payload => {
    //     console.log("receving returned signal", payload.callerID)
    //     console.log("receving returned signal", username)
    //     io_video.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: username });
    // });

    // socket.on('disconnect', () => {
    //     const roomID = socketToRoom[username];
    //     let room = users[roomID];
    //     console.log("room", room)
    //     console.log("socket to room", socketToRoom)
    //     if (room) {
    //         room = room.filter(id => id !== username);
    //         users[roomID] = room;
    //     }
    // });
    let username = socket.handshake.session.username;
    socket.on("join room", roomID => {

        if (users[roomID]) {
            if(loggedin[roomID].indexOf(username) == -1) {
                console.log("inside login", loggedin)
                loggedin[roomID].push(username)
                users[roomID].push(socket.id);

            }
            
                    
        } else {
            loggedin[roomID] = [username];
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        console.log("loggedin", loggedin)
        console.log("users", users)
        console.log("in room", usersInThisRoom)
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        console.log("sending signal", payload.callerID)
        io_video.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        console.log("receving returned signal", payload.callerID)
        console.log("receving returned signal", socket.id)
        io_video.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log("disconnect user")   
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        let loggers = loggedin[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            loggers = loggers.filter(id => id !== username);
            users[roomID] = room;
            loggedin[roomID] = loggers;
        }
        socket.broadcast.emit("user left",socket.id);

        // const roomID = socketToRoom[socket.id];
        // let usersinroom = users[roomID];
        // let loggers = loggedin[roomID]
        // if (usersinroom) {
        //     usersinroom = usersinroom.filter(id => id !== socket.id);
        //     loggers = loggers.filter(id => id !== username);
        //     users[roomID] = usersinroom;
        //     loggedin[roomID] = loggers;
        //     delete socketToRoom[socket.id]
            
        // }
        console.log("users now:", users)
        console.log("loggedin now:", loggedin)
        console.log("socketroom", socketToRoom)
        socket.broadcast.emit("user left",socket.id);
    });

});



wss.on('connection', function (ws) {
    var stream = new WebSocketJSONStream(ws);
    shareDb.listen(stream);
});

app.get("/:path?(*)", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});


webServer.listen(8080);
console.log("Server Running!");

//Citation

//createDocInShareDb() and wss configurations are modifications from the shareDB textarea example
/***************************************************************************************
*    Title: Collaborative Textarea with ShareDB
*    Author: Alec Gibson
*    Date: 202-04-20
*    Availability: https://github.com/share/sharedb/tree/master/examples/textarea
*
***************************************************************************************/


// socket.on("join room", roomID => {
//         if (users[roomID]) {
//             users[roomID].push(socket.id);
//         } else {
//             users[roomID] = [socket.id];
//         }
//         socketToRoom[socket.id] = roomID;
//         const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
//         console.log("users in server, ", users)
//         console.log("usersinthis roomm ", usersInThisRoom)
//         socket.emit("all users", usersInThisRoom);
//     });

//     socket.on("sending signal", payload => {
//         io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
//     });

//     socket.on("returning signal", payload => {
//         io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//     });

//     socket.on('disconnect', () => {
//         const roomID = socketToRoom[socket.id];
//         let room = users[roomID];
//         if (room) {
//             room = room.filter(id => id !== socket.id);
//             users[roomID] = room;
//         }
//     });