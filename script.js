const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status");
const restartBtn = document.querySelector("#restart");

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]           // Diagonals
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

function initialize(){
    cells.forEach((cell, index) => {
        cell.setAttribute("cellIndex", index);
        cell.addEventListener("click", clicked);
    });
    restartBtn.addEventListener("click", restart);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
initialize();

function clicked(){
    const cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] !== "" || !running) {
        return; // Ignore if cell is already occupied
    }
    updateCell(this, cellIndex);
    checkWin();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWin(){
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (checkDraw()) { 
        statusText.textContent = "It's a Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

function checkDraw(){
    return options.every(cell => cell !== ""); // Returns true if all cells are filled
}

function restart(){
    options = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    running = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
}
