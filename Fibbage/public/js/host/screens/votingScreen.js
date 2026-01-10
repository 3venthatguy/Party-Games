/**
 * Voting phase screen logic for the host.
 */

/**
 * Shows the voting phase UI.
 */
function showVotingPhase() {
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');

  submitPhase.style.display = 'none';
  votingPhase.style.display = 'block';
  resultsPhase.style.display = 'none';
}

/**
 * Displays the voting answers.
 * @param {Array} answers - Array of answer objects
 */
function displayVotingAnswers(answers) {
  const answersGrid = document.getElementById('answersGrid');
  answersGrid.innerHTML = '';

  answers.forEach((answer) => {
    const card = document.createElement('div');
    card.className = 'answer-card';
    card.dataset.answerId = answer.id;

    const answerText = document.createElement('div');
    answerText.textContent = answer.text;
    answerText.style.flex = '1';
    card.appendChild(answerText);

    answersGrid.appendChild(card);
  });
}
