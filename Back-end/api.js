// Import modules
const mysql = require('mysql');
const sha256 = require('js-sha256');
const express = require('express');
const path = require('path');

// Create a new express application
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname.slice(0,23), 'Front-end')));

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
function closePool(){
    pool.end((err) =>{
        if(err) throw err;
        console.log("Closing pool");
    });
}

function checkEmail(email){
    const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if(typeof userEmail !== "string"){
        return false;
    }
    if(userEmail.length === 0){
        return false;
    }
    if(emailRegExp.test(userEmail) === false){
        return false;
    }
}

function checkPassword(password){
    if (typeof password !== "string"){
        return false;
    }
    if (password.length === 0){
        return false;
    }
}

function checkString(name){
    if (typeof name !== "string"){
        return false;
    }
    if (name.length === 0){
        return false;
    }
}

// Function to execute queries
async function sqlQuery (query, values){
    try{
        console.log("Running query");
        return await new Promise((resolve, reject) => {
            pool.query(query, values, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        });
    } catch (err){
        return err;
    }
}

async function emailLogIn(email, password){
    if (!checkEmail(email)){
        return new Error("Invalid email");
    }
    if(!checkPassword(password)){
        return new Error("Invalid password");
    }
    try {
        let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.contrasenia = ?";
        let promise = await sqlQuery(sql, [email, sha256(password)]);
        // Return true if the query has results
        return promise.length > 0;
    } catch(err){
        return err;
    }
}

async function register(name, email, password){
    if (!checkEmail(email)){
        return new Error("Invalid email");
    }
    if(!checkPassword(password)){
        return new Error("Invalid password");
    }
    if(!checkString(name)){
        return new Error("Invalid name");
    }
    try {
        let sql = "INSERT INTO usuario(nombre, email, contrasenia) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, sha256(password)]);
        // If the query was not successful, return the error
        if(promise instanceof Error){
            return promise
        } else {
            return true;
        }
    } catch(err){
        return err;
    }
}

async function addAssignment(userEmail, name, description, excercices, doneExcercices, subject, dueDate, difficulty){
    if(!checkEmail(userEmail)){
        return new Error("Invalid email");
    }
    if(!checkString(name)){
        return new Error("Invalid name");
    }
    if(!checkString(descriptiono)){
        return new Error("Invalid description");
    }
    if(!checkString(subject)){
        return new Error("Invalid subject");
    }
    if(typeof excercices !== "number"){
        return new Error("Invalid number of excercices");
    }
    if(typeof doneExcercices !== "number"){
        return new Error("Invalid number of excercices done");
    }
    if(typeof difficulty !== "number"){
        return new Error("Invalid number of difficulty");
    }
    if(!dueDate instanceof Date || isNaN(dueDate)){
        return new Error("Invalid due date");
    }
    try {
        let sql = "INSERT INTO tarea(nombre, descripcion, cantej, cantejhechos, materia, fechaentrega, dificultad) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let promise = await sqlQuery(sql, [name, description, excercices, doneExcercices, subject, dueDate, difficulty]);
        // If the query was not successful, return the error
        if(promise instanceof Error){
            return promise;
        }
        // If the query was successful, add the user to the assignment 
        else {
           let result = await addUserToAssignment(userEmail, promise.insertId);
           // If the query was not successful, return the error
           if(result instanceof Error){
            return result;
           } else {
            return true;
           }
        }
    } catch(err) {
        return err;
    }
}

async function addUserToAssignment(userEmail, assignmentID){
    if (!checkEmail(userEmail)){
        return new Error("Invalid email");
    }
    if (typeof assignmentID !== "number"){
        return new Error("Invalid Id");
    }
    try {
        let sql = "INSERT INTO `relacion usuario/tarea`(email, tarea) VALUES (?, ?)";
        let promise = await sqlQuery(sql, [userEmail, assignmentID]);
        // If the query was not successful, return the error
        if(promise instanceof Error){
            return promise;
        } else {
            return true;
        }
    } catch(err) {
        return err;
    }
}

async function getAssignments(userEmail){
    if(!checkEmail(userEmail)){
        return new Error("Invalid email");
    }
    try {
        let sql = "SELECT tarea.id, tarea.nombre, tarea.cantej, tarea.cantejhechos, \
        tarea.materia, tarea.fechaentrega, tarea.dificultad FROM tarea INNER JOIN \
        `relacion usuario/tarea` ON tarea.id = `relacion usuario/tarea`.tarea \
        WHERE `relacion usuario/tarea`.email = ?";
        return await sqlQuery(sql, [userEmail]);
    } catch(err) {
        return err;
    }
}

async function getAssignmentInfo(id) {
    if (typeof id !== "number"){
        return new Error("Invalid Id");
    }
    try {
        let sql = "SELECT tarea.descripcion, `relacion usuario/tarea`.email \
        FROM tarea INNER JOIN `relacion usuario/tarea` ON tarea.id = \
        `relacion usuario/tarea`.tarea WHERE tarea.id = ?";
        return await sqlQuery(sql, [id]);
    } catch(err) {
        return err;
    }
}