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
    this.timings = this.getAnimationTimings();
    this.sequenceId = Date.now();
  }

  /**
   * Gets animation timing constants.
   * @returns {object} Timing configuration
   */
  getAnimationTimings() {
    return {
      answerHighlight: 500,
      voterAppearStagger: 200,
      authorRevealPause: 500,
      authorRevealDuration: 1000,
      scoreAnimationDuration: 1000,
      reactionPause: 500,
      transitionDuration: 300,
      correctAnswerBuildUp: 2000,
      correctAnswerReveal: 1000,
      correctVoterAppearStagger: 200,
      explanationDisplay: 4000,
      scoreboardAnimation: 2000,
      betweenAnswers: 300
    };
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

    // Prepare answer order (fake answers first, correct last)
    const fakeAnswers = this.gameState.players
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

    // Emit start sequence event
    this.io.to(this.roomCode).emit('results:startSequence', {
      sequenceId: this.sequenceId,
      fakeAnswerCount: fakeAnswers.length,
      timings: this.timings
    });

    // Wait a moment for clients to prepare
    await this.delay(500);

    // Reveal each fake answer
    for (let i = 0; i < fakeAnswers.length; i++) {
      const fakeAnswer = fakeAnswers[i];
      await this.revealFakeAnswer(fakeAnswer, i);
      
      // Brief pause between answers
      if (i < fakeAnswers.length - 1) {
        await this.delay(this.timings.betweenAnswers);
      }
    }

    // Reveal correct answer
    await this.revealCorrectAnswer(correctAnswer, explanation, votes, roundScores);

    // Show explanation
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

    // Phase 2: Show Voters
    this.io.to(this.roomCode).emit('results:showVoters', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      voters: voters
    });
    // Wait for voters to appear (staggered)
    await this.delay(this.timings.voterAppearStagger * voters.length + 500);

    // Phase 3: Reveal Author
    await this.delay(this.timings.authorRevealPause);
    this.io.to(this.roomCode).emit('results:revealAuthor', {
      sequenceId: this.sequenceId,
      answerId: playerId,
      authorId: playerId,
      authorName: playerName,
      pointsEarned: pointsEarned,
      voterCount: voters.length
    });
    await this.delay(this.timings.authorRevealDuration);

    // Phase 4: Score Update
    if (pointsEarned > 0) {
      this.io.to(this.roomCode).emit('results:updateScore', {
        sequenceId: this.sequenceId,
        playerId: playerId,
        pointsEarned: pointsEarned,
        newTotalScore: this.gameState.getPlayer(playerId).score
      });
      await this.delay(this.timings.scoreAnimationDuration);
    }

    // Phase 5: Reaction Pause
    await this.delay(this.timings.reactionPause);

    // Phase 6: Transition
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
    // Phase 1: Buildup
    this.io.to(this.roomCode).emit('results:correctAnswerBuild', {
      sequenceId: this.sequenceId
    });
    await this.delay(this.timings.correctAnswerBuildUp);

    // Phase 2: Correct Answer Reveal
    this.io.to(this.roomCode).emit('results:correctAnswerReveal', {
      sequenceId: this.sequenceId,
      answerText: correctAnswer
    });
    await this.delay(this.timings.correctAnswerReveal);

    // Phase 3: Show Correct Voters
    const correctVoters = this.getCorrectVoters(votes);
    this.io.to(this.roomCode).emit('results:showCorrectVoters', {
      sequenceId: this.sequenceId,
      voters: correctVoters
    });
    await this.delay(this.timings.correctVoterAppearStagger * correctVoters.length + 500);

    // Phase 4: Score Correct Voters
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

    this.io.to(this.roomCode).emit('results:showLeaderboard', {
      sequenceId: this.sequenceId,
      sortedPlayers: sortedScores,
      roundScores: roundScores,
      totalScores: totalScores
    });
    await this.delay(this.timings.scoreboardAnimation);
  }
}

module.exports = ResultsAnimator;
