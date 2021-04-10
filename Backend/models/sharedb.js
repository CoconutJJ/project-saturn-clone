const ShareDB = require("sharedb");
const shareDbAccess = require("sharedb-access");
const mysqlOptions = {
    db: {
        host: "localhost",
        user: "root",
        password: "1234",
        database: "saturn",
        connectionLimit: 5,
    },
    ops_table: "shareDbOps",
    snapshots_table: "shareDbSnapShots",
    debug: false,
};
const mySQLDB = require("sharedb-mysql")(mysqlOptions);

const shareDb = new ShareDB({ db: mySQLDB });

shareDbAccess(shareDb);
const Project = require("./project");

function setShareDbAccess (projectID) {
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

module.exports = {shareDb,createDocInShareDb,setShareDbAccess};

