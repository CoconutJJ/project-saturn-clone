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

}

module.exports = Project;
