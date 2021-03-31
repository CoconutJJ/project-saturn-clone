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

const Interrupts = require("./interrupts");
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
// console.log(mySQLDB)
const shareDb = require('sharedb')({ db: mySQLDB })
// console.log(shareDb)
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
    signUpUser: async ({ firstname, lastname, username, password, email }) => {
        try {
            if(await User.create(firstname, lastname, username, password, email)){
                context.req.session.username = username;
                return true;
            }else{
                return false;
            }
        } catch (e) {
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
    getProjects: async ({ relationship }, context) => {
        try {
            if (context.req.loggedIn) {
                return await Project.get(relationship, context.req.session.username);
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

const { Server } = require("socket.io");
const io = new Server(http, {path: "/pty"});

io.on("connection", async (socket) => {
    
    console.log("new connection");

    let sb = new Sandbox("alpine-sandbox");

    let stream = await sb.launchSHShell();

    stream.on("data", (data) => {
        socket.emit("response", data.toString());
    })

    socket.on("command", (cmd) => {
        stream.write(cmd);
    })

    socket.on("disconnect", () => {
        sb.destroy();
    })

})

app.get("/:path?(*)", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

// Interrupts.init();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
    var stream = new WebSocketJSONStream(ws);
    shareDb.listen(stream);
});
server.listen(8080);
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