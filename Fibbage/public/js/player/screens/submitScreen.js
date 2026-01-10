/**
 * Submit phase screen logic for the player.
 */

/**
 * Sets up the submit screen inputs and button.
 * @param {Function} onSubmit - Callback when submit button is clicked
 */
function setupSubmitScreen(onSubmit) {
  const answerInput = document.getElementById('answerInput');
  const submitButton = document.getElementById('submitButton');
  const charCounter = document.getElementById('charCounter');

  answerInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.substring(0, 100);
    updateCharCounter(e.target.value.length);
    updateSubmitButtonState();
  });

  answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !submitButton.disabled) {
      submitButton.click();
    }
  });

  submitButton.addEventListener('click', () => {
    const answer = answerInput.value.trim();
    if (answer.length === 0) return;

    onSubmit(answer);
  });

  function updateSubmitButtonState() {
    const playerState = window.playerState;
    submitButton.disabled = answerInput.value.trim().length === 0 || playerState.submittedAnswer;
  }
}

/**
 * Shows the submit phase UI.
 */
function showPlayerSubmitPhase() {
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const watchScreen = document.getElementById('watchScreen');
  const submitWaiting = document.getElementById('submitWaiting');
  const questionDisplay = document.getElementById('questionDisplay');
  const questionNumber = document.getElementById('questionNumber');
  const timerDisplay = document.getElementById('timerDisplay');

  submitPhase.style.display = 'block';
  votingPhase.style.display = 'none';
  if (watchScreen) {
    watchScreen.style.display = 'none';
  }
  submitWaiting.style.display = 'none';

  // Show question, question number, and timer
  if (questionDisplay) {
    questionDisplay.style.display = 'block';
  }
  if (questionNumber) {
    questionNumber.style.display = 'block';
  }
  if (timerDisplay) {
    timerDisplay.style.display = 'block';
  }
}

/**
 * Resets the submit phase for a new question.
 */
function resetSubmitPhase() {
  const answerInput = document.getElementById('answerInput');
  const submitButton = document.getElementById('submitButton');
  const submitWaiting = document.getElementById('submitWaiting');

  answerInput.value = '';
  answerInput.disabled = false;
  submitButton.disabled = false;
  submitWaiting.style.display = 'none';
  updateCharCounter(0);
}

/**
 * Shows the waiting state after submitting an answer.
 */
function showSubmitWaiting() {
  const submitButton = document.getElementById('submitButton');
  const submitWaiting = document.getElementById('submitWaiting');
  const answerInput = document.getElementById('answerInput');

  submitButton.disabled = true;
  submitWaiting.style.display = 'block';
  answerInput.disabled = true;
}

/**
 * Shows all answers submitted message.
 */
function showAllAnswersSubmittedPlayer() {
  const submitWaiting = document.getElementById('submitWaiting');
  const playerState = window.playerState;

  if (playerState.currentPhase === 'submit') {
    submitWaiting.style.display = 'block';
  }
}
