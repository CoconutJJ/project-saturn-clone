const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const bodyParser = require("body-parser");
const session = require("express-session");
const qlSchema = buildSchema(fs.readFileSync("api.gql").toString());
const MySQLStore = require("express-mysql-session")(session);
const User = require("./models/user");

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

//Mock data base
const users = [];
const documents = []
const userTOdocument = [];
var userId = 0;
var documentId = 0;

const createUser = (firstName, lastName, userName, password, email, id) => {
    return {
        firstName, lastName, userName, password, email, id
    }
}
const createDocument = (name, owner, id) => {
    return { name, owner, guests: [], id };
}
const createUserTOdocument = (userId, documentId, relationship) => ({ userId, documentId, relationship }); //OWNER or GUEST for relationship

app.use(session({
    secret: 'please change this secret',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: true, secure: true }
}));

app.use(function (req, res, next) {
    var username = (req.session.username) ? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,// 1 week in number of seconds
        // httpOnly:true
        sameSite: true,
        secure: true,
    }));
    next();
});

app.use(function (req, res, next) {
    req.username = (req.session && req.session.username) ? req.session.username : '';
    req.userId = (req.username) ? users.find((x) => x.userName === req.username).id : undefined;
    console.log("HTTP request", req.username, req.userId, req.method, req.url, req.body);
    next();
});

var isAuthenticated = function (req, res, next) {
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

// app.use(morgan("dev"));

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

app.post("/signup", (req, res) => {
    users.push(createUser(req.body.firstName, req.body.lastName, req.body.password, req.body.email, userId++));
    req.session.username = req.body.userName;
    res.setHeader('Set-Cookie', cookie.serialize('username', req.body.userName, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.status(200).end();
})

app.post("/login,", (req, res) => {
    if (req.body.userName in Object.keys(users) && req.body.password === users[req.body.userName].password) {
        req.session.username = req.body.userName;
        res.setHeader('Set-Cookie', cookie.serialize('username', req.body.userName, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
        }));
        res.status(200).end();
    }
})

//create a document
app.post("/documents", isAuthenticated, (req, res) => {
    documents.push(createDocument(req.body.name, req.session.username, documentId));
    userTOdocument.push(createUserTOdocument(req.userId, documentId, "OWNER"));
    documentId++;
    res.status(200).json(documents)
})

//get all the documents with a certain relationship to a user
app.get("/documents", isAuthenticated, (req, res) => {
    res.json(documents.filter((x) => x.userId === req.userId && x.relationship === req.body.relationship));
})



app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});


app.listen(8080, () => {
    console.log("Server Running!");
});
