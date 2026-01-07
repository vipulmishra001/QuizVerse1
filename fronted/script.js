// tiny helper for life (your code's, not yours)
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* NAV ACTIVE STATE ON SCROLL */
const sections = ["home", "quizzes", "games", "streaks", "leaderboard", "contact"].map(
  (id) => document.getElementById(id)
);
const navLinks = $$(".nav-link");

function updateActiveNav() {
  let currentId = "home";

  sections.forEach((sec) => {
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = sec.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", updateActiveNav);

/* SMOOTH SCROLL FOR NAV (for older browsers) */
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const offsetTop = target.offsetTop - 70;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  });
});

/* BUTTON RIPPLE CLASS TOGGLE */
$$(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.remove("clicked");
    // force reflow for animation restart
    void btn.offsetWidth;
    btn.classList.add("clicked");
  });
});

/* QUIZ QUESTIONS DATABASE */
const quizQuestions = {
  coding: [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup"],
      correct: 0
    },
    {
      question: "Which symbol is used for comments in JavaScript?",
      options: ["//", "<!--", "**", "##"],
      correct: 0
    },
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var name = 'John'", "variable name = 'John'", "v name = 'John'", "declare name = 'John'"],
      correct: 0
    },
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
      correct: 0
    },
    {
      question: "Which method is used to add an element to the end of an array in JavaScript?",
      options: ["push()", "append()", "add()", "insert()"],
      correct: 0
    },
    {
      question: "What is the output of: console.log(typeof null)?",
      options: ["object", "null", "undefined", "boolean"],
      correct: 0
    },
    {
      question: "Which HTML tag is used for the largest heading?",
      options: ["<h1>", "<head>", "<header>", "<h6>"],
      correct: 0
    },
    {
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Advanced Programming Interface", "Application Program Integration", "Automated Programming Interface"],
      correct: 0
    }
  ],
  math: [
    {
      question: "In programming, what is 2^10 (2 to the power of 10)?",
      options: ["1024", "512", "2048", "256"],
      correct: 0
    },
    {
      question: "How many bytes are in a kilobyte (KB)?",
      options: ["1024", "1000", "512", "2048"],
      correct: 0
    },
    {
      question: "What is the binary representation of the decimal number 8?",
      options: ["1000", "1001", "1010", "1100"],
      correct: 0
    },
    {
      question: "In array indexing, if an array has 10 elements, what is the index of the last element?",
      options: ["9", "10", "11", "8"],
      correct: 0
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(log n)", "O(n)", "O(n²)", "O(1)"],
      correct: 0
    },
    {
      question: "How many bits are in a byte?",
      options: ["8", "4", "16", "32"],
      correct: 0
    },
    {
      question: "What is the hexadecimal value of decimal 15?",
      options: ["F", "E", "10", "15"],
      correct: 0
    },
    {
      question: "In a binary tree, what is the maximum number of nodes at level 3?",
      options: ["8", "4", "16", "7"],
      correct: 0
    }
  ],
  iq: [
    {
      question: "What is the purpose of a loop in programming?",
      options: ["To repeat code multiple times", "To stop execution", "To create variables", "To print output"],
      correct: 0
    },
    {
      question: "Which data structure follows LIFO (Last In First Out) principle?",
      options: ["Stack", "Queue", "Array", "Linked List"],
      correct: 0
    },
    {
      question: "What is debugging?",
      options: ["Finding and fixing errors in code", "Writing new code", "Deleting code", "Copying code"],
      correct: 0
    },
    {
      question: "What does 'git' refer to in software development?",
      options: ["Version control system", "Programming language", "Database", "Framework"],
      correct: 0
    },
    {
      question: "What is a function in programming?",
      options: ["A reusable block of code", "A variable", "A data type", "An operator"],
      correct: 0
    },
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: ["== checks value, === checks value and type", "== checks type, === checks value", "They are the same", "== is for strings, === is for numbers"],
      correct: 0
    },
    {
      question: "What is an algorithm?",
      options: ["A step-by-step procedure to solve a problem", "A programming language", "A database", "A framework"],
      correct: 0
    },
    {
      question: "What does 'DOM' stand for in web development?",
      options: ["Document Object Model", "Data Object Model", "Dynamic Object Method", "Document Order Model"],
      correct: 0
    }
  ]
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizXP = 0;

