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
        const output = {isCreated:false,documentID:undefined,error:undefined};
        let [results] = await Document.db.query("SELECT COUNT(*) as count FROM documents WHERE name = ? AND projectID = ?", [name,projectID]);
        if (parseInt(results[0].count) > 0) {
            output.error = Error("A document with the same name already exists");
            output.error.status = 400;
        }else{
            let [results, fields] = await Document.db.query( "INSERT INTO documents (name,projectID) VALUES (?,?)",[name, projectID]);
            output.isCreated = results.affectedRows != 0;
            output.documentID = results.insertId;
        }
        return output;
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
