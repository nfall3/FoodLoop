/*
This edited version of the program requires a Microsoft SQL server on your local device, and an account with username "foodloop" and password "password123" to function!
You will also need to create a database named "foodloop" with the following tables:

users: id (int + primary key with identity(1,1)), password(varchar), email(varchar), role(varchar), created_at(datetime)
profiles: id (int + primary key with identity(1,1)), user_id (int), first_name (varchar), last_name (varchar)
requests: id (int + primary key with identity(1,1)), donationName(varchar), donationDesc(text), allergies(varchar), homeAddress(text), pickupDate(date), pickupStart(time), pickupEnd(time)
individuals: id (int + primary key with identity(1,1)), firstName(varchar), lastName(varchar), phone(varchar), email(varchar), password(varchar)

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
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
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
    const userId = "FL-" + Math.random().toString(36).substr(2, 9).toUpperCase();

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

app.post("/individual-signup", async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  try {
    await poolConnect;

    // Check if email already exists
    const checkRequest = pool.request();
    checkRequest.input("email", mysql.VarChar, email);

    const checkResult = await checkRequest.query(
      "SELECT * FROM individuals WHERE email = @email"
    );

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Insert new individual
    const insertRequest = pool.request();
    insertRequest.input("firstName", mysql.VarChar, firstName);
    insertRequest.input("lastName", mysql.VarChar, lastName);
    insertRequest.input("phone", mysql.VarChar, phone);
    insertRequest.input("email", mysql.VarChar, email);
    insertRequest.input("password", mysql.VarChar, password);

    await insertRequest.query(`
      INSERT INTO individuals (firstName, lastName, phone, email, password)
      VALUES (@firstName, @lastName, @phone, @email, @password)
    `);

    res.status(200).json({ message: "Signup successful!" });

  } catch (err) {
    console.error("Individual signup failed:", err);
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

// GET user profile by email
app.get("/api/profile/:email", async (req, res) => {
  const { email } = req.params;
 
  try {
    await poolConnect;
   
    const result = await pool.request()
      .input("email", mysql.VarChar, email)
      .query("SELECT user_id, email, name, phone, city, state, role, profile_picture FROM users WHERE email = @email");
   
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
   
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE user profile
app.put("/api/profile/:email", async (req, res) => {
  const { email } = req.params;
  const { name, phone, city, state, role, profile_picture } = req.body;
 
  try {
    await poolConnect;
   
    const result = await pool.request()
      .input("email", mysql.VarChar, email)
      .input("name", mysql.VarChar, name)
      .input("phone", mysql.VarChar, phone)
      .input("city", mysql.VarChar, city)
      .input("state", mysql.VarChar, state)
      .input("role", mysql.VarChar, role)
      .input("profile_picture", mysql.Text, profile_picture)
      .query(`
        UPDATE users
        SET name = @name, phone = @phone, city = @city, state = @state, role = @role, profile_picture = @profile_picture
        WHERE email = @email
      `);
   
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }
   
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

app.post("/submitDonation", async (req, res) => {
    try {
        let pool = await mysql.connect(db);
        const fixTime = t => t ? `${t}:00` : null;

        await pool.request()
            .input('donationName', mysql.VarChar, req.body.donationName)
            .input('donationDesc', mysql.Text, req.body.donationDesc)
            .input('allergies', mysql.VarChar, req.body.allergies)
            .input('homeAddress', mysql.Text, req.body.homeAddress)
            .input('pickupDate', mysql.Date, req.body.pickupDate)
            .input('pickupStart', mysql.VarChar, req.body.pickupStart)
            .input('pickupEnd', mysql.VarChar, req.body.pickupEnd)
            .query(`
                INSERT INTO requests (
                    donationName,
                    donationDesc,
                    allergies,
                    homeAddress,
                    pickupDate,
                    pickupStart,
                    pickupEnd
                ) VALUES (
                    @donationName,
                    @donationDesc,
                    @allergies,
                    @homeAddress,
                    @pickupDate,
                    @pickupStart,
                    @pickupEnd
                )
            `);

        res.status(200).json({ message: "Donation successfully saved!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error saving data." });
    }
});

app.get("/listDonations", async (req, res) => {
    try {
        const pool = await mysql.connect(db);
        const result = await pool.request().query("SELECT * FROM requests ORDER BY pickupDate DESC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching donations:", err);
        res.status(500).json({ message: "Database error" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});