# Economics Fibbage - Complete File Structure

## Project Overview

This document provides a complete map of the refactored Economics Fibbage codebase.

---

## Root Directory

```
economics-fibbage/
├── README.md                           # Project documentation
├── REFACTORING_SUMMARY.md             # Refactoring summary and quick reference
├── FILE_STRUCTURE.md                  # This file - complete structure guide
├── package.json                       # Node.js dependencies
├── backup-original-files/             # Backup of original monolithic files
│   ├── host.js (305 lines)           # Original host script
│   ├── player.js (379 lines)         # Original player script
│   └── questions.js (59 lines)       # Original questions file
├── server/                           # Server-side code
└── public/                           # Client-side code
```

---

## Server Directory (`/server/`)

### Main Files

```
server/
├── server.js (65 lines)              # Main server entry point
├── config.js (39 lines)              # Configuration constants
└── gameManager.js (274 lines)        # Game room manager (delegates to GameRoom)
```

**server.js** - Initializes Express, Socket.io, routes, and socket handlers. Clean ~65 lines.

**config.js** - All magic numbers in one place:
- Server configuration (PORT, CORS)
- Game settings (MIN_PLAYERS, QUESTIONS_PER_GAME)
- Phase durations (SUBMIT_PHASE_DURATION, VOTING_PHASE_DURATION)
- Scoring (CORRECT_VOTE_POINTS, FOOL_PLAYER_POINTS)
- Transition delays and intervals

**gameManager.js** - Simplified manager that:
- Creates and manages multiple game rooms
- Maps sockets to rooms/players
- Delegates game logic to GameRoom instances
- Handles cleanup

---

### Routes (`/server/routes/`)

```
routes/
└── index.js (17 lines)               # Express route setup
```

**index.js** - Sets up:
- Static file serving
- Root route (redirects to host.html)

---

### Socket Events (`/server/socket/`)

```
socket/
├── socketHandler.js (23 lines)       # Main socket setup - delegates to event modules
├── timerBroadcast.js (103 lines)    # Timer broadcast logic for all rooms
└── events/
    ├── connectionEvents.js (31 lines)    # connect, disconnect
    ├── roomEvents.js (54 lines)          # createRoom, joinRoom
    ├── gameEvents.js (93 lines)          # startGame, nextQuestion
    └── playerEvents.js (90 lines)        # submitAnswer, submitVote
```

**socketHandler.js** - Coordinates all socket event handlers

**timerBroadcast.js** - Manages timer broadcasts with auto-phase transitions

**events/connectionEvents.js** - Handles:
- Client connections (logging)
- Client disconnects (cleanup, host transfer)

**events/roomEvents.js** - Handles:
- `createRoom` - Creates new game room
- `joinRoom` - Adds player to room

**events/gameEvents.js** - Handles:
- `startGame` - Starts game, loads first question
- `nextQuestion` - Advances to next question or ends game

**events/playerEvents.js** - Handles:
- `submitAnswer` - Records player answer
- `submitVote` - Records player vote

---

### Game Logic (`/server/game/`)

```
game/
├── GameRoom.js (248 lines)           # Single room coordinator
├── Player.js (61 lines)              # Player data model
├── GameState.js (139 lines)          # Game state management
├── Timer.js (42 lines)               # Phase timer logic
├── ScoreCalculator.js (65 lines)     # Scoring calculations
└── AnswerManager.js (50 lines)       # Answer shuffling/validation
```

**GameRoom.js** - Orchestrates a single game room:
- `addPlayer(name, socketId)` - Adds player
- `startGame(hostSocketId)` - Starts game
- `loadQuestion(index)` - Loads question
- `submitAnswer(playerId, answer)` - Handles answer submission
- `submitVote(playerId, votedForId)` - Handles vote
- `calculateResults()` - Calculates round results
- `nextQuestion(hostSocketId)` - Advances to next question
- `handleDisconnect(playerId)` - Handles player disconnect
- `transferHostIfNeeded(socketId)` - Transfers host if needed

**Player.js** - Player model:
- `static generateId()` - Generates unique ID
- `addScore(points)` - Adds points
- `disconnect()` - Marks disconnected
- `reconnect(socketId)` - Reconnects player
- `toClientData()` - Returns safe data for client

**GameState.js** - Game state model:
- `setPhase(phase)` - Sets current phase
- `setQuestion(question, index)` - Sets current question
- `addPlayer(player)` - Adds player
- `getPlayer(id)` - Gets player by ID
- `hasPlayerName(name)` - Checks if name exists
- `submitAnswer(playerId, answer)` - Records answer
- `submitVote(playerId, votedForId)` - Records vote
- `isSubmitPhaseComplete()` - Checks if all answered
- `isVotingPhaseComplete()` - Checks if all voted
- `startTimer(duration)` - Starts phase timer
- `getTimeRemaining()` - Gets remaining time
- `transferHost(newHostId)` - Transfers host
- `getConnectedPlayers()` - Gets connected players

