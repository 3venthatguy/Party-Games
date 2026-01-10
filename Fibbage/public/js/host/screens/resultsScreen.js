/**
 * Results phase screen logic for the host.
 * Handles progressive results reveal animation sequence.
 */

// Animation state
let currentSequenceId = null;
let answerElements = new Map(); // answerId -> element
let currentAnswerElement = null;
let animationState = {
  currentAnswerIndex: 0,
  fakeAnswers: [],
  correctAnswer: null,
  explanation: null,
  totalScores: null,
  roundScores: null
};

/**
 * Shows the results phase UI.
 */
function showResultsPhase() {
  console.log('[ResultsScreen] ========== SHOW RESULTS PHASE ==========');
  console.log('[ResultsScreen] About to reset state. Current sequenceId:', currentSequenceId);
  console.log('[ResultsScreen] Current answerElements size:', answerElements.size);

  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');
  const questionDisplay = document.getElementById('questionDisplay');
  const questionNumber = document.getElementById('questionNumber');

  console.log('[ResultsScreen] Hiding submitPhase and votingPhase, showing resultsPhase');
  submitPhase.style.display = 'none';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'block';
  console.log('[ResultsScreen] votingPhase display set to:', votingPhase.style.display);
  console.log('[ResultsScreen] resultsPhase display set to:', resultsPhase.style.display);

  // Keep question visible during results animation but make it smaller
  if (questionDisplay) {
    questionDisplay.style.display = 'block';
    questionDisplay.classList.add('results-mode');
  }
  if (questionNumber) {
    questionNumber.style.display = 'block';
    questionNumber.classList.add('results-mode');
  }

  console.log('[ResultsScreen] Results phase UI updated');

  // CRITICAL: Reset sequence ID IMMEDIATELY to prepare for new animation
  // This must happen BEFORE the results:startSequence event arrives
  console.log('[ResultsScreen] Resetting currentSequenceId from', currentSequenceId, 'to null');
  currentSequenceId = null;

  // Clear previous results but preserve structure
  const resultsContainer = document.getElementById('resultsPhase');
  if (resultsContainer) {
    // Check if structure already exists
    let answersRevealArea = document.getElementById('answersRevealArea');
    if (!answersRevealArea) {
      resultsContainer.innerHTML = `
        <div class="results-container">
          <div class="answers-reveal-area" id="answersRevealArea"></div>
          <div class="correct-answer-area" id="correctAnswerArea" style="display: none;"></div>
          <div class="explanation-area" id="explanationArea" style="display: none;"></div>
          <div class="leaderboard-area" id="leaderboardArea" style="display: none;"></div>
          <button class="next-button" id="nextButton" style="display: none;">Next Question</button>
        </div>
      `;
    } else {
      // Clear content but keep structure
      answersRevealArea.innerHTML = '';
      // CRITICAL: Reset display to block so animations are visible for all questions
      answersRevealArea.style.display = 'block';

      document.getElementById('correctAnswerArea').innerHTML = '';
      document.getElementById('correctAnswerArea').style.display = 'none';
      document.getElementById('explanationArea').innerHTML = '';
      document.getElementById('explanationArea').style.display = 'none';
      document.getElementById('leaderboardArea').innerHTML = '';
      document.getElementById('leaderboardArea').style.display = 'none';
      const nextButton = document.getElementById('nextButton');
      if (nextButton) {
        nextButton.style.display = 'none';
      }
    }
  }

  // Reset animation state
  console.log('[ResultsScreen] Resetting animation state...');
  animationState = {
    currentAnswerIndex: 0,
    fakeAnswers: [],
    correctAnswer: null,
    explanation: null,
    totalScores: null,
    roundScores: null
  };
  answerElements.clear();
  currentAnswerElement = null;
  console.log('[ResultsScreen] State reset complete. answerElements size:', answerElements.size);
  console.log('[ResultsScreen] ========== SHOW RESULTS PHASE COMPLETE ==========');
}

