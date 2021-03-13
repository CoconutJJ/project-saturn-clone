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

const root = {
    loginUser: async ({ username, password }, context) => {
        try {
            return await User.authenticate(username, password);
        } catch (e) {
            console.log(e);
            throw Error("Internal Server Error");
        }
    },
    signUpUser: async ({ firstname, lastname, username, password, email }) => {
        try {
            await User.create(firstname, lastname, username, password, email);
        } catch (e) {
            throw Error("Internal Server Error");
        }
    },
};

app.use(morgan("dev"));

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

app.get("/:path?", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(8080, () => {
    console.log("Server Running!");
});
