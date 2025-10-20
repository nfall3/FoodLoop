const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "foodloop",
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// --- SIGNUP ROUTE ---
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(insertQuery, [email, password], (err) => {
      if (err) return res.status(500).json({ message: "Signup failed" });
      res.status(200).json({ message: "Signup successful!" });
    });
  });
});

// --- LOGIN ROUTE (ADD THIS PART HERE) ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.log("Error checking user:", err);
      return res.status(500).json({ message: "Login failed" });
    }

    if (results.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = results[0];
    if (user.password === password) {
      res.json({ message: "Login Successful!" });
    } else {
      res.json({ message: "Incorrect password" });
    }
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});