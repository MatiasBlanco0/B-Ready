// Import modules
const mysql = require('mysql');
const sha256 = require('js-sha256');
const express = require('express');
const cors = require('cors');

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
    console.log("\nRecibi una request POST en /login");
    logIn(req.body['email'], req.body['contrasenia'])
        .then(result => res.json(result));
});

app.post('/register', (req, res) => {
    console.log("\nRecibi una request POST en /register");
    register(req.body['nombre'], req.body['email'], req.body['contrasenia'])
        .then(result => res.json(result));
});

app.post('/assignments', (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    getAssignments(req.body['email'], req.body['contrasenia'])
        .then(result => res.json(result));
});

app.post('/assignmentInfo', (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    getAssignmentInfo(req.body['id'])
        .then(result => res.json(result));
})

app.post('/addAssignment', (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    addAssignment(req.body['email'], req.body['contrasenia'], req.body['nombre'], req.body['descripcion'], req.body['ejercicios'], req.body['ejerciciosHechos'], req.body['materia'], req.body['fecha'], req.body['difficultad'])
        .then(result => res.json(result));
});

app.post('addUser', (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    addUserToAssignment(req.body['email'], req.body['id'])
        .then(result => res.json(result));
});

app.post('delete', (req, res) => {
    console.log("\nRecibi una request POST en /delete");
    deleteAssignment(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => res.json(result));
});


app.listen(port, () => console.log('Server started at http://localhost:' + port));

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "b-ready"
});

// Don't use this function, it's only for testing purposes
function closePool() {
    pool.end((err) => {
        if (err) throw err;
        console.log("Closing pool");
    });
}

function checkEmail(email) {
    const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (typeof email !== "string") {
        return false;
    }
    if (email.length === 0) {
        return false;
    }
    if (!emailRegExp.test(email)) {
        return false;
    }

    return true;
}

function checkPassword(password) {
    if (typeof password !== "string") {
        return false;
    }
    if (password.length === 0) {
        return false;
    }

    return true;
}

function checkString(name) {
    if (typeof name !== "string") {
        return false;
    }
    if (name.length <= 0) {
        return false;
    }

    return true;
}

