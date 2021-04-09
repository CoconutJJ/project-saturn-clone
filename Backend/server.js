const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const bodyParser = require("body-parser");
const qlSchema = buildSchema(fs.readFileSync("api.gql").toString());
const qlResolver = require("./qlresolver");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const http = require("http");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const Project = require("./models/project");
const Document = require("./models/document");
const Sandbox = require("./models/sandbox");
const shareDb = require("./models/sharedb")
const setShareDbAccess = require("./models/sharedb-access");
const sharedsession = require("express-socket.io-session");
require('dotenv').config();

app.use(morgan("dev"));
app.use(bodyParser.json());
var sessionParser = session({
    store: new MySQLStore({
        host: process.env.sql_host,
        user: process.env.sql_user,
        password: process.env.sql_password,
        database: process.env.sql_database,
    }),
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    key: process.env.session_key,
});
app.use(sessionParser);
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
        rootValue: qlResolver /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);
const webServer = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true, path:"/codepad"});
const { Server } = require("socket.io");
const io = new Server(null, { path: "/pty" });
const io_video = new Server(null, {path: "/video"});
io.attach(webServer);
io_video.attach(webServer);
io_video.use(sharedsession(sessionParser));
webServer.on("upgrade", (request, socket, head) => {
    
    if (request.url.startsWith("/codepad")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    }
});


io.on("connection", async (socket) => {

    let sb = new Sandbox("alpine-sandbox");


    let stream = await sb.launchSHShell();

    let commandRun = false;

    sessionParser(
        socket.request,
        () => {},
        () => {
            let session = socket.request.session;

            socket.on("setfs", async (projectID) => {
                if (await Project.isOwnerOrGuest(session.username, projectID)) {
                    let documents = await Document.get(projectID);
                    for (let d of documents) {
                        let name = await Document.getName(d.id);
                        let data = await Document.getDocumentData(d.id);
                        sb.createMountFile(name, data);
                    }
                } else {
                    socket.disconnect();
                }

            });

            stream.on("data", (data) => {
                if (commandRun) {
                    commandRun = false;
                    return;
                }

                socket.emit("response", data.toString());
            });

            socket.on("command", (cmd) => {
                commandRun = true;
                stream.write(cmd);
            });

            socket.on("makedir", (dirname) => {
                sb.makeMountDir(dirname);
            });

            socket.on("makefile", (filename) => {
                sb.createMountFile(filename, "");
            });

            socket.on("disconnect", () => {
                sb.destroy();
                socket.disconnect();
            });
        }
    );
});

const users = {};
const rooms = {};

io_video.on('connection', socket => {
    console.log(`New connection: ${socket.id}`);
    let username = socket.handshake.session.username;
    if (users[username]) {
        console.error(`${username} is already connected`);
        socket.disconnect();
    }

    users[username] = socket;
    socket.username = username;

    socket.on("join room", roomID => {
        console.log(`${socket.id} has joined room ${roomID}`);
        if (!rooms[roomID]) {
            rooms[roomID] = {};
        }

        if (rooms[socket.roomID] && rooms[socket.roomID][socket.id]) {
            socket.in(socket.roomID).emit("user left", socket.id);
            delete rooms[socket.roomID][socket.id];
        }

        socket.emit("all users", Object.keys(rooms[roomID]));
        rooms[roomID][socket.id] = socket;
        socket.join(roomID);
        socket.roomID = roomID;
    });

    socket.on("sending signal", payload => {
        console.log(`${socket.id} starting connection with ${payload.callerID}`);
        io_video.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        console.log(`${socket.id} - ${payload.callerID}: COMPLETE`);
        io_video.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} has left room ${socket.roomID}`);
        users[username] = null;
    
        if (rooms[socket.roomID]) {
            if (rooms[socket.roomID][socket.id]) {
                delete rooms[socket.roomID][socket.id];
            }

            if (Object.keys(rooms[socket.roomID]).length) {
                socket.to(socket.roomID).emit("user left", socket.id);
            } else {
                delete rooms[socket.roomID];
            }
        }
    });

});
wss.on("connection", function (ws, req) {
    sessionParser(req, {}, function () {
        if (req.session.username) {
            var stream = new WebSocketJSONStream(ws);
            shareDb.listen(stream, req.session);
        }
    });
});

shareDb.use("connect", (request, next) => {
    if (request.req) request.agent.connectSession = request.req;
    next();
});

app.get("/:path?(*)", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

const serverInit = async () => {
    let projectIDs = await Project.getProjectIDs();
    projectIDs.map(({ id }) => setShareDbAccess(id));
};

serverInit().then(() => webServer.listen(8080)).then(()=>console.log("Server started!"));

//Citation
//createDocInShareDb() and wss configurations are modifications from the shareDB textarea example
/***************************************************************************************
 *    Title: Collaborative Textarea with ShareDB
 *    Author: Alec Gibson
 *    Date: 2020-04-20
 *    Availability: https://github.com/share/sharedb/tree/master/examples/textarea
 *
 ***************************************************************************************/

//User access middleware usage inspired by issue
/***************************************************************************************
 *    Title: How do I "setup" a session.
 *    Author: julienmachon
 *    Date: 2018-02-11
 *    Availability: https://github.com/dmapper/sharedb-access/issues/8
 *
 ***************************************************************************************/

//Citation
// Socket layout is inspired and from Group Video Final Example
/***************************************************************************************
 *    Title: Group Video Call
 *    Author: coding-with-chaim
 *    Date: 2020-05-14
 *    Availability: https://github.com/coding-with-chaim/group-video-final
 *
 ***************************************************************************************/
