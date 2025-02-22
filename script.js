const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");
const winningLine = document.querySelector("#winning-line");

const winConditions = [
    [0, 1, 2],  // Row 1
    [3, 4, 5],  // Row 2
    [6, 7, 8],  // Row 3
    [0, 3, 6],  // Column 1
    [1, 4, 7],  // Column 2
    [2, 5, 8],  // Column 3
    [0, 4, 8],  // Diagonal 1
    [2, 4, 6]   // Diagonal 2
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

function initialize() {
    cells.forEach((cell, index) => {
        cell.setAttribute("cellIndex", index);
        cell.addEventListener("click", clicked);
    });
    restartBtn.addEventListener("click", restart);
    statusText.textContent = `${currentPlayer}'s Turn`;
    running = true;
}

initialize();

function clicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !== "" || !running) return;

    updateCell(this, cellIndex);
    checkWin();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
}

function checkWin() {
    let roundWon = false;
    let winningCondition = null;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];

        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            winningCondition = winConditions[i];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} Wins!`;
        statusText.style.color = currentPlayer === "X" ? "green" : "blue";  // Change color
        drawWinningLine(winningCondition);
        running = false;
    } else if (checkDraw()) {
        statusText.textContent = "It's a Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

function checkDraw() {
    return options.every(cell => cell !== ""); 
}

function drawWinningLine(condition) {
    const [a, b, c] = condition;
    const firstCell = cells[a];
    const lastCell = cells[c];

    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    const boardRect = document.querySelector(".board").getBoundingClientRect();

    // Calculate the exact center positions
    const startX = firstRect.left + firstRect.width / 2 - boardRect.left;
    const startY = firstRect.top + firstRect.height / 2 - boardRect.top;
    const endX = lastRect.left + lastRect.width / 2 - boardRect.left;
    const endY = lastRect.top + lastRect.height / 2 - boardRect.top;

    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    winningLine.style.width = `${length}px`;
    winningLine.style.height = `5px`; // Ensures the line is visible
    winningLine.style.position = "absolute";
    winningLine.style.backgroundColor = "red";
    winningLine.style.left = `${startX}px`;
    winningLine.style.top = `${startY}px`;
    winningLine.style.transformOrigin = "left center"; // Fixes rotation anchor
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.transition = "width 0.5s ease-in-out"; // Smooth animation
}

function restart() {
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    statusText.textContent = `${currentPlayer}'s Turn`;
    statusText.style.color = "black";  // Reset color
    cells.forEach(cell => cell.textContent = "");
    winningLine.style.width = "0";  // Remove the red line
}
