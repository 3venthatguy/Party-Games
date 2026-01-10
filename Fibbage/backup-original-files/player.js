// Player screen JavaScript
const socket = io();

let roomCode = null;
let playerName = null;
let playerId = null;
let currentPhase = 'join';
let submittedAnswer = false;
let submittedVote = false;
let selectedAnswerId = null;

// DOM Elements
const joinScreen = document.getElementById('joinScreen');
const lobbyScreen = document.getElementById('lobbyScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const roomCodeInput = document.getElementById('roomCodeInput');
const playerNameInput = document.getElementById('playerNameInput');
const joinButton = document.getElementById('joinButton');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const playersList = document.getElementById('playersList');
const questionNumber = document.getElementById('questionNumber');
const timerDisplay = document.getElementById('timerDisplay');
const questionDisplay = document.getElementById('questionDisplay');
const submitPhase = document.getElementById('submitPhase');
const answerInput = document.getElementById('answerInput');
const charCounter = document.getElementById('charCounter');
const submitButton = document.getElementById('submitButton');
const submitWaiting = document.getElementById('submitWaiting');
const votingPhase = document.getElementById('votingPhase');
const answersList = document.getElementById('answersList');
const votingWaiting = document.getElementById('votingWaiting');
const resultsPhase = document.getElementById('resultsPhase');
const correctAnswerReveal = document.getElementById('correctAnswerReveal');
const explanation = document.getElementById('explanation');
const totalScore = document.getElementById('totalScore');
const miniLeaderboard = document.getElementById('miniLeaderboard');
const finalLeaderboard = document.getElementById('finalLeaderboard');
const thanksMessage = document.getElementById('thanksMessage');
const errorMessage = document.getElementById('errorMessage');

// Input handlers
roomCodeInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4);
  updateJoinButton();
});

playerNameInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.substring(0, 20);
  updateJoinButton();
  updateCharCounter();
});

answerInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.substring(0, 100);
  updateCharCounter();
  updateSubmitButton();
});

roomCodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && joinButton.disabled === false) {
    joinButton.click();
  }
});

playerNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && joinButton.disabled === false) {
    joinButton.click();
  }
});

answerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && submitButton.disabled === false) {
    submitButton.click();
  }
});

function updateJoinButton() {
  joinButton.disabled = !(roomCodeInput.value.length === 4 && playerNameInput.value.trim().length > 0);
}

function updateCharCounter() {
  if (charCounter) {
    const remaining = 100 - answerInput.value.length;
    charCounter.textContent = `${answerInput.value.length}/100 characters`;
  }
}

function updateSubmitButton() {
  submitButton.disabled = answerInput.value.trim().length === 0 || submittedAnswer;
}

// Join room
joinButton.addEventListener('click', () => {
  const code = roomCodeInput.value.toUpperCase();
  const name = playerNameInput.value.trim();
  
  if (code.length !== 4 || name.length === 0) {
    return;
  }
  
  roomCode = code;
  playerName = name;
  
  socket.emit('joinRoom', { roomCode: code, playerName: name });
  joinButton.disabled = true;
  joinButton.textContent = 'Joining...';
});

// Socket event handlers
socket.on('playerJoined', (data) => {
  const { players } = data;
  updatePlayersList(players);
  
  // Find our player ID
  const ourPlayer = players.find(p => p.name === playerName);
  if (ourPlayer) {
    playerId = ourPlayer.id;
  }
  
  // Show lobby screen
  joinScreen.style.display = 'none';
  lobbyScreen.classList.add('active');
  roomCodeDisplay.textContent = roomCode;
});

socket.on('gameState', (data) => {
  // Handle reconnection or late join
  if (data.phase !== 'lobby') {
    // Game already in progress
    showError('Game already in progress. Please wait for the next game.');
  }
});

socket.on('gameStarted', () => {
  console.log('Game started');
  currentPhase = 'submit';
});

socket.on('newQuestion', (data) => {
  const { question, questionIndex, totalQuestions } = data;
  questionDisplay.textContent = question;
  questionNumber.textContent = `Question ${questionIndex + 1} of ${totalQuestions}`;

  // Reset state
  submittedAnswer = false;
  submittedVote = false;
  selectedAnswerId = null;
  answerInput.value = '';
  updateCharCounter();

  // Show game screen
  lobbyScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  gameScreen.classList.add('active');

  // Reset phases
  submitPhase.style.display = 'block';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'none';
  submitWaiting.style.display = 'none';
  votingWaiting.style.display = 'none';

  // Show timer for new question
  timerDisplay.style.display = 'block';

  updateSubmitButton();
});

socket.on('phaseChange', (data) => {
  currentPhase = data.phase;
  
  if (data.phase === 'submit') {
    submitPhase.style.display = 'block';
    votingPhase.style.display = 'none';
    resultsPhase.style.display = 'none';
    submitWaiting.style.display = 'none';
  } else if (data.phase === 'voting') {
    submitPhase.style.display = 'none';
    votingPhase.style.display = 'block';
    resultsPhase.style.display = 'none';
    votingWaiting.style.display = 'none';
  } else if (data.phase === 'results') {
    submitPhase.style.display = 'none';
    votingPhase.style.display = 'none';
    resultsPhase.style.display = 'block';
  }
  
  updateTimer(data.timeRemaining);
});

