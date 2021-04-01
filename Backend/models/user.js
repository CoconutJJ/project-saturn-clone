const Database = require("../database");
const Model = require("./model");
const crypto = require("crypto");
class User {

    static db = new Database();

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<boolean>}
     */
    static async authenticate(username, password) {
        let [results, fields] = await User.db.query("SELECT * FROM users WHERE uname = ?", [username]);
        if (results.length == 0) {
            return false;
        }
        return User._verifyPassword(password, results[0]["pword"], results[0]["salt"])  
    }

    /**
     *  Create a new user.
     * @param {string} firstname 
     * @param {string} lastname 
     * @param {string} username 
     * @param {string} password 
     * @param {string} email 
     */
    static async create(firstname, lastname, username, password, email) {

        let [hashedPassword, salt] = User._hashPassword(password);

        let [results, _] = await User.db.query("SELECT COUNT(*) as count FROM users WHERE username = ?", [username]);

        if (parseInt(results[0].count) > 0) {
            return false;
        }

        [results, _] = await User.db.query(
            "INSERT INTO users (fname, lname, uname, pword, salt, email) VALUES (?,?,?,?,?,?)",
            [firstname, lastname, username, hashedPassword, salt, email]);
        return results.affectedRows != 0;
    }

    /**
     * @param {string} password
     * @returns {[string, string]} [hashedPassword, salt]
     */
    static _hashPassword(password) {
        
        let salt = crypto.randomBytes(16);

        let hash = crypto.createHmac("sha256", salt);

        hash.update(password);

        let hashedPassword = hash.digest("hex");

        return [hashedPassword, salt.toString("hex")];
    }

    /**
     * @param {string} plainPassword 
     * @param {string} hashedPassword 
     * @param {string} salt 
     * @returns {boolean}
     */
    static _verifyPassword(plainPassword, hashedPassword, salt) {

        let hash = crypto.createHmac("sha256", Buffer.from(salt, "hex"));

        hash.update(plainPassword);

        return hash.digest("hex") === hashedPassword;
    }

}

module.exports = User;
