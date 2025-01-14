import java.util.Scanner;

public class TicTacToe {
    public static char currentPlayer = 'X';
    public static char[][] board = new char[][]{{' ', ' ', ' '}, {' ', ' ', ' '}, {' ', ' ', ' '}};
    public static boolean gameRunning = true;

    public static void main(String[] args) {
        gameRunning();
        playAgain();
    }

    public static void gameRunning() {
        System.out.println("Welcome to Tic Tac Toe!");
        System.out.println("Board: ");
        printBoard(board);
        while (gameRunning) {
            System.out.println("Player " + currentPlayer + "'s turn, please enter row and colum (1-3): ");
            Scanner console = new Scanner(System.in);
            int row = console.nextInt();
            int col = console.nextInt();

            while (row < 1 || row > 3 || col < 1 || col > 3) {
                System.out.println("Invalid row and colum, please try again.");
                row = console.nextInt();
                col = console.nextInt();
            }

            if (board[row - 1][col - 1] != ' ') {
                System.out.println("This cell is already taken, please try again.");
                continue;
            }

            board[row - 1][col - 1] = currentPlayer;
            printBoard(board);
            checkWinner();
            switchPlayer();
        }
    }

    public static void newGame() {
        gameRunning = true;
        printBoard(board = new char[][]{{' ', ' ', ' '}, {' ', ' ', ' '}, {' ', ' ', ' '}});
        gameRunning();
    }


    public static void printBoard(char[][] board) {
        for (int row = 0; row < board.length; row++) {
            if (row != 0) {
                System.out.println("+-+-+-+");
            }
            for (int col = 0; col < board[row].length; col++) {
                System.out.print("|" + board[row][col]);

            }
            System.out.println("|");
        }
    }

    public static void switchPlayer() {
        currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
    }

    public static void playAgain() {
        if (!gameRunning) {
            System.out.println("Would you like to play again? (Y/N)");
            Scanner console = new Scanner(System.in);
            String answer = console.nextLine();
            if (answer.equalsIgnoreCase("Y")) {
                newGame();
            } else {
                System.out.println("Thanks for playing!");
            }
        }
    }

    public static void checkWinner() {
        // Check if a player has won
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == currentPlayer && board[i][1] == currentPlayer && board[i][2] == currentPlayer) {
                gameRunning = false;
                System.out.println(currentPlayer + " has won!");
            }
            if (board[0][i] == currentPlayer && board[1][i] == currentPlayer && board[2][i] == currentPlayer) {
                gameRunning = false;
                System.out.println(currentPlayer + " has won!");
            }
        }

        if (board[0][0] == currentPlayer && board[1][1] == currentPlayer && board[2][2] == currentPlayer) {
            gameRunning = false;
            System.out.println(currentPlayer + " has won!");
        }

        if (board[0][2] == currentPlayer && board[1][1] == currentPlayer && board[2][0] == currentPlayer) {
            gameRunning = false;
            System.out.println(currentPlayer + " has won!");
        }
    }
}