**Timer.js** - Timer functionality:
- `start(duration)` - Starts timer
- `getTimeRemaining()` - Gets remaining seconds
- `isExpired()` - Checks if expired

**ScoreCalculator.js** - Scoring logic:
- `calculateResults(gameState)` - Calculates round scores
  - Awards points for voting correctly
  - Awards points for fooling others

**AnswerManager.js** - Answer utilities:
- `getShuffledAnswers(gameState)` - Shuffles answers with correct answer
- `isAnswerValid(answer, correctAnswer)` - Validates answer isn't correct

---

### Utilities (`/server/utils/`)

```
utils/
├── logger.js (80 lines)              # Logging functions
├── validation.js (43 lines)          # Input validation
└── roomCodeGenerator.js (23 lines)   # Room code generation
```

**logger.js** - Consistent logging:
- `logRoomCreated(roomCode, hostId)`
- `logPlayerJoined(playerName, roomCode)`
- `logGameStarted(roomCode)`
- `logPhaseTransition(roomCode, phase)`
- `logAnswerSubmitted(playerName, roomCode)`
- `logVoteSubmitted(voter, votedFor, roomCode)`
- `logResults(roomCode)`
- `logHostTransfer(newHost, roomCode)`
- `logRoomCleanup(roomCode)`
- `logConnection(socketId)`
- `logDisconnection(socketId)`
- `logError(context, error)`
- `logQuestionsSelected(questionIds)`

**validation.js** - Input sanitization:
- `sanitizePlayerName(name)` - Sanitizes player name
- `sanitizeAnswer(answer)` - Sanitizes answer text
- `isValidRoomCode(code)` - Validates room code format

**roomCodeGenerator.js** - Room code generation:
- `generateRoomCode(existingRooms)` - Generates unique 4-char code

---

### Data (`/server/data/`)

```
data/
└── questions.js (59 lines)           # Economics questions database
```

**questions.js** - Array of question objects with:
- `id` - Unique identifier
- `question` - Question text
- `answer` - Correct answer (numeric/text)
- `explanation` - Why this is the answer
- `category` - Economics category

---

## Public Directory (`/public/`)

### HTML Files

```
public/
├── host.html (79 lines)              # Host screen HTML
├── player.html (98 lines)            # Player screen HTML
├── css/
│   ├── host.css                     # Host screen styles
│   └── player.css                   # Player screen styles
└── js/                              # JavaScript modules
```

---

### Host JavaScript (`/public/js/host/`)

```
js/host/
├── hostMain.js (52 lines)            # Host initialization and state
├── socketHandlers.js (87 lines)      # All host socket listeners
├── screens/                         # Screen-specific logic
│   ├── lobbyScreen.js (22 lines)    # Lobby UI
│   ├── submitScreen.js (58 lines)   # Submit phase UI
│   ├── votingScreen.js (37 lines)   # Voting phase UI
│   ├── resultsScreen.js (58 lines)  # Results phase UI
│   └── gameOverScreen.js (53 lines) # Game over UI
└── ui/                             # UI utilities
    ├── uiUpdater.js (93 lines)      # DOM manipulation
    └── timer.js (15 lines)          # Timer display
```

**hostMain.js** - Host initialization:
- Initializes socket connection
- Sets up button handlers
- Creates room on load
- Manages host state

**socketHandlers.js** - Socket event listeners:
- `roomCreated` - Displays room code
- `playerJoined` - Updates player list
- `gameStarted` - Transitions to game screen
- `newQuestion` - Shows new question
- `phaseChange` - Changes phase
- `timerUpdate` - Updates timer
- `answerSubmitted` - Updates submission count
- `allAnswersSubmitted` - Shows transition
- `votingReady` - Shows answers for voting
- `voteSubmitted` - Updates vote count
- `resultsReady` - Shows results
- `gameOver` - Shows final scores
- `error` - Shows error message

**screens/lobbyScreen.js** - Lobby display:
- `showLobby()` - Shows lobby screen
- `updatePlayersList(players)` - Updates player grid
- `updateStartButton(playerCount)` - Enables/disables start

**screens/submitScreen.js** - Submit phase:
- `showSubmitScreen()` - Shows submit phase
- `updateSubmitStatus(count, total)` - Updates status
- `showSubmitCheckmarks(players, submitted)` - Shows checkmarks

