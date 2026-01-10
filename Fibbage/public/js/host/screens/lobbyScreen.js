/**
 * Lobby screen logic for the host.
 */

/**
 * Shows the lobby screen.
 */
function showLobbyScreen() {
  const lobbyScreen = document.getElementById('lobbyScreen');
  const gameScreen = document.getElementById('gameScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');

  lobbyScreen.classList.add('active');
  gameScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
}

/**
 * Hides the lobby screen.
 */
function hideLobbyScreen() {
  const lobbyScreen = document.getElementById('lobbyScreen');
  lobbyScreen.classList.remove('active');
}
