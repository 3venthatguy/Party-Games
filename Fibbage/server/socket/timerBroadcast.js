/**
 * Timer broadcast functionality for game phases.
 */

const config = require('../config');
const { logError } = require('../utils/logger');

/**
 * Starts broadcasting timer updates to a room.
 * @param {object} io - Socket.io server instance
 * @param {string} roomCode - Room code
 * @param {GameManager} gameManager - Game manager instance
 */
function startTimerBroadcast(io, roomCode, gameManager) {
  const timerInterval = setInterval(() => {
    const gameState = gameManager.getGameState(roomCode);
    if (!gameState) {
      clearInterval(timerInterval);
      return;
    }

    const timeRemaining = gameManager.getTimeRemaining(gameState);

    if (timeRemaining > 0) {
      io.to(roomCode).emit('timerUpdate', { timeRemaining });
    } else {
      // Timer expired, handle auto-transition based on current phase
      const currentPhase = gameState.phase;

      if (currentPhase === 'reading') {
        handleReadingPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval);
      } else if (currentPhase === 'submit') {
        handleSubmitPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval);
      } else if (currentPhase === 'voting') {
        handleVotingPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval);
      }
    }
  }, config.TIMER_BROADCAST_INTERVAL);
}

/**
 * Handles timer expiry during reading phase.
 */
function handleReadingPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval) {
  console.log('[TimerBroadcast] Reading phase expired, transitioning to submit');

  // Get the game room to call transitionToSubmit
  const gameRoom = gameManager.getGameRoom(roomCode);
  if (gameRoom) {
    gameRoom.transitionToSubmit();
  }

  console.log('[TimerBroadcast] Emitting phaseChange to submit (reading phase expired)');
  io.to(roomCode).emit('phaseChange', {
    phase: 'submit',
    timeRemaining: config.SUBMIT_PHASE_DURATION
  });

  startTimerBroadcast(io, roomCode, gameManager);
  clearInterval(timerInterval);
}

/**
 * Handles timer expiry during submit phase.
 */
function handleSubmitPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval) {
  // Transition to voting
  gameManager.transitionToVoting(gameState);
  const shuffledAnswers = gameManager.getShuffledAnswers(gameState);
  io.to(roomCode).emit('allAnswersSubmitted');

  setTimeout(() => {
    io.to(roomCode).emit('votingReady', {
      answers: shuffledAnswers.map(a => ({ id: a.id, text: a.text }))
    });

    console.log('[TimerBroadcast] Emitting phaseChange to voting (submit phase expired)');
    io.to(roomCode).emit('phaseChange', {
      phase: 'voting',
      timeRemaining: config.VOTING_PHASE_DURATION
    });

    startTimerBroadcast(io, roomCode, gameManager);
  }, config.VOTING_TRANSITION_DELAY);

  clearInterval(timerInterval);
}

/**
 * Handles timer expiry during voting phase.
 */
function handleVotingPhaseExpiry(io, roomCode, gameState, gameManager, timerInterval) {
  console.log('[TimerBroadcast] Voting phase expired, transitioning to results');

  // Transition to results phase
  gameState.setPhase('results');

  if (Object.keys(gameState.votes).length > 0) {
    // Start results animation sequence
    const { startResultsAnimation } = require('./events/resultsEvents');
    startResultsAnimation(io, roomCode, gameManager);
  } else {
    console.log('[TimerBroadcast] No votes submitted, auto-advancing to next question');
    // Auto-advance if no votes
    setTimeout(() => {
      try {
        const nextState = gameManager.nextQuestion(roomCode, gameState.hostId);
        if (nextState.phase === 'gameOver') {
          const finalScores = nextState.players
            .map(p => p.toClientData())
            .sort((a, b) => b.score - a.score);
          io.to(roomCode).emit('gameOver', { finalScores });
        } else {
          io.to(roomCode).emit('newQuestion', {
            question: nextState.currentQuestion.question,
            questionIndex: nextState.currentQuestionIndex,
            totalQuestions: nextState.selectedQuestionIds.length
          });

          io.to(roomCode).emit('phaseChange', {
            phase: 'reading',
            timeRemaining: config.READING_PHASE_DURATION
          });

          startTimerBroadcast(io, roomCode, gameManager);
        }
      } catch (e) {
        logError('auto-advancing', e);
      }
    }, config.AUTO_ADVANCE_DELAY);
  }

  clearInterval(timerInterval);
}

module.exports = {
  startTimerBroadcast
};