/* HERO BUTTONS -> START QUIZ */
$$(".hero-buttons .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const quizType = btn.dataset.quiz;
    if (quizType) {
      startQuiz(quizType);
    }
  });
});

// Start Quiz Function
function startQuiz(quizType) {
  currentQuiz = quizType;
  currentQuestionIndex = 0;
  quizScore = 0;
  quizXP = 0;
  
  const quizModal = $("#quizModal");
  const quizContainer = $("#quizContainer");
  
  if (!quizModal || !quizContainer) return;
  
  quizContainer.innerHTML = getQuizHTML(quizType);
  quizModal.style.display = "block";
  document.body.style.overflow = "hidden";
  
  setTimeout(() => {
    initQuiz();
  }, 100);
}

// Get Quiz HTML
function getQuizHTML(quizType) {
  const titles = {
    coding: "💻 Coding Quiz",
    math: "🔢 Math & Coding Quiz",
    iq: "🧠 IQ & Coding Basics Quiz"
  };
  
  return `
    <div class="quiz-wrapper">
      <h2>${titles[quizType] || "Quiz"}</h2>
      <div class="quiz-progress">
        <div class="progress-bar">
          <div id="quizProgress" class="progress-fill"></div>
        </div>
        <span id="questionCounter">Question 1 of ${quizQuestions[quizType].length}</span>
      </div>
      <div id="quizQuestionContainer" class="quiz-question-container">
        <!-- Questions will be loaded here -->
      </div>
      <div id="quizScoreDisplay" class="quiz-score-display" style="display: none;">
        <h3>Quiz Complete! 🎉</h3>
        <div class="score-details">
          <div class="score-item">
            <span class="score-label">Score:</span>
            <span id="finalScore" class="score-value">0</span>
          </div>
          <div class="score-item">
            <span class="score-label">XP Earned:</span>
            <span id="finalXP" class="score-value">+0</span>
          </div>
          <div class="score-item">
            <span class="score-label">Accuracy:</span>
            <span id="finalAccuracy" class="score-value">0%</span>
          </div>
        </div>
        <button id="restartQuiz" class="btn primary-btn">Take Another Quiz</button>
        <button id="closeQuiz" class="btn outline-btn">Close</button>
      </div>
    </div>
  `;
}

// Initialize Quiz
function initQuiz() {
  loadQuestion();
  
  const restartBtn = $("#restartQuiz");
  const closeBtn = $("#closeQuiz");
  
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      startQuiz(currentQuiz);
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeQuizModal();
    });
  }
}

// Load Question
function loadQuestion() {
  if (!currentQuiz || !quizQuestions[currentQuiz]) return;
  
  const questions = quizQuestions[currentQuiz];
  if (currentQuestionIndex >= questions.length) {
    showQuizResults();
    return;
  }
  
  const question = questions[currentQuestionIndex];
  const container = $("#quizQuestionContainer");
  const scoreDisplay = $("#quizScoreDisplay");
  
  if (scoreDisplay) scoreDisplay.style.display = "none";
  if (!container) return;
  
  container.innerHTML = `
    <div class="question-text">${question.question}</div>
    <div class="quiz-options-list">
      ${question.options.map((option, index) => `
        <button class="quiz-option-btn" data-index="${index}">${option}</button>
      `).join("")}
    </div>
  `;
  
  // Update progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const progressBar = $("#quizProgress");
  const questionCounter = $("#questionCounter");
  
  if (progressBar) progressBar.style.width = progress + "%";
  if (questionCounter) questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  
  // Add click handlers
  $$(".quiz-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedIndex = parseInt(btn.dataset.index);
      checkAnswer(selectedIndex, question.correct);
    });
  });
}

