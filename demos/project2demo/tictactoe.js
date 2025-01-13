class TicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        this.gameRunning = true;
        this.console = document.getElementById('javaConsole');
        this.input = document.getElementById('userInput');
        this.waitingForInput = false;
        this.moveBuffer = [];
    }

    start() {
        this.println("Welcome to Tic Tac Toe!");
        this.println("Board: ");
        this.printBoard();
        this.promptMove();
    }

    println(text) {
        this.console.value += text + "\n";
        this.console.scrollTop = this.console.scrollHeight;
    }

    printBoard() {
        for (let row = 0; row < 3; row++) {
            if (row !== 0) {
                this.println("+-+-+-+");
            }
            let line = "";
            for (let col = 0; col < 3; col++) {
                line += "|" + this.board[row][col];
            }
            this.println(line + "|");
        }
    }

    promptMove() {
        this.println(`Player ${this.currentPlayer}'s turn, please enter row and column (1-3):`);
        this.waitingForInput = true;
    }

    handleMove(input) {
        const numbers = input.split(/\s+/).map(num => parseInt(num));
        
        if (numbers.length !== 2 || 
            numbers.some(num => isNaN(num) || num < 1 || num > 3)) {
            this.println("Invalid input. Please enter two numbers (1-3) separated by space.");
            this.promptMove();
            return;
        }

        const [row, col] = numbers;

        if (this.board[row - 1][col - 1] !== ' ') {
            this.println("This cell is already taken, please try again.");
            this.promptMove();
            return;
        }

        this.board[row - 1][col - 1] = this.currentPlayer;
        this.printBoard();
        
        if (this.checkWinner()) {
            this.println(`${this.currentPlayer} has won!`);
            this.gameRunning = false;
            this.promptPlayAgain();
            return;
        }

        if (this.isBoardFull()) {
            this.println("It's a tie!");
            this.gameRunning = false;
            this.promptPlayAgain();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.promptMove();
    }

    checkWinner() {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === this.currentPlayer && 
                this.board[i][1] === this.currentPlayer && 
                this.board[i][2] === this.currentPlayer) return true;
            if (this.board[0][i] === this.currentPlayer && 
                this.board[1][i] === this.currentPlayer && 
                this.board[2][i] === this.currentPlayer) return true;
        }
        // Check diagonals
        if (this.board[0][0] === this.currentPlayer && 
            this.board[1][1] === this.currentPlayer && 
            this.board[2][2] === this.currentPlayer) return true;
        if (this.board[0][2] === this.currentPlayer && 
            this.board[1][1] === this.currentPlayer && 
            this.board[2][0] === this.currentPlayer) return true;
        return false;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ' '));
    }

    promptPlayAgain() {
        this.println("Would you like to play again? (Y/N)");
        this.waitingForInput = true;
    }

    resetGame() {
        this.currentPlayer = 'X';
        this.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        this.gameRunning = true;
        this.moveBuffer = [];
        this.console.value = '';
        this.start();
    }
}

let game = new TicTacToe();
game.start();

function handleInput(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim().toUpperCase();
        event.target.value = '';

        if (!game.gameRunning && (input === 'Y' || input === 'N')) {
            if (input === 'Y') {
                game.resetGame();
            } else {
                game.println("Thanks for playing!");
            }
            return;
        }

        if (game.gameRunning) {
            game.handleMove(input);
        }
    }
} 