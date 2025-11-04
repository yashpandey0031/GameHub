// Rock Paper Scissors Game Logic
const choices = {
    rock: { emoji: '🪨', name: 'Rock' },
    paper: { emoji: '📄', name: 'Paper' },
    scissors: { emoji: '✂️', name: 'Scissors' }
};

let scores = JSON.parse(localStorage.getItem('rpsScores')) || {
    player: 0,
    computer: 0,
    draws: 0
};

// Initialize game
function initGame() {
    updateScoreDisplay();
}

// Play game
function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update display
    updateChoiceDisplay(playerChoice, computerChoice);
    updateResult(result, playerChoice, computerChoice);
    updateScores(result);
    updateScoreDisplay();
    saveScores();
}

// Get random computer choice
function getComputerChoice() {
    const choiceKeys = Object.keys(choices);
    return choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
}

// Determine winner
function determineWinner(player, computer) {
    if (player === computer) return 'draw';
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winConditions[player] === computer ? 'player' : 'computer';
}

// Update choice display
function updateChoiceDisplay(playerChoice, computerChoice) {
    const playerDisplay = document.getElementById('playerChoice');
    const computerDisplay = document.getElementById('computerChoice');
    
    // Add animation classes
    playerDisplay.className = 'text-8xl mb-4 animate__animated animate__bounceIn';
    computerDisplay.className = 'text-8xl mb-4 animate__animated animate__bounceIn';
    
    // Update choices
    playerDisplay.textContent = choices[playerChoice].emoji;
    computerDisplay.textContent = choices[computerChoice].emoji;
}

// Update result display
function updateResult(result, playerChoice, computerChoice) {
    const resultDiv = document.getElementById('gameResult');
    const resultText = document.getElementById('resultText');
    const alertDiv = resultDiv.querySelector('.alert');
    
    let message = '';
    let alertClass = 'alert';
    
    switch (result) {
        case 'player':
            message = `You Win! ${choices[playerChoice].name} beats ${choices[computerChoice].name}! 🎉`;
            alertClass = 'alert alert-success';
            break;
        case 'computer':
            message = `Computer Wins! ${choices[computerChoice].name} beats ${choices[playerChoice].name}! 😔`;
            alertClass = 'alert alert-error';
            break;
        case 'draw':
            message = `It's a Draw! Both chose ${choices[playerChoice].name}! 🤝`;
            alertClass = 'alert alert-warning';
            break;
    }
    
    resultText.textContent = message;
    alertDiv.className = alertClass;
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('animate__animated', 'animate__fadeInUp');
}

// Update scores
function updateScores(result) {
    switch (result) {
        case 'player':
            scores.player++;
            break;
        case 'computer':
            scores.computer++;
            break;
        case 'draw':
            scores.draws++;
            break;
    }
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('playerWins').textContent = scores.player;
    document.getElementById('computerWins').textContent = scores.computer;
    document.getElementById('draws').textContent = scores.draws;
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem('rpsScores', JSON.stringify(scores));
}

// Reset game
function resetGame() {
    scores = { player: 0, computer: 0, draws: 0 };
    updateScoreDisplay();
    saveScores();
    
    // Reset display
    document.getElementById('playerChoice').textContent = '❓';
    document.getElementById('computerChoice').textContent = '❓';
    document.getElementById('gameResult').classList.add('hidden');
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);