socket.on('timerUpdate', (data) => {
  updateTimer(data.timeRemaining);
});

socket.on('allAnswersSubmitted', () => {
  if (currentPhase === 'submit') {
    submitWaiting.style.display = 'block';
  }
});

socket.on('votingReady', (data) => {
  const { answers } = data;
  answersList.innerHTML = '';

  // Filter out the player's own answer
  const votableAnswers = answers.filter(answer => answer.id !== playerId);

  votableAnswers.forEach((answer) => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = answer.text;
    button.dataset.answerId = answer.id;

    button.addEventListener('click', () => {
      if (submittedVote) return;

      // Remove previous selection
      answersList.querySelectorAll('.answer-button').forEach(btn => {
        btn.classList.remove('selected');
      });

      button.classList.add('selected');
      selectedAnswerId = answer.id;

      // Submit vote
      socket.emit('submitVote', { roomCode, votedForId: answer.id });
      submittedVote = true;

      // Disable all buttons
      answersList.querySelectorAll('.answer-button').forEach(btn => {
        btn.disabled = true;
      });

      votingWaiting.style.display = 'block';
    });

    answersList.appendChild(button);
  });
});

socket.on('resultsReady', (data) => {
  const { correctAnswer, explanation: exp, roundScores, totalScores } = data;

  // Transition to results phase
  submitPhase.style.display = 'none';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'block';
  currentPhase = 'results';

  // Hide timer during results
  timerDisplay.style.display = 'none';

  // Show correct answer
  correctAnswerReveal.textContent = `Correct Answer: ${correctAnswer}`;
  explanation.textContent = exp;

  // Show total score
  const ourTotalScore = totalScores.find(p => p.id === playerId);
  if (ourTotalScore) {
    totalScore.textContent = `Total: ${ourTotalScore.score.toLocaleString()} points`;
  }

  // Show mini leaderboard
  updateMiniLeaderboard(totalScores);
});

socket.on('gameOver', (data) => {
  const { finalScores } = data;
  
  gameScreen.classList.remove('active');
  gameOverScreen.classList.add('active');
  
  // Show final leaderboard
  finalLeaderboard.innerHTML = '';
  finalScores.forEach((player, index) => {
    const item = document.createElement('div');
    item.className = `final-leaderboard-item rank-${index + 1}`;
    
    const rank = document.createElement('span');
    rank.className = 'rank-badge';
    rank.textContent = `#${index + 1}`;
    
    const name = document.createElement('span');
    name.textContent = player.name;
    name.style.flex = '1';
    name.style.textAlign = 'left';
    name.style.marginLeft = '15px';
    
    const score = document.createElement('span');
    score.textContent = `${player.score.toLocaleString()} pts`;
    score.style.fontWeight = 'bold';
    
    item.appendChild(rank);
    item.appendChild(name);
    item.appendChild(score);
    finalLeaderboard.appendChild(item);
  });
  
  // Show thanks message
  const ourRank = finalScores.findIndex(p => p.id === playerId) + 1;
  thanksMessage.textContent = `You finished in ${getOrdinal(ourRank)} place! Thanks for playing!`;
});

socket.on('error', (message) => {
  showError(message);
  joinButton.disabled = false;
  joinButton.textContent = 'Join Game';
});

// Submit answer
submitButton.addEventListener('click', () => {
  const answer = answerInput.value.trim();
  if (answer.length === 0 || submittedAnswer) return;
  
  socket.emit('submitAnswer', { roomCode, answer });
  submittedAnswer = true;
  submitButton.disabled = true;
  submitWaiting.style.display = 'block';
  answerInput.disabled = true;
});

// Helper functions
function updatePlayersList(players) {
  playersList.innerHTML = '';
  players.forEach(player => {
    const item = document.createElement('div');
    item.className = 'player-item';
    item.textContent = player.name;
    playersList.appendChild(item);
  });
}

function updateTimer(seconds) {
  timerDisplay.textContent = seconds;
  
  if (seconds <= 10) {
    timerDisplay.classList.add('timer-warning');
  } else {
    timerDisplay.classList.remove('timer-warning');
  }
}

function updateMiniLeaderboard(totalScores) {
  miniLeaderboard.innerHTML = '<h3>Leaderboard</h3>';
  
  const sorted = [...totalScores].sort((a, b) => b.score - a.score);
  sorted.forEach((player) => {
    const item = document.createElement('div');
    item.className = `mini-leaderboard-item ${player.id === playerId ? 'highlight' : ''}`;
    
    const name = document.createElement('span');
    name.textContent = player.name;
    
    const score = document.createElement('span');
    score.textContent = `${player.score.toLocaleString()} pts`;
    
    item.appendChild(name);
    item.appendChild(score);
    miniLeaderboard.appendChild(item);
  });
}

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}

// Initialize
updateJoinButton();
