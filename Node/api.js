let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "b-ready"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  let sql = "SELECT * FROM usuario";
  con.query(sql, (err, result) => {
    if (err) throw err;
    return console.log(result);
  })

  con.end((err) => {
    if (err) console.log(err);
    return console.log("Close the database connection");
  });
});