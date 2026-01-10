/**
 * ResultsAnimator - Orchestrates the progressive results reveal animation sequence.
 * Controls timing and emits socket events to synchronize animations across all clients.
 */

const config = require('../config');

class ResultsAnimator {
  constructor(gameState, io, roomCode) {
    this.gameState = gameState;
    this.io = io;
    this.roomCode = roomCode;
    this.timings = config.RESULTS_ANIMATION_TIMINGS;
    this.sequenceId = Date.now();
  }

  /**
   * Delays execution by specified milliseconds.
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Plays the complete results animation sequence.
   * @param {object} results - Results data from ScoreCalculator
   */
  async playResultsSequence(results) {
    const { correctAnswer, explanation, roundScores, totalScores, votes, voteCounts } = results;

    // Prepare fake answers with vote information
    const allFakeAnswers = this.gameState.players
      .filter(player => {
        const answer = this.gameState.submittedAnswers[player.id];
        return answer && answer !== correctAnswer;
      })
      .map(player => ({
        playerId: player.id,
        playerName: player.name,
        answerText: this.gameState.submittedAnswers[player.id],
        voters: this.getVotersForAnswer(player.id, votes),
        pointsEarned: roundScores[player.id] || 0
      }));

    // CRITICAL: Filter to only include answers that received votes (Jackbox flow)
    const votedOnFakeAnswers = allFakeAnswers.filter(answer => answer.voters.length > 0);

    console.log(`[ResultsAnimator] Total fake answers: ${allFakeAnswers.length}, With votes: ${votedOnFakeAnswers.length}`);

    // Prepare all answers data for client (including correct answer)
    const allAnswersData = [
      ...votedOnFakeAnswers.map(fa => ({
        id: fa.playerId,
        text: fa.answerText,
        isCorrect: false
      })),
      {
        id: 'correct',
        text: correctAnswer,
        isCorrect: true
      }
    ];

    // Emit start sequence event with answer data
    this.io.to(this.roomCode).emit('results:startSequence', {
      sequenceId: this.sequenceId,
      fakeAnswerCount: votedOnFakeAnswers.length,
      timings: this.timings,
      answers: allAnswersData // NEW: Send answer data to client
    });

    // Wait a moment for clients to prepare
    await this.delay(500);

    // Reveal each voted-on fake answer
    for (let i = 0; i < votedOnFakeAnswers.length; i++) {
      const fakeAnswer = votedOnFakeAnswers[i];
      await this.revealFakeAnswer(fakeAnswer, i);

      // Brief pause between answers
      if (i < votedOnFakeAnswers.length - 1) {
        await this.delay(this.timings.betweenAnswers);
      }
    }

    // Reveal correct answer (always last)
    await this.revealCorrectAnswer(correctAnswer, explanation, votes, roundScores);

    // Show explanation AFTER correct answer reveal
    await this.showExplanation(explanation);

    // Update scoreboard
    await this.showScoreboard(totalScores, roundScores);

    // Complete
    this.io.to(this.roomCode).emit('results:complete', {
      sequenceId: this.sequenceId
    });
  }

  /**
   * Gets list of voters for a specific answer.
   * @param {string} answerPlayerId - Player ID who wrote the answer
   * @param {object} votes - All votes
   * @returns {Array} Array of voter player IDs
   */
  getVotersForAnswer(answerPlayerId, votes) {
    return Object.entries(votes)
      .filter(([voterId, votedForId]) => votedForId === answerPlayerId)
      .map(([voterId]) => {
        const player = this.gameState.getPlayer(voterId);
        return player ? { id: player.id, name: player.name } : null;
      })
      .filter(Boolean);
  }

  /**
   * Reveals a single fake answer with full animation sequence.
   * @param {object} fakeAnswer - Fake answer data
   * @param {number} index - Index in sequence
   */
  async revealFakeAnswer(fakeAnswer, index) {
    const { playerId, playerName, answerText, voters, pointsEarned } = fakeAnswer;

    // Phase 1: Highlight Answer
    this.io.to(this.roomCode).emit('results:highlightAnswer', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      answerText: answerText,
      index: index
    });
    await this.delay(this.timings.answerHighlight);

    // Phase 2: Suspense Pause (NEW - Jackbox flow)
    await this.delay(this.timings.suspensePause);

