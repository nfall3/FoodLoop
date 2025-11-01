/*
Warning: this is an experimental program made to connect to a Microsoft SQL server! 
If you're trying to develop, use the main branch, Signup-Login-DatabaseConnection!!
This edited version of the program requires a Microsoft SQL server on your local device, and an account with username "foodloop" and password "password123" to function!
So far, this matches the current functionality of the main branch, just refitted to work with Microsoft SQL, but be wary!

To run in terminal:
1. Change directory to backend and run "node server.js".
2. In a seperate terminal, change directory to frontend-app and run "npm start".
3. Website should appear automatically!
*/

const express = require("express");
const mysql = require("mssql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const db = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: "localhost",
  database: "foodloop",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433
};

const pool = new mysql.ConnectionPool(db);
const poolConnect = pool.connect();

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;

    const request = pool.request();
    request.input("email", mysql.VarChar, email);
    request.input("password", mysql.VarChar, password);

    const checkResult = await request.query("SELECT * FROM users WHERE email = @email");

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    await pool.request()
      .input("email", mysql.VarChar, email)
      .input("password", mysql.VarChar, password)
      .query("INSERT INTO users (email, password) VALUES (@email, @password)");

    res.status(200).json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({ message: "Database error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;

    const result = await pool.request()
      .input("email", mysql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = result.recordset[0];
    if (user.password === password) {
      res.json({ message: "Login Successful!" });
    } else {
      res.json({ message: "Incorrect password" });
    }
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Database error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});