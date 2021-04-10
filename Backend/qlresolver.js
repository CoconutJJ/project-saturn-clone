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
                return Error("Invalid credentials");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
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
            return Error("Internal server error");
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
                return Error("Invalid arguments");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
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
                return Error("Access Denied. Please log in.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
    shareProject: async ({ uname, projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwner(context.req.session.username, projectID))
            ) {
                let result = await Project.share(uname, projectID);
                if (result.isShared) {
                    return true;
                } else {
                    context.res.status(result.error.status);
                    return result.error;
                }
            } else {
                context.res.status(403);
                return Error("Access Denied. Only project owners can share projects.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
    unShareProject: async ({ uname, projectID }, context) => {
        try {
            if (
                context.req.loggedIn &&
                (await Project.isOwner(context.req.session.username, projectID))
            ) {
                return await Project.unShare(uname, projectID);
            } else {
                context.res.status(403);
                return Error("Access Denied. Only project owners can unshare projects.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
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
                return Error("Access Denied. Only project owners and participants can create documents.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
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
                return Error("Access Denied. Please log in.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
    getProject: async ({ projectID }, context) => {
        try {
            return await Project.getProject(projectID);
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
    getUserProjects: async ({ relationship }, context) => {
        try {
            if (context.req.loggedIn) {
                let data = await Project.getUserProjects(
                    relationship,
                    context.req.session.username
                );
                return data;
            } else {
                context.res.status(403);
                return Error("Access Denied. Please log in.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
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
                return Error("Access Denied. Only project owners and participants can see documents.");
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
};

module.exports = root;
