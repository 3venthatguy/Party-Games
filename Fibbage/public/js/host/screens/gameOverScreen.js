/**
 * Game over screen logic for the host.
 */

/**
 * Shows the game over screen with final scores.
 * @param {Array} finalScores - Array of final scores sorted by rank
 */
function showGameOverScreen(finalScores) {
  const gameScreen = document.getElementById('gameScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const winnerCelebration = document.getElementById('winnerCelebration');
  const finalLeaderboard = document.getElementById('finalLeaderboard');

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
}