/**
 * Initializes the results animation sequence.
 * Builds fresh answer cards from server data instead of cloning from hidden voting grid.
 * @param {Array} answersData - Array of answer objects from server
 */
function initializeResultsSequence(answersData) {
  console.log('[ResultsScreen] initializeResultsSequence called with answersData:', answersData);
  console.log('[ResultsScreen] currentSequenceId:', currentSequenceId);

  const answersRevealArea = document.getElementById('answersRevealArea');

  if (!answersRevealArea) {
    console.error('[ResultsScreen] answersRevealArea not found!');
    return;
  }

  // Clear previous answer elements
  answersRevealArea.innerHTML = '';
  answerElements.clear();
  console.log('[ResultsScreen] Cleared previous answer elements');

  // Build fresh answer cards from server data
  if (answersData && answersData.length > 0) {
    console.log('[ResultsScreen] Building', answersData.length, 'fresh cards from server data');
    console.log('[ResultsScreen] Full answersData:', JSON.stringify(answersData, null, 2));

    answersData.forEach((answer) => {
      // Create fresh card
      const card = document.createElement('div');
      card.className = 'answer-card';
      card.dataset.answerId = answer.id;

      // Create answer text element (matching voting screen structure)
      const answerText = document.createElement('div');
      answerText.textContent = answer.text;
      answerText.style.flex = '1';
      card.appendChild(answerText);

      // Apply base styles
      card.style.maxWidth = '600px';
      card.style.display = 'block';
      card.style.opacity = '1';

      // Append to reveal area
      answersRevealArea.appendChild(card);
      answerElements.set(answer.id, card);
      console.log(`[ResultsScreen] Created fresh card for answerId: ${answer.id}, text: "${answer.text.substring(0, 50)}"`);
    });
  } else {
    console.error('[ResultsScreen] No answers data provided!');
  }

  console.log('[ResultsScreen] Total cards created:', answerElements.size);

  // Debug: Check visibility of reveal area
  if (answersRevealArea) {
    console.log('[ResultsScreen] answersRevealArea display:', answersRevealArea.style.display);
    console.log('[ResultsScreen] answersRevealArea offsetHeight:', answersRevealArea.offsetHeight);
    console.log('[ResultsScreen] answersRevealArea children:', answersRevealArea.children.length);

    // Check each created card
    answerElements.forEach((element, answerId) => {
      console.log(`[ResultsScreen] Card ${answerId}: display=${element.style.display}, opacity=${element.style.opacity}, offsetHeight=${element.offsetHeight}`);
    });
  }
}

/**
 * Handles the start of results sequence.
 * @param {object} data - Sequence data (includes answers array from server)
 */
function handleResultsStartSequence(data) {
  console.log('[ResultsScreen] ========== RESULTS SEQUENCE START ==========');
  console.log('[ResultsScreen] Results sequence started:', data);
  console.log('[ResultsScreen] Previous currentSequenceId:', currentSequenceId);
  console.log('[ResultsScreen] New sequenceId:', data.sequenceId);
  console.log('[ResultsScreen] Answers data received:', data.answers);

  // CRITICAL: Always accept new sequence and update ID
  // This allows animations to work for all questions (1-8)
  currentSequenceId = data.sequenceId;
  console.log('[ResultsScreen] currentSequenceId updated to:', currentSequenceId);

  // Initialize results sequence with answers data from server
  setTimeout(() => {
    console.log('[ResultsScreen] Initializing results sequence with server data...');
    initializeResultsSequence(data.answers);

    // Dim all answers initially (including correct answer)
    answerElements.forEach((element) => {
      element.classList.add('answer-dimmed');
    });
    console.log('[ResultsScreen] Dimmed all answer elements');
    console.log('[ResultsScreen] ========== INITIALIZATION COMPLETE ==========');
  }, 100);
}

