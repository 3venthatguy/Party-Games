/**
 * Voting phase screen logic for the player.
 */

/**
 * Shows the voting phase UI.
 */
function showPlayerVotingPhase() {
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');
  const votingWaiting = document.getElementById('votingWaiting');

  submitPhase.style.display = 'none';
  votingPhase.style.display = 'block';
  resultsPhase.style.display = 'none';
  votingWaiting.style.display = 'none';
}

/**
 * Displays the voting answers (excluding player's own answer).
 * @param {Array} answers - Array of answer objects
 * @param {string} playerId - Current player's ID
 * @param {Function} onVote - Callback when an answer is voted for
 */
function displayPlayerVotingAnswers(answers, playerId, onVote) {
  const answersList = document.getElementById('answersList');
  answersList.innerHTML = '';

  // Filter out the player's own answer
  const votableAnswers = answers.filter(answer => answer.id !== playerId);

  votableAnswers.forEach((answer) => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.textContent = answer.text;
    button.dataset.answerId = answer.id;

    button.addEventListener('click', () => {
      const playerState = window.playerState;
      if (playerState.submittedVote) return;

      // Remove previous selection
      answersList.querySelectorAll('.answer-button').forEach(btn => {
        btn.classList.remove('selected');
      });

      button.classList.add('selected');
      playerState.selectedAnswerId = answer.id;

      onVote(answer.id);
    });

    answersList.appendChild(button);
  });
}

/**
 * Shows the voting waiting state.
 */
function showVotingWaiting() {
  const votingWaiting = document.getElementById('votingWaiting');
  const answersList = document.getElementById('answersList');

  votingWaiting.style.display = 'block';

  // Disable all buttons
  answersList.querySelectorAll('.answer-button').forEach(btn => {
    btn.disabled = true;
  });
}
