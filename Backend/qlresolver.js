const User = require("./models/user");
const Project = require("./models/project");
const Document = require("./models/document");
const shareDb = require("./models/sharedb");
const setShareDbAccess = require("./models/sharedb-access");

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
    logoutUser: async ({}, context) => {
        context.req.session.destroy();
        res.cookie("userdata", "", { maxAge: 0, sameSite: "strict" });

        return true;
    },
    loggedIn: ({}, context) => {
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

module.exports = root;
