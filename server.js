const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 SERVE FRONTEND FILES
app.use(express.static(path.join(__dirname, "fronted")));

// 🔹 MYSQL CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mallesh@2006",
  database: "quizverse",
  port: 3306,
});

let dbConnected = false;

// 🔹 CONNECT DATABASE
db.connect((err) => {
  if (err) {
    console.log("⚠️  Database connection failed:", err.message);
    console.log("⚠️  Frontend will still work, but API endpoints won't function.");
    console.log("💡 To fix: Run 'node setup-database.js' to set up the database");
    dbConnected = false;
  } else {
    console.log("✅ MySQL Connected");
    dbConnected = true;
  }
});

// 🔹 API ROUTE
app.get("/quizzes", (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ 
      error: "Database not connected", 
      message: "Please check your MySQL connection. The database server may not be running." 
    });
  }
  
  db.query("SELECT * FROM quizzes", (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.status(500).json({ 
        error: "Database query failed", 
        message: err.message 
      });
    } else {
      res.json(results);
    }
  });
});

// 🔹 DEFAULT ROUTE → FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "fronted", "index.html"));
});

// 🔹 START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  console.log("Frontend available at: http://localhost:3000");
});
