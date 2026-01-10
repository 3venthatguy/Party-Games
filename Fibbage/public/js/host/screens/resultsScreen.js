/**
 * Results phase screen logic for the host.
 */

/**
 * Shows the results phase UI.
 */
function showResultsPhase() {
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
 * @param {Array} players - Array of players
 */
function displayResults(data, players) {
  const { correctAnswer, explanation, roundScores, totalScores, votes } = data;

  // Show correct answer
  const correctAnswerReveal = document.getElementById('correctAnswerReveal');
  const explanationEl = document.getElementById('explanation');
  correctAnswerReveal.textContent = `Correct Answer: ${correctAnswer}`;
  explanationEl.textContent = explanation;

  // Show who fooled whom
  const fooledBreakdown = document.getElementById('fooledBreakdown');
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
}
