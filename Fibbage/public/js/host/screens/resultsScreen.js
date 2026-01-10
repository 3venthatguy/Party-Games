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
  console.log('[ResultsScreen] Showing results phase');
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');

  submitPhase.style.display = 'none';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'block';
  console.log('[ResultsScreen] Results phase UI updated');

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
}

/**
 * Initializes the results animation sequence.
 * Creates answer cards from voting phase or creates new ones.
 */
function initializeResultsSequence() {
  console.log('[ResultsScreen] initializeResultsSequence called');
  // Get answers from voting phase
  const answersGrid = document.getElementById('answersGrid');
  const answersRevealArea = document.getElementById('answersRevealArea');

  console.log('[ResultsScreen] answersGrid:', answersGrid);
  console.log('[ResultsScreen] answersRevealArea:', answersRevealArea);

  if (!answersRevealArea) {
    console.error('[ResultsScreen] answersRevealArea not found!');
    return;
  }

  // If we have voting answers, copy them to results area
  if (answersGrid) {
    const answerCards = answersGrid.querySelectorAll('.answer-card');
    console.log('[ResultsScreen] Found', answerCards.length, 'answer cards in voting grid');

    answerCards.forEach((card) => {
      const answerId = card.dataset.answerId;
      console.log('[ResultsScreen] Processing card with answerId:', answerId);

      if (answerId && answerId !== 'correct') {
        // Clone the card for results area
        const clonedCard = card.cloneNode(true);
        clonedCard.style.display = 'block';
        clonedCard.style.margin = '20px auto';
        clonedCard.style.maxWidth = '600px';
        answersRevealArea.appendChild(clonedCard);
        answerElements.set(answerId, clonedCard);
        console.log('[ResultsScreen] Cloned card for answerId:', answerId);
      } else {
        console.log('[ResultsScreen] Skipping card (correct answer or no ID)');
      }
    });
  } else {
    console.error('[ResultsScreen] answersGrid not found!');
  }

  console.log('[ResultsScreen] Total cloned cards:', answerElements.size);
}

/**
 * Handles the start of results sequence.
 * @param {object} data - Sequence data
 */
function handleResultsStartSequence(data) {
  console.log('[ResultsScreen] Results sequence started:', data);
  currentSequenceId = data.sequenceId;

  // Initialize results sequence (copy answers from voting phase)
  setTimeout(() => {
    console.log('[ResultsScreen] Initializing results sequence...');
    initializeResultsSequence();

    // Dim all answers initially
    answerElements.forEach((element, answerId) => {
      element.classList.add('answer-dimmed');
    });
    console.log('[ResultsScreen] Dimmed', answerElements.size, 'answer elements');
  }, 100);
}

/**
 * Handles answer highlight phase.
 * @param {object} data - Highlight data
 */
async function handleHighlightAnswer(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const answerElement = answerElements.get(data.answerId);
  if (!answerElement) return;

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
 * Handles correct answer buildup.
 * @param {object} data - Buildup data
 */
function handleCorrectAnswerBuild(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const answersRevealArea = document.getElementById('answersRevealArea');
  if (answersRevealArea) {
    answersRevealArea.innerHTML = '<div class="correct-answer-buildup">AND THE TRUTH IS...</div>';
  }
}

/**
 * Handles correct answer reveal.
 * @param {object} data - Correct answer data
 */
async function handleCorrectAnswerReveal(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const correctAnswerArea = document.getElementById('correctAnswerArea');
  if (!correctAnswerArea) return;

  correctAnswerArea.style.display = 'block';
  correctAnswerArea.innerHTML = `
    <div class="correct-answer-card" id="correctAnswerCard">
      <div class="correct-answer-text">${data.answerText}</div>
    </div>
  `;

  const correctCard = document.getElementById('correctAnswerCard');
  const { correctAnswerZoom } = await import('../animations/resultsAnimations.js');
  await correctAnswerZoom(correctCard);
}

/**
 * Handles showing correct voters.
 * @param {object} data - Correct voters data
 */
function handleShowCorrectVoters(data) {
  if (data.sequenceId !== currentSequenceId) return;

  const correctAnswerArea = document.getElementById('correctAnswerArea');
  if (!correctAnswerArea) return;

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

  correctAnswerArea.appendChild(votersContainer);
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

  // Show next button
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
