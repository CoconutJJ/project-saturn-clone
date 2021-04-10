const User = require("./models/user");
const Project = require("./models/project");
const Document = require("./models/document");
const { createDocInShareDb } = require("./models/sharedb");
const validator = require('validator');

const inputValidation = (req) => {
    for (let i = 0; i < req.length; i++) {
        if (!req[i].condition) {
            return req[i].error
        }
    }
}


const root = {
    loginUser: async ({ username, password }, context) => {
        try {
            let inputError = inputValidation([
                { condition: !validator.isEmpty(username) && validator.isAlphanumeric(username) && validator.escape(username) == username, error: new Error("Username must be alphanumeric.") },
            ])
            if (!inputError) {
                let result = await User.authenticate(username, password)
                if (result) {
                    context.req.session.username = username;
                    return true;
                } else {
                    context.res.status(401);
                    return Error("Invalid credentials.");
                }
            } else {
                context.res.status(400);
                return Error(inputError.message);
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
            let inputError = inputValidation([
                { condition: validator.isEmail(email), error: new Error("Invalid email.") },
                { condition: !validator.isEmpty(firstname) && validator.isAlpha(firstname) && validator.escape(firstname) == firstname, error: new Error("Invalid firstname.") },
                { condition: !validator.isEmpty(lastname) && validator.isAlpha(lastname) && validator.escape(lastname) == lastname, error: new Error("Invalid lastname.") },
                { condition: !validator.isEmpty(username) && validator.isAlphanumeric(username) && validator.escape(username) == username, error: new Error("Username must be alphanumeric.") },
                //regex from https://www.w3schools.com/howto/howto_js_password_validation.asp
                { condition: !validator.isEmpty(password) && /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password), error: new Error("Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.") }
            ])
            if (!inputError) {
                let result = await User.create(
                    firstname,
                    lastname,
                    username,
                    password,
                    email
                )
                if (result.isCreated) {
                    context.req.session.username = username;
                    return true;
                }
                else {
                    context.res.status(400);
                    return Error(result.error.message);
                }
            } else {
                context.res.status(400);
                return Error(inputError.message);
            }
        } catch (e) {
            console.error(e);
            context.res.status(500);
            return Error("Internal server error");
        }
    },
    createProject: async ({ name, env }, context) => {
        try {
            let inputError = inputValidation([
                { condition: !validator.isEmpty(name) && validator.isAlphanumeric(name) && validator.escape(name) == name, error: new Error("Project names must be alphanumeric.") },
                { condition: env === "python" || env === "c", error: new Error(`Project environment must be "python" or "c".`) },
            ])
            if (context.req.loggedIn) {
                if (!inputError) {
                    return await Project.create(
                        name,
                        env,
                        context.req.session.username
                    );
                } else {
                    context.res.status(400);
                    return Error(inputError.message);
                }
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
            let inputError = inputValidation([
                //regex from https://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
                { condition: !validator.isEmpty(name) && /^[^\\/:\*\?"<>\|]+$/.test(name), error: new Error(`Document names must not contain the symbols \ / : * ? \" < > |`) },
            ])
            if(inputError){
                context.res.status(400);
                return inputError;
            }
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
