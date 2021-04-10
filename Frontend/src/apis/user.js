import API from "../api";

class User {
    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    static async login(username, password) {
        let data = await API.q(
            `query($uname: String!, $pword: String!){ loginUser(username: $uname, password: $pword) }`,
            {
                uname: username,
                pword: password,
            }
        );
        if(data.errors){
            throw Error(data.errors[0].message);
        }

        return data.data.loginUser;
    }

    static async logout() {
        await API.q("query { logoutUser }");

    }

    /**
     * Create a user account
     * @param {string} firstname
     * @param {string} lastname
     * @param {string} username
     * @param {string} password
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    static async signUp(firstname, lastname, username, password, email) {
        let data = await API.m(
            `mutation($fname: String!, $lname: String!, $uname: String!, $pword: String!, $email: String!) { 
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
        if (data.errors) {
            throw Error(data.errors[0].message);
        }


        return data.data.signUpUser;
    }

    static isLoggedIn() {

        let cookie_string = document.cookie;

        if (cookie_string.length == 0) {
            return false;
        }

        let cookies = cookie_string.split(";")

        for (let c of cookies) {
            if (c.split("=")[0].trim() == "userdata") return true;

        }

        return false;
    }

}
export default User;
