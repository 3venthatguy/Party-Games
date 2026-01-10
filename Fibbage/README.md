# Economics Fibbage

A multiplayer Fibbage-style economics trivia game built with Node.js, Express, and Socket.io. Players compete by submitting fake answers to economics questions and trying to fool others into voting for their answers.

## Features

- **Real-time multiplayer gameplay** using WebSocket communication
- **8 economics trivia questions** with fascinating facts about economic history
- **Dynamic scoring system**: 
  - +1000 points for voting for the correct answer
  - +500 points for each player who votes for your fake answer
- **Beautiful Jackbox-style UI** with vibrant gradients and smooth animations
- **Mobile-optimized player interface** for phone controllers
- **Large display host interface** for TV/projector viewing
- **Automatic timer management** with server-side synchronization
- **Room-based gameplay** with unique 4-letter room codes

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd economics-fibbage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or:
   ```bash
   node server/server.js
   ```

4. **Access the game:**
   - **Host screen** (for main display): http://localhost:3000/host.html
   - **Player screen** (for mobile devices): http://localhost:3000/player.html

   For players on the same network, replace `localhost` with your computer's IP address (e.g., `http://192.168.1.100:3000/player.html`)

## How to Play

### For the Host

1. Open the host screen on a large display (TV, projector, or computer monitor)
2. A 4-letter room code will be automatically generated (e.g., "ABCD")
3. Share this room code with players
4. Wait for at least 2 players to join
5. Click "Start Game" when ready
6. For each question:
   - **Submit Phase**: Watch as players submit their fake answers
   - **Voting Phase**: See which answers players vote for
   - **Results Phase**: Reveal the correct answer and see scores
   - Click "Next Question" to continue
7. After all 8 questions, view the final leaderboard

### For Players

1. Open the player screen on your mobile device
2. Enter the 4-letter room code provided by the host
3. Enter your name (max 20 characters)
4. Click "Join Game"
5. Wait in the lobby until the host starts the game
6. For each question:
   - **Submit Phase (30 seconds)**: Type a convincing fake answer
   - **Voting Phase (20 seconds)**: Tap the answer you think is correct (you can't vote for your own)
   - **Results Phase**: See the correct answer, your points, and the leaderboard
7. After all questions, see your final rank!

## Game Mechanics

### Scoring System

- **Correct Answer Vote**: +1000 points for voting for the actual correct answer
- **Fooling Others**: +500 points for each player who votes for your fake answer
- Players cannot vote for their own answer

### Question Format

Each question has a blank (represented by "_____") that players must fill in. The correct answer is mixed in with all the fake answers during the voting phase.

### Timer System

- **Submit Phase**: 30 seconds to submit a fake answer
- **Voting Phase**: 20 seconds to vote for what you think is the correct answer
- Timers are synchronized across all devices via the server
- If all players complete a phase early, the game automatically advances

## Project Structure

```
economics-fibbage/
├── server/
│   ├── server.js          # Main Express + Socket.io server
│   ├── gameManager.js     # Game state management and logic
│   └── questions.js       # Question database
├── public/
│   ├── host.html          # Host display screen
│   ├── player.html        # Player mobile controller
│   ├── css/
│   │   ├── host.css       # Host screen styles
│   │   └── player.css     # Player screen styles
│   └── js/
│       ├── host.js        # Host screen logic
│       └── player.js      # Player screen logic
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Adding More Questions

To add more questions, edit `server/questions.js` and add new question objects to the array:

```javascript
{
  question: "Your question text with _____ blank.",
  answer: "The correct answer",
  explanation: "An explanation of why this answer is correct."
}
```

The game will automatically use all questions in the array. Currently, the game is set up for 8 questions, but you can add as many as you like.

## Technical Details

### Technology Stack

- **Backend**: Node.js + Express
- **Real-time Communication**: Socket.io (WebSocket)
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Styling**: Modern CSS with gradients and animations

### Server Features

- Room-based game management
- Automatic timer synchronization
- Score calculation and validation
- Player reconnection handling
- Host transfer on disconnect
- Empty room cleanup

### Security Features

- Server-side answer shuffling
- Server-side score calculation
- Input validation and sanitization
- Vote validation (can't vote for own answer)
- Duplicate vote prevention

## Troubleshooting

### Players can't connect

- Make sure all devices are on the same network
- Check that the server is running
- Verify the room code is entered correctly (case-insensitive)
- Check firewall settings if connecting from different networks

### Timer not syncing

- The server manages all timers - refresh the page if timers seem off
- Check browser console for any errors

### Game not advancing

- Make sure the host clicks "Next Question" after results
- Check that all players have submitted/voted
- Refresh the page if the game seems stuck

## Development

### Running in Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Console Logging

The server logs important events to the console:
- Room creation
- Player joins/leaves
- Answer submissions
- Votes cast
- Score calculations

Check the server console for debugging information.

## License

ISC

## Credits

Game concept inspired by Jackbox Games' Fibbage series.
