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
    return await new Promise((resolve) => {
        pool.query(query, values, (err, result) => {
            // Solo esta para el testeo de la funcion, sino queda el programa corriendo
            closePool();

            if(err) throw err;
            resolve(result);
        });
    });
}

async function nameLogIn(name, password){
    let value = "No se usar promesas";
    let sql = "SELECT 1 FROM usuario WHERE usuario.nombre = ? AND usuario.contrasenia = ?";
    let promise = await sqlQuery(sql, [name, password]);

    console.log("------------------------------");
    console.log("Inside nameLogIn: ");
    console.log("Promise:");
    console.table(promise);

    value = promise.length > 0;
    console.log("Value: " + value);

    return value;
}

let nombre = "Test";
let contrasenia = "incorrecta";

console.log("\n------------------------------");
console.log("nameLogIn Call:");
console.log("Name: " + nombre);
console.log("Contrasenia: " + contrasenia);

let logIn;
nameLogIn(nombre, contrasenia).then((value) => {
    logIn = value;
    console.log("------------------------------");
    console.log("nameLogIn Promise:");
    console.log("logIn: ");
    console.log(logIn);
});

console.log("LogIn?: " + logIn);
console.table(logIn);