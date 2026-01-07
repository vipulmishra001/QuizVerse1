# QuizVerse

A modern quiz application built with Node.js backend and vanilla JavaScript frontend.

## Features

- 🎯 Interactive quiz interface
- 🎨 Modern, neon-themed UI
- 📊 XP and progress tracking
- 🏆 Leaderboard system
- 🔥 Daily streaks
- 💾 MySQL database integration

## Project Structure

```
Quizverse/
├── fronted/              # Frontend files
│   ├── index.html       # Main HTML file
│   ├── script.js        # JavaScript logic
│   ├── style.css        # Styling
│   └── assets/
│       └── images/      # Image assets
├── database/
│   └── SQL FILE.sql     # Database schema
├── server.js            # Express server
├── setup-database.js    # Database setup script
└── package.json         # Dependencies

```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Quizverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Make sure MySQL is running
   - Update database credentials in `server.js` if needed
   - Run the setup script:
```bash
npm run setup-db
```

## Running the Application

1. Start the server:
```bash
npm run server
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Available Scripts

- `npm run server` - Start the Express server
- `npm run setup-db` - Set up the database
- `npm run test-db` - Test database connection

## Database Configuration

Update the database credentials in `server.js`:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "quizverse",
  port: 3306,
});
```

## Requirements

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## License

ISC
