let secret = 0; // The hidden number to guess
let maxNum = 100; // Upper bound (changes with difficulty)
let attempts = 0; // Number of guesses made
let low = 1, high = 100; // Current possible range after hints
let gameActive = false; // Whether a game is in progress
let timerInterval = null; // Holds the setInterval ID for the timer
let timerSeconds = 0; // Elapsed seconds
let bestScores = {}; // Stores best attempts per difficulty
// KEYED BY maxNum
 
//******** Generates a random integer between 1 and `max` (inclusive).
function rand(max) { return Math.floor(Math.random() * max) + 1; }

function startGame() { 
  secret = rand(maxNum);// Picks a new `secret` number using `rand(maxNum)`.
  attempts = 0;
  low = 1; //Resets attempts, range bounds (`low`, `high`)
  high = maxNum; // and timer.
  gameActive = true;
  timerSeconds = 0;

  document.getElementById('attemptsNum').textContent = '0';
  document.getElementById('timerNum').textContent = '0:00';
  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').max = maxNum;
  document.getElementById('guessInput').min = 1;
  document.getElementById('guessInput').className = '';
  document.getElementById('btnSubmit').disabled = false;
  document.getElementById('btnGiveup').disabled = false;
  document.getElementById('hintBox').className = 'hint-box';
  document.getElementById('hintText').textContent = 'Enter a number between 1 and ' + maxNum + '!';
  document.getElementById('hintBox').querySelector('.hint-icon').textContent = '🎯';
  document.getElementById('resultCard').classList.remove('show');
  document.getElementById('gaveupMsg').classList.remove('show');
  document.getElementById('historyList').innerHTML = '<li class="hist-empty" id="histEmpty">No guesses yet — get started!</li>';

  updateRange();
  updateRangeHighLabel();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    document.getElementById('timerNum').textContent = m + ':' + String(s).padStart(2,'0');
  }, 1000);
}

function updateRangeHighLabel() {
  document.getElementById('rangeHigh') && (document.getElementById('rangeHigh').textContent = maxNum);
  document.getElementById('rangeLow').textContent = '1';
  document.getElementById('rangeMid').textContent = '';
  document.getElementById('rangeHighLbl') && (document.getElementById('rangeHighLbl').textContent = maxNum);
}

function setDifficulty(btn) {
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  maxNum = parseInt(btn.dataset.max);
  newGame();
}

function checkGuess() {
  if (!gameActive) return;
  const input = document.getElementById('guessInput');
  const val = input.value.trim();
  const hint = document.getElementById('hintBox');
  const hintText = document.getElementById('hintText');
  const icon = hint.querySelector('.hint-icon');

  if (val === '' || isNaN(val)) {
    hint.className = 'hint-box warn';
    icon.textContent = '⚠️';
    hintText.textContent = 'Please enter a number first!';
    return;
  }
  const guess = parseInt(val);
  if (guess < 1 || guess > maxNum) {
    hint.className = 'hint-box warn';
    icon.textContent = '⚠️';
    hintText.textContent = `Number must be between 1 and ${maxNum}!`;
    return;
  }

  attempts++;
  document.getElementById('attemptsNum').textContent = attempts;
  addHistory(guess);
  input.value = '';
  input.focus();

  if (guess === secret) {
    clearInterval(timerInterval);
    gameActive = false;
    input.disabled = true;
    input.className = 'won';
    document.getElementById('btnSubmit').disabled = true;
    document.getElementById('btnGiveup').disabled = true;

    hint.className = 'hint-box win';
    icon.textContent = '🎉';
    hintText.textContent = `That's it! The number was ${secret}!`;

    updateBest();
    showResult();
    low = 1; high = maxNum;
    updateRange();
  } else if (guess < secret) {
    hint.className = 'hint-box high';
    icon.textContent = '⬆️';
    hintText.textContent = `Too low! Try something higher.`;
    if (guess > low) { low = guess + 1; }
    updateRange(guess);
  } else {
    hint.className = 'hint-box low';
    icon.textContent = '⬇️';
    hintText.textContent = `Too high! Try something lower.`;
    if (guess < high) { high = guess - 1; }
    updateRange(guess);
  }
}

function updateRange(lastGuess) {
  const fillLeft = ((low - 1) / maxNum) * 100;
  const fillWidth = ((high - low + 1) / maxNum) * 100;
  document.getElementById('rangeFill').style.left = fillLeft + '%';
  document.getElementById('rangeFill').style.width = fillWidth + '%';
  document.getElementById('rangeLow').textContent = low;
  document.getElementById('rangeHigh').textContent = high;

  const marker = document.getElementById('rangeMarker');
  if (lastGuess !== undefined) {
    marker.style.display = 'block';
    marker.style.left = ((lastGuess / maxNum) * 100) + '%';
  } else {
    marker.style.display = 'none';
  }

  const mid = Math.round((low + high) / 2);
  document.getElementById('rangeMid').textContent = low < high ? `~${mid}` : '';
}

function addHistory(guess) {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('histEmpty');
  if (empty) empty.remove();

  const li = document.createElement('li');
  let cls = guess < secret ? 'high' : guess > secret ? 'low' : 'win';
  const arrow = guess < secret ? '↑' : guess > secret ? '↓' : '✓';
  li.className = 'hist-chip ' + cls;
  li.textContent = guess + arrow;
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}

function updateBest() {
  const key = maxNum;
  if (!bestScores[key] || attempts < bestScores[key]) {
    bestScores[key] = attempts;
  }
  document.getElementById('bestNum').textContent = bestScores[key];
}

function showResult() {
  const card = document.getElementById('resultCard');
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const timeStr = m > 0 ? `${m}m ${s}s` : `${s}s`;

  document.getElementById('winNum').textContent = secret;
  document.getElementById('winAttempts').textContent = attempts + (attempts === 1 ? ' guess' : ' guesses');
  document.getElementById('winTime').textContent = timeStr;

  const badge = document.getElementById('ratingBadge');
  const trophy = document.getElementById('resultTrophy');
  const threshold = maxNum === 50 ? [4, 7, 12] : maxNum === 100 ? [5, 10, 15] : [8, 15, 25];

  if (attempts <= threshold[0]) {
    badge.className = 'rating-badge excellent';
    badge.textContent = '⭐ Excellent — Genius!';
    trophy.textContent = '🏆';
  } else if (attempts <= threshold[1]) {
    badge.className = 'rating-badge good';
    badge.textContent = '✅ Good — Well played!';
    trophy.textContent = '🎉';
  } else if (attempts <= threshold[2]) {
    badge.className = 'rating-badge ok';
    badge.textContent = '👍 OK — Not bad!';
    trophy.textContent = '😊';
  } else {
    badge.className = 'rating-badge practice';
    badge.textContent = '💪 Keep practicing!';
    trophy.textContent = '📚';
  }

  card.classList.add('show');
}

function giveUp() {
  if (!gameActive) return;
  clearInterval(timerInterval);
  gameActive = false;
  document.getElementById('guessInput').disabled = true;
  document.getElementById('btnSubmit').disabled = true;
  document.getElementById('btnGiveup').disabled = true;
  document.getElementById('hintBox').className = 'hint-box low';
  document.getElementById('hintBox').querySelector('.hint-icon').textContent = '😔';
  document.getElementById('hintText').textContent = 'You gave up!';
  document.getElementById('revealNum').textContent = secret;
  document.getElementById('gaveupMsg').classList.add('show');
}

function newGame() { startGame(); }

document.getElementById('guessInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') checkGuess();
});

startGame();