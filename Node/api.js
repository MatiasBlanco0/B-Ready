let mysql = require('mysql');

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "b-ready"
});

function logIn(name, password){
    let conResult;
    let sql = "SELECT usuario.Email FROM usuario WHERE usuario.Nombre = ? AND usuario.Contrasenia = ?";
    pool.query(sql, [name, password], (err, result) => {
        if (err) throw err;
        console.log("result: ");
        console.table(result);
        conResult = result;
    })

    pool.end((err) => {
        if(err) throw err;
        console.log("Closing pool");
    });

    console.log("conResult: ");
    console.table(conResult);
    return "Ayuda nacho no funciona";
}

console.log("El resultado es: " + logIn("Test", "incorrecta"));