    // Phase 3: Reveal "IT'S A LIE!" + Show Fooled Players
    this.io.to(this.roomCode).emit('results:revealLie', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      authorName: playerName,
      voters: voters,
      pointsEarned: pointsEarned
    });
    await this.delay(this.timings.lieRevealDuration);

    // Phase 4: Show Voters (fooled players fly in)
    this.io.to(this.roomCode).emit('results:showVoters', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      voters: voters
    });
    // Wait for voters to appear (staggered)
    await this.delay(this.timings.voterAppearStagger * voters.length + 500);

    // Phase 5: Reveal Author
    this.io.to(this.roomCode).emit('results:revealAuthor', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      authorId: playerId,
      authorName: playerName,
      pointsEarned: pointsEarned,
      voterCount: voters.length
    });
    await this.delay(this.timings.authorRevealDuration);

    // Phase 6: Score Update
    if (pointsEarned > 0) {
      this.io.to(this.roomCode).emit('results:updateScore', {
        sequenceId: this.sequenceId,
        playerId: playerId,
        pointsEarned: pointsEarned,
        newTotalScore: this.gameState.getPlayer(playerId).score
      });
      await this.delay(this.timings.scoreAnimationDuration);
    }

    // Phase 7: Reaction Pause
    await this.delay(this.timings.reactionPause);

    // Phase 8: Transition
    this.io.to(this.roomCode).emit('results:transitionNext', {
      sequenceId: this.sequenceId,
      answerId: playerId
    });
    await this.delay(this.timings.transitionDuration);
  }

  /**
   * Reveals the correct answer with special treatment.
   * @param {string} correctAnswer - Correct answer text
   * @param {string} explanation - Explanation text
   * @param {object} votes - All votes
   * @param {object} roundScores - Round scores
   */
  async revealCorrectAnswer(correctAnswer, explanation, votes, roundScores) {
    // Phase 1: Highlight Correct Answer (NEW - Jackbox flow)
    this.io.to(this.roomCode).emit('results:highlightCorrectAnswer', {
      sequenceId: this.sequenceId,
      answerText: correctAnswer
    });
    await this.delay(this.timings.correctAnswerHighlight);

    // Phase 2: Suspense Pause
    await this.delay(this.timings.suspensePause);

    // Phase 3: Reveal "THE TRUTH!" + Correct Answer
    this.io.to(this.roomCode).emit('results:revealTruth', {
      sequenceId: this.sequenceId,
      answerText: correctAnswer
    });
    await this.delay(this.timings.truthRevealDuration);

    // Phase 4: Show Correct Voters
    const correctVoters = this.getCorrectVoters(votes);
    this.io.to(this.roomCode).emit('results:showCorrectVoters', {
      sequenceId: this.sequenceId,
      voters: correctVoters
    });
    await this.delay(this.timings.correctVoterAppearStagger * correctVoters.length + 500);

    // Phase 5: Score Correct Voters
    const correctVotersWithScores = correctVoters.map(voter => ({
      ...voter,
      pointsEarned: roundScores[voter.id] || 0,
      newTotalScore: this.gameState.getPlayer(voter.id)?.score || 0
    }));

    this.io.to(this.roomCode).emit('results:updateCorrectScores', {
      sequenceId: this.sequenceId,
      voters: correctVotersWithScores
    });
    await this.delay(this.timings.scoreAnimationDuration);
  }

  /**
   * Gets list of players who voted correctly.
   * @param {object} votes - All votes
   * @returns {Array} Array of correct voter data
   */
  getCorrectVoters(votes) {
    return Object.entries(votes)
      .filter(([voterId, votedForId]) => votedForId === 'correct')
      .map(([voterId]) => {
        const player = this.gameState.getPlayer(voterId);
        return player ? { id: player.id, name: player.name } : null;
      })
      .filter(Boolean);
  }

  /**
   * Shows the explanation.
   * @param {string} explanation - Explanation text
   */
  async showExplanation(explanation) {
    this.io.to(this.roomCode).emit('results:showExplanation', {
      sequenceId: this.sequenceId,
      explanation: explanation
    });
    await this.delay(this.timings.explanationDisplay);
  }

  /**
   * Shows the updated scoreboard.
   * @param {Array} totalScores - Total scores for all players
   * @param {object} roundScores - Round scores
   */
  async showScoreboard(totalScores, roundScores) {
    // Sort by score descending
    const sortedScores = [...totalScores].sort((a, b) => b.score - a.score);

    // Store scoreboard data for when button is clicked
    this.leaderboardData = {
      sequenceId: this.sequenceId,
      sortedPlayers: sortedScores,
      roundScores: roundScores,
      totalScores: totalScores
    };

    // Show the "Show Leaderboard" button instead of auto-showing
    this.io.to(this.roomCode).emit('results:showLeaderboardButton', {
      sequenceId: this.sequenceId
    });

    // Don't auto-proceed - wait for host to click the button
  }

  /**
   * Shows the leaderboard (called when host clicks the button).
   */
  showLeaderboardNow() {
    if (this.leaderboardData) {
      this.io.to(this.roomCode).emit('results:showLeaderboard', this.leaderboardData);
    }
  }
}

module.exports = ResultsAnimator;
