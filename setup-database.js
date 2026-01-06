const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Database configuration
const config = {
  host: "localhost",
  user: "root",
  password: "Mallesh@2006",
  port: 3306,
};

// Create connection without database first
const connection = mysql.createConnection(config);

console.log("🔹 Connecting to MySQL...");

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    console.log("\n💡 Please check:");
    console.log("   1. MySQL server is running");
    console.log("   2. Credentials in setup-database.js are correct");
    console.log("   3. MySQL is accessible on port 3306");
    process.exit(1);
  }

  console.log("✅ Connected to MySQL");

  // Create database if it doesn't exist
  connection.query("CREATE DATABASE IF NOT EXISTS quizverse", (err) => {
    if (err) {
      console.error("❌ Error creating database:", err.message);
      connection.end();
      process.exit(1);
    }

    console.log("✅ Database 'quizverse' created/verified");

    // Switch to the database
    connection.query("USE quizverse", (err) => {
      if (err) {
        console.error("❌ Error switching to database:", err.message);
        connection.end();
        process.exit(1);
      }

      // Read and execute SQL file
      const sqlFile = path.join(__dirname, "database", "SQL FILE.sql");
      
      if (!fs.existsSync(sqlFile)) {
        console.error("❌ SQL file not found:", sqlFile);
        connection.end();
        process.exit(1);
      }

      console.log("🔹 Reading SQL file...");
      const sql = fs.readFileSync(sqlFile, "utf8");

      // Split by semicolons and execute each statement
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

      console.log(`🔹 Executing ${statements.length} SQL statements...`);

      let completed = 0;
      let errors = 0;

      statements.forEach((statement, index) => {
        if (statement.length > 10) {
          // Skip very short statements (likely comments or empty)
          connection.query(statement, (err) => {
            completed++;
            if (err) {
              // Ignore "table already exists" errors
              if (!err.message.includes("already exists")) {
                errors++;
                console.error(`⚠️  Statement ${index + 1} error:`, err.message);
              }
            }

            if (completed === statements.length) {
              if (errors === 0) {
                console.log("✅ Database setup completed successfully!");
                console.log("\n📊 Database 'quizverse' is ready to use.");
                console.log("🚀 You can now start the server with: npm run server");
              } else {
                console.log(`⚠️  Setup completed with ${errors} errors (some may be expected)`);
              }
              connection.end();
            }
          });
        } else {
          completed++;
          if (completed === statements.length) {
            console.log("✅ Database setup completed!");
            connection.end();
          }
        }
      });
    });
  });
});

