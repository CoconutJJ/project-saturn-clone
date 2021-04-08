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

module.exports = shareDb;

