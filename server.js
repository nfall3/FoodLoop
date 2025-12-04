/*
This edited version of the program requires a Microsoft SQL server on your local device, and an account with username "foodloop" and password "password123" to function!
You will also need to create a database named "foodloop" with the following tables:

users: id (int), password(varchar), email(varchar), role(varchar), created_at(datetime)
profiles: id (int), user_id (int), first_name (varchar), last_name (varchar)
requests: id (int), donationName(varchar), donationDesc(text), allergies(varchar), homeAddress(text), pickupDate(date), pickupStart(time), pickupEnd(time)

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

        res.send("Donation successfully saved!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data.");
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