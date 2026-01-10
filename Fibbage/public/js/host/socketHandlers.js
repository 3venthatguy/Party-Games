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
    console.log('Room created with code:', code);
    state.roomCode = code;
    const roomCodeDisplay = document.getElementById('roomCodeDisplay');
    if (roomCodeDisplay) {
      roomCodeDisplay.textContent = code;
      console.log('Room code displayed:', code);
    } else {
      console.error('Room code display element not found!');
    }
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

    // Show question elements (in case they were hidden during results)
    questionDisplay.style.display = 'block';
    questionNumber.style.display = 'block';

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

    if (data.phase === 'submit') {
      showSubmitPhase(state.players.length);
    } else if (data.phase === 'voting') {
      console.log('[SocketHandlers] Showing voting phase...');
      showVotingPhase();
    } else if (data.phase === 'results') {
      console.log('[SocketHandlers] Showing results phase...');
      showResultsPhase();
      hideTimer(); // Hide timer during results animation
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

  socket.on('results:correctAnswerBuild', (data) => {
    if (typeof handleCorrectAnswerBuild === 'function') {
      handleCorrectAnswerBuild(data);
    }
  });

  socket.on('results:correctAnswerReveal', (data) => {
    if (typeof handleCorrectAnswerReveal === 'function') {
      handleCorrectAnswerReveal(data);
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

  socket.on('results:showLeaderboard', (data) => {
    if (typeof handleShowLeaderboard === 'function') {
      handleShowLeaderboard(data);
    }
  });

  socket.on('results:complete', (data) => {
    if (typeof handleResultsComplete === 'function') {
      handleResultsComplete(data);
    }
  });

  socket.on('gameOver', (data) => {
    const { finalScores } = data;
    showGameOverScreen(finalScores);
  });

  socket.on('error', (message) => {
    showError(message);
  });
}
