import API from "../api";

class User {
    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    static async login(username, password) {
        let data = await API.q(
            `{ loginUser(username: ${username}, password: ${password}) }`
        );

        return data.data.loginUser;
    }

    /**
     * Create a user account
     * @param {string} firstname
     * @param {string} lastname
     * @param {string} username
     * @param {string} password
     * @param {string} email
     */
    static async signUp(firstname, lastname, username, password, email) {
        let data = await API.m(
            `mutation($fname: String, $lname: String, $uname: String, $pword: String, $email: String) { 
                signUpUser(firstname: $fname, lastname: $lname, username: $uname, password: $pword, email: $email) 
            }`,
            {
                fname: firstname,
                lname: lastname,
                uname: username,
                pword: password,
                email: email,
            }
        );
    }
}
export default User;
