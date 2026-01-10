# Host HTML File Structure and Contents

## File Location
`/Users/evansmacbookair/Documents/UES-Games/economics-fibbage/public/host.html`

## Overall Structure

### HTML Document Structure
- **DOCTYPE**: HTML5 (`<!DOCTYPE html>`)
- **Language**: English (`lang="en"`)
- **Title**: "Economics Fibbage - Host"
- **CSS**: Links to `css/host.css`
- **Socket.IO**: Loads from `/socket.io/socket.io.js`

## Main Container Structure

### Root Container
- **Element**: `<div class="container">`
- Contains all screen components and error messaging

## Screen Components

### 1. Lobby Screen
- **ID**: `lobbyScreen`
- **Class**: `lobby-screen active`
- **Purpose**: Initial screen for room setup and player waiting

**Child Elements**:
- `<h1>`: "Economics Fibbage" (48px font, 20px bottom margin)
- `<div id="roomCodeDisplay" class="room-code-display">`: Displays room code (default: "----")
- `<div id="playerCount" class="player-count">`: Shows player count (default: "Waiting for players...")
- `<div id="playersGrid" class="players-grid">`: Grid container for player list
- `<button id="startButton" class="start-button" disabled>`: Start game button (initially disabled)

### 2. Game Screen
- **ID**: `gameScreen`
- **Class**: `game-screen`
- **Purpose**: Main game interface during gameplay

**Child Elements**:
- `<div id="questionNumber" class="question-number">`: Displays current question (e.g., "Question 1 of 8")
- `<div id="timerDisplay" class="timer-display">`: Timer countdown display (default: "30")
- `<div id="questionDisplay" class="question-display">`: Displays the current question text

**Game Screen Sub-Phases**:

#### Submit Phase
- **ID**: `submitPhase`
- **Class**: `submit-phase`
- **Display**: Initially hidden (`style="display: none;"`)
- **Child Elements**:
  - `<div id="submitStatus" class="submit-status">`: Status text (default: "Players are submitting answers...")
  - `<div id="submitCheckmarks" class="submit-checkmarks">`: Visual indicators for player submissions

#### Voting Phase
- **ID**: `votingPhase`
- **Class**: `voting-phase`
- **Display**: Initially hidden (`style="display: none;"`)
- **Child Elements**:
  - `<h2>`: "Vote for the correct answer!" (36px font, 30px bottom margin)
  - `<div id="answersGrid" class="answers-grid">`: Grid container for answer options

#### Results Phase
- **ID**: `resultsPhase`
- **Class**: `results-phase`
- **Display**: Initially hidden (`style="display: none;"`)
- **Child Elements**:
  - `<div id="correctAnswerReveal" class="correct-answer-reveal">`: Reveals the correct answer
  - `<div id="explanation" class="explanation">`: Displays explanation for the answer
  - `<div id="fooledBreakdown" class="fooled-breakdown">`: Shows voting statistics
  - `<div id="leaderboard" class="leaderboard">`: Current scores/leaderboard
  - `<button id="nextButton" class="next-button">`: "Next Question" button

### 3. Game Over Screen
- **ID**: `gameOverScreen`
- **Class**: `game-over-screen`
- **Purpose**: Final screen showing game results

**Child Elements**:
- `<h1>`: "Game Over!" (64px font, 20px bottom margin)
- `<div id="winnerCelebration" class="winner-celebration">`: Winner announcement/celebration
- `<div id="finalLeaderboard" class="final-leaderboard">`: Final scores/leaderboard
- `<button id="playAgainButton" class="play-again-button">`: "Play Again" button

### 4. Error Message
- **ID**: `errorMessage`
- **Class**: `error-message`
- **Purpose**: Displays error notifications

## JavaScript Dependencies (Load Order)

### UI Utilities (Loaded First)
1. `js/host/ui/uiUpdater.js` - UI update utilities
2. `js/host/ui/timer.js` - Timer functionality

### Screen Modules (Loaded Second)
3. `js/host/screens/lobbyScreen.js` - Lobby screen logic
4. `js/host/screens/submitScreen.js` - Submit phase logic
5. `js/host/screens/votingScreen.js` - Voting phase logic
6. `js/host/screens/resultsScreen.js` - Results phase logic
7. `js/host/screens/gameOverScreen.js` - Game over screen logic

### Socket Handlers (Loaded Third)
8. `js/host/socketHandlers.js` - Socket.IO event handlers

### Main Initialization (Loaded Last)
9. `js/host/hostMain.js` - Main initialization and orchestration

## Element ID Reference

### Lobby Screen
- `lobbyScreen` - Main lobby container
- `roomCodeDisplay` - Room code display
- `playerCount` - Player count display
- `playersGrid` - Players list container
- `startButton` - Start game button

### Game Screen
- `gameScreen` - Main game container
- `questionNumber` - Question number display
- `timerDisplay` - Timer display
- `questionDisplay` - Question text display

### Submit Phase
- `submitPhase` - Submit phase container
- `submitStatus` - Submission status text
- `submitCheckmarks` - Submission indicators

### Voting Phase
- `votingPhase` - Voting phase container
- `answersGrid` - Answer options grid

### Results Phase
- `resultsPhase` - Results phase container
- `correctAnswerReveal` - Correct answer display
- `explanation` - Answer explanation
- `fooledBreakdown` - Voting statistics
- `leaderboard` - Current leaderboard
- `nextButton` - Next question button

### Game Over Screen
- `gameOverScreen` - Game over container
- `winnerCelebration` - Winner display
- `finalLeaderboard` - Final leaderboard
- `playAgainButton` - Play again button

### Error Handling
- `errorMessage` - Error message container

## CSS Classes Reference

### Screen Classes
- `container` - Main container
- `lobby-screen` - Lobby screen styling
- `game-screen` - Game screen styling
- `game-over-screen` - Game over screen styling

### Phase Classes
- `submit-phase` - Submit phase styling
- `voting-phase` - Voting phase styling
- `results-phase` - Results phase styling

### Component Classes
- `room-code-display` - Room code display
- `player-count` - Player count display
- `players-grid` - Players grid layout
- `start-button` - Start button styling
- `question-number` - Question number display
- `timer-display` - Timer display
- `question-display` - Question text display
- `submit-status` - Submit status text
- `submit-checkmarks` - Submission checkmarks
- `answers-grid` - Answers grid layout
- `correct-answer-reveal` - Correct answer display
- `explanation` - Explanation text
- `fooled-breakdown` - Voting breakdown
- `leaderboard` - Leaderboard display
- `next-button` - Next button styling
- `winner-celebration` - Winner celebration display
- `final-leaderboard` - Final leaderboard display
- `play-again-button` - Play again button styling
- `error-message` - Error message styling

## State Management Notes

- Only one screen is active at a time (controlled by `active` class and `display: none` styles)
- The lobby screen starts with `active` class
- Game screen phases are controlled via `display: none` style attribute
- Start button is initially disabled (`disabled` attribute)

## External Dependencies

1. **Socket.IO Client**: Loaded from `/socket.io/socket.io.js`
2. **CSS Stylesheet**: `css/host.css`
3. **JavaScript Modules**: 9 separate JS files in specific load order