// Function to execute queries
async function sqlQuery(query, values) {
    try {
        console.log("Running query");
        return await new Promise((resolve, reject) => {
            pool.query(query, values, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    } catch (err) {
        return err;
    }
}

async function logIn(email, password) {
    if (!checkEmail(email)) {
        return new Error("Invalid email");
    }
    if (!checkPassword(password)) {
        return new Error("Invalid password");
    }
    try {
        let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.contrasenia = ?";
        let promise = await sqlQuery(sql, [email, sha256(password)]);
        // Return true if the query has results
        return promise.length > 0;
    } catch (err) {
        return err;
    }
}

async function register(name, email, password) {
    if (!checkEmail(email)) {
        return new Error("Invalid email");
    }
    if (!checkPassword(password)) {
        return new Error("Invalid password");
    }
    if (!checkString(name)) {
        return new Error("Invalid name");
    }
    try {
        let sql = "INSERT INTO usuario(nombre, email, contrasenia) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, sha256(password)]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise
        } else {
            return true;
        }
    } catch (err) {
        return err;
    }
}

async function addAssignment(userEmail, password, name, description, excercices, doneExcercices, subject, dueDate, difficulty) {
    if (!checkEmail(userEmail)) {
        return new Error("Invalid email");
    }
    if (!checkPassword(password)) {
        return new Error("Invalid password");
    }
    if (!checkString(name)) {
        return new Error("Invalid name");
    }
    if (!checkString(description)) {
        return new Error("Invalid description");
    }
    if (!checkString(subject)) {
        return new Error("Invalid subject");
    }
    if (typeof excercices !== "number") {
        return new Error("Invalid number of excercices");
    }
    if (typeof doneExcercices !== "number") {
        return new Error("Invalid number of done excercices");
    }
    if (typeof difficulty !== "number") {
        return new Error("Invalid number of difficulty");
    }
    if (!dueDate instanceof Date || isNaN(dueDate)) {
        return new Error("Invalid due date");
    }
    try {
        if (await logIn(userEmail, sha256(password))) {
            let sql = "INSERT INTO tarea(nombre, descripcion, cantej, cantejhechos, materia, fechaentrega, dificultad) VALUES(?, ?, ?, ?, ?, ?, ?)";
            let promise = await sqlQuery(sql, [name, description, excercices, doneExcercices, subject, dueDate, difficulty]);
            // If the query was not successful, return the error
            if (promise instanceof Error) {
                return promise;
            }
            // If the query was successful, add the user to the assignment 
            else {
                let result = await addUserToAssignment(userEmail, promise.insertId);
                // If the query was not successful, return the error
                if (result instanceof Error) {
                    return result;
                } else {
                    return true;
                }
            }
        } else {
            return new Error("Invalid email or password");
        }
    } catch (err) {
        return err;
    }
}

async function addUserToAssignment(userEmail, assignmentID) {
    if (!checkEmail(userEmail)) {
        return new Error("Invalid email");
    }
    if (typeof assignmentID !== "number") {
        return new Error("Invalid Id");
    }
    try {
        let sql = "INSERT INTO `relacion usuario/tarea`(email, tarea) VALUES (?, ?)";
        let promise = await sqlQuery(sql, [userEmail, assignmentID]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        } else {
            return true;
        }
    } catch (err) {
        return err;
    }
}

async function getAssignments(userEmail, password) {
    if (!checkEmail(userEmail)) {
        return new Error("Invalid email");
    }
    if (!checkPassword(password)) {
        return new Error("Invalid password");
    }
    try {
        if (await logIn(userEmail, sha256(password))) {
            let sql = "SELECT tarea.id, tarea.nombre, tarea.cantej, tarea.cantejhechos, \
            tarea.materia, tarea.fechaentrega, tarea.dificultad FROM tarea INNER JOIN \
            `relacion usuario/tarea` ON tarea.id = `relacion usuario/tarea`.tarea \
            WHERE `relacion usuario/tarea`.email = ?";
            return await sqlQuery(sql, [userEmail]);
        } else {
            return new Error("Invalid email or password");
        }
    } catch (err) {
        return err;
    }
}

async function getAssignmentInfo(id) {
    if (typeof id !== "number") {
        return new Error("Invalid Id");
    }
    if (id < 0) {
        return new Error("Invalid Id");
    }
    try {
        let sql = "SELECT tarea.descripcion, `relacion usuario/tarea`.email \
        FROM tarea INNER JOIN `relacion usuario/tarea` ON tarea.id = \
        `relacion usuario/tarea`.tarea WHERE tarea.id = ?";
        return await sqlQuery(sql, [id]);
    } catch (err) {
        return err;
    }
}

async function deleteAssignment(id, userEmail, password) {
    if (typeof id !== "number") {
        return new Error("Invalid Id");
    }
    if (id < 0) {
        return new Error("Invalid Id");
    }
    if (!checkEmail(userEmail)) {
        return new Error("Invalid email");
    }
    if (!checkPassword(password)) {
        return new Error("Invalid password");
    }
    try {
        if (await logIn(userEmail, sha256(password))) {
            let sql = "DELETE FROM tarea WHERE tarea.id = ?";
            let promise = await sqlQuery(sql, [id]);
            // If the query was not successful, return the error
            if (promise instanceof Error) {
                return promise;
            } else {
                sql = "DELETE FROM `relacion usuario/tarea` WHERE `relacion usuario/tarea`.tarea = ?";
                let result = await sqlQuery(sql, [id]);
                // If the query was not successful, return the error
                if (result instanceof Error) {
                    return result;
                } else {
                    return true;
                }
            }
        } else {
            return new Error("Invalid email or password");
        }
    } catch (err) {
        return err;
    }
}