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

async function addSubject(name, userEmail){
    try{
        let sql = "INSERT INTO materia(nombre) VALUES(?)";
        let promise = await sqlQuery(sql, [name]);
        if (promise instanceof Error){
            return promise;
        }
        sql = "INSERT INTO 'relacion materia/usuario'(email, materia) VALUES (?, ?)";
        let promise1 = await sqlQuery(sql, [userEmail, promise.insertId]);
        if (promise1 instanceof Error){
            return promise1;
        }
        else {
            return true;
        }
    } catch(err) {
        return err;
    }
}

let nombre = "Testeo";
let email = "test@test.test";
addSubject(nombre, email).then((value) => {
    console.log("Result of addSubject: ");
    console.table(value);
});