**screens/votingScreen.js** - Voting phase:
- `showVotingScreen()` - Shows voting phase
- `displayAnswers(answers)` - Displays answer options

**screens/resultsScreen.js** - Results:
- `showResultsScreen()` - Shows results
- `displayResults(results)` - Shows correct answer, explanation
- `displayFooledBreakdown(results)` - Shows who fooled whom
- `displayLeaderboard(scores)` - Shows leaderboard

**screens/gameOverScreen.js** - Game over:
- `showGameOverScreen()` - Shows game over
- `displayWinner(winner)` - Shows winner celebration
- `displayFinalLeaderboard(scores)` - Shows final standings

**ui/uiUpdater.js** - DOM utilities:
- `showScreen(screenId)` - Shows specific screen
- `hideAllScreens()` - Hides all screens
- `updateElement(id, content)` - Updates element
- `createElement(tag, className, content)` - Creates element

**ui/timer.js** - Timer display:
- `updateTimer(seconds)` - Updates timer display
- `addWarningClass(threshold)` - Adds warning class at threshold

---

### Player JavaScript (`/public/js/player/`)

```
js/player/
├── playerMain.js (37 lines)          # Player initialization and state
├── socketHandlers.js (99 lines)      # All player socket listeners
├── screens/                         # Screen-specific logic
│   ├── joinScreen.js (70 lines)     # Join screen logic
│   ├── lobbyScreen.js (22 lines)    # Lobby UI
│   ├── submitScreen.js (97 lines)   # Submit answer UI
│   ├── votingScreen.js (76 lines)   # Voting UI
│   ├── resultsScreen.js (48 lines)  # Results UI
│   └── gameOverScreen.js (71 lines) # Game over UI
└── ui/                             # UI utilities
    ├── uiUpdater.js (82 lines)      # DOM manipulation
    └── timer.js (16 lines)          # Timer display
```

**playerMain.js** - Player initialization:
- Initializes socket connection
- Sets up screen handlers
- Manages player state (roomCode, name, id, phase)

**socketHandlers.js** - Socket event listeners:
- `playerJoined` - Shows lobby
- `gameState` - Handles reconnection
- `gameStarted` - Game start notification
- `newQuestion` - Shows new question
- `phaseChange` - Changes phase
- `timerUpdate` - Updates timer
- `allAnswersSubmitted` - Shows waiting message
- `votingReady` - Shows voting options
- `resultsReady` - Shows results
- `gameOver` - Shows final scores
- `error` - Shows error message

**screens/joinScreen.js** - Join screen:
- Input validation (room code, player name)
- Character limits
- Enter key handling
- `setupJoinScreen(onJoin)` - Sets up join functionality

**screens/lobbyScreen.js** - Lobby:
- `showLobbyScreen()` - Shows lobby
- `updateLobbyPlayers(players)` - Updates player list

**screens/submitScreen.js** - Submit answer:
- Answer input with character counter
- Submit button management
- `setupSubmitScreen(onSubmit)` - Sets up submit functionality
- `showSubmitWaiting()` - Shows waiting state

**screens/votingScreen.js** - Voting:
- `showVotingScreen(answers)` - Shows voting UI
- Creates clickable answer buttons
- Handles vote submission
- Shows waiting state after voting

**screens/resultsScreen.js** - Results:
- `showResultsScreen(results)` - Shows results
- Displays correct answer and explanation
- Shows player's score
- Shows mini leaderboard

**screens/gameOverScreen.js** - Game over:
- `showGameOverScreen(finalScores)` - Shows game over
- Displays final leaderboard with rankings
- Shows player's placement
- Medal icons for top 3

**ui/uiUpdater.js** - DOM utilities:
- `showScreen(screenId)` - Shows specific screen
- `hideScreen(screenId)` - Hides specific screen
- `updateElement(id, content)` - Updates element
- `showError(message)` - Shows error toast

**ui/timer.js** - Timer display:
- `updateTimer(seconds)` - Updates timer display
- Adds warning class when time is low

---

## File Count Summary

### Server-Side Files (19 files)
- **Main**: 3 files (server.js, config.js, gameManager.js)
- **Routes**: 1 file (index.js)
- **Socket**: 5 files (socketHandler.js, timerBroadcast.js, 4 event handlers)
- **Game**: 6 files (GameRoom, Player, GameState, Timer, ScoreCalculator, AnswerManager)
- **Utils**: 3 files (logger, validation, roomCodeGenerator)
- **Data**: 1 file (questions.js)

### Client-Side Files (20 files)
- **Host**: 10 files
  - Main: 2 files (hostMain.js, socketHandlers.js)
  - Screens: 5 files
  - UI: 2 files
