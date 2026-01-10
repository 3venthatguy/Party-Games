/**
 * Socket event handlers for room creation and joining.
 */

const { logError } = require('../../utils/logger');

/**
 * Sets up room-related event handlers.
 * @param {object} io - Socket.io server instance
 * @param {object} socket - Socket instance
 * @param {GameManager} gameManager - Game manager instance
 */
function setupRoomEvents(io, socket, gameManager) {
  // Create a new room
  socket.on('createRoom', () => {
    try {
      const roomCode = gameManager.createRoom(socket.id);
      socket.emit('roomCreated', roomCode);
      socket.join(roomCode);
    } catch (error) {
      socket.emit('error', error.message);
      logError('creating room', error);
    }
  });

  // Join a room
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    try {
      const gameState = gameManager.getGameState(roomCode);
      if (!gameState) {
        socket.emit('error', 'Room not found');
        return;
      }

      const player = gameManager.joinRoom(roomCode, playerName, socket.id);
      socket.join(roomCode);

      // Notify all players in room
      io.to(roomCode).emit('playerJoined', {
        players: gameState.getPlayersClientData()
      });

      // Send current game state to the new player
      socket.emit('gameState', {
        phase: gameState.phase,
        currentQuestionIndex: gameState.currentQuestionIndex,
        totalQuestions: gameState.selectedQuestionIds.length || 8
      });
    } catch (error) {
      socket.emit('error', error.message);
      logError('joining room', error);
    }
  });
}

module.exports = {
  setupRoomEvents
};