// Check Answer
function checkAnswer(selected, correct) {
  const buttons = $$(".quiz-option-btn");
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correct) {
      btn.classList.add("correct");
    } else if (index === selected) {
      btn.classList.add("wrong");
    }
  });
  
  if (selected === correct) {
    quizScore++;
    quizXP += 10;
  }
  
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}

// Show Quiz Results
function showQuizResults() {
  const container = $("#quizQuestionContainer");
  const scoreDisplay = $("#quizScoreDisplay");
  const questions = quizQuestions[currentQuiz];
  const accuracy = Math.round((quizScore / questions.length) * 100);
  
  if (container) container.style.display = "none";
  if (scoreDisplay) {
    scoreDisplay.style.display = "block";
    $("#finalScore").textContent = `${quizScore}/${questions.length}`;
    $("#finalXP").textContent = `+${quizXP}`;
    $("#finalAccuracy").textContent = `${accuracy}%`;
  }
  
  // Update global XP
  xp = Math.min(100, xp + quizXP);
  if (xpFill) xpFill.style.width = xp + "%";
  if (xpSpan) xpSpan.textContent = xp.toString();
}

// Close Quiz Modal
function closeQuizModal() {
  const quizModal = $("#quizModal");
  if (quizModal) {
    quizModal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

/* QUICK QUIZ LOGIC */
let xp = 0;
const xpFill = $(".xp-fill");
const xpSpan = $("#xp");
const quizMsg = $("#quiz-message");

$$(".quiz-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    // clear previous state
    $$(".quiz-option").forEach((b) => b.classList.remove("correct", "wrong"));

    const isCorrect = btn.dataset.correct === "true";

    if (isCorrect) {
      btn.classList.add("correct");
      const gained = xp >= 100 ? 0 : 20;
      xp = Math.min(100, xp + gained);
      quizMsg.style.color = "var(--success)";
      quizMsg.textContent =
        xp >= 100
          ? "Max XP for this quiz reached. Calm down."
          : `Nice! +${gained} XP earned.`;
    } else {
      btn.classList.add("wrong");
      quizMsg.style.color = "var(--danger)";
      quizMsg.textContent = "Wrong answer. Think, don't just click randomly.";
      xp = Math.max(0, xp - 5);
    }

    xpFill.style.width = xp + "%";
    xpSpan.textContent = xp.toString();
  });
});

// initial call for nav highlight
updateActiveNav();

/* GAMES SECTION */
const games = [
  {
    id: "guess",
    name: "Guess the Number",
    icon: "🎯",
    description: "Find the secret number from 1 to 100",
    category: "logic"
  },
  {
    id: "rps",
    name: "Rock Paper Scissors",
    icon: "✂️",
    description: "Play vs computer",
    category: "logic"
  },
  {
    id: "click",
    name: "Click Speed Test",
    icon: "⚡",
    description: "How many clicks in 10 seconds?",
    category: "speed"
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    icon: "⭕",
    description: "Play vs friend or vs bot",
    category: "logic"
  },
  {
    id: "memory",
    name: "Memory Match",
    icon: "🧠",
    description: "Match pairs of cards",
    category: "logic"
  },
  {
    id: "snake",
    name: "Snake Game",
    icon: "🐍",
    description: "Classic snake game",
    category: "speed"
  }
];

// Render games grid
function renderGames() {
  const gamesGrid = $("#gamesGrid");
  if (!gamesGrid) return;

  gamesGrid.innerHTML = games.map(game => `
    <div class="game-card" data-game="${game.id}">
      <div class="game-icon">${game.icon}</div>
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <button class="btn primary-btn play-btn">Play Now</button>
    </div>
  `).join("");

  // Add click handlers
  $$(".play-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const game = games[index];
      loadGame(game.id);
    });
  });
}

