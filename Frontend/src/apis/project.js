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
        return data;
    }

    /**
     * Get an array of projects with specific relationship to a user
     * @param {string} relationship
    */
    static async get(relationship) {
        let data = await API.q(
            `query($relationship: String){ getProjects(relationship: $relationship){name,owner,env}}`,
            {
                relationship
            }
        );
        return data.data.getProjects;
    }

}
export default Project;
