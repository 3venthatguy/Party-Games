/**
 * Score calculation logic for the game.
 */

const config = require('../config');

/**
 * Calculates results and scores for the current round.
 * @param {object} gameState - Current game state
 * @returns {object} Results data including scores and vote counts
 */
function calculateResults(gameState) {
  const correctAnswer = gameState.currentQuestion.answer;
  const roundScores = {};
  const voteCounts = {};

  // Initialize scores and vote counts
  gameState.players.forEach(player => {
    roundScores[player.id] = 0;
    voteCounts[player.id] = 0;
  });

  // Calculate scores for each player
  gameState.players.forEach(player => {
    const votedFor = gameState.votes[player.id];

    // Award points for voting for correct answer
    if (votedFor === 'correct') {
      roundScores[player.id] += config.CORRECT_VOTE_POINTS;
    } else if (votedFor) {
      const votedForPlayer = gameState.players.find(p => p.id === votedFor);
      if (votedForPlayer && gameState.submittedAnswers[votedFor] === correctAnswer) {
        roundScores[player.id] += config.CORRECT_VOTE_POINTS;
      }
    }

    // Count votes received and award points for fooling others
    Object.values(gameState.votes).forEach(voterVote => {
      if (voterVote === player.id && gameState.submittedAnswers[player.id] !== correctAnswer) {
        voteCounts[player.id]++;
        roundScores[player.id] += config.FOOL_PLAYER_POINTS;
      }
    });
  });

  // Update total scores
  gameState.players.forEach(player => {
    player.addScore(roundScores[player.id]);
  });

  return {
    correctAnswer,
    explanation: gameState.currentQuestion.explanation,
    roundScores,
    totalScores: gameState.players.map(p => p.toClientData()),
    votes: gameState.votes,
    voteCounts
  };
}

module.exports = {
  calculateResults
};
