// Import modules
const mysql = require('mysql');
const sha256 = require('js-sha256');
const express = require('express');
const cors = require('cors');

// -------------------------------------------------------------------------------------------------------------------
// express
// -------------------------------------------------------------------------------------------------------------------

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

function errorToObj(error) {
    let errorObj = {};
    for (const key in error) {
        errorObj[key] = error[key];
    }
    return errorObj;
}

app.use(cors());
app.use(express.json());

app.all('*', (req, res, next) => {
    if (Object.keys(req.body).length <= 0) {
        res.json({ message: "Body was empty, Content-Type header didn't match the type of body or there was another error" });
    }
    next();
})

app.post('/login', (req, res) => {
    console.log("\nRecibi una request POST en /login");
    logIn(req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/register', (req, res) => {
    console.log("\nRecibi una request POST en /register");
    register(req.body['nombre'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/assignments', (req, res) => {
    console.log("\nRecibi una request POST en /assignments");
    getAssignments(req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/assignmentInfo', (req, res) => {
    console.log("\nRecibi una request POST en /assignmentInfo");
    getAssignmentInfo(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
})

app.post('/addAssignment', (req, res) => {
    console.log("\nRecibi una request POST en /addAssignment");
    addAssignment(req.body['email'], req.body['contrasenia'], req.body['nombre'], req.body['descripcion'], req.body['ejercicios'], req.body['ejerciciosHechos'], req.body['materia'], req.body['fecha'], req.body['difficultad'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/addUser', (req, res) => {
    console.log("\nRecibi una request POST en /addUser");
    addUserToAssignment(req.body['email'], req.body['id'], req.body['duenio'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

app.post('/delete', (req, res) => {
    console.log("\nRecibi una request POST en /delete");
    deleteAssignment(req.body['id'], req.body['email'], req.body['contrasenia'])
        .then(result => {
            if (result instanceof Error) {
                res.json(errorToObj(result));
            } else {
                res.json(result);
            }
        });
});

// Start server
app.listen(port, () => console.log('Server started at http://localhost:' + port));

// -------------------------------------------------------------------------------------------------------------------
// mysql
// -------------------------------------------------------------------------------------------------------------------

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
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (typeof email !== "string") {
        return false;
    }
    if (email.length === 0) {
        return false;
    }
    if (!emailRegEx.test(email)) {
        return false;
    }

    return true;
}

function checkPassword(password) {
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm

    if (typeof password !== "string") {
        return false;
    }
    if (password.length === 0) {
        return false;
    }
    if (!passwordRegEx.test(password)) {
        return false;
    }

    return true;
}

function checkString(string) {
    if (typeof string !== "string") {
        return false;
    }
    if (string.length <= 0) {
        return false;
    }

    return true;
}

function checkNumber(number) {
    if (typeof number !== "number") {
        return false;
    }
    if (number < 0) {
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
    // Input Validation
    if (!checkEmail(email)) {
        return new Error(email + " is not a valid email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
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
    // Input Validation
    if (!checkEmail(email)) {
        return new Error(email + " is not a valid email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
    }
    if (!checkString(name)) {
        return new Error(name + " is not a valid name");
    }
    try {
        let sql = "INSERT INTO usuario(nombre, email, contrasenia) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, sha256(password)]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            if (promise.code === "ER_DUP_ENTRY") {
                return new Error(email + " already is a user");
            }
            return promise
        } else {
            return true;
        }
    } catch (err) {
        return err;
    }
}

async function addAssignment(userEmail, password, name, description, excercices, doneExcercices, subject, dueDate, difficulty) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
    }
    if (!checkString(name)) {
        return new Error(name + " is not a valid name");
    }
    if (!checkString(description)) {
        return new Error(description + " is not a valid description");
    }
    if (!checkString(subject)) {
        return new Error(subject + " is not a valid subject");
    }
    if (!checkNumber(excercices)) {
        return new Error(excercices + " is not valid number of excercices");
    }
    if (!checkNumber(doneExcercices)) {
        return new Error(doneExcercices + " is not a valid number of done excercices");
    }
    if (!checkNumber(difficulty)) {
        return new Error(difficulty + " is not a valid number of difficulty");
    }
    if (!dueDate instanceof Date || isNaN(dueDate)) {
        return new Error(dueDate + " is not a valid due date");
    }
    try {
        if (await logIn(userEmail, password) === true) {
            let sql = "INSERT INTO tarea(nombre, descripcion, cantej, cantejhechos, materia, fechaentrega, dificultad) VALUES(?, ?, ?, ?, ?, ?, ?)";
            let promise = await sqlQuery(sql, [name, description, excercices, doneExcercices, subject, dueDate, difficulty]);
            // If the query was not successful, return the error
            if (promise instanceof Error) {
                return promise;
            }
            // If the query was successful, add the user to the assignment 
            else {
                let result = await addUserToAssignment(userEmail, promise.insertId, userEmail, password);
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

async function addUserToAssignment(userToAdd, assignmentID, ownerEmail, password) {
    // Input Validation
    if (!checkEmail(userToAdd)) {
        return new Error(userToAdd + " is not a valid email");
    }
    if (!checkNumber(assignmentID)) {
        return new Error(assignmentID + " is not a valid assignment Id");
    }
    if (!checkEmail(ownerEmail)) {
        return new Error(ownerEmail + " is not a valid owner email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
    }
    try {
        if (await logIn(ownerEmail, password)) {
            let result = await sqlQuery("SELECT 1 FROM `relacion usuario/tarea` WHERE `relacion usuario/tarea`.email = ? \
            AND `relacion usuario/tarea`.tarea = ?", [ownerEmail, assignmentID]);
            if (result.length > 0) {
                let sql = "INSERT INTO `relacion usuario/tarea`(email, tarea) VALUES (?, ?)";
                let promise = await sqlQuery(sql, [userToAdd, assignmentID, ownerEmail, assignmentID]);
                // If the query was not successful, return the error
                if (promise instanceof Error) {
                    if (promise.code === "ER_DUP_ENTRY") {
                        return new Error(userToAdd + " already is owner of assignment");
                    }
                    return promise;
                } else {
                    return true;
                }
            } else {
                return new Error(ownerEmail + " is not the owner of the assignment");
            }
        } else {
            return new Error("Invalid owner or password");
        }
    } catch (err) {
        return err;
    }
}

async function getAssignments(userEmail, password) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
    }
    try {
        if (await logIn(userEmail, password) === true) {
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

async function getAssignmentInfo(id, userEmail, password) {
    // Input Validation
    if (!checkNumber(id)) {
        return new Error(id + " is not a valid assignment Id");
    }
    try {
        if (await logIn(userEmail, password) === true) {
            let sql = "SELECT tarea.descripcion, `relacion usuario/tarea`.email \
        FROM tarea INNER JOIN `relacion usuario/tarea` ON tarea.id = \
        `relacion usuario/tarea`.tarea WHERE tarea.id = ? AND EXISTS(SELECT * FROM `relacion usuario/tarea` \
        WHERE `relacion usuario/tarea`.email = ? AND `relacion usuario/tarea`.tarea = tarea.id)";
            return await sqlQuery(sql, [id, userEmail]);
        }
        else {
            return new Error("Invalid email or password");
        }
    } catch (err) {
        return err;
    }
}

// agregar checkeo de owner
async function deleteAssignment(id, userEmail, password) {
    // Input Validation
    if (!checkNumber(id)) {
        return new Error(id + " is not a valid assignment Id");
    }
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkPassword(password)) {
        return new Error(password + " is not a valid password");
    }
    try {
        if (await logIn(userEmail, password) === true) {
            let checkUsers = await sqlQuery("SELECT `relacion usuario/tarea`.email WHERE `relacion usuario/tarea`.id = ?", [id]);
            if (checkUsers.length === 0) {
                let sql = "DELETE FROM tarea WHERE tarea.id = ?;\
                DELETE FROM `relacion usuario/tarea` WHERE `relacion usuario/tarea`.tarea = ?";
                let promise = await sqlQuery(sql, [id, id]);
                // If the query was not successful, return the error
                if (promise instanceof Error) {
                    return promise;
                } else {
                    return true;
                }
            } else {
                let sql = "DELETE FROM `relacion usuario/tarea` WHERE `relacion usuario/tarea`.tarea = ? AND \
                `relacion usuario/tarea`.email = ?";
                let result = await sqlQuery(sql, [id, userEmail]);
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