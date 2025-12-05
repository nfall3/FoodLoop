const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "foodloop",
  port: Number(process.env.DATABASE_PORT) || 3306
});

connection.connect((error) => {
  if (error) {
    console.log("Unable to connect to MySQL", error);
    return;
  }

  const userEmail = "user@testexample.com";
  console.log("Successfully connected to MySQL Database");

  const sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [userEmail], (error, results) => {
    if (error) {
      console.log("Unable to connect to the query", error.message);
      return;
    }

    if (results.length > 0) {
      console.log("Successfully found user");
      console.log(results[0]);
    } else {
      console.log("Unable to find user's email");
    }

    connection.end((error) => {
      if (error) {
        console.log("Unable to close connection", error.message);
        return;
      }
      console.log("Connection closed");
    });
  });
});

module.exports = connection;