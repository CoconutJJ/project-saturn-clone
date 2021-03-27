class API {
    /**
     *
     * @param {string} method
     * @param {string} url
     * @param {object} headers
     * @param {string} data
     * @returns {Promise<XMLHttpRequest>}
     */
    static request(method, url, headers, data) {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();

            xhttp.onload = () => {
                resolve(xhttp);
            };

            xhttp.onerror = () => {
                reject(xhttp);
            };

            xhttp.open(method, url);

            for (let header of Object.keys(headers)) {
                xhttp.setRequestHeader(header, headers[header]);
            }

            xhttp.send(data);
        });
    }

    static async _r(type, query, variables = {}) {
        let xhttp = await API.request(
            "POST",
            "/ql",
            {
                "Content-Type": "application/json",
            },
            JSON.stringify({ [type]: query, variables: variables })
        );

        if (xhttp.status == 400) {
            let errorMessage = JSON.parse(xhttp.responseText);

            throw new Error(errorMessage.errors[0].message);
        }

        return JSON.parse(xhttp.responseText);
    }

    static async q(query, variables = {}) {
        return API._r("query", query, variables);
    }
    static async m(query, variables = {}) {
        return API._r("query", query, variables);
    }
}

export default API