// Load and display game
function loadGame(gameId) {
  const gameContainer = $("#gameContainer");
  const gameModal = $("#gameModal");
  if (!gameContainer || !gameModal) return;

  gameContainer.innerHTML = getGameHTML(gameId);
  gameModal.style.display = "block";
  document.body.style.overflow = "hidden";
  
  // Initialize game after a small delay to ensure DOM is ready
  setTimeout(() => {
    initGame(gameId);
  }, 100);
}

// Get game HTML
function getGameHTML(gameId) {
  const gamesHTML = {
    guess: `
      <div class="game-wrapper">
        <h2>🎯 Guess the Number</h2>
        <p>I'm thinking of a number between 1 and 100. Can you guess it?</p>
        <div class="guess-game">
          <input type="number" id="guessInput" min="1" max="100" placeholder="Enter your guess">
          <button id="guessBtn" class="btn primary-btn">Guess</button>
          <button id="newGameBtn" class="btn outline-btn">New Game</button>
          <div id="guessMessage" class="game-message"></div>
          <div id="guessAttempts">Attempts: 0</div>
        </div>
      </div>
    `,
    rps: `
      <div class="game-wrapper">
        <h2>✂️ Rock Paper Scissors</h2>
        <div class="rps-game">
          <div class="rps-choices">
            <button class="rps-btn" data-choice="rock">🪨 Rock</button>
            <button class="rps-btn" data-choice="paper">📄 Paper</button>
            <button class="rps-btn" data-choice="scissors">✂️ Scissors</button>
          </div>
          <div id="rpsResult" class="game-result"></div>
          <div class="rps-score">
            <div>You: <span id="playerScore">0</span></div>
            <div>Computer: <span id="computerScore">0</span></div>
          </div>
        </div>
      </div>
    `,
    click: `
      <div class="game-wrapper">
        <h2>⚡ Click Speed Test</h2>
        <div class="click-game">
          <div id="clickTimer" class="click-timer">10</div>
          <button id="clickBtn" class="click-btn">Click Me!</button>
          <div id="clickCount" class="click-count">0 clicks</div>
          <button id="clickStartBtn" class="btn primary-btn">Start</button>
        </div>
      </div>
    `,
    tictactoe: `
      <div class="game-wrapper">
        <h2>⭕ Tic Tac Toe</h2>
        <div class="ttt-game">
          <div id="tttBoard" class="ttt-board"></div>
          <div id="tttStatus" class="ttt-status">Your turn (X)</div>
          <button id="tttReset" class="btn outline-btn">Reset Game</button>
        </div>
      </div>
    `,
    memory: `
      <div class="game-wrapper">
        <h2>🧠 Memory Match</h2>
        <div class="memory-game">
          <div id="memoryBoard" class="memory-board"></div>
          <div id="memoryScore">Matches: 0 / 8</div>
          <button id="memoryReset" class="btn outline-btn">New Game</button>
        </div>
      </div>
    `,
    snake: `
      <div class="game-wrapper">
        <h2>🐍 Snake Game</h2>
        <div class="snake-game">
          <canvas id="snakeCanvas" width="400" height="400"></canvas>
          <div class="snake-controls">
            <div id="snakeScore">Score: 0</div>
            <button id="snakeStart" class="btn primary-btn">Start Game</button>
            <p>Use arrow keys to control</p>
          </div>
        </div>
      </div>
    `
  };

  return gamesHTML[gameId] || "<p>Game not found</p>";
}

// Initialize game logic
function initGame(gameId) {
  switch(gameId) {
    case "guess":
      initGuessGame();
      break;
    case "rps":
      initRPSGame();
      break;
    case "click":
      initClickGame();
      break;
    case "tictactoe":
      initTTTGame();
      break;
    case "memory":
      initMemoryGame();
      break;
    case "snake":
      initSnakeGame();
      break;
  }
}

