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

/* HERO BUTTONS -> SIMPLE MESSAGE */
$$(".hero-buttons .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.quiz;
    const msg = $("#quiz-message");
    if (!msg) return;

    if (type === "coding") {
      msg.textContent = "Coding quiz loading... in your imagination for now.";
    } else if (type === "math") {
      msg.textContent = "Math quiz: warm up your brain, not your calculator.";
    } else if (type === "iq") {
      msg.textContent = "IQ quiz ready: try not to embarrass yourself.";
    }
  });
});

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

