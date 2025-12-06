/*
This edited version of the program requires a Microsoft SQL server on your local device, and an account with username "foodloop" and password "password123" to function!
You will also need to create a database named "foodloop" with the following tables:

users: id (int + primary key with identity(1,1)), password(varchar), email(varchar), role(varchar), created_at(datetime)
profiles: id (int + primary key with identity(1,1)), user_id (int), first_name (varchar), last_name (varchar)
requests: id (int + primary key with identity(1,1)), donationName(varchar), donationDesc(text), allergies(varchar), homeAddress(text), pickupDate(date), pickupStart(time), pickupEnd(time)
individuals: id (int + primary key with identity(1,1)), firstName(varchar), lastName(varchar), phone(varchar), email(varchar), password(varchar)


users:
id INT IDENTITY(1,1) PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(50),
  city VARCHAR(255),
  state VARCHAR(255),
  role VARCHAR(100),
  profile_picture TEXT,
  user_id VARCHAR(50)

individuals:
  id INT IDENTITY(1,1) PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  password VARCHAR(255),
  user_id VARCHAR(50),
  city VARCHAR(255),
  state VARCHAR(255),
  profile_picture TEXT

requests:
  id INT IDENTITY(1,1) PRIMARY KEY,
  donationName VARCHAR(255),
  donationDesc TEXT,
  allergies VARCHAR(255),
  homeAddress TEXT,
  pickupDate DATE,
  pickupStart TIME,
  pickupEnd TIME

To run in terminal:
1. Make sure you have npm and neccessary packages installed (express, mssql, cors, dotenv... if something gives you an error, just run "npm install [package name]")
2. While still in the Foodloop directory, run "node server.js" to start the backend server.
3. Go to http://localhost:3001/homeMain.html in your web browser.
4. Website should be fully functional!
*/


const express = require("express");
const mysql = require("mssql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// SQL CONNECTION
const db = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: "localhost",
  database: "foodloop",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  port: 1433,
};

const pool = new mysql.ConnectionPool(db);
const poolConnect = pool.connect();

/*USER SIGNUP (for "users" table only) */
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;

    const check = await pool.request()
      .input("email", mysql.VarChar, email)
      .query("SELECT * FROM users WHERE email=@email");

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const userId = "FL-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    await pool.request()
      .input("email", mysql.VarChar, email)
      .input("password", mysql.VarChar, password)
      .input("user_id", mysql.VarChar, userId)
      .query(`
        INSERT INTO users (email, password, user_id)
        VALUES (@email, @password, @user_id)
      `);

    res.json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/*INDIVIDUAL SIGNUP (individuals table) */
