/**
 * Voting phase screen logic for the host.
 */

/**
 * Shows the voting phase UI.
 */
function showVotingPhase() {
  console.log('[VotingScreen] Showing voting phase');
  const submitPhase = document.getElementById('submitPhase');
  const votingPhase = document.getElementById('votingPhase');
  const resultsPhase = document.getElementById('resultsPhase');

  submitPhase.style.display = 'none';
  votingPhase.style.display = 'block';
  resultsPhase.style.display = 'none';

  // Debug: Check if answers are in the grid
  const answersGrid = document.getElementById('answersGrid');
  console.log('[VotingScreen] Voting phase UI updated');
  console.log('[VotingScreen] votingPhase display:', votingPhase.style.display);
  console.log('[VotingScreen] answersGrid children count:', answersGrid?.children.length);
  console.log('[VotingScreen] answersGrid HTML:', answersGrid?.innerHTML.substring(0, 200));
}

/**
 * Displays the voting answers.
 * @param {Array} answers - Array of answer objects
 */
function displayVotingAnswers(answers) {
  console.log('[VotingScreen] Displaying voting answers:', answers);
  const answersGrid = document.getElementById('answersGrid');
  if (!answersGrid) {
    console.error('[VotingScreen] answersGrid element not found!');
    return;
  }

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
    console.log('[VotingScreen] Added answer card:', answer.text);
  });

  console.log('[VotingScreen] Total answer cards added:', answers.length);
}
