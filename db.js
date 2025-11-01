const mysql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const connection = {
  host: "localhost\\SQLEXPRESS",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: "foodloop",
  port: parseInt(process.env.DATABASE_PORT, 10) || 1433
};

async function connect() {
  try {
    await mysql.connect(connection);
    console.log("Database connected");
    } catch (err) {
      console.error("Database failed:", err);
  }
}

connect();

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

module.exports = connection;