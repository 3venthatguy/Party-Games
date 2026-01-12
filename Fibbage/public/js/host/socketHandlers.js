/**
 * Socket event handlers for the host screen.
 */

/**
 * Sets up all socket event handlers for the host.
 * @param {object} socket - Socket.io client instance
 * @param {object} state - Host state object
 */
function setupHostSocketHandlers(socket, state) {
  socket.on('roomCreated', (data) => {
    // Handle both old format (string) and new format (object)
    const code = typeof data === 'string' ? data : data.roomCode;
    const gameTitle = data.gameTitle || 'Fibbage';
    const gameRules = data.gameRules || '';

    console.log('Room created with code:', code);
    state.roomCode = code;

    const roomCodeDisplay = document.getElementById('roomCodeDisplay');
    if (roomCodeDisplay) {
      roomCodeDisplay.textContent = code;
      console.log('Room code displayed:', code);
    } else {
      console.error('Room code display element not found!');
    }

    // Update game title
    const gameTitleElement = document.getElementById('gameTitle');
    if (gameTitleElement) {
      gameTitleElement.textContent = gameTitle;
      document.title = `${gameTitle} - Host`;
    }

    // Update game rules
    const gameRulesElement = document.getElementById('gameRules');
    if (gameRulesElement && gameRules) {
      gameRulesElement.textContent = gameRules;
    }
  });

  socket.on('playerJoined', (data) => {
    state.players = data.players;
    updatePlayersDisplay(state.players);
    updateStartButton(state.players.length);
    // Play pop sound when a player joins
    playSoundEffect('pop', 0.7);
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

    // Show question elements and restore normal size (remove results-mode class)
    questionDisplay.style.display = 'block';
    questionDisplay.classList.remove('results-mode');
    questionNumber.style.display = 'block';
    questionNumber.classList.remove('results-mode');

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
    console.log('[SocketHandlers] phaseChange event received:', data);
    state.currentPhase = data.phase;

    if (data.phase === 'reading') {
      showReadingPhase(data.timeRemaining);
      // Stop game music during reading phase
      stopGameMusic();
    } else if (data.phase === 'submit') {
      showSubmitPhase(state.players.length);
      // Start game music for submit phase
      playRandomGameMusic();
    } else if (data.phase === 'voting') {
      console.log('[SocketHandlers] Showing voting phase...');
      showVotingPhase(state.players.length);
      // Continue game music into voting phase (or start if not playing)
      if (!isGameMusicPlaying()) {
        playRandomGameMusic();
      }
    } else if (data.phase === 'results') {
      console.log('[SocketHandlers] Showing results phase...');
      showResultsPhase();
      hideTimer(); // Hide timer during results animation
      // Stop music during results
      stopGameMusic();
    }

    updateTimer(data.timeRemaining);
  });

  socket.on('timerUpdate', (data) => {
    updateTimer(data.timeRemaining);
  });

  socket.on('answerSubmitted', (data) => {
    const { submittedCount, totalPlayers } = data;
    updateSubmitStatus(submittedCount, totalPlayers);
    // Play pop sound when an answer is submitted
    playSoundEffect('pop', 0.4);
  });

  socket.on('allAnswersSubmitted', () => {
    showAllAnswersSubmitted();
  });

  socket.on('voteSubmitted', (data) => {
    const { voteCount, totalPlayers } = data;
    updateVotingStatus(voteCount, totalPlayers);
    // Play pop sound when a vote is cast
    playSoundEffect('pop', 0.4);

    // Show "All votes submitted!" when everyone has voted
    if (voteCount === totalPlayers) {
      showAllVotesSubmitted();
    }
  });

  socket.on('votingReady', (data) => {
    console.log('[SocketHandlers] votingReady event received:', data);
    const { answers } = data;
    displayVotingAnswers(answers);
  });

  socket.on('resultsReady', (data) => {
    // Legacy handler - animation sequence now handled by individual events
    console.log('[SocketHandlers] resultsReady event received (LEGACY - should not fire during voting!):', data);
    showResultsPhase();
    hideTimer();
    displayResults(data, state.players);
  });

  // Results animation sequence events
  socket.on('results:startSequence', (data) => {
    if (typeof handleResultsStartSequence === 'function') {
      handleResultsStartSequence(data);
    }
  });

  socket.on('results:highlightAnswer', (data) => {
    if (typeof handleHighlightAnswer === 'function') {
      handleHighlightAnswer(data);
    }
  });

  socket.on('results:showVoters', (data) => {
    if (typeof handleShowVoters === 'function') {
      handleShowVoters(data);
    }
  });

  socket.on('results:revealAuthor', (data) => {
    if (typeof handleRevealAuthor === 'function') {
      handleRevealAuthor(data);
    }
  });

  socket.on('results:updateScore', (data) => {
    if (typeof handleUpdateScore === 'function') {
      handleUpdateScore(data);
    }
  });

  socket.on('results:transitionNext', (data) => {
    if (typeof handleTransitionNext === 'function') {
      handleTransitionNext(data);
    }
  });

  socket.on('results:revealLie', (data) => {
    if (typeof handleRevealLie === 'function') {
      handleRevealLie(data);
    }
  });

  socket.on('results:highlightCorrectAnswer', (data) => {
    if (typeof handleHighlightCorrectAnswer === 'function') {
      handleHighlightCorrectAnswer(data);
    }
  });

  socket.on('results:revealTruth', (data) => {
    if (typeof handleRevealTruth === 'function') {
      handleRevealTruth(data);
    }
  });

  socket.on('results:showCorrectVoters', (data) => {
    if (typeof handleShowCorrectVoters === 'function') {
      handleShowCorrectVoters(data);
    }
  });

  socket.on('results:updateCorrectScores', (data) => {
    if (typeof handleUpdateCorrectScores === 'function') {
      handleUpdateCorrectScores(data);
    }
  });

  socket.on('results:showExplanation', (data) => {
    if (typeof handleShowExplanation === 'function') {
      handleShowExplanation(data);
    }
  });

  socket.on('results:showLeaderboardButton', (data) => {
    if (typeof handleShowLeaderboardButton === 'function') {
      handleShowLeaderboardButton(data);
    }
  });

  socket.on('results:showLeaderboard', (data) => {
    if (typeof handleShowLeaderboard === 'function') {
      handleShowLeaderboard(data);
    }
  });

  socket.on('results:showNextButton', (data) => {
    if (typeof handleShowNextButton === 'function') {
      handleShowNextButton(data);
    }
  });

  socket.on('results:complete', (data) => {
    if (typeof handleResultsComplete === 'function') {
      handleResultsComplete(data);
    }
  });

  socket.on('playTransitionSound', () => {
    console.log('[SocketHandlers] Playing transition sound before results');
    // Stop music first
    stopGameMusic();
    // Play the transition sound effect
    playSoundEffect('timeToVote', 0.6);
  });

  socket.on('gameOver', (data) => {
    const { finalScores } = data;
    showGameOverScreen(finalScores);
    // Stop game music when game ends
    stopGameMusic();
  });

  socket.on('error', (message) => {
    showError(message);
  });
}
