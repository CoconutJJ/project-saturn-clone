
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const app = express();

const { graphqlHTTP } = require("express-graphql");
const {buildSchema} = require("graphql");
const bodyParser = require("body-parser");
const qlSchema = buildSchema(fs.readFileSync("api.gql").toString());



const root = {
    
}

app.use(morgan("dev"));

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../Frontend/dist")))

app.use("/ql", (req, res) =>
    graphqlHTTP({
        schema: qlSchema /* GraphQL Schema */,
        rootValue: root /* Query Resolver */,
        graphiql: true /* Allows for interactive GraphQL in browser */,
        context: { req, res },
    })(req, res)
);

app.listen(8080, () => {
    console.log("Server Running!")
})