app.post("/individual-signup", async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  try {
    await poolConnect;

    const check = await pool.request()
      .input("email", mysql.VarChar, email)
      .query("SELECT * FROM individuals WHERE email=@email");

    if (check.recordset.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const userId = "FL-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    await pool.request()
      .input("firstName", mysql.VarChar, firstName)
      .input("lastName", mysql.VarChar, lastName)
      .input("phone", mysql.VarChar, phone)
      .input("email", mysql.VarChar, email)
      .input("password", mysql.VarChar, password)
      .input("user_id", mysql.VarChar, userId)
      .query(`
        INSERT INTO individuals (firstName, lastName, phone, email, password, user_id)
        VALUES (@firstName, @lastName, @phone, @email, @password, @user_id)
      `);

    res.json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Individual signup failed:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* LOGIN (works for both tables) */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;

    let result = await pool.request()
      .input("email", mysql.VarChar, email)
      .query("SELECT * FROM users WHERE email=@email");

    if (result.recordset.length === 0) {
      result = await pool.request()
        .input("email", mysql.VarChar, email)
        .query("SELECT * FROM individuals WHERE email=@email");
    }

    if (result.recordset.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = result.recordset[0];

    if (user.password !== password) {
      return res.json({ message: "Incorrect password" });
    }

    res.json({ message: "Login Successful!" });

  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* UPDATE PROFILE (users + individuals)*/
app.put("/api/profile/:email", async (req, res) => {
  const { email } = req.params;
  const { name, phone, city, state, role, profile_picture } = req.body;

  try {
    await poolConnect;

    // Name split for individuals
    const nameParts = name ? name.split(" ") : [""];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    /* UPDATE USERS TABLE */
    let result = await pool.request()
      .input("email", mysql.VarChar, email)
      .input("name", mysql.VarChar, name || null)
      .input("phone", mysql.VarChar, phone || null)
      .input("city", mysql.VarChar, city || null)
      .input("state", mysql.VarChar, state || null)
      .input("role", mysql.VarChar, role || null)
      .input("profile_picture", mysql.Text, profile_picture || null)
      .query(`
        UPDATE users
        SET name=@name, phone=@phone, city=@city, state=@state,
            role=@role, profile_picture=@profile_picture
        WHERE email=@email
      `);

    if (result.rowsAffected[0] > 0) {
      return res.json({ message: "Profile updated successfully!" });
    }

    /* UPDATE INDIVIDUALS TABLE */
    result = await pool.request()
      .input("email", mysql.VarChar, email)
      .input("firstName", mysql.VarChar, firstName)
      .input("lastName", mysql.VarChar, lastName)
      .input("phone", mysql.VarChar, phone || null)
      .input("city", mysql.VarChar, city || null)
      .input("state", mysql.VarChar, state || null)
      .input("profile_picture", mysql.Text, profile_picture || null)
      .query(`
        UPDATE individuals
        SET firstName=@firstName, lastName=@lastName, phone=@phone,
            city=@city, state=@state, profile_picture=@profile_picture
        WHERE email=@email
      `);

    if (result.rowsAffected[0] > 0) {
      return res.json({ message: "Profile updated successfully!" });
    }

    return res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

/* GET PROFILE */
app.get("/api/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
    await poolConnect;

    // Try users table first
    let user = await pool.request()
      .input("email", mysql.VarChar, email)
      .query(`
        SELECT email, name, phone, city, state, role, profile_picture, user_id
        FROM users WHERE email=@email
      `);

    if (user.recordset.length > 0) {
      return res.json(user.recordset[0]);
    }

    // Try individuals table
    let indiv = await pool.request()
      .input("email", mysql.VarChar, email)
      .query(`
        SELECT firstName, lastName, phone, email, user_id, city, state, profile_picture
        FROM individuals WHERE email=@email
      `);

    if (indiv.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const u = indiv.recordset[0];

    return res.json({
      email: u.email,
      name: `${u.firstName} ${u.lastName}`,
      phone: u.phone,
      city: u.city,
      state: u.state,
      role: "Individual",
      user_id: u.user_id,
      profile_picture: u.profile_picture
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/* DONATION SUBMIT*/
app.post("/submitDonation", async (req, res) => {
  try {
    let p = await mysql.connect(db);

    await p.request()
      .input("donationName", mysql.VarChar, req.body.donationName)
      .input("donationDesc", mysql.Text, req.body.donationDesc)
      .input("allergies", mysql.VarChar, req.body.allergies)
      .input("homeAddress", mysql.Text, req.body.homeAddress)
      .input("pickupDate", mysql.Date, req.body.pickupDate)
      .input("pickupStart", mysql.VarChar, req.body.pickupStart)
      .input("pickupEnd", mysql.VarChar, req.body.pickupEnd)
      .query(`
        INSERT INTO requests (
          donationName, donationDesc, allergies, homeAddress,
          pickupDate, pickupStart, pickupEnd
        )
        VALUES (
          @donationName, @donationDesc, @allergies, @homeAddress,
          @pickupDate, @pickupStart, @pickupEnd
        )
      `);

    res.json({ message: "Donation successfully saved!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving donation" });
  }
});

/*LIST DONATIONS*/
app.get("/listDonations", async (req, res) => {
  try {
    const p = await mysql.connect(db);
    const result = await p.request().query("SELECT * FROM requests ORDER BY pickupDate DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error loading donations:", err);
    res.status(500).json({ message: "Error loading donation list" });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});