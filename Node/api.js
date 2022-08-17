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

async function sqlQuery (query){
    console.log("Running query");
    let promise = new Promise((resolve, reject) => {
        pool.query(query, (err, result) => {
            if(err) throw err;
            resolve(result);
        });
    });

    return await promise;
}

function nameLogIn(name, password){
    let value = false;
    let sql = "SELECT 1 FROM usuario WHERE usuario.nombre = " + mysql.escape(name) + " AND usuario.contrasenia = " + mysql.escape(password);
    sqlQuery(sql).then(result => {
        console.log("------------------------------");
        console.log(name + ", " + password);
        console.table(result);
        console.log(result.length > 0),
        console.log("------------------------------");
        value = result.length > 0;
    });
    return value;
}

console.log("------------------------------");
console.log("Name: Hola\nPassword: test");
console.log(nameLogIn("Hola", "test"));
console.log("------------------------------");
console.log("Name: Test\nPassword: incorrecta");
console.log(nameLogIn("Test", "incorrecta"));
console.log("------------------------------");