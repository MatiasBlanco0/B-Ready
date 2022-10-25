// Import modules
require('dotenv').config();
const mysql = require('mysql2');
const sha256 = require('js-sha256');
let pool;
// Create a connection pool function
//ORT
if (process.env.MODE === "ORT") {
    pool = mysql.createPool({
        connectionLimit: 100,
        host: "localhost",
        port: 3306,
        user: "root",
        password: "rootroot",
        database: "b-ready"
    });
}
//Home
else if (process.env.MODE === "HOME") {
    pool = mysql.createPool({
        connectionLimit: 100,
        host: "localhost",
        port: 3307,
        user: "breadyusr",
        password: "yes!bready",
        database: "breadydb"
    });
}

function checkEmail(email) {
    const emailRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (typeof email !== "string" || email.length === 0 || !emailRegEx.test(email)) {
        return false;
    }
    return true;
}

function checkPassword(password) {
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm
    if (typeof password !== "string" || password.length === 0 || !passwordRegEx.test(password)) {
        return false;
    }
    return true;
}

function checkString(string) {
    if (typeof string !== "string" || string.length <= 0) {
        return false;
    }
    return true;
}

function checkNumber(number) {
    if (typeof number !== "number" || number < 0) {
        return false;
    }
    return true;
}

function checkDate(date) {
    if (isNaN(new Date(date))) {
        return false;
    }
    return true;
}

function checkToken(token) {
    if (typeof token !== "string" || token.length <= 0 || token === "") {
        return false;
    }
    return true;
}

// Function to execute queries
async function sqlQuery(query, values) {
    try {
        return await new Promise((resolve, reject) => {
            pool.execute(query, values, (err, result) => {
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
        // If there was an error return it, otherwise return true if the query has results
        if (promise instanceof Error) {
            return promise;
        }
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
        }
        return true;
    } catch (err) {
        return err;
    }
}

async function updateToken(userEmail, token) {
    // Input validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkToken(token)) {
        return new Error(token + " is not a valid token");
    }
    try {
        let sql = "UPDATE usuario SET usuario.token = ? WHERE usuario.email = ?";
        let promise = await sqlQuery(sql, [token, userEmail]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        }
        return true;
    } catch (err) {
        return err;
    }
}

async function tokenExists(userEmail, token) {
    // Input validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkToken(token)) {
        return new Error(token + " is not a valid token");
    }
    try {
        let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.token = ?";
        let promise = await sqlQuery(sql, [userEmail, token]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        }
        return promise.length > 0;
    } catch (err) {
        return err;
    }
}

async function addAssignment(userEmail, name, description, excercices, doneExcercices, subject, dueDate, difficulty) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
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
    if (!checkDate(dueDate)) {
        return new Error(dueDate + " is not a valid due date");
    }
    try {
        let sql = "INSERT INTO tarea(nombre, descripcion, cantej, cantejhechos, materia, fechaentrega, dificultad) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let promise = await sqlQuery(sql, [name, description, excercices, doneExcercices, subject, dueDate, difficulty]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        }
        // If the query was successful, add the user to the assignment 
        sql = "INSERT INTO relacion_usuario_tarea(email, tarea) VALUES (?, ?)";
        let result = await sqlQuery(sql, [userEmail, promise.insertId]);
        // If the query was not successful, return the error
        if (result instanceof Error) {
            return result;
        }
        return true;
    } catch (err) {
        return err;
    }
}

async function userExists(user) {
    let sql = "SELECT 1 FROM usuario WHERE usuario.email=?";
    let promise = await sqlQuery(sql, [user]);
    return promise.length > 0;
}

async function userInAssignment(user, id) {
    let sql = "SELECT 1 FROM relacion_usuario_tarea WHERE relacion_usuario_tarea.email = ? AND relacion_usuario_tarea.tarea = ?";
    let promise = await sqlQuery(sql, [user, id]);
    return promise;
}

async function addUserToAssignment(userToAdd, assignmentID, ownerEmail) {
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
    try {
        let result = await userExists(userToAdd);
        if (result !== true) {
            return new Error(userToAdd + " is not a user");
        }

        result = await userInAssignment(ownerEmail, assignmentID);
        if (result.length < 0) {
            return new Error(ownerEmail + " is not the owner of the assignment");
        }

        result = await userInAssignment(userToAdd, assignmentID);
        if (result.length !== 0) {
            return new Error(userToAdd + "is already an owner of the assignment");
        }

        let sql = "INSERT INTO relacion_usuario_tarea(email, tarea) VALUES (?, ?)";
        let promise = await sqlQuery(sql, [userToAdd, assignmentID, ownerEmail, assignmentID]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        }
        return true;
    } catch (err) {
        return err;
    }
}


async function getAssignments(userEmail) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    try {
        let sql = "SELECT tarea.id, tarea.nombre, tarea.cantej, tarea.cantejhechos, tarea.materia, tarea.fechaentrega, tarea.dificultad FROM tarea INNER JOIN relacion_usuario_tarea ON tarea.id = relacion_usuario_tarea.tarea WHERE relacion_usuario_tarea.email = ?";
        return await sqlQuery(sql, [userEmail]);
    } catch (err) {
        return err;
    }
}

