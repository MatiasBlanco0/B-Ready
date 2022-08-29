const mysql = require('mysql');
const sha256 = require('js-sha256');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "b-ready"
});

function closePool(){
    pool.end((err) =>{
        if(err) throw err;
        console.log("Closing pool");
    });
}

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

async function nameLogIn(name, password){
    try{
        let sql = "SELECT 1 FROM usuario WHERE usuario.nombre = ? AND usuario.contrasenia = ?";
        let promise = await sqlQuery(sql, [name, sha256(password)]);
        return promise.length > 0;
    } catch (err) {
        return err;
    }
}

async function emailLogIn(email, password){
    try {
        let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.contrasenia = ?";
        let promise = await sqlQuery(sql, [email, sha256(password)]);
        return promise.length > 0;
    } catch(err){
        return err;
    }
}

async function register(name, email, password){
    try {
        let sql = "INSERT INTO usuario(nombre, email, contrasenia) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, sha256(password)]);
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
    try {
        let sql = "INSERT INTO tarea(nombre, descripcion, cantej, cantejhechos, materia, fechaentrega, dificultad) VALUES(?, ?, ?, ?, ?, ?, ?)";
        let promise = await sqlQuery(sql, [name, description, excercices, doneExcercices, subject, dueDate, difficulty]);
        if(promise instanceof Error){
            return promise;
        } else {
           let result = await addUserToAssignment(userEmail, promise.insertId);
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
    try {
        let sql = "INSERT INTO `relacion usuario/tarea`(email, tarea) VALUES (?, ?)";
        let promise = await sqlQuery(sql, [userEmail, assignmentID]);
        if(promise instanceof Error){
            return promise;
        } else {
            return true;
        }
    } catch(err) {
        return err;
    }
}

async function getAssignment(userEmail){
    try {
        let sql = "SELECT tarea.id, tarea.nombre, tarea.descripcion, tarea.cantej, \
        tarea.cantejhechos, tarea.materia, tarea.materia, tarea.fechaentrega, \
        tarea.dificultad FROM tarea INNER JOIN `relacion usuario/tarea` ON \
        tarea.id = `relacion usuario/tarea`.tarea WHERE `relacion usuario/tarea`.email = ?";
        return await sqlQuery(sql, [userEmail]);
    } catch(err) {
        return err;
    }
}

async function getAssignmentUsers(id) {
    try {
        let sql = "SELECT rel.email FROM `relacion usuario/tarea` AS rel WHERE rel.tarea = ?"
        return await sqlQuery(sql, [id]);
    } catch(err) {
        return err;
    }
}

nameLogIn("Juan", "123456")
.then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
}).finally(() => {
    closePool();
});