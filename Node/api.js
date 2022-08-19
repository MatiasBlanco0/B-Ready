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
    value = promise.length > 0;
    return value;
}

let nombre = "Test";
let contrasenia = "incorrecta";
nameLogIn(nombre, contrasenia).then((value) => {
    console.log("LogIn?: " + value);
});