async function getAssignmentInfo(id, userEmail) {
    // Input Validation
    if (!checkNumber(id)) {
        return new Error(id + " is not a valid assignment Id");
    }
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    try {
        let sql = "SELECT tarea.nombre, tarea.descripcion, tarea.materia, tarea.fechaentrega, tarea.cantej, tarea.cantejhechos, tarea.dificultad, relacion_usuario_tarea.email FROM tarea INNER JOIN relacion_usuario_tarea ON tarea.id = relacion_usuario_tarea.tarea WHERE tarea.id = ? AND EXISTS(SELECT 1 FROM relacion_usuario_tarea WHERE relacion_usuario_tarea.email = ? AND relacion_usuario_tarea.tarea = tarea.id)";
        return await sqlQuery(sql, [id, userEmail]);
    } catch (err) {
        return err;
    }
}

async function deleteAssignment(id, userEmail) {
    // Input Validation
    if (!checkNumber(id)) {
        return new Error(id + " is not a valid assignment Id");
    }
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    try {
        const isOwner = await sqlQuery("SELECT 1 FROM relacion_usuario_tarea WHERE relacion_usuario_tarea.email = ? AND relacion_usuario_tarea.tarea = ?", [userEmail, id]);
        if (isOwner.length < 0) {
            return new Error(userEmail + " is not an owner of the assignment");
        }
        let checkUsers = await sqlQuery("SELECT relacion_usuario_tarea.email WHERE relacion_usuario_tarea.id = ?", [id]);
        if (checkUsers.length < 2) {
            let sql = "DELETE FROM tarea WHERE tarea.id = ?; DELETE FROM relacion_usuario_tarea WHERE relacion_usuario_tarea.tarea = ?";
            let promise = await sqlQuery(sql, [id, id]);
            // If the query was not successful, return the error
            if (promise instanceof Error) {
                return promise;
            }
            return true;
        }
        let sql = "DELETE FROM relacion_usuario_tarea WHERE relacion_usuario_tarea.tarea = ? AND relacion_usuario_tarea.email = ?";
        let result = await sqlQuery(sql, [id, userEmail]);
        // If the query was not successful, return the error
        if (result instanceof Error) {
            return result;
        }
        return true;
    } catch (err) {
        return err;
    }
}

async function updateDoneExercises(userEmail, id, doneExcercices) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkNumber(id)) {
        return new Error(id + " is not a valid assignment Id");
    }
    if (!checkNumber(doneExcercices)) {
        return new Error(doneExcercices + " is not a valid number of excercices");
    }
    try {
        const isOwner = await sqlQuery("SELECT 1 FROM relacion_usuario_tareaWHERE relacion_usuario_tarea.email = ? AND relacion_usuario_tarea.tarea = ?", [userEmail, id]);
        if (isOwner.length < 0) {
            return new Error(userEmail + " is not an owner of the assignment");
        }
        let sql = "UPDATE tarea SET tarea.cantejhechos = ? WHERE tarea.id = ?";
        let promise = await sqlQuery(sql, [doneExcercices, id]);
        // If the query was not successful, return the error
        if (promise instanceof Error) {
            return promise;
        }
        return true;
    } catch (err) {
        return err;
    }
}

async function getAssignmentsByDay(userEmail, date) {
    // Input Validation
    if (!checkEmail(userEmail)) {
        return new Error(userEmail + " is not a valid email");
    }
    if (!checkDate(date)) {
        return new Error(date + " is not a valid date");
    }
    try {
        let sql = "SELECT tarea.id, tarea.nombre FROM tarea INNER JOIN relacion_usuario_tarea ON tarea.id=relacion_usuario_tarea.tarea WHERE relacion_usuario_tarea.email=? AND tarea.fechaentrega=?";
        let promise = await sqlQuery(sql, [userEmail, date]);
        if (promise instanceof Error) {
            return promise;
        }
        return promise;
    } catch (err) {
        return err;
    }
}

async function getStyle(user) {
    if (!checkEmail(user)) {
        return new Error(user + " is not a valid email");
    }
    try {
        let sql = "SELECT usuario.estilo FROM usuario WHERE usuario.email=?";
        let promise = await sqlQuery(sql, [user]);
        if (promise instanceof Error) {
            return promise;
        }
        return promise;
    } catch (err) {
        return err;
    }
}

async function updateStyle(user, style) {
    if (!checkEmail(user)) {
        return new Error(user + " is not a valid email");
    }
    if (!checkString(style)) {
        return new Error(style + " is not a valid style");
    }
    try {
        let sql = "UPDATE usuario SET usuario.estilo=? WHERE usuario.email=?";
        let promise = await sqlQuery(sql, [style, user]);
        if (promise instanceof Error) {
            return promise;
        }
        return true;
    } catch (err) {
        return err;
    }
}

// Export functions
module.exports = {
    logIn: logIn,
    register: register,
    updateToken: updateToken,
    tokenExists: tokenExists,
    addAssignment: addAssignment,
    addUserToAssignment: addUserToAssignment,
    getAssignments: getAssignments,
    getAssignmentsByDay: getAssignmentsByDay,
    getAssignmentInfo: getAssignmentInfo,
    deleteAssignment: deleteAssignment,
    updateDoneExercises: updateDoneExercises,
    getStyle: getStyle,
    updateStyle: updateStyle
}