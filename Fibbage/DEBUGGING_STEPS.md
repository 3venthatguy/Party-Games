# Debugging Steps for Player Score Display Issue

## Issue
The round score and total score for each individual player is showing 0 on the player screen.

## Changes Made
1. Added `roundScore` display element to player.html
2. Updated `displayPlayerResults()` to extract and display `roundScores` from data
3. Added extensive console logging on both client and server

## Testing Steps

### 1. Start the server
```bash
cd /Users/evansmacbookair/Documents/UES-Games/economics-fibbage/server
node server.js
```

### 2. Open the game
- Host: Open browser to `http://localhost:3000/host.html`
- Player: Open browser to `http://localhost:3000/player.html` (in a different browser/incognito window)

### 3. Play through one round
1. Create a game room
2. Join as a player
3. Start the game
4. Submit an answer
5. Vote for an answer
6. **Check the console logs**

### 4. What to look for in Browser Console (Player screen)

Open Developer Tools (F12) on the player screen and look for these console logs:

```
displayPlayerResults called with data: {...}
playerId: player_xxxxx
roundScore element: <div>...</div>
totalScore element: <div>...</div>
totalScores: [...]
ourTotalScore: {...}
ourRoundScore: 1000
Set roundScore to: +1,000
Set totalScore to: Total: 1,000 points
```

### 5. What to look for in Server Console

Look for:
```
Sending resultsReady with data: {
  "correctAnswer": "...",
  "explanation": "...",
  "roundScores": {
    "player_xxx": 1000,
    "player_yyy": 500
  },
  "totalScores": [
    { "id": "player_xxx", "name": "...", "score": 1000, "connected": true },
    ...
  ],
  ...
}
```

## Possible Issues

### Issue 1: playerId doesn't match
If the console shows `ERROR: Could not find player in totalScores!`, then the playerId doesn't match any player in the totalScores array.

**Check:**
- What is the value of `playerId` in the console?
- What are the `id` values in the `totalScores` array?

### Issue 2: Data not being sent
If you don't see the server console log "Sending resultsReady with data:", then the results are not being calculated or sent.

**Check:**
- Did all players vote?
- Did the timer expire?
- Are there any errors in the server console?

### Issue 3: Elements not found
If the console shows `roundScore element: null` or `totalScore element: null`, then the HTML elements don't exist.

**Check:**
- Refresh the browser
- View page source and search for `id="roundScore"` and `id="totalScore"`

### Issue 4: resultsPhase not visible
If the elements exist but you can't see them on screen, the resultsPhase div might not be visible.

**Check in console:**
```javascript
document.getElementById('resultsPhase').style.display
// Should be 'block', not 'none'
```

## Next Steps

Based on what you find in the console logs, report back:
1. What does the server log show for `resultsReady` data?
2. What does the client log show for `displayPlayerResults`?
3. What is the value of `ourTotalScore`?
4. What is the value of `ourRoundScore`?
5. Can you see the score elements on the page? (inspect with browser dev tools)
