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
     *  Share a project with a user.
     * @param {string} uname
     * @param {int} projectID   
     */
    static async share(uname, projectID) {
        const output = {
            isShared: false,
            error: undefined,
        };

        let [countOwnerResults, fields] = await Project.db.query(
            "SELECT COUNT(*) as count FROM projects WHERE id = ? AND owner = ?",
            [projectID, uname]);
        if (parseInt(countOwnerResults[0].count) > 0) {
            output.error = Error(
                `You are already the owner of this project.`
            );
            output.error.status = 400;
            return output;
        }

        let [
            countGuestResults,
            _,
        ] = await Project.db.query(
            "SELECT COUNT(*) as count FROM projectsToSharedUsers WHERE projectID = ? AND uname = ?",
            [projectID, uname]
        );
        if (parseInt(countGuestResults[0].count) > 0) {
            output.error = Error(
                `This project is already shared with user ${uname}.`
            );
            output.error.status = 400;
        } else {

            let [results, fields] = await Project.db.query(
                "INSERT INTO projectsToSharedUsers (uname,projectID) VALUES (?,?)",
                [uname, projectID]);
            output.isShared = results.affectedRows != 0;
        }
        return output;
    }

    /**
     *  Unshare a project with a user.
     * @param {string} uname
     * @param {int} projectID   
     */
    static async unShare(uname, projectID) {
        let [results, fields] = await Project.db.query(
            "DELETE FROM projectsToSharedUsers WHERE projectID = ? AND uname = ?",
            [projectID, uname]);
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
        } else if (relationship == "shared") {
            let [results, fields] = await Project.db.query(
                `SELECT * FROM projectsToSharedUsers
                LEFT JOIN projects
                ON projectsToSharedUsers.projectID = projects.id
                WHERE uname = ?`,
                [username]);
            return results;
        }
        return [];
    }

    /**
     *  Get an array of all project ids
     */
    static async getProjectIDs() {
        let [results, fields] = await Project.db.query(
            "SELECT id FROM projects",
            []);
        return results;
    }

    /**
     *  Get an array of guests of a specific project
     * @param {int} projectID
     */
    static async getGuests(projectID) {
        let [results, fields] = await Project.db.query(
            "SELECT * FROM projectsToSharedUsers WHERE projectID = ?",
            [projectID]);
        return results;
    }

    /**
     *  Check if a user is an owner of a project
     * @param {string} username  
     * @param {int} projectID  
     */
    static async isOwner(username, projectID) {
        let result = await Project.get("owned", username);
        let project = result.find((x) => x.id == projectID);
        return project != undefined;
    }

    /**
     *  Check if a user is a guest of a project
     * @param {string} username  
     * @param {int} projectID  
     */
    static async isGuest(username, projectID) {
        let result = await Project.get("shared", username);
        let project = result.find((x) => x.id == projectID);
        return project != undefined;
    }

    /**
     *  Check if a user is a guest OR owner of a project
     * @param {string} username  
     * @param {int} projectID  
     */
    static async isOwnerOrGuest(username, projectID) {
        return await Project.isOwner(username, projectID) || await Project.isGuest(username, projectID);
    }
}

module.exports = Project;