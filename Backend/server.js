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
const Project = require("./models/project");

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
            console.log(e);
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
            console.log("createProject",context.req.session);
            if ( context.req.session.username !== undefined &&
                context.req.session.username !== null) {
                   return await Project.create(name,env, context.req.session.username); 
            }else{
                return false;
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
    } else {
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


app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(8080, () => {
    console.log("Server Running!");
});
