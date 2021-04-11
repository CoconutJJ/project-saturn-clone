# Saturn Graphql API Documentation


## Create


### signup
- description: create a new user
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `mutation($fname: String!, $lname: String!, $uname: String!, $pword: String!, $email: String!) { signUpUser(firstname: $fname, lastname: $lname, username: $uname, password: $pword, email: $email) }`
        - variables: (object)
            - fname: (string) "firstname"
            - lname: (string) "lastname"
            - uname: (string) "username"
            - pword: (string) "password"
            - email: (string) "email"
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - signUpUser (boolean) true
- response: 400, 409
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


### signin
- description: login a user and create a new user session
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `query($uname: String!, $pword: String!){ loginUser(username: $uname, password: $pword) }`
        - variables: (object)
            - uname: (string) "username"
            - pword: (string) "password"
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - loginUser (boolean) true
- response: 400, 401
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


### document
- description: create a new document
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `mutation($name: String!, $projectID: Int!){ createDocument(name: $name, projectID: $projectID)}`
        - variables: (object)
            - name: (string) "document name"
            - projectID: (int) 1
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - createDocument (boolean) true
- response: 400, 403
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


### project
- description: create a new project
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `mutation($name: String!, $env: String!){ createProject(name: $name, env: $env)}`
        - variables: (object)
            - name: (string) "project name"
            - env: (string) "python or c"
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - createProject (boolean) true
- response: 400, 403
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


## Read


### project
- description: get details of a specific project
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `query($projectID: Int!){ getProject(projectID: $projectID){name,owner,env,id}}`
        - variables: (object)
            - projectID: (int) 1
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - getProject (object)
                - name (string) "project name"
                - env (string) "python or c"
                - owner (string) "project owner username"
                - id (int) 1
                - guests (array)
                    - (object)
                        - uname (string) "username"
                - documents (array)
                    - (object)
                        - name (string) "document name"
                        - id (int) 
- response: 403
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


### user to project
- description: get an array of projects with specific relationship to a user
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `query($relationship: String!){ getUserProjects(relationship: $relationship){name,owner,env,id}}`
        - variables: (object)
            - relationship: (string) "onwed or shared"
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - getUserProjects (array)
                - (object)
                    - name (string) "project name"
                    - env (string) "python or c"
                    - owner (string) "project owner username"
                    - id (int) 1
- response: 403
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


## Update


### share project
- description: share a specific project with a user
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `mutation($uname: String!, $projectID: Int!){ shareProject(uname: $uname, projectID: $projectID)}`
        - variables: (object)
            - uname: (string) "guest username"
            - projectID: (int) 1
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - shareProject (boolean) true
- response: 403,400
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


### unshare project
- description: unshare a specific project with a user
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `mutation($uname: String!, $projectID: Int!){ unShareProject(uname: $uname, projectID: $projectID)}`
        - variables: (object)
            - uname: (string) "guest username"
            - projectID: (int) 1
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - unShareProject (boolean) true
- response: 403,400
    - content-type : `application/json`
    - body: (object)
        - errors (array)
            - (object)
                - message (string) "Error message"


## Delete


### logout
- description: logout user and delete session
- request: `POST /ql/`
    - content-type : `application/json`
    - body: (object)
        - query: (string)
            `query { logoutUser }`
- response: 200
    - content-type : `application/json`
    - body: (object)
        - data (object)
            - logoutUser (boolean) true