// Guess the Number Game
function initGuessGame() {
  const guessBtn = $("#guessBtn");
  const newGameBtn = $("#newGameBtn");
  if (!guessBtn || !newGameBtn) return;

  let secretNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  guessBtn.addEventListener("click", () => {
    const guessInput = $("#guessInput");
    const guess = parseInt(guessInput ? guessInput.value : 0);
    const message = $("#guessMessage");
    const attemptsDiv = $("#guessAttempts");

    if (!guess || guess < 1 || guess > 100) {
      message.textContent = "Please enter a number between 1 and 100";
      message.style.color = "var(--danger)";
      return;
    }

    attempts++;
    attemptsDiv.textContent = `Attempts: ${attempts}`;

    if (guess === secretNumber) {
      message.textContent = `🎉 Correct! You found it in ${attempts} attempts!`;
      message.style.color = "var(--success)";
    } else if (guess < secretNumber) {
      message.textContent = "📈 Too low! Try again.";
      message.style.color = "var(--neon)";
    } else {
      message.textContent = "📉 Too high! Try again.";
      message.style.color = "var(--neon)";
    }
  });

  newGameBtn.addEventListener("click", () => {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    const guessInput = $("#guessInput");
    const guessMessage = $("#guessMessage");
    const guessAttempts = $("#guessAttempts");
    if (guessInput) guessInput.value = "";
    if (guessMessage) guessMessage.textContent = "";
    if (guessAttempts) guessAttempts.textContent = "Attempts: 0";
  });
}

// Rock Paper Scissors Game
function initRPSGame() {
  let playerScore = 0;
  let computerScore = 0;

  const choices = ["rock", "paper", "scissors"];
  const emojis = { rock: "🪨", paper: "📄", scissors: "✂️" };

  $$(".rps-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const playerChoice = btn.dataset.choice;
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      const result = $("#rpsResult");

      let outcome = "";
      if (playerChoice === computerChoice) {
        outcome = "🤝 It's a tie!";
      } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
      ) {
        outcome = "🎉 You win!";
        playerScore++;
        $("#playerScore").textContent = playerScore;
      } else {
        outcome = "😢 You lose!";
        computerScore++;
        $("#computerScore").textContent = computerScore;
      }

      result.innerHTML = `
        <div>You chose: ${emojis[playerChoice]} ${playerChoice}</div>
        <div>Computer chose: ${emojis[computerChoice]} ${computerChoice}</div>
        <div style="margin-top: 10px; font-size: 1.2rem;">${outcome}</div>
      `;
    });
  });
}

// Click Speed Test Game
function initClickGame() {
  let count = 0;
  let timeLeft = 10;
  let timer = null;
  let isRunning = false;

  $("#clickStartBtn").addEventListener("click", () => {
    if (isRunning) return;
    
    isRunning = true;
    count = 0;
    timeLeft = 10;
    $("#clickCount").textContent = "0 clicks";
    $("#clickBtn").disabled = false;
    $("#clickStartBtn").disabled = true;

    timer = setInterval(() => {
      timeLeft--;
      $("#clickTimer").textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        $("#clickBtn").disabled = true;
        $("#clickStartBtn").disabled = false;
        isRunning = false;
        $("#clickTimer").textContent = "Time's up!";
      }
    }, 1000);
  });

  $("#clickBtn").addEventListener("click", () => {
    if (!isRunning) return;
    count++;
    $("#clickCount").textContent = `${count} clicks`;
  });
}

// Tic Tac Toe Game
function initTTTGame() {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;

  function renderBoard() {
    const boardEl = $("#tttBoard");
    boardEl.innerHTML = "";
    board.forEach((cell, index) => {
      const cellEl = document.createElement("div");
      cellEl.className = "ttt-cell";
      cellEl.textContent = cell;
      cellEl.addEventListener("click", () => makeMove(index));
      boardEl.appendChild(cellEl);
    });
  }

  function makeMove(index) {
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkWinner()) {
      $("#tttStatus").textContent = `🎉 ${currentPlayer} wins!`;
      gameActive = false;
      return;
    }

    if (board.every(cell => cell !== "")) {
      $("#tttStatus").textContent = "🤝 It's a tie!";
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    $("#tttStatus").textContent = `Player ${currentPlayer}'s turn`;
  }

  function checkWinner() {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  }

  $("#tttReset").addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    $("#tttStatus").textContent = "Your turn (X)";
    renderBoard();
  });

  renderBoard();
}

