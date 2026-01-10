// Host screen JavaScript
const socket = io();

let roomCode = null;
let currentPhase = 'lobby';
let players = [];
let timerInterval = null;

// DOM Elements
const lobbyScreen = document.getElementById('lobbyScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const playersGrid = document.getElementById('playersGrid');
const playerCount = document.getElementById('playerCount');
const startButton = document.getElementById('startButton');
const questionDisplay = document.getElementById('questionDisplay');
const questionNumber = document.getElementById('questionNumber');
const timerDisplay = document.getElementById('timerDisplay');
const submitPhase = document.getElementById('submitPhase');
const submitStatus = document.getElementById('submitStatus');
const submitCheckmarks = document.getElementById('submitCheckmarks');
const votingPhase = document.getElementById('votingPhase');
const answersGrid = document.getElementById('answersGrid');
const resultsPhase = document.getElementById('resultsPhase');
const correctAnswerReveal = document.getElementById('correctAnswerReveal');
const explanation = document.getElementById('explanation');
const fooledBreakdown = document.getElementById('fooledBreakdown');
const leaderboard = document.getElementById('leaderboard');
const nextButton = document.getElementById('nextButton');
const winnerCelebration = document.getElementById('winnerCelebration');
const finalLeaderboard = document.getElementById('finalLeaderboard');
const playAgainButton = document.getElementById('playAgainButton');
const errorMessage = document.getElementById('errorMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createRoom();
});

// Create a new room
function createRoom() {
  socket.emit('createRoom');
}

// Socket event handlers
socket.on('roomCreated', (code) => {
  roomCode = code;
  roomCodeDisplay.textContent = code;
  socket.join(code);
  console.log('Room created:', code);
});

socket.on('playerJoined', (data) => {
  players = data.players;
  updatePlayersDisplay();
  updateStartButton();
});

socket.on('gameStarted', () => {
  console.log('Game started');
  currentPhase = 'submit';
});

socket.on('newQuestion', (data) => {
  const { question, questionIndex, totalQuestions } = data;
  questionDisplay.textContent = question;
  questionNumber.textContent = `Question ${questionIndex + 1} of ${totalQuestions}`;

  // Show game screen
  lobbyScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  gameScreen.classList.add('active');

  // Reset phases
  submitPhase.style.display = 'block';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'none';

  // Show timer for new question
  timerDisplay.style.display = 'block';
});

socket.on('phaseChange', (data) => {
  currentPhase = data.phase;
  
  if (data.phase === 'submit') {
    submitPhase.style.display = 'block';
    votingPhase.style.display = 'none';
    resultsPhase.style.display = 'none';
    submitCheckmarks.innerHTML = '';
    players.forEach(() => {
      const checkmark = document.createElement('div');
      checkmark.className = 'checkmark';
      checkmark.textContent = '✓';
      submitCheckmarks.appendChild(checkmark);
    });
  } else if (data.phase === 'voting') {
    submitPhase.style.display = 'none';
    votingPhase.style.display = 'block';
    resultsPhase.style.display = 'none';
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

socket.on('answerSubmitted', (data) => {
  const { submittedCount, totalPlayers } = data;
  submitStatus.textContent = `${submittedCount}/${totalPlayers} players submitted`;
  
  // Update checkmarks
  const checkmarks = submitCheckmarks.querySelectorAll('.checkmark');
  for (let i = 0; i < submittedCount; i++) {
    if (checkmarks[i]) {
      checkmarks[i].classList.add('submitted');
    }
  }
});

socket.on('allAnswersSubmitted', () => {
  submitStatus.textContent = 'All answers submitted!';
});

socket.on('votingReady', (data) => {
  const { answers } = data;
  answersGrid.innerHTML = '';

  answers.forEach((answer, index) => {
    const card = document.createElement('div');
    card.className = 'answer-card';
    card.dataset.answerId = answer.id;

    const answerText = document.createElement('div');
    answerText.textContent = answer.text;
    answerText.style.flex = '1';
    card.appendChild(answerText);

    answersGrid.appendChild(card);
  });
});

socket.on('resultsReady', (data) => {
  const { correctAnswer, explanation: exp, roundScores, totalScores, votes, voteCounts } = data;

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

  // Show who fooled whom
  fooledBreakdown.innerHTML = '<h3 style="font-size: 32px; margin-bottom: 20px;">Who Fooled Whom</h3>';

  players.forEach(player => {
    const fooledBy = Object.entries(votes)
      .filter(([voterId, votedFor]) => votedFor === player.id && roundScores[voterId] === 0)
      .map(([voterId]) => {
        const voter = players.find(p => p.id === voterId);
        return voter ? voter.name : 'Unknown';
      });

    if (fooledBy.length > 0) {
      const item = document.createElement('div');
      item.className = 'fooled-item';
      item.textContent = `${fooledBy.join(', ')} got fooled by ${player.name}'s answer!`;
      fooledBreakdown.appendChild(item);
    }
  });

  // Update leaderboard
  updateLeaderboard(totalScores, roundScores);
});

socket.on('gameOver', (data) => {
  const { finalScores } = data;
  
  gameScreen.classList.remove('active');
  gameOverScreen.classList.add('active');
  
  // Show winner
  if (finalScores.length > 0) {
    winnerCelebration.textContent = `🎉 ${finalScores[0].name} Wins! 🎉`;
  }
  
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
    name.style.marginLeft = '20px';
    
    const score = document.createElement('span');
    score.textContent = `${player.score.toLocaleString()} pts`;
    score.style.fontWeight = 'bold';
    
    item.appendChild(rank);
    item.appendChild(name);
    item.appendChild(score);
    finalLeaderboard.appendChild(item);
  });
});

socket.on('error', (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
});

// UI Update Functions
function updatePlayersDisplay() {
  playersGrid.innerHTML = '';
  players.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.textContent = player.name;
    playersGrid.appendChild(card);
  });
}

function updateStartButton() {
  startButton.disabled = players.length < 2;
}

function updateTimer(seconds) {
  timerDisplay.textContent = seconds;
  
  if (seconds <= 10) {
    timerDisplay.classList.add('timer-warning');
  } else {
    timerDisplay.classList.remove('timer-warning');
  }
}

function updateLeaderboard(totalScores, roundScores) {
  leaderboard.innerHTML = '<div class="leaderboard-title">Current Scores</div>';
  
  const sorted = [...totalScores].sort((a, b) => b.score - a.score);
  sorted.forEach((player, index) => {
    const item = document.createElement('div');
    item.className = `leaderboard-item rank-${index + 1}`;
    
    const name = document.createElement('span');
    name.textContent = player.name;
    
    const scoreContainer = document.createElement('span');
    scoreContainer.style.display = 'flex';
    scoreContainer.style.alignItems = 'center';
    scoreContainer.style.gap = '10px';
    
    const score = document.createElement('span');
    score.textContent = `${player.score.toLocaleString()} pts`;
    
    if (roundScores[player.id] > 0) {
      const change = document.createElement('span');
      change.className = 'score-change';
      change.textContent = `+${roundScores[player.id]}`;
      scoreContainer.appendChild(change);
    }
    
    scoreContainer.appendChild(score);
    item.appendChild(name);
    item.appendChild(scoreContainer);
    leaderboard.appendChild(item);
  });
}

// Button handlers
startButton.addEventListener('click', () => {
  socket.emit('startGame', { roomCode });
  startButton.disabled = true;
});

nextButton.addEventListener('click', () => {
  socket.emit('nextQuestion', { roomCode });
});

playAgainButton.addEventListener('click', () => {
  location.reload();
});
