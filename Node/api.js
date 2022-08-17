let mysql = require('mysql');

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "b-ready"
});

async function logIn(name, password){
    let promise = new Promise((resolve, reject) => {
        let sql = "SELECT usuario.Email FROM usuario WHERE usuario.Nombre = ? AND usuario.Contrasenia = ?";
        pool.query(sql, [name, password], (err, result) => {
            if (err) reject(err);
            console.log("result: ");
            console.table(result);
            resolve(result);
        });
    })

    let conResult = await promise;

    promise.finally(() => {
        pool.end((err) => {
            if(err) throw err;
            console.log("Closing pool");
        });
    });

    console.log("conResult: ");
    console.table(conResult);
    return conResult.result;
}

console.log("El resultado es: " + logIn("Test", "incorrecta"));