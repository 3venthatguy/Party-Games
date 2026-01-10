/**
 * Configuration constants for the Economics Fibbage game.
 * Contains all magic numbers, timeouts, and game settings.
 */

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  CORS_ORIGIN: "*",

  // Room configuration
  ROOM_CODE_LENGTH: 4,
  ROOM_CODE_CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes

  // Game configuration
  MIN_PLAYERS: 2,
  QUESTIONS_PER_GAME: 8,
  MAX_PLAYER_NAME_LENGTH: 20,
  MAX_ANSWER_LENGTH: 100,

  // Phase durations (in seconds)
  SUBMIT_PHASE_DURATION: 30,
  VOTING_PHASE_DURATION: 20,

  // Transition delays (in milliseconds)
  GAME_START_DELAY: 1000,
  VOTING_TRANSITION_DELAY: 2000,
  RESULTS_TRANSITION_DELAY: 1000,
  AUTO_ADVANCE_DELAY: 3000,

  // Scoring
  CORRECT_VOTE_POINTS: 1000,
  FOOL_PLAYER_POINTS: 500,

  // Timer broadcast interval
  TIMER_BROADCAST_INTERVAL: 1000
};
