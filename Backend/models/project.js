const Database = require("../database");
const Model = require("./model");
class Project {

    static db = new Database();

    /**
     *  Create a new project.
     * @param {string} name
     * @param {string} env   //environment of the project
     * @param {string} owner //username of the project owner
     */
    static async create(name, env, owner) {
        let [results, fields] = await Project.db.query(
            "INSERT INTO projects (name,env,owner) VALUES (?,?,?)",
            [name, env, owner]);
        return results.affectedRows != 0;
    }

    /**
     *  Get an array of projects with specific relationship to a user.
     * @param {string} relationship
     * @param {string} username  
     */
    static async get(relationship, username) {
        if (relationship == "owned") {
            let [results, fields] = await Project.db.query(
                "SELECT * FROM projects WHERE owner = ?",
                [username]);
            return results;
        }
        return[];
    }

}

module.exports = Project;