/**
 * Handles answer highlight phase.
 * @param {object} data - Highlight data
 */
async function handleHighlightAnswer(data) {
  console.log('[ResultsScreen] handleHighlightAnswer called');
  console.log('[ResultsScreen] Event sequenceId:', data.sequenceId, 'Current sequenceId:', currentSequenceId);

  if (data.sequenceId !== currentSequenceId) {
    console.log('[ResultsScreen] SEQUENCE ID MISMATCH - IGNORING EVENT');
    return;
  }

  console.log('[ResultsScreen] Highlighting answer:', data.answerId);
  const answerElement = answerElements.get(data.answerId);
  if (!answerElement) {
    console.error('[ResultsScreen] Answer element not found for ID:', data.answerId);
    return;
  }

  currentAnswerElement = answerElement;

  // Remove dim from this answer, keep others dimmed
  answerElements.forEach((element, answerId) => {
    if (answerId === data.answerId) {
      element.classList.remove('answer-dimmed');
    } else {
      element.classList.add('answer-dimmed');
    }
  });

  // Import and use animation function
  const { highlightAnswer } = await import('../animations/resultsAnimations.js');
  await highlightAnswer(answerElement);
  console.log('[ResultsScreen] Highlight animation complete');
}

/**
 * Handles showing voters for an answer.
 * @param {object} data - Voters data
 */
async function handleShowVoters(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  const votersContainer = document.createElement('div');
  votersContainer.className = 'voters-container';
  currentAnswerElement.appendChild(votersContainer);

  const { showVoters } = await import('../animations/resultsAnimations.js');
  await showVoters(votersContainer, data.voters);
}

/**
 * Handles author reveal.
 * @param {object} data - Author data
 */
async function handleRevealAuthor(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  const authorContainer = document.createElement('div');
  authorContainer.className = 'author-container';
  currentAnswerElement.appendChild(authorContainer);

  const { revealAuthor } = await import('../animations/resultsAnimations.js');
  await revealAuthor(authorContainer, data.authorName, data.pointsEarned);
}

/**
 * Handles score update.
 * @param {object} data - Score data
 */
async function handleUpdateScore(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  const scoreContainer = document.createElement('div');
  scoreContainer.className = 'score-container';
  currentAnswerElement.appendChild(scoreContainer);

  const player = animationState.totalScores?.find(p => p.id === data.playerId);
  const startScore = player ? (player.score - data.pointsEarned) : 0;

  const { animateScore } = await import('../animations/resultsAnimations.js');
  await animateScore(scoreContainer, data.pointsEarned, startScore, data.newTotalScore);
}

/**
 * Handles transition to next answer.
 * @param {object} data - Transition data
 */
function handleTransitionNext(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  currentAnswerElement.classList.add('fade-out');
  setTimeout(() => {
    currentAnswerElement.style.display = 'none';
  }, 300);
}

/**
 * Handles "IT'S A LIE!" reveal for fake answers.
 * @param {object} data - Lie reveal data
 */
function handleRevealLie(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  // Add "IT'S A LIE!" text above the answer
  const lieRevealDiv = document.createElement('div');
  lieRevealDiv.className = 'lie-reveal';
  lieRevealDiv.textContent = `IT'S A LIE!`;

  // Insert at the top of the current answer element
  currentAnswerElement.insertBefore(lieRevealDiv, currentAnswerElement.firstChild);
}

/**
 * Handles highlighting the correct answer.
 * @param {object} data - Highlight data
 */