// Memory Match Game
function initMemoryGame() {
  const symbols = ["🎯", "🎮", "⚡", "🌟", "🔥", "💎", "🎨", "🚀"];
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  let flippedCards = [];
  let matchedPairs = 0;

  function renderBoard() {
    const board = $("#memoryBoard");
    board.innerHTML = "";
    cards.forEach((symbol, index) => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.dataset.index = index;
      card.textContent = "?";
      card.addEventListener("click", () => flipCard(index));
      board.appendChild(card);
    });
  }

  function flipCard(index) {
    const card = $(`.memory-card[data-index="${index}"]`);
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.textContent = cards[index];
    card.classList.add("flipped");
    flippedCards.push(index);

    if (flippedCards.length === 2) {
      setTimeout(() => {
        const [a, b] = flippedCards;
        if (cards[a] === cards[b]) {
          $(`.memory-card[data-index="${a}"]`).classList.add("matched");
          $(`.memory-card[data-index="${b}"]`).classList.add("matched");
          matchedPairs++;
          $("#memoryScore").textContent = `Matches: ${matchedPairs} / 8`;
        } else {
          $(`.memory-card[data-index="${a}"]`).textContent = "?";
          $(`.memory-card[data-index="${b}"]`).textContent = "?";
          $(`.memory-card[data-index="${a}"]`).classList.remove("flipped");
          $(`.memory-card[data-index="${b}"]`).classList.remove("flipped");
        }
        flippedCards = [];
      }, 1000);
    }
  }

  $("#memoryReset").addEventListener("click", () => {
    cards.sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    $("#memoryScore").textContent = "Matches: 0 / 8";
    renderBoard();
  });

  renderBoard();
}

// Snake Game
function initSnakeGame() {
  const canvas = $("#snakeCanvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const gridSize = 20;
  let snake = [{x: 10, y: 10}];
  let direction = {x: 0, y: 0};
  let food = {x: 15, y: 15};
  let score = 0;
  let gameLoop = null;

  function draw() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e";
    snake.forEach(segment => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = "#ff4d67";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }

  function move() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
      gameOver();
      return;
    }

    // Check collision with self
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        gameOver();
        return;
      }
    }

    if (head.x === food.x && head.y === food.y) {
      score++;
      $("#snakeScore").textContent = `Score: ${score}`;
      // Generate new food position (not on snake)
      do {
        food = {
          x: Math.floor(Math.random() * (canvas.width / gridSize)),
          y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
      } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
    } else {
      snake.pop();
    }

    snake.unshift(head);
    draw();
  }

  function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    $("#snakeStart").disabled = false;
  }

  $("#snakeStart").addEventListener("click", () => {
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    score = 0;
    $("#snakeScore").textContent = "Score: 0";
    $("#snakeStart").disabled = true;
    draw();

    gameLoop = setInterval(move, 150);
  });

  const keyHandler = (e) => {
    const startBtn = $("#snakeStart");
    if (!startBtn || startBtn.disabled === false) return;
    
    switch(e.key) {
      case "ArrowUp": if (direction.y === 0) direction = {x: 0, y: -1}; break;
      case "ArrowDown": if (direction.y === 0) direction = {x: 0, y: 1}; break;
      case "ArrowLeft": if (direction.x === 0) direction = {x: -1, y: 0}; break;
      case "ArrowRight": if (direction.x === 0) direction = {x: 1, y: 0}; break;
    }
  };

  document.addEventListener("keydown", keyHandler);

  draw();
  
  // Clean up event listener when modal closes
  return () => {
    document.removeEventListener("keydown", keyHandler);
  };
}

