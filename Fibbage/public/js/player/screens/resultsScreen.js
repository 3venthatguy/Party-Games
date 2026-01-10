/**
 * Results phase screen logic for the player.
 */

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
}

/**
 * Displays the results.
 * @param {object} data - Results data
 * @param {string} playerId - Current player's ID
 */
function displayPlayerResults(data, playerId) {
  console.log('displayPlayerResults called with data:', data);
  console.log('playerId:', playerId);

  const { correctAnswer, explanation, roundScores, totalScores } = data;

  // Show correct answer
  const correctAnswerReveal = document.getElementById('correctAnswerReveal');
  const explanationEl = document.getElementById('explanation');
  correctAnswerReveal.textContent = `Correct Answer: ${correctAnswer}`;
  explanationEl.textContent = explanation;

  // Show round score and total score
  const roundScore = document.getElementById('roundScore');
  const totalScore = document.getElementById('totalScore');

  console.log('roundScore element:', roundScore);
  console.log('totalScore element:', totalScore);
  console.log('totalScores:', totalScores);

  const ourTotalScore = totalScores.find(p => p.id === playerId);
  console.log('ourTotalScore:', ourTotalScore);

  if (ourTotalScore) {
    const ourRoundScore = roundScores[playerId] || 0;
    console.log('ourRoundScore:', ourRoundScore);
    roundScore.textContent = `+${ourRoundScore.toLocaleString()}`;
    totalScore.textContent = `Total: ${ourTotalScore.score.toLocaleString()} points`;
    console.log('Set roundScore to:', roundScore.textContent);
    console.log('Set totalScore to:', totalScore.textContent);
  } else {
    console.log('ERROR: Could not find player in totalScores!');
  }

  // Show mini leaderboard
  updateMiniLeaderboard(totalScores, playerId);
}
