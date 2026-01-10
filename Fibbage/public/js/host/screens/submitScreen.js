/**
 * Submit phase screen logic for the host.
 */

/**
 * Shows the submit phase UI.
 * @param {number} playerCount - Number of players
 */
function showSubmitPhase(playerCount) {
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');

  submitPhase.style.display = 'block';
  votingPhase.style.display = 'none';
  resultsPhase.style.display = 'none';

  // Initialize checkmarks
  const submitCheckmarks = document.getElementById('submitCheckmarks');
  submitCheckmarks.innerHTML = '';
  for (let i = 0; i < playerCount; i++) {
    const checkmark = document.createElement('div');
    checkmark.className = 'checkmark';
    checkmark.textContent = '✓';
    submitCheckmarks.appendChild(checkmark);
  }
}

/**
 * Updates the submit status display.
 * @param {number} submittedCount - Number of players who submitted
 * @param {number} totalPlayers - Total number of players
 */
function updateSubmitStatus(submittedCount, totalPlayers) {
  const submitStatus = document.getElementById('submitStatus');
  submitStatus.textContent = `${submittedCount}/${totalPlayers} players submitted`;

  // Update checkmarks
  const submitCheckmarks = document.getElementById('submitCheckmarks');
  const checkmarks = submitCheckmarks.querySelectorAll('.checkmark');
  for (let i = 0; i < submittedCount; i++) {
    if (checkmarks[i]) {
      checkmarks[i].classList.add('submitted');
    }
  }
}

/**
 * Shows all answers submitted message.
 */
function showAllAnswersSubmitted() {
  const submitStatus = document.getElementById('submitStatus');
  submitStatus.textContent = 'All answers submitted!';
}
