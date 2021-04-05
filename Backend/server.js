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

const http = require("http");
const ShareDB = require("sharedb");
const WebSocket = require("ws");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const User = require("./models/user");
const Project = require("./models/project");
const Document = require("./models/document");
const shareDbAccess = require("sharedb-access");
const sharedSession = require("express-socket.io-session");
const Sandbox = require("./models/sandbox");

const mysqlOptions = {
    db: {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "saturn",
        connectionLimit: 5,
    },
    ops_table: "shareDbOps",
    snapshots_table: "shareDbSnapShots",
    debug: false,
};
const mySQLDB = require("sharedb-mysql")(mysqlOptions);

const shareDb = new ShareDB({ db: mySQLDB });

shareDbAccess(shareDb);

const setShareDbAccess = (projectID) => {
    //Document & project access restrictions
    shareDb.allowCreate(projectID.toString(), async (docId, doc, session) => {
        return await Project.isOwnerOrGuest(session.username, projectID)
    })
    shareDb.allowUpdate(projectID.toString(), async (docId, oldDoc, newDoc, ops, session) => {
        return await Project.isOwnerOrGuest(session.username, projectID)
    });
    shareDb.allowUpdate(
        projectID.toString(),
        async (docId, oldDoc, newDoc, ops, session) => {
            console.log("update");
            return await Project.isOwnerOrGuest(session.username, projectID);
        }
    );
    shareDb.allowRead(projectID.toString(), async (docId, doc, session) => {
        console.log("read");
        return await Project.isOwnerOrGuest(session.username, projectID);
    });
    shareDb.allowDelete(projectID.toString(), async (docId, doc, session) => {
        
        console.log("delete");
        return await Project.isOwnerOrGuest(session.username, projectID);
    });
}

function createDocInShareDb(projectID, documentID) {
    var connection = shareDb.connect();
    var doc = connection.get(projectID.toString(), documentID.toString());
    doc.fetch(function (err) {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({ content: "" });
        }
    });
    setShareDbAccess(projectID);
}

const root = {
    loginUser: async ({ username, password }, context) => {
        try {
            if (await User.authenticate(username, password)) {
                context.req.session.username = username;
                return true;
            } else {
                context.res.status(401);
                return Error("Invalid Credentials");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    logoutUser: async ({ }, context) => {
        context.req.session.destroy();
        res.cookie("userdata", "", { maxAge: 0, sameSite: "strict" });

        return true;
    },
    loggedIn: ({ }, context) => {
        try {
            return (
                context.req.session.username !== undefined &&
                context.req.session.username !== null
            );
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    signUpUser: async (
        { firstname, lastname, username, password, email },
        context
    ) => {
        try {
            if (
                await User.create(
                    firstname,
                    lastname,
                    username,
                    password,
                    email
                )
            ) {
                context.req.session.username = username;
                return true;
            } else {
                context.res.status(400);
                return Error("Invalid Arguments");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    createProject: async ({ name, env }, context) => {
        try {
            if (context.req.loggedIn) {
                return await Project.create(
                    name,
                    env,
                    context.req.session.username
                );
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    shareProject: async ({ uname, projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwner(context.req.session.username, projectID))
            ) {
                return await Project.share(uname, projectID);
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    createDocument: async ({ name, projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwnerOrGuest(
                    context.req.session.username,
                    projectID
                ))
            ) {
                let result = await Document.create(name, projectID);
                if (result.isCreated) {
                    createDocInShareDb(projectID, result.documentID);
                } else {
                    context.res.status(result.error.status);
                    return result.error;
                }
                return true;
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    getProjectGuests: async ({ projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwnerOrGuest(
                    context.req.session.username,
                    projectID
                ))
            ) {
                return await Project.getGuests(projectID);
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    getProjects: async ({ relationship }, context) => {
        try {
            if (context.req.loggedIn) {
                let data = await Project.get(
                    relationship,
                    context.req.session.username
                );
                return data;
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
    getDocuments: async ({ projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwnerOrGuest(
                    context.req.session.username,
                    projectID
                ))
            ) {
                return await Document.get(projectID);
            } else {
                context.res.status(403);
                return Error("Access Denied");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal Server Error");
        }
    },
};

app.use(morgan("dev"));
app.use(bodyParser.json());

var sessionParser = session({
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
        rootValue: root /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);
const webServer = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(null, { path: "/pty" });
io.attach(webServer);
io.use(
    sharedSession(session, {
        secret: "this is top secret!",
        resave: false,
        saveUninitialized: false,
    })
);

const wss = new WebSocket.Server({ noServer: true });

webServer.on("upgrade", (request, socket, head) => {
    // console.log(request, socket, head);
    if (!request.url.startsWith("/pty")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    }
});

io.on("connection", async (socket) => {
    console.log("new connection");
    console.log(socket.request.session);

    let sb = new Sandbox("alpine-sandbox");


    let stream = await sb.launchSHShell();

    socket.handshake.session.mountPath = sb.mountPath;

    socket.on("initialize", async (projectID) => {
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
        socket.emit("response", data.toString());
    });

    socket.on("command", (cmd) => {
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
        socket.handshake.session.mountPath = null;
        socket.disconnect();
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

const serverInit = async()=>{
    let projectIDs = await Project.getProjectIDs();
    projectIDs.map(({id})=>setShareDbAccess(id));
}

serverInit().then(()=>webServer.listen(8080));

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
