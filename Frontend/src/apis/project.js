import API from "../api";

class Project {

    /**
     * Create a new project
     * @param {string} name //project name
     * @param {string} env  //project environment
     */
    static async createProject(name, env) {
        let data = await API.m(
            `mutation($name: String, $env: String){ createProject(name: $name, env: $env)}`,
            {
                name, env
            }
        );
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data;
    }

    /**
     * Share a project with a user
     * @param {string} uname  //guest username
     * @param {int} projectID //projectID
     */
    static async shareProject(uname, projectID) {
        let data = await API.m(
            `mutation($uname: String, $projectID: Int){ shareProject(uname: $uname, projectID: $projectID)}`,
            {
                uname, projectID
            }
        );
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data;
    }

    /**
     * Unshare a project from a user
     * @param {string} uname  //guest username
     * @param {int} projectID //projectID
     */
    static async unShareProject(uname, projectID) {
        let data = await API.m(
            `mutation($uname: String, $projectID: Int){ unShareProject(uname: $uname, projectID: $projectID)}`,
            {
                uname, projectID
            }
        );
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data;
    }

    /**
     * Get an array of projects with specific relationship to a user
     * @param {string} relationship
    */
    static async getUserProjects(relationship) {
        let data = await API.q(
            `query($relationship: String){ getUserProjects(relationship: $relationship){name,owner,env,id}}`,
            {
                relationship
            }
        );
        return data.data.getUserProjects;
    }

    /**
     * Get details of a project
     * @param {int} projectID
    */
    static async getProject(projectID) {
        let data = await API.q(
            `query($projectID: Int){ getProject(projectID: $projectID){name,owner,env,id}}`,
            {
                projectID
            }
        );
        return data.data.getProject;
    }

    /**
 *  Get an array of guests of a specific project 
 * * @param {int} projectID
*/
    static async getGuests(projectID) {
        let data = await API.q(
            `query($projectID: Int){ getProjectGuests(projectID: $projectID){uname}}`,
            {
                projectID
            }
        );
        if (data.errors) {
            throw Error(data.errors[0].message);
        }
        return data.data.getProjectGuests;
    }



}
export default Project;
