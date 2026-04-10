
//* Number Guessing Game 


## 1. Global State Variables

```javascript
let secret = 0;          // The hidden number to guess
let maxNum = 100;        // Upper bound (changes with difficulty)
let attempts = 0;        // Number of guesses made
let low = 1, high = 100; // Current possible range after hints
let gameActive = false;  // Whether a game is in progress
let timerInterval = null;// Holds the setInterval ID for the timer
let timerSeconds = 0;    // Elapsed seconds
let bestScores = {};     // Stores best attempts per difficulty (keyed by maxNum)
```

---

## 2. Helper Function

```javascript
function rand(max) {
  return Math.floor(Math.random() * max) + 1;
}
```
Generates a random integer between 1 and `max` (inclusive).

---

## 3. `startGame()` – Initializes / Resets the Game

- Picks a new `secret` number using `rand(maxNum)`.
- Resets attempts, range bounds (`low`, `high`), and timer.
- Enables the input field and buttons.
- Updates UI elements: attempts counter, timer display, hint box, clears history.
- Calls `updateRange()` and `updateRangeHighLabel()` to reset visual range bar.
- Clears any existing timer and starts a new one that increments `timerSeconds` every second and formats it as `M:SS`.

---

## 4. `updateRangeHighLabel()` – Updates Labels for the Range Slider

- Sets the displayed upper bound on the visual range bar (if elements exist).
- Resets the low and mid labels.

---

## 5. `setDifficulty(btn)` – Changes Difficulty Level

- Removes `active` class from all difficulty buttons, then adds it to the clicked one.
- Reads `data-max` attribute from the button to set `maxNum` (e.g., 50, 100, 200).
- Calls `newGame()` (which is just an alias for `startGame()`) to restart with new bounds.

---

## 6. `checkGuess()` – Core Game Logic

Triggered when the user submits a guess (by clicking Submit or pressing Enter).

1. **Validation:**
   - Checks if game is active.
   - Ensures input is not empty, is a number, and within `1 … maxNum`.
   - If invalid, shows a warning in the hint box.

2. **Process Valid Guess:**
   - Increments `attempts` and updates the counter.
   - Adds the guess to the history list via `addHistory()`.
   - Clears the input field and keeps focus.

3. **Win Condition (`guess === secret`):**
   - Stops the timer.
   - Disables further input and buttons.
   - Updates hint box with success message and styling.
   - Calls `updateBest()` to possibly store a new high score.
   - Calls `showResult()` to display the win card.
   - Resets range and updates visual bar.

4. **Too Low / Too High:**
   - Updates the hint box with appropriate arrow and message.
   - **Narrows the search range:**  
     - If guess is too low and greater than current `low`, set `low = guess + 1`.  
     - If too high and less than current `high`, set `high = guess - 1`.
   - Calls `updateRange(lastGuess)` to update the visual range bar and show a marker for the last guess.

---

## 7. `updateRange(lastGuess)` – Visual Range Bar Logic

- Calculates the filled portion of the range bar based on `low` and `high` as percentages of `maxNum`.
- Updates the left position and width of `#rangeFill`.
- Displays current `low` and `high` numbers.
- If a `lastGuess` is provided, shows a marker (`#rangeMarker`) at that guess position.
- Computes and displays the midpoint (`~${mid}`) of the remaining range.

---

## 8. `addHistory(guess)` – Updates the Guess History List

- Removes the placeholder "No guesses yet" item if present.
- Creates a new `<li>` element with a class based on guess outcome (`high`, `low`, or `win`) and appends an arrow symbol.
- Scrolls the list to the bottom automatically.

---

## 9. `updateBest()` – Tracks Best Score per Difficulty

- Uses `maxNum` as the key for `bestScores`.
- If no score exists for this difficulty or current attempts are fewer, updates the best score.
- Reflects the best attempts count in the `#bestNum` element.

---

## 10. `showResult()` – Displays the Win Card

- Formats elapsed time.
- Populates the card with the secret number, attempts count, and time.
- Determines a rating badge based on attempts relative to thresholds (different for each difficulty).
- Applies corresponding CSS classes and trophy emoji.
- Shows the result card by adding the `.show` class.

---

## 11. `giveUp()` – Handles Surrender

- Stops the timer, deactivates game, disables controls.
- Changes hint box to a "gave up" state.
- Reveals the secret number in the `#revealNum` element.
- Shows the `#gaveupMsg` card.

---

## 12. `newGame()` and Event Listeners

- `newGame()` simply calls `startGame()` (a convenience wrapper).
- An event listener on the guess input listens for the **Enter** key and calls `checkGuess()`.
- Finally, `startGame()` is invoked immediately to start a game when the page loads.

---

## Summary of Interaction Flow

1. Page loads → `startGame()` sets a random number, resets UI.
2. User enters a guess and submits.
3. `checkGuess()` validates, updates attempts, narrows range, and gives feedback.
4. If correct, game ends, best score updates, result card appears.
5. User can change difficulty at any time (resets game).
6. User can give up (reveals answer).

The code is well-structured, with clear separation of concerns for updating UI, managing game state, and handling user events.
