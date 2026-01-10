/**
 * Main initialization and state management for the host screen.
 */

// Host state
const hostState = {
  roomCode: null,
  currentPhase: 'lobby',
  players: []
};

// Initialize socket connection
const socket = io();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initializeHost();
});

/**
 * Initializes the host screen.
 */
function initializeHost() {
  // Setup socket handlers
  setupHostSocketHandlers(socket, hostState);

  // Setup button handlers
  setupButtonHandlers();

  // Create room
  createRoom();
}

/**
 * Creates a new game room.
 */
function createRoom() {
  socket.emit('createRoom');
}

/**
 * Sets up button event handlers.
 */
function setupButtonHandlers() {
  const startButton = document.getElementById('startButton');
  const nextButton = document.getElementById('nextButton');
  const playAgainButton = document.getElementById('playAgainButton');

  startButton.addEventListener('click', () => {
    socket.emit('startGame', { roomCode: hostState.roomCode });
    startButton.disabled = true;
  });

  nextButton.addEventListener('click', () => {
    socket.emit('nextQuestion', { roomCode: hostState.roomCode });
  });

  playAgainButton.addEventListener('click', () => {
    location.reload();
  });
}