- **Player**: 10 files
  - Main: 2 files (playerMain.js, socketHandlers.js)
  - Screens: 6 files
  - UI: 2 files

### HTML/CSS Files (4 files)
- **HTML**: 2 files (host.html, player.html)
- **CSS**: 2 files (host.css, player.css)

### Documentation (3 files)
- README.md
- REFACTORING_SUMMARY.md
- FILE_STRUCTURE.md (this file)

**Total: 46 files** (vs. 5 monolithic files originally)

---

## Module Loading Order

### Host Screen

HTML loads scripts in this order:
1. UI utilities (uiUpdater.js, timer.js)
2. Screen modules (lobbyScreen, submitScreen, votingScreen, resultsScreen, gameOverScreen)
3. Socket handlers (socketHandlers.js)
4. Main initialization (hostMain.js)

### Player Screen

HTML loads scripts in this order:
1. UI utilities (uiUpdater.js, timer.js)
2. Screen modules (joinScreen, lobbyScreen, submitScreen, votingScreen, resultsScreen, gameOverScreen)
3. Socket handlers (socketHandlers.js)
4. Main initialization (playerMain.js)

---

## Quick Navigation Guide

| **Need to modify...** | **File location** |
|----------------------|-------------------|
| Server configuration | [server/config.js](server/config.js) |
| Room creation | [server/socket/events/roomEvents.js](server/socket/events/roomEvents.js) |
| Game start logic | [server/socket/events/gameEvents.js](server/socket/events/gameEvents.js) |
| Answer submission | [server/socket/events/playerEvents.js](server/socket/events/playerEvents.js) |
| Scoring logic | [server/game/ScoreCalculator.js](server/game/ScoreCalculator.js) |
| Timer logic | [server/game/Timer.js](server/game/Timer.js) or [server/socket/timerBroadcast.js](server/socket/timerBroadcast.js) |
| Host lobby UI | [public/js/host/screens/lobbyScreen.js](public/js/host/screens/lobbyScreen.js) |
| Host voting UI | [public/js/host/screens/votingScreen.js](public/js/host/screens/votingScreen.js) |
| Player join UI | [public/js/player/screens/joinScreen.js](public/js/player/screens/joinScreen.js) |
| Player voting UI | [public/js/player/screens/votingScreen.js](public/js/player/screens/votingScreen.js) |
| Questions database | [server/data/questions.js](server/data/questions.js) |

---

## Dependencies Between Modules

### Server-Side Dependencies

```
server.js
├── requires: config.js
├── requires: gameManager.js
├── requires: routes/index.js
└── requires: socket/socketHandler.js

gameManager.js
├── requires: config.js
├── requires: game/GameRoom.js
├── requires: data/questions.js
├── requires: utils/roomCodeGenerator.js
└── requires: utils/logger.js

game/GameRoom.js
├── requires: game/GameState.js
├── requires: game/Player.js
├── requires: game/AnswerManager.js
├── requires: game/ScoreCalculator.js
├── requires: utils/validation.js
├── requires: utils/logger.js
└── requires: config.js

socket/socketHandler.js
├── requires: socket/events/connectionEvents.js
├── requires: socket/events/roomEvents.js
├── requires: socket/events/gameEvents.js
└── requires: socket/events/playerEvents.js
```

### Client-Side Dependencies

```
hostMain.js
├── uses: socketHandlers.js (functions)
├── uses: screens/*.js (functions)
└── uses: ui/*.js (functions)

playerMain.js
├── uses: socketHandlers.js (functions)
├── uses: screens/*.js (functions)
└── uses: ui/*.js (functions)
```

---

## Benefits of This Structure

### 1. Easy Debugging
- Bug in voting? Check `playerEvents.js` and `votingScreen.js`
- Timer issue? Check `Timer.js` and `timerBroadcast.js`
- Scoring problem? Check `ScoreCalculator.js`

### 2. Easy Feature Addition
- New game mode? Add to `game/` directory
- New screen? Add to `screens/` directory
- New validation? Add to `utils/validation.js`

### 3. Easy Testing
- Each module can be tested independently
- Clear inputs and outputs
- Minimal coupling

### 4. Easy Collaboration
- Multiple developers can work simultaneously
- Clear ownership of modules
- Minimal merge conflicts

### 5. Easy Maintenance
- Small files are easier to understand
- Changes have limited blast radius
- Refactoring is safer

---

## Change Log

### 2026-01-09 - Complete Refactoring
- Broke down 5 monolithic files (1,549 lines) into 46 modular files
- Organized code into logical directories
- Added comprehensive documentation
- No functionality changes - game works exactly the same
