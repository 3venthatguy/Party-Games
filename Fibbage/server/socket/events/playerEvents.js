/**
 * Socket event handlers for player actions (submit answer, submit vote).
 */

const config = require('../../config');
const { logError } = require('../../utils/logger');

/**
 * Sets up player action event handlers.
 * @param {object} io - Socket.io server instance
 * @param {object} socket - Socket instance
 * @param {GameManager} gameManager - Game manager instance
 */
function setupPlayerEvents(io, socket, gameManager) {
  // Submit an answer
  socket.on('submitAnswer', ({ roomCode, answer }) => {
    try {
      const socketData = gameManager.socketToPlayer.get(socket.id);
      if (!socketData) {
        socket.emit('error', 'Not a player in this room');
        return;
      }

      const gameState = gameManager.submitAnswer(roomCode, socketData.playerId, answer);

      // Notify all players of submission count
      io.to(roomCode).emit('answerSubmitted', {
        submittedCount: Object.keys(gameState.submittedAnswers).length,
        totalPlayers: gameState.players.length
      });

      // If all submitted, notify transition
      if (gameState.phase === 'voting') {
        const shuffledAnswers = gameManager.getShuffledAnswers(gameState);
        io.to(roomCode).emit('allAnswersSubmitted');

        setTimeout(() => {
          io.to(roomCode).emit('votingReady', {
            answers: shuffledAnswers.map(a => ({ id: a.id, text: a.text }))
          });

          io.to(roomCode).emit('phaseChange', {
            phase: 'voting',
            timeRemaining: config.VOTING_PHASE_DURATION
          });
        }, config.VOTING_TRANSITION_DELAY);
      }
    } catch (error) {
      socket.emit('error', error.message);
      logError('submitting answer', error);
    }
  });

  // Submit a vote
  socket.on('submitVote', ({ roomCode, votedForId }) => {
    try {
      const socketData = gameManager.socketToPlayer.get(socket.id);
      if (!socketData) {
        socket.emit('error', 'Not a player in this room');
        return;
      }

      const gameState = gameManager.submitVote(roomCode, socketData.playerId, votedForId);

      // Notify all players of vote count
      const voteCount = Object.keys(gameState.votes).length;
      io.to(roomCode).emit('voteSubmitted', {
        voteCount,
        totalPlayers: gameState.players.length,
        votedForId: votedForId
      });

      // If all voted, calculate and send results
      if (gameState.phase === 'results') {
        const results = gameManager.calculateResults(gameState);
        console.log('Sending resultsReady with data:', JSON.stringify(results, null, 2));

        setTimeout(() => {
          io.to(roomCode).emit('resultsReady', results);
        }, config.RESULTS_TRANSITION_DELAY);
      }
    } catch (error) {
      socket.emit('error', error.message);
      logError('submitting vote', error);
    }
  });
}

module.exports = {
  setupPlayerEvents
};
