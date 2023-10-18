var mysql = require('mysql');

//--db connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testwave",
  multipleStatements: true
})


module.exports = connection;
