/**
 * Socket event handlers for results animation sequence.
 */

const ResultsAnimator = require('../../game/ResultsAnimator');
const { logError } = require('../../utils/logger');

/**
 * Sets up results animation event handlers.
 * @param {object} io - Socket.io server instance
 * @param {object} socket - Socket instance
 * @param {GameManager} gameManager - Game manager instance
 */
function setupResultsEvents(io, socket, gameManager) {
  // This is called when voting phase completes and results should be shown
  // The actual animation sequence is triggered from playerEvents.js
  // This file exists for potential future direct results requests
}

/**
 * Starts the results animation sequence for a room.
 * @param {object} io - Socket.io server instance
 * @param {string} roomCode - Room code
 * @param {GameManager} gameManager - Game manager instance
 */
async function startResultsAnimation(io, roomCode, gameManager) {
  try {
    console.log('[ResultsEvents] Starting results animation for room:', roomCode);
    const gameState = gameManager.getGameState(roomCode);
    if (!gameState) {
      console.error('[ResultsEvents] No game state found for room:', roomCode);
      return;
    }
    if (gameState.phase !== 'results') {
      console.error('[ResultsEvents] Game not in results phase:', gameState.phase);
      return;
    }

    console.log('[ResultsEvents] Calculating results...');
    const results = gameManager.calculateResults(gameState);
    console.log('[ResultsEvents] Results calculated:', results);

    // IMPORTANT: Tell clients to transition to results phase UI first
    console.log('[ResultsEvents] Emitting phaseChange to results');
    io.to(roomCode).emit('phaseChange', {
      phase: 'results',
      timeRemaining: 0
    });

    // Wait a moment for clients to set up results UI
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('[ResultsEvents] Creating ResultsAnimator...');
    const animator = new ResultsAnimator(gameState, io, roomCode);

    // Start animation sequence (non-blocking)
    console.log('[ResultsEvents] Starting animation sequence...');
    animator.playResultsSequence(results).catch(error => {
      console.error('[ResultsEvents] Animation sequence error:', error);
      logError('results animation sequence', error);
      // Fallback: send instant results if animation fails
      io.to(roomCode).emit('resultsReady', results);
    });
  } catch (error) {
    console.error('[ResultsEvents] Error starting results animation:', error);
    logError('starting results animation', error);
    // Fallback: send instant results
    const gameState = gameManager.getGameState(roomCode);
    if (gameState) {
      const results = gameManager.calculateResults(gameState);
      io.to(roomCode).emit('resultsReady', results);
    }
  }
}

module.exports = {
  setupResultsEvents,
  startResultsAnimation
};
