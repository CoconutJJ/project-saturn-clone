const mysql = require("mysql");

class Database {

    static pool = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "saturn",
        connectionLimit: 5
    });

    constructor() {
        this.transactionContext = false;
    }

    /**
     *
     * @param {string} sql
     * @param {string[]} params
     * @returns {Promise<[object[], mysql.FieldInfo[]]>}
     */
    async query(sql, params = []) {
        return new Promise(async (resolve, reject) => {

            Database.pool.query(sql, params, async (err, results, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve([results, fields]);
            });
        });
    }

    async startTransaction() {
        if (this.transactionContext) return Promise.resolve();

        return new Promise(async (resolve, reject) => {
            Database.pool.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.transactionContext = true;
                resolve();
            });
        });
    }

    async endTransaction() {
        if (!this.transactionContext) return Promise.resolve();

        return new Promise(async (resolve, reject) => {
            Database.pool.commit(async (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.transactionContext = false;
                resolve();
            });
        });
    }

    async rollback() {
        Database.pool.rollback(async (err) => {
            this.transactionContext = false;
            if (err) reject(err);
        });
    }
}
module.exports = Database;
