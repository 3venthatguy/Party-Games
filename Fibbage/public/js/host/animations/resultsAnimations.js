/**
 * Animation functions for results reveal sequence.
 * Each function handles a specific animation phase.
 */

/**
 * Highlights an answer card with pulse/zoom effect.
 * @param {HTMLElement} answerElement - Answer card element
 * @returns {Promise} Promise that resolves when animation completes
 */
export function highlightAnswer(answerElement) {
  return new Promise((resolve) => {
    if (!answerElement) {
      resolve();
      return;
    }

    answerElement.classList.add('answer-highlighted');
    
    // Play sound
    playSound('ding');

    setTimeout(() => {
      resolve();
    }, 500);
  });
}

/**
 * Shows voters for an answer with fly-in animation.
 * @param {HTMLElement} container - Container element for voters
 * @param {Array} voters - Array of voter objects {id, name}
 * @returns {Promise} Promise that resolves when all voters appear
 */
export function showVoters(container, voters) {
  return new Promise((resolve) => {
    if (!container) {
      resolve();
      return;
    }

    container.innerHTML = '';
    
    if (voters.length === 0) {
      const noVotesMsg = document.createElement('div');
      noVotesMsg.className = 'no-votes-message';
      noVotesMsg.textContent = 'Nobody fell for it!';
      container.appendChild(noVotesMsg);
      resolve();
      return;
    }

    const label = document.createElement('div');
    label.className = 'voters-label';
    label.textContent = 'Who voted for this?';
    container.appendChild(label);

    const votersList = document.createElement('div');
    votersList.className = 'voters-list';
    container.appendChild(votersList);

    let appeared = 0;
    voters.forEach((voter, index) => {
      setTimeout(() => {
        const voterElement = document.createElement('div');
        voterElement.className = 'voter-avatar';
        voterElement.textContent = voter.name;
        voterElement.dataset.playerId = voter.id;
        votersList.appendChild(voterElement);
        
        appeared++;
        if (appeared === voters.length) {
          resolve();
        }
      }, index * 200);
    });
  });
}

/**
 * Reveals the author with burst effect.
 * @param {HTMLElement} container - Container element
 * @param {string} authorName - Author's name
 * @param {number} pointsEarned - Points earned
 * @returns {Promise} Promise that resolves when animation completes
 */
export function revealAuthor(container, authorName, pointsEarned) {
  return new Promise((resolve) => {
    if (!container) {
      resolve();
      return;
    }

    container.innerHTML = '';
    
    const authorReveal = document.createElement('div');
    authorReveal.className = 'author-reveal';
    
    const label = document.createElement('div');
    label.className = 'author-label';
    label.textContent = 'FOOLED BY';
    
    const name = document.createElement('div');
    name.className = 'author-name';
    name.textContent = authorName;
    
    authorReveal.appendChild(label);
    authorReveal.appendChild(name);
    container.appendChild(authorReveal);

    // Add confetti
    showConfetti(container);

    // Play sound
    playSound('reveal');

    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

/**
 * Animates score update with counting effect.
 * @param {HTMLElement} container - Container element
 * @param {number} points - Points to display
 * @param {number} startScore - Starting score
 * @param {number} endScore - Ending score
 * @returns {Promise} Promise that resolves when animation completes
 */
export function animateScore(container, points, startScore, endScore) {
  return new Promise((resolve) => {
    if (!container || points === 0) {
      resolve();
      return;
    }

    container.innerHTML = '';

    // Points earned display
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'points-earned';
    pointsDisplay.textContent = `+${points.toLocaleString()}`;
    container.appendChild(pointsDisplay);

    // Animate points flying up
    setTimeout(() => {
      pointsDisplay.classList.add('points-fly-up');
    }, 100);

    // Count up total score
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'total-score-display';
    container.appendChild(scoreDisplay);

    countUpScore(scoreDisplay, startScore, endScore, 1000).then(() => {
      resolve();
    });
  });
}

/**
 * Zooms in the correct answer with special styling.
 * @param {HTMLElement} answerElement - Answer element
 * @returns {Promise} Promise that resolves when animation completes
 */
export function correctAnswerZoom(answerElement) {
  return new Promise((resolve) => {
    if (!answerElement) {
      resolve();
      return;
    }

    answerElement.classList.add('correct-answer-zoom');
    
    // Play sound
    playSound('fanfare');

    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

/**
 * Shows confetti particles around an element.
 * @param {HTMLElement} element - Element to show confetti around
 */
export function showConfetti(element) {
  if (!element) return;

  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  element.appendChild(confettiContainer);

  // Create confetti particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 0.5}s`;
    confettiContainer.appendChild(particle);
  }

  // Remove after animation
  setTimeout(() => {
    confettiContainer.remove();
  }, 3000);
}

/**
 * Counts up a score value with animation.
 * @param {HTMLElement} element - Element to display score in
 * @param {number} startVal - Starting value
 * @param {number} endVal - Ending value
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves when counting completes
 */
export function countUpScore(element, startVal, endVal, duration) {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const range = endVal - startVal;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + range * eased);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = endVal.toLocaleString();
        resolve();
      }
    };

    update();
  });
}

/**
 * Shakes an element (for fooled players).
 * @param {HTMLElement} element - Element to shake
 */
export function shakeElement(element) {
  if (!element) return;
  
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 400);
}

/**
 * Plays a sound effect (placeholder - implement with actual sounds).
 * @param {string} soundName - Name of sound to play
 */
function playSound(soundName) {
  // Placeholder for sound effects
  // In production, load and play actual sound files
  // const audio = new Audio(`/sounds/${soundName}.mp3`);
  // audio.play().catch(() => {}); // Ignore errors
}
