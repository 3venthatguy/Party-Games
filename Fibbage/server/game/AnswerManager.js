/**
 * Answer management utilities.
 * Handles answer shuffling and validation.
 */

/**
 * Shuffles answers with the correct answer for voting.
 * @param {object} gameState - Current game state
 * @returns {Array} Shuffled array of answers
 */
function getShuffledAnswers(gameState) {
  const answers = [];

  // Add all player answers
  gameState.players.forEach(player => {
    if (gameState.submittedAnswers[player.id]) {
      answers.push({
        id: player.id,
        text: gameState.submittedAnswers[player.id],
        isCorrect: false
      });
    }
  });

  // Add correct answer
  answers.push({
    id: 'correct',
    text: gameState.currentQuestion.answer,
    isCorrect: true
  });

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return answers;
}

/**
 * Validates that an answer is not the same as the correct answer.
 * @param {string} answer - Submitted answer
 * @param {string} correctAnswer - The correct answer
 * @returns {boolean} True if valid (different from correct), false otherwise
 */
function isAnswerValid(answer, correctAnswer) {
  const submitted = answer.toLowerCase().trim();
  const correct = correctAnswer.toLowerCase().trim();
  return submitted !== correct;
}

module.exports = {
  getShuffledAnswers,
  isAnswerValid
};
