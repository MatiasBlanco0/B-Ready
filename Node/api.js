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
    console.log("Running query");
    let promise = new Promise((resolve) => {
        pool.query(query, values, (err, result) => {
            closePool();
            if(err) throw err;
            resolve(result);
        });
    });

    return await promise;
}

async function nameLogIn(name, password){
    let value = "No se usar promesas";
    let sql = "SELECT 1 FROM usuario WHERE usuario.nombre = ? AND usuario.contrasenia = ?";
    let values = [name, password];
    let promise = await sqlQuery(sql, values);
    console.log("------------------------------\nInside nameLogIn: ")
    console.log("Promise:");
    console.table(promise);
    value = promise.length > 0;
    console.log("Value: " + value);
    return value;
}

let nombre = "Test";
let contrasenia = "incorrecta";
console.log("\n------------------------------\nnameLogIn Call:")
console.log("Name: " + nombre + "\nContrasenia: " + contrasenia);
let logIn;
nameLogIn(nombre, contrasenia).then((value) => {
    logIn = value;
});
console.log("LogIn?: " + logIn);
console.table(logIn);