let mysql = require('mysql');

let pool = mysql.createPool({
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
        let promise = await sqlQuery(sql, [name, password]);
        return promise.length > 0;
    } catch (err) {
        return err;
    }
}

async function emailLogIn(email, password){
    try {
        let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.contrasenia = ?";
        let promise = await sqlQuery(sql, [email, password]);
        return promise.length > 0;
    } catch(err){
        return err;
    }
}

async function register(name, email, password){
    try {
        let sql = "INSERT INTO usuario(nombre, email, contrasenia) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, password]);
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

let nombre = "Proyecto";
let descripcion = "Proyecto B-ready B)";
let ejercicos = 10;
let ejercicosHechos = 2;
let materia = "TIC";
let fechaEntrega = new Date(2022, 10, 20);
let dificultad = 127;

