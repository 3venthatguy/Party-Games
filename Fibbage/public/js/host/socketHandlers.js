/**
 * Socket event handlers for the host screen.
 */

/**
 * Sets up all socket event handlers for the host.
 * @param {object} socket - Socket.io client instance
 * @param {object} state - Host state object
 */
function setupHostSocketHandlers(socket, state) {
  socket.on('roomCreated', (code) => {
    state.roomCode = code;
    const roomCodeDisplay = document.getElementById('roomCodeDisplay');
    roomCodeDisplay.textContent = code;
    socket.join(code);
  });

  socket.on('playerJoined', (data) => {
    state.players = data.players;
    updatePlayersDisplay(state.players);
    updateStartButton(state.players.length);
  });

  socket.on('gameStarted', () => {
    state.currentPhase = 'submit';
  });

  socket.on('newQuestion', (data) => {
    const { question, questionIndex, totalQuestions } = data;
    const questionDisplay = document.getElementById('questionDisplay');
    const questionNumber = document.getElementById('questionNumber');

    questionDisplay.textContent = question;
    questionNumber.textContent = `Question ${questionIndex + 1} of ${totalQuestions}`;

    // Show game screen
    hideLobbyScreen();
    const gameScreen = document.getElementById('gameScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameScreen.classList.add('active');
    gameOverScreen.classList.remove('active');

    // Reset phases
    showSubmitPhase(state.players.length);

    // Show timer for new question
    showTimer();
  });

  socket.on('phaseChange', (data) => {
    state.currentPhase = data.phase;

    if (data.phase === 'submit') {
      showSubmitPhase(state.players.length);
    } else if (data.phase === 'voting') {
      showVotingPhase();
    } else if (data.phase === 'results') {
      showResultsPhase();
    }

    updateTimer(data.timeRemaining);
  });

  socket.on('timerUpdate', (data) => {
    updateTimer(data.timeRemaining);
  });

  socket.on('answerSubmitted', (data) => {
    const { submittedCount, totalPlayers } = data;
    updateSubmitStatus(submittedCount, totalPlayers);
  });

  socket.on('allAnswersSubmitted', () => {
    showAllAnswersSubmitted();
  });

  socket.on('votingReady', (data) => {
    const { answers } = data;
    displayVotingAnswers(answers);
  });

  socket.on('resultsReady', (data) => {
    showResultsPhase();
    hideTimer();
    displayResults(data, state.players);
    updateLeaderboard(data.totalScores, data.roundScores);
  });

  socket.on('gameOver', (data) => {
    const { finalScores } = data;
    showGameOverScreen(finalScores);
  });

  socket.on('error', (message) => {
    showError(message);
  });
}
