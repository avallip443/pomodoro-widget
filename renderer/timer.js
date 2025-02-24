const pomodoro = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 3,
}

let isTimerRunning = false;
let timer = null;
let isPaused = false;
let minutes = pomodoro.work;
let seconds = 0;
let sessionCount = 0;

const startButton = document.querySelector(".start-btn");
const pauseResumeButton = document.querySelector(".pause");
const stopButton = document.querySelector(".stop");
const controls = document.querySelector(".controls");
const sessionText = document.querySelector(".status");
const backgroundElement = document.querySelector(".background");

document.addEventListener("DOMContentLoaded", () => {
  updateButtonState();
  startButton.addEventListener("click", (event) => {
    event.preventDefault();
    startSession();
  });
  pauseResumeButton.addEventListener("click", togglePauseResume);
  stopButton.addEventListener("click", stopSession);
});

// session 

function startSession() {
  if (isTimerRunning) return;
  isTimerRunning = true;
  isPaused = false;
  updateButtonState();
  startTimer();
}

function stopSession() {
  clearInterval(timer);
  timer = null;
  isTimerRunning = false
  isPaused = false;

  sessionCount = 0;
  minutes = pomodoro.work;
  seconds = 0;
  console.log('end ', minutes, seconds)
  document.querySelector(".time").textContent = formatTime(minutes, seconds);

  updateButtonState();
}

function handleSessionCompletion() {
  const audio = document.querySelector("#session-switch-sound"); 
  console.log("Audio Element:", audio); // Debugging

  sessionCount++;
  console.log('session', sessionCount);

  sessionText.textContent = sessionCount % 2 === 0 ? "f o c u s" : "b r e a k";
  audio.play();

  if (sessionCount % 2 == 0) {
    minutes = pomodoro.work;
  } else {
    minutes = (sessionCount % pomodoro.longBreakInterval == 0) 
    ? pomodoro.longBreak : pomodoro.shortBreak;
  }

  seconds = 0;
  changeBackgroundImage();
  startTimer();
}

// timer

function startTimer() {
  if (timer) return;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  document.querySelector(".time").textContent = formatTime(minutes, seconds);

  if (!isPaused && minutes === 0 && seconds === 0) {
    clearInterval(timer);
    timer = null;
    handleSessionCompletion();
  } else {
    seconds = seconds > 0 ? seconds -1 : 59;
    minutes = seconds === 59 ? minutes - 1 : minutes;
  }
}

function formatTime(minutes, seconds) {
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2,"0")}`;
}

// buttons

function updateButtonState() {
  startButton.style.display = isTimerRunning ? "none" : "block";
  controls.style.display = isTimerRunning ? "flex" : "none";
}

function togglePauseResume() {
  isPaused = !isPaused;

  if (isPaused) {
    clearInterval(timer);
    timer = null;
    pauseResumeButton.textContent = "resume";
  } else {
    startTimer();
    pauseResumeButton.textContent = "pause";
  }
}

// background

function getRandomBackground() {
  return Math.floor(Math.random() * 16) + 1;
}

function changeBackgroundImage() {
  const randomImageNumber = getRandomBackground();
  const imageUrl = `../public/backgrounds/bg-${randomImageNumber}.jpeg`;
  backgroundElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`;
}

changeBackgroundImage()
