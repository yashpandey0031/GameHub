// Snake Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// Initialize game
function initGame() {
    document.getElementById('highScore').textContent = highScore;
    generateFood();
    drawGame();
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'hsl(var(--b2))';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'hsl(var(--p))';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw food
    ctx.fillStyle = 'hsl(var(--er))';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Update game state
function updateGame() {
    if (!gameRunning) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Change snake direction
function changeDirection(direction) {
    if (!gameRunning) return;

    switch (direction) {
        case 'up':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'down':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'left':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'right':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
}

// Toggle game play/pause
function toggleGame() {
    const btn = document.getElementById('playPauseBtn');
    const status = document.getElementById('gameStatus');

    if (!gameRunning) {
        gameRunning = true;
        gameLoop = setInterval(updateGame, 150);
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        status.textContent = 'Playing';
    } else {
        gameRunning = false;
        clearInterval(gameLoop);
        btn.innerHTML = '<i class="fas fa-play"></i> Resume';
        status.textContent = 'Paused';
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }

    document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i> Start';
    document.getElementById('gameStatus').textContent = 'Game Over';
}

// Reset game
function resetGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i> Start';
    document.getElementById('gameStatus').textContent = 'Ready';
    
    generateFood();
    drawGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection('down');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection('right');
            break;
        case ' ':
            e.preventDefault();
            toggleGame();
            break;
    }
});

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);