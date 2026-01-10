/**
 * Timer class for managing phase timers.
 */

class Timer {
  constructor() {
    this.startTime = null;
    this.duration = 0;
  }

  /**
   * Starts the timer with the specified duration.
   * @param {number} durationSeconds - Duration in seconds
   */
  start(durationSeconds) {
    this.startTime = Date.now();
    this.duration = durationSeconds * 1000;
  }

  /**
   * Gets the remaining time in seconds.
   * @returns {number} Remaining time in seconds
   */
  getTimeRemaining() {
    if (!this.startTime) return 0;
    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, Math.ceil((this.duration - elapsed) / 1000));
    return remaining;
  }

  /**
   * Checks if the timer has expired.
   * @returns {boolean} True if expired, false otherwise
   */
  isExpired() {
    return this.getTimeRemaining() <= 0;
  }

  /**
   * Resets the timer.
   */
  reset() {
    this.startTime = null;
    this.duration = 0;
  }
}

module.exports = Timer;
