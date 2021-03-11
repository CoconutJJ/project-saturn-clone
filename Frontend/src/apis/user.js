import API from "../api";

class User {
    /**
     * @param {string} username 
     * @param {string} password
     * @returns {boolean} 
     */
    static login(username, password) {
        let data = await API.q(`{ loginUser(username: ${username}, password: ${password}) }`);

        return data.data.loginUser
    }


}