function handleHighlightCorrectAnswer(data) {
  console.log('[ResultsScreen] handleHighlightCorrectAnswer called');
  console.log('[ResultsScreen] Event sequenceId:', data.sequenceId, 'Current sequenceId:', currentSequenceId);

  if (data.sequenceId !== currentSequenceId) {
    console.log('[ResultsScreen] SEQUENCE ID MISMATCH - IGNORING EVENT');
    return;
  }

  console.log('[ResultsScreen] Getting correct answer card from answerElements');
  console.log('[ResultsScreen] answerElements keys:', Array.from(answerElements.keys()));

  // Get the cloned correct answer card from answersRevealArea
  const correctAnswerCard = answerElements.get('correct');
  if (correctAnswerCard) {
    console.log('[ResultsScreen] Found correct answer card, highlighting it');
    // Show the card and highlight it
    correctAnswerCard.style.display = 'block';
    correctAnswerCard.classList.remove('answer-dimmed');
    correctAnswerCard.classList.add('answer-highlighted');
    currentAnswerElement = correctAnswerCard;
    console.log('[ResultsScreen] Correct answer highlighted');
  } else {
    console.error('[ResultsScreen] Correct answer card NOT FOUND in answerElements!');
  }
}

/**
 * Handles "THE TRUTH!" reveal for correct answer.
 * @param {object} data - Truth reveal data
 */
function handleRevealTruth(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  // Add "THE TRUTH!" text above the answer
  const truthRevealDiv = document.createElement('div');
  truthRevealDiv.className = 'truth-reveal';
  truthRevealDiv.textContent = 'THE TRUTH!';

  // Insert at the top of the current answer element
  currentAnswerElement.insertBefore(truthRevealDiv, currentAnswerElement.firstChild);

  // Apply the zoom animation
  currentAnswerElement.classList.add('correct-answer-zoom');
}


/**
 * Handles showing correct voters.
 * @param {object} data - Correct voters data
 */
function handleShowCorrectVoters(data) {
  if (data.sequenceId !== currentSequenceId || !currentAnswerElement) return;

  const votersContainer = document.createElement('div');
  votersContainer.className = 'correct-voters-container';

  if (data.voters.length === 0) {
    votersContainer.innerHTML = '<div class="no-correct-voters">Everyone was fooled!</div>';
  } else {
    const label = document.createElement('div');
    label.className = 'correct-voters-label';
    label.textContent = 'THESE PLAYERS KNEW THE TRUTH!';
    votersContainer.appendChild(label);

    const votersList = document.createElement('div');
    votersList.className = 'correct-voters-list';
    data.voters.forEach((voter, index) => {
      setTimeout(() => {
        const voterElement = document.createElement('div');
        voterElement.className = 'correct-voter';
        voterElement.dataset.playerId = voter.id;
        voterElement.textContent = voter.name;
        votersList.appendChild(voterElement);
      }, index * 200);
    });
    votersContainer.appendChild(votersList);
  }

  currentAnswerElement.appendChild(votersContainer);
}

/**
 * Handles updating correct voters' scores.
 * @param {object} data - Score update data
 */
async function handleUpdateCorrectScores(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const { animateScore } = await import('../animations/resultsAnimations.js');
  
  for (const voter of data.voters) {
    if (voter.pointsEarned > 0) {
      const voterElement = document.querySelector(`[data-player-id="${voter.id}"]`);
      if (voterElement) {
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'score-container';
        voterElement.appendChild(scoreContainer);
        
        const player = animationState.totalScores?.find(p => p.id === voter.id);
        const startScore = player ? (player.score - voter.pointsEarned) : 0;
        await animateScore(scoreContainer, voter.pointsEarned, startScore, voter.newTotalScore);
      }
    }
  }
}

/**
 * Handles showing explanation.
 * @param {object} data - Explanation data
 */
function handleShowExplanation(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const explanationArea = document.getElementById('explanationArea');
  if (!explanationArea) return;

  explanationArea.style.display = 'block';
  explanationArea.innerHTML = `
    <div class="explanation-box">
      <h3>Explanation</h3>
      <p>${data.explanation}</p>
    </div>
  `;
}

/**
 * Handles showing the leaderboard button.
 * @param {object} data - Button data
 */
