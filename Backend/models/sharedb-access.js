const shareDb = require("./sharedb")
const Project = require("./project");
const setShareDbAccess = (projectID) => {
    //Document & project access restrictions
    shareDb.allowUpdate(
        projectID.toString(),
        async (docId, oldDoc, newDoc, ops, session) => {
            return await Project.isOwnerOrGuest(session.username, projectID);
        }
    );
    shareDb.allowUpdate(
        projectID.toString(),
        async (docId, oldDoc, newDoc, ops, session) => {
            return await Project.isOwnerOrGuest(session.username, projectID);
        }
    );
    shareDb.allowRead(projectID.toString(), async (docId, doc, session) => {
        return await Project.isOwnerOrGuest(session.username, projectID);
    });
};

module.exports = setShareDbAccess;