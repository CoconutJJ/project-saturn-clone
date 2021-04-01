import API from "../api";

class Document {

    /**
     * Create a new project
     * @param {string} name //document name
     * @param {string} projectID //projectID
     */
    static async createDocument(name, projectID) {
        let data = await API.m(
            `mutation($name: String, $projectID: Int){ createDocument(name: $name, projectID: $projectID)}`,
            {
                name, projectID
            }
        );
        return data;
    }


    /**
     * Get an array of documents inside a project
     * @param {int} projectID
    */
    static async get(projectID) {
        let data = await API.q(
            `query($projectID: Int){ getDocuments(projectID: $projectID){name,id}}`,
            {
                projectID
            }
        );
        if(data.errors){
            throw Error(data.errors[0].message);
        }
        return data.data.getDocuments;
    }

}
export default Document;
