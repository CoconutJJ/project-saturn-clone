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
const { Server } = require("socket.io");
const User = require("./models/user");

const Sandbox = require('./models/sandbox');
const http = require("http").Server(app);


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




const io = new Server(http, {path: "/pty"});

io.on("connection", async (socket) => {
    console.log("new connection");
    let sb = new Sandbox("alpine");

    let stream = await sb.launchSHShell();

    stream.on("data", (data) => {
        console.log(data.toString());
        socket.emit("response", data.toString());
    })

    socket.on("command", (cmd) => {
        console.log(cmd);
        stream.write(cmd);
    })

    socket.on("disconnect", () => {
        console.log("lost connection");
        sb.destroy();
    })

})

app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});


http.listen(8080, () => {
    console.log("Server Running!");
});