function handleShowLeaderboardButton(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const leaderboardArea = document.getElementById('leaderboardArea');
  if (!leaderboardArea) return;

  leaderboardArea.style.display = 'block';
  leaderboardArea.innerHTML = `
    <button class="show-leaderboard-button" id="showLeaderboardButton">
      Show Leaderboard
    </button>
  `;

  const button = document.getElementById('showLeaderboardButton');
  button.onclick = () => {
    if (hostState && hostState.roomCode) {
      socket.emit('showLeaderboard', { roomCode: hostState.roomCode });
      button.disabled = true;
      button.style.display = 'none';
    }
  };
}

/**
 * Handles showing leaderboard.
 * @param {object} data - Leaderboard data
 */
function handleShowLeaderboard(data) {
  if (data.sequenceId !== currentSequenceId) return;

  // Store in animation state
  if (data.totalScores) {
    animationState.totalScores = data.totalScores;
  }
  if (data.roundScores) {
    animationState.roundScores = data.roundScores;
  }

  // Hide all other elements to make leaderboard exclusive
  const answersRevealArea = document.getElementById('answersRevealArea');
  const correctAnswerArea = document.getElementById('correctAnswerArea');
  const explanationArea = document.getElementById('explanationArea');
  const questionDisplay = document.getElementById('questionDisplay');
  const questionNumber = document.getElementById('questionNumber');

  if (answersRevealArea) answersRevealArea.style.display = 'none';
  if (correctAnswerArea) correctAnswerArea.style.display = 'none';
  if (explanationArea) explanationArea.style.display = 'none';
  if (questionDisplay) questionDisplay.style.display = 'none';
  if (questionNumber) questionNumber.style.display = 'none';

  const leaderboardArea = document.getElementById('leaderboardArea');
  if (!leaderboardArea) return;

  leaderboardArea.style.display = 'block';
  leaderboardArea.innerHTML = '<h3 style="font-size: 32px; margin-bottom: 20px;">Leaderboard</h3>';

  const leaderboardList = document.createElement('div');
  leaderboardList.className = 'leaderboard-list';

  data.sortedPlayers.forEach((player, index) => {
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';
    entry.style.animationDelay = `${index * 0.1}s`;

    const roundScore = data.roundScores[player.id] || 0;
    entry.innerHTML = `
      <div class="leaderboard-rank">${index + 1}</div>
      <div class="leaderboard-name">${player.name}</div>
      <div class="leaderboard-score">${player.score.toLocaleString()}</div>
      ${roundScore > 0 ? `<div class="leaderboard-round-score">+${roundScore}</div>` : ''}
    `;

    leaderboardList.appendChild(entry);
  });

  leaderboardArea.appendChild(leaderboardList);
}

/**
 * Handles showing the next button.
 * @param {object} data - Button data
 */
function handleShowNextButton(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const nextButton = document.getElementById('nextButton');
  if (nextButton) {
    nextButton.style.display = 'block';
    nextButton.classList.add('fade-in');

    // Ensure event listener is attached (in case button was recreated)
    nextButton.onclick = () => {
      if (hostState && hostState.roomCode) {
        socket.emit('nextQuestion', { roomCode: hostState.roomCode });
      }
    };
  }
}

/**
 * Handles results sequence completion.
 * @param {object} data - Completion data
 */
function handleResultsComplete(data) {
  if (data.sequenceId !== currentSequenceId) return;
  // Animation sequence complete
}

/**
 * Legacy function for instant results (kept for compatibility).
 * @param {object} data - Results data
 * @param {Array} players - Array of players
 */
function displayResults(data, players) {
  // Store data for animation sequence
  animationState.totalScores = data.totalScores;
  animationState.roundScores = data.roundScores;
  animationState.correctAnswer = data.correctAnswer;
  animationState.explanation = data.explanation;
  
  // This function is called by socket handler, but animations are now handled
  // by individual socket events from the ResultsAnimator
  // The actual display happens through the animation sequence events
}
