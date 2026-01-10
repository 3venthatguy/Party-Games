/**
 * Socket event handlers for the player screen.
 */

/**
 * Sets up all socket event handlers for the player.
 * @param {object} socket - Socket.io client instance
 * @param {object} state - Player state object
 */
function setupPlayerSocketHandlers(socket, state) {
  socket.on('playerJoined', (data) => {
    const { players } = data;
    updatePlayersList(players);

    // Find our player ID
    const ourPlayer = players.find(p => p.name === state.playerName);
    if (ourPlayer) {
      state.playerId = ourPlayer.id;
    }

    // Show player name badge
    showPlayerNameBadge(state.playerName);

    // Show lobby screen
    showPlayerLobbyScreen(state.roomCode);
  });

  socket.on('gameState', (data) => {
    // Handle reconnection or late join
    if (data.phase !== 'lobby') {
      showPlayerError('Game already in progress. Please wait for the next game.');
    }
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

    // Reset state
    state.submittedAnswer = false;
    state.submittedVote = false;
    state.selectedAnswerId = null;
    resetSubmitPhase();

    // Show game screen
    hidePlayerLobbyScreen();
    const gameScreen = document.getElementById('gameScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameScreen.classList.add('active');
    gameOverScreen.classList.remove('active');

    // Reset phases
    showPlayerSubmitPhase();

    // Show timer for new question
    showPlayerTimer();
  });

  socket.on('phaseChange', (data) => {
    state.currentPhase = data.phase;

    if (data.phase === 'submit') {
      showPlayerSubmitPhase();
    } else if (data.phase === 'voting') {
      showPlayerVotingPhase();
    } else if (data.phase === 'results') {
      showPlayerResultsPhase();
    }

    updatePlayerTimer(data.timeRemaining);
  });

  socket.on('timerUpdate', (data) => {
    updatePlayerTimer(data.timeRemaining);
  });

  socket.on('allAnswersSubmitted', () => {
    showAllAnswersSubmittedPlayer();
  });

  socket.on('votingReady', (data) => {
    const { answers } = data;
    displayPlayerVotingAnswers(answers, state.playerId, (votedForId) => {
      socket.emit('submitVote', { roomCode: state.roomCode, votedForId });
      state.submittedVote = true;
      showVotingWaiting();
    });
  });

  socket.on('resultsReady', (data) => {
    showPlayerResultsPhase();
    hidePlayerTimer();
    displayPlayerResults(data, state.playerId);
  });

  socket.on('gameOver', (data) => {
    const { finalScores } = data;
    showPlayerGameOverScreen(finalScores, state.playerId);
  });

  socket.on('error', (message) => {
    showPlayerError(message);
    resetJoinButton();
  });
}
