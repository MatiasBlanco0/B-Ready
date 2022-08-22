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
            if(err) throw err;
            resolve(result);
        });
    });
}

async function nameLogIn(name, password){
    let sql = "SELECT 1 FROM usuario WHERE usuario.nombre = ? AND usuario.contrasenia = ?";
    let promise = await sqlQuery(sql, [name, password]);
    return promise.length > 0;
}

async function emailLogIn(email, password){
    let sql = "SELECT 1 FROM usuario WHERE usuario.email = ? AND usuario.contrasenia = ?";
    let promise = await sqlQuery(sql, [email, password]);
    return promise.length > 0;
}

async function register(name, email, password){
    try {
        let sql = "INSERT INTO usuario(nombre, email, password) VALUES(?, ?, ?)";
        let promise = await sqlQuery(sql, [name, email, password]);
        return true;
    } catch(err){
        return err;
    }

}

let nombre = "Test";
let email = "test@test.test";
let contrasenia = "incorrecta";
nameLogIn(nombre, contrasenia).then((value) => {
    console.group("NameLogIn");
    console.log("Name: " + nombre);
    console.log("Password: " + contrasenia);
    console.log("nameLogIn?: " + value);
    console.groupEnd();
});
emailLogIn(email, contrasenia).then((value) => {
    console.group("EmailLogIn");
    console.log("Email: " + email);
    console.log("Password: " + contrasenia);
    console.log("emailLogIn?: " + value);
    console.groupEnd();
});