// Leaderboard Data with Indian Names
const leaderboardData = {
  global: [
    { name: "Arjun Sharma", xp: 15420, level: 25, streak: 45, badge: "👑" },
    { name: "Priya Patel", xp: 14280, level: 24, streak: 38, badge: "💎" },
    { name: "Rohan Verma", xp: 13850, level: 23, streak: 42, badge: "🔥" },
    { name: "Ananya Singh", xp: 13120, level: 22, streak: 35, badge: "⚡" },
    { name: "Karan Mehta", xp: 12500, level: 21, streak: 40, badge: "🌟" },
    { name: "Isha Reddy", xp: 11890, level: 20, streak: 33, badge: "🚀" },
    { name: "Vikram Joshi", xp: 11250, level: 19, streak: 37, badge: "💫" },
    { name: "Sneha Agarwal", xp: 10800, level: 18, streak: 30, badge: "🎯" },
    { name: "Aditya Kumar", xp: 10240, level: 17, streak: 28, badge: "⭐" },
    { name: "Meera Nair", xp: 9850, level: 16, streak: 32, badge: "🏆" }
  ],
  weekly: [
    { name: "Rohan Verma", xp: 2450, level: 23, streak: 7, badge: "🔥" },
    { name: "Ananya Singh", xp: 2320, level: 22, streak: 7, badge: "⚡" },
    { name: "Arjun Sharma", xp: 2180, level: 25, streak: 7, badge: "👑" },
    { name: "Karan Mehta", xp: 2050, level: 21, streak: 6, badge: "🌟" },
    { name: "Priya Patel", xp: 1920, level: 24, streak: 7, badge: "💎" }
  ],
  monthly: [
    { name: "Arjun Sharma", xp: 8520, level: 25, streak: 45, badge: "👑" },
    { name: "Priya Patel", xp: 7980, level: 24, streak: 38, badge: "💎" },
    { name: "Rohan Verma", xp: 7450, level: 23, streak: 42, badge: "🔥" },
    { name: "Ananya Singh", xp: 7120, level: 22, streak: 35, badge: "⚡" },
    { name: "Karan Mehta", xp: 6800, level: 21, streak: 40, badge: "🌟" }
  ]
};

// Render Leaderboard
function renderLeaderboard(tab = "global") {
  const list = $("#leaderboardList");
  if (!list) return;
  
  const data = leaderboardData[tab] || leaderboardData.global;
  
  list.innerHTML = data.map((user, index) => `
    <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}" style="animation-delay: ${index * 0.1}s">
      <div class="rank">${index + 1}</div>
      <div class="user-info">
        <div class="user-avatar">${user.badge}</div>
        <div class="user-details">
          <div class="user-name">${user.name}</div>
          <div class="user-stats">
            <span>Level ${user.level}</span>
            <span>•</span>
            <span>🔥 ${user.streak} days</span>
          </div>
        </div>
      </div>
      <div class="user-xp">${user.xp.toLocaleString()} XP</div>
    </div>
  `).join("");
}

// Initialize Leaderboard Tabs
function initLeaderboardTabs() {
  $$(".leaderboard-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".leaderboard-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderLeaderboard(btn.dataset.tab);
    });
  });
  
  renderLeaderboard("global");
}

// Modal controls
const gameModal = $("#gameModal");
const quizModal = $("#quizModal");
const closeBtns = $$(".game-modal-close");

closeBtns.forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    if (gameModal) gameModal.style.display = "none";
    if (quizModal) quizModal.style.display = "none";
    document.body.style.overflow = "auto";
  });
});

if (gameModal) {
  gameModal.addEventListener("click", (e) => {
    if (e.target === gameModal) {
      gameModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

if (quizModal) {
  quizModal.addEventListener("click", (e) => {
    if (e.target === quizModal) {
      quizModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

// Contact form handler
const contactForm = $(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    if (name && email && message) {
      alert("Thank you for your message! We'll get back to you soon.");
      contactForm.reset();
    } else {
      alert("Please fill in all fields.");
    }
  });
}

// Initialize everything when DOM is ready
function initApp() {
  renderGames();
  initLeaderboardTabs();
  updateActiveNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

