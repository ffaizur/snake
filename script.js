alert('Clear Level 61+ to win ₹50! Tap "OK" to start your challenge!');

const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const informationElement = document.querySelector(".information");
const wrapperElement = document.querySelector(".wrapper");
const messageElement = document.querySelector(".message");
const harmessageElement = document.querySelector(".har-message");
const resetButton = document.querySelector(".message-btn button");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[5, 5], [4, 5], [3, 5]];
let setIntervalId;
let score = 0;
let gameStarted = false;

// Prevent inspect element
document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("keydown", event => {
    if (event.ctrlKey && (event.key === "U" || event.key === "I" || event.key === "J" || event.key === "C")) {
        event.preventDefault();
    }
});

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    gameOver = true;
    if (score > 61) {
        informationElement.style.display = 'none';
        wrapperElement.style.display = 'none';
        messageElement.style.display = 'block';
        harmessageElement.style.display = 'none';
    } else {
        informationElement.style.display = 'none';
        wrapperElement.style.display = 'none';
        messageElement.style.display = 'none';
        harmessageElement.style.display = 'block';
    }
};

resetButton.addEventListener("click", () => {
    informationElement.style.display = 'flex';
    wrapperElement.style.display = 'block';
    messageElement.style.display = 'none';
    location.reload();
});

const changeDirection = (e) => {
    let key = e.key || e.target.dataset.key;
    if (!gameStarted) {
        gameStarted = true;
    }
    if (key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

document.addEventListener("keydown", changeDirection);
controls.forEach(button => button.addEventListener("click", changeDirection));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if (gameStarted) {
        snakeX += velocityX;
        snakeY += velocityY;
        
        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = [...snakeBody[i - 1]];
        }
        snakeBody[0] = [snakeX, snakeY];
    }
    
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([...snakeBody[snakeBody.length - 1]]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        let color = i === 0 ? "white" : "#60CBFF";
        let extraClass = i === 0 ? "first-head" : "";
        html += `<div class="head ${extraClass}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; background: ${color}"></div>`;
        
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }
    
    playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
