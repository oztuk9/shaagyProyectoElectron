const mysql = require("promise-mysql");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  port: '3308',
  database: "mantenimiento"
});

function getConnection() {
  return connection;
}

module.exports = { getConnection };
