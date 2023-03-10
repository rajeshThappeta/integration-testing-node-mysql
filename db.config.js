const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log("err in db connect", err);
  } else {
    console.log("DB connection success");
  }
});

module.exports = connection;
