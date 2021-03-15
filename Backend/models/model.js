const Database = require("../database");

class Model {

    constructor () {
        this.db = new Database();
    }

}
module.exports = Model;