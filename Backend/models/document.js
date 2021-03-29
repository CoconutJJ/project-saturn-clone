const Database = require("../database");
const Model = require("./model");
class Document {

    static db = new Database();

    /**
     *  Create a new document for a specific project.
     * @param {string} name
     * @param {int} projectID  //project id
     */
    static async create(name, projectID) {
        let [results, fields] = await Document.db.query(
            "INSERT INTO documents (name,projectID) VALUES (?,?)",
            [name, projectID]);
        return { isCreated : results.affectedRows != 0, documentID : results.insertId};
    }
    
    /**
     *  Get an array of documents from a specific project.
     * @param {int} projectID 
     */
    static async get(projectID) {
        let [results, fields] = await Document.db.query(
            "SELECT * FROM documents WHERE projectID = ?",
            [projectID]);
        return results;
    }
}

module.exports = Document;
