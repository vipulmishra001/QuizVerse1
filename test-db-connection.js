const mysql = require("mysql2");

// Test connection without database first
const config = {
  host: "localhost",
  user: "root",
  password: "Mallesh@2006",
  port: 3306,
};

console.log("🔹 Testing MySQL connection...");
console.log(`   Host: ${config.host}`);
console.log(`   User: ${config.user}`);
console.log(`   Port: ${config.port}`);

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error("\n❌ Connection failed!");
    console.error(`   Error: ${err.message}`);
    console.error(`   Code: ${err.code}`);
    
    if (err.code === "ECONNREFUSED") {
      console.log("\n💡 MySQL server is not running or not accessible.");
      console.log("   Please start MySQL service:");
      console.log("   - Windows: Open Services and start MySQL");
      console.log("   - Or use MySQL Workbench to start the server");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n💡 Wrong username or password.");
      console.log("   Please update credentials in server.js and setup-database.js");
    } else {
      console.log("\n💡 Please check:");
      console.log("   1. MySQL is installed and running");
      console.log("   2. Credentials are correct");
      console.log("   3. Port 3306 is not blocked");
    }
    process.exit(1);
  }

  console.log("\n✅ Successfully connected to MySQL!");
  
  // Test if database exists
  connection.query("SHOW DATABASES LIKE 'quizverse'", (err, results) => {
    if (err) {
      console.error("Error checking database:", err.message);
    } else if (results.length > 0) {
      console.log("✅ Database 'quizverse' exists");
    } else {
      console.log("⚠️  Database 'quizverse' does not exist");
      console.log("   Run: node setup-database.js to create it");
    }
    
    connection.end();
    console.log("\n✅ Connection test completed!");
  });
});

