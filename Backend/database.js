const mysql = require("mysql");

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "1234",
            database: "saturn",
        });

        this.transactionContext = false;
    }

    async _connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) reject(err);

                resolve();
            });
        });
    }

    async _disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        });
    }

    async query(sql, params = []) {
        return new Promise((resolve, reject) => {

            if (!this.transactionContext) await this._connect();

            this.connection.query(sql, params, (err, results, fields) => {
                await this._disconnect();
                if (err) {
                    reject(err);
                    return;
                }

                resolve([results, fields]);
            });
        });
    }

    async startTransaction() {
        if (this.transactionContext) return Promise.resolve();

        return new Promise((resolve, reject) => {
            await this._connect();
            this.connection.beginTransaction((err) => {
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

        return new Promise((resolve, reject) => {
            this.connection.commit((err) => {
                await this._disconnect();
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
        this.connection.rollback((err) => {
            await this._disconnect();
            this.transactionContext = false;
            if (err) reject(err);
        });
    }
}
