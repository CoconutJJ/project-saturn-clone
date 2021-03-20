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
const cookie = require('cookie');

const http = require('http');
const ShareDB = require('sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

const shareDb = new ShareDB();

function createDocInShareDb(id) {
    var connection = shareDb.connect();
    var doc = connection.get('documents', id);
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

//Mock data base
const users = [];
const documents = []
const userTOdocument = [];
var documentId = 0;

const createUser = (firstName, lastName, userName, password, email) => {
    return {
        firstName, lastName, userName, password, email
    }
}
const createDocument = (name, owner, id) => {
    return { name, owner, id };
}
const createUserTOdocument = (userName, documentId, relationship) => ({ userName, documentId, relationship }); //OWNER or GUEST for relationship

app.use("/static", express.static(path.join(__dirname, "../Frontend/dist")));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use("/ql", (req, res) =>
    graphqlHTTP({
        schema: qlSchema /* GraphQL Schema */,
        rootValue: root /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);

app.post("/signup", (req, res) => {
    users.push(createUser(req.body.firstName, req.body.lastName, req.body.userName, req.body.password, req.body.email));
    res.status(200).end();
})

app.post("/login,", (req, res) => {

})

//create a document
app.post("/documents", (req, res) => {
    documents.push(createDocument(req.body.name, req.body.userName, documentId.toString()));
    userTOdocument.push(createUserTOdocument(req.body.userName, documentId.toString(), "OWNER"));
    createDocInShareDb(documentId.toString());
    documentId++;
    res.status(200).end();
})

//update a document
app.patch("/documents",(req,res)=>{
    const op = "ADD_GUEST";
    if(op === "ADD_GUEST"){
        userTOdocument.push(createUserTOdocument(req.body.guestUserName,req.body.id,"GUEST"));
    }
})

//get all the documents with a certain relationship to a user
app.get("/documents/:username", (req, res) => {
    const relationship = (Object.keys(req.query).includes("relationship")) ? req.query.relationship : undefined;
    console.log(relationship);
    console.log(userTOdocument);
    const docs = userTOdocument.filter((x) => x.userName === req.params.username && x.relationship === relationship);
    
    docs.forEach((doc) => {
        doc.name = documents.find((x) => x.id === doc.documentId).name;
    })

    return res.json(docs);
})

app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});


const server = http.createServer(app);

const wss = new WebSocket.Server({ server: server });
wss.on('connection', function (ws) {
    console.log("user connected");
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
