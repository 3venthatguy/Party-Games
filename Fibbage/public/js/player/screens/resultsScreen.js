/**
 * Results phase screen logic for the player.
 * Handles personal results display with animations.
 */

let playerAnimationState = {
  playerId: null,
  roundScores: null,
  totalScores: null,
  votes: null,
  correctAnswer: null,
  explanation: null
};

/**
 * Shows the results phase UI.
 */
function showPlayerResultsPhase() {
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');

  submitPhase.style.display = 'none';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'block';

  // Clear previous results
  const correctAnswerReveal = document.getElementById('correctAnswerReveal');
  const explanationEl = document.getElementById('explanation');
  const roundScore = document.getElementById('roundScore');
  const totalScore = document.getElementById('totalScore');
  
  if (correctAnswerReveal) correctAnswerReveal.textContent = '';
  if (explanationEl) explanationEl.textContent = '';
  if (roundScore) roundScore.textContent = '+0';
  if (totalScore) totalScore.textContent = 'Total: 0 points';
}

/**
 * Handles results sequence start (stores data for later use).
 * @param {object} data - Sequence data
 */
function handlePlayerResultsStart(data) {
  // Store sequence ID for validation
  playerAnimationState.sequenceId = data.sequenceId;
}

/**
 * Handles correct answer reveal for player.
 * @param {object} data - Correct answer data
 */
function handlePlayerCorrectAnswerReveal(data) {
  const correctAnswerReveal = document.getElementById('correctAnswerReveal');
  if (correctAnswerReveal) {
    correctAnswerReveal.textContent = `Correct Answer: ${data.answerText}`;
    correctAnswerReveal.classList.add('fade-in');
  }
}

/**
 * Handles showing explanation for player.
 * @param {object} data - Explanation data
 */
function handlePlayerShowExplanation(data) {
  const explanationEl = document.getElementById('explanation');
  if (explanationEl) {
    explanationEl.textContent = data.explanation;
    explanationEl.classList.add('fade-in');
  }
}

/**
 * Handles score update for player.
 * @param {object} data - Score data
 */
async function handlePlayerScoreUpdate(data) {
  if (data.playerId !== playerAnimationState.playerId) return;

  const roundScore = document.getElementById('roundScore');
  const totalScore = document.getElementById('totalScore');

  if (roundScore && data.pointsEarned > 0) {
    const { showRoundScore } = await import('../animations/resultsAnimations.js');
    showRoundScore(roundScore.parentElement, data.pointsEarned);
  }

  if (totalScore) {
    const player = playerAnimationState.totalScores?.find(p => p.id === data.playerId);
    const startScore = player ? (player.score - data.pointsEarned) : 0;
    const { animatePlayerScore } = await import('../animations/resultsAnimations.js');
    await animatePlayerScore(totalScore, startScore, data.newTotalScore);
  }
}

/**
 * Handles showing personal celebration.
 * @param {object} data - Celebration data
 */
async function handlePlayerCelebration(data) {
  if (data.playerId !== playerAnimationState.playerId) return;

  const celebrationContainer = document.createElement('div');
  celebrationContainer.id = 'playerCelebration';
  const resultsPhase = document.getElementById('resultsPhase');
  if (!resultsPhase) return;

  // Insert at beginning
  resultsPhase.insertBefore(celebrationContainer, resultsPhase.firstChild);

  const { showFooledCelebration, showCorrectCelebration } = await import('../animations/resultsAnimations.js');

  if (data.type === 'fooled') {
    showFooledCelebration(celebrationContainer, data.fooledCount, data.pointsEarned);
  } else if (data.type === 'correct') {
    showCorrectCelebration(celebrationContainer, data.pointsEarned);
  }
}

/**
 * Handles showing if player was fooled.
 * @param {object} data - Fooled data
 */
async function handlePlayerFooled(data) {
  if (data.playerId !== playerAnimationState.playerId) return;

  const fooledContainer = document.createElement('div');
  fooledContainer.id = 'playerFooled';
  const resultsPhase = document.getElementById('resultsPhase');
  if (!resultsPhase) return;

  resultsPhase.insertBefore(fooledContainer, resultsPhase.firstChild);

  const { showFooledMessage } = await import('../animations/resultsAnimations.js');
  showFooledMessage(fooledContainer, data.authorName);
}

/**
 * Handles leaderboard update for player.
 * @param {object} data - Leaderboard data
 */
function handlePlayerLeaderboard(data) {
  updateMiniLeaderboard(data.sortedPlayers, playerAnimationState.playerId);
}

/**
 * Legacy function for instant results (kept for compatibility).
 * @param {object} data - Results data
 * @param {string} playerId - Current player's ID
 */
function displayPlayerResults(data, playerId) {
  // Store data for animation sequence
  playerAnimationState.playerId = playerId;
  playerAnimationState.roundScores = data.roundScores;
  playerAnimationState.totalScores = data.totalScores;
  playerAnimationState.votes = data.votes;
  playerAnimationState.correctAnswer = data.correctAnswer;
  playerAnimationState.explanation = data.explanation;

  // Determine player's result
  const ourRoundScore = data.roundScores[playerId] || 0;
  const ourTotalScore = data.totalScores.find(p => p.id === playerId);
  
  // Check if player got correct
  const gotCorrect = data.votes[playerId] === 'correct';
  
  // Check if player fooled others
  const ourAnswer = data.submittedAnswers?.[playerId];
  const fooledCount = Object.values(data.votes).filter(v => v === playerId).length;

  // Show appropriate celebration
  if (gotCorrect && ourRoundScore > 0) {
    handlePlayerCelebration({
      playerId: playerId,
      type: 'correct',
      pointsEarned: ourRoundScore
    });
  } else if (fooledCount > 0 && ourRoundScore > 0) {
    handlePlayerCelebration({
      playerId: playerId,
      type: 'fooled',
      fooledCount: fooledCount,
      pointsEarned: ourRoundScore
    });
  }

  // Update scores
  const roundScore = document.getElementById('roundScore');
  const totalScore = document.getElementById('totalScore');

  if (roundScore && ourRoundScore > 0) {
    roundScore.textContent = `+${ourRoundScore.toLocaleString()}`;
  }

  if (totalScore && ourTotalScore) {
    totalScore.textContent = `Total: ${ourTotalScore.score.toLocaleString()} points`;
  }

  // Show correct answer and explanation
  const correctAnswerReveal = document.getElementById('correctAnswerReveal');
  const explanationEl = document.getElementById('explanation');
  
  if (correctAnswerReveal) {
    correctAnswerReveal.textContent = `Correct Answer: ${data.correctAnswer}`;
  }
  
  if (explanationEl) {
    explanationEl.textContent = data.explanation;
  }

  // Show mini leaderboard
  updateMiniLeaderboard(data.totalScores, playerId);
}
