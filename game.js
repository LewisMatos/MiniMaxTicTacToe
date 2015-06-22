//Global variables
var difficulty = 1; //Sets how far to search down the tree. higher value increases difficulty.  
var ROWS = 3; //Defines the size of the board 3*3 tic tac toe.
var COLS = 3;
var MAX_DEPTH; //Limits depth of search.
var AI_MOVE; //minimax returns value for max and min score.
var board = new Array(ROWS * COLS); //array for the board.
var turn = ""; //is set to determine who's turn i tis
var gameOver = false;
//X and O images for the board.
var X = new Image();
var O = new Image();
X.src = "tic-tac-toe-X.png";
O.src = "tic-tac-toe-O.png";

/*This listen to see if the page is fully loaded and then immediately calls the start function.*/
document.addEventListener('DOMContentLoaded', function() {
    start();
}, false);

//Changes difficulty when player chooses from drop down menu. The harder the difficulty the father the AI looks ahead.
function setDifficulty() {
    difficulty = document.getElementById("setLevel").value;
}
//rand function to select which opponent goes first.
function randTurn() {
    if (Math.random() < 0.5) {
        turn = "X";
        document.getElementById("gameInfo").innerHTML = "You start first";
    } else {
        turn = "O";
        document.getElementById("gameInfo").innerHTML = "Computer started first";
        clickBox(99); //If computer starts have it call clickbox to play the game. 99 is just a default value. 
    }
}

function playerTurn(player) {
        document.getElementById("gameInfo").innerHTML = player + " turn";
    }

//Gets called by eventListener when page is loaded and starts the game.
function start() {
        initializeBoard();
        randTurn();
    }

//When a user selects a different difficulty the board is reset to start with that difficulty level.
function setDiffRestart() {
        setDifficulty();
        start();
    }

//Resets the board by initializing both board and table data with empty string.
function initializeBoard() {
        for (var i = 0; i < board.length; i++) {
            board[i] = "";
            document.getElementById(i).innerHTML = "";
            gameOver = false;
        }
    }
/* Function clickBox(id) get's called when a player clicks a box in the table. If it's players turn and the box is empty an X is filled in that particular box else computer plays and minimax algorithm is called to check the best move for Comp.*/
function clickBox(id) {
        var pos = parseInt(id);
        if ((board[pos] == "" || pos == 99) && !gameOver) { //if user clicked a square continue if that square is empty or if AI started first and the game can't be over. Once game is over locks the board.
            if (turn == "X") {
                playerTurn("Player");
                document.getElementById(id).innerHTML = "<img src =" + X.src +">";
                board[pos] = "X";
                turn = "O";
            }
            if (full(board)) { //After played made a move check if the board is full if so game ends in a tie.
                document.getElementById("gameInfo").innerHTML = "Game Tied";
            } else if (wins(board, "X")) { //If game isn't full then check for a winner by checking all winning possibilities.
                document.getElementById("gameInfo").innerHTML = "You Won!!!";
            } else {//If player hasn't won then the computer calls minimax to check for best possible move.
                MAX_DEPTH = difficulty; //sets the limit on how far the computer would look ahead
                minimax(board, "O", 0); //Minimax looks for the best possible move for AI. Returns AI_MOVE.
                board[AI_MOVE] = "O"; //Select the square that AI choose.
                turn = "X";
                document.getElementById(AI_MOVE).innerHTML = "<img src =" + O.src +">";
                if (wins(board, "O")) { //Check win for AI
                    document.getElementById("gameInfo").innerHTML = "Computer WON!!!";
                }
                if (full(board)) { //Check for full board again but this time for AI.
                    document.getElementById("gameInfo").innerHTML = "Game Tied";

                }
            }
        }
    }

//Returns all available moves left on the current board.
function get_available_moves(state) {
        var all_moves = new Array();
        for (var i = 0; i < board.length; i++) {
            if (state[i] == "") {
                all_moves.push(i);
            }
        }
        return all_moves
    }

//Checks the state of the board and returns true if there are no longer any moves to be made. 
function full(state) {
        if (get_available_moves(state).length == 0) {
            gameOver = true;
            return true;
        } else return false;
    }

//Takes a board state and checks to see if AI or human won the match.
function wins(state, player) {
        if (
            (state[0] == player && state[1] == player && state[2] == player) ||
            (state[3] == player && state[4] == player && state[5] == player) ||
            (state[6] == player && state[7] == player && state[8] == player) ||
            (state[0] == player && state[3] == player && state[6] == player) ||
            (state[1] == player && state[4] == player && state[7] == player) ||
            (state[2] == player && state[5] == player && state[8] == player) ||
            (state[0] == player && state[4] == player && state[8] == player) ||
            (state[2] == player && state[4] == player && state[6] == player)) {
            gameOver = true;
            return true;
        } else {
            return false;
        }
    }

// Given a state of the board, returns true if the board is full or a player has won. 
function terminal(state) {
        if (full(state) || wins(state, "X") || wins(state, "O")) {
            return true;
        } else return false;
    }

//If player has a winning state assign a score of 1 else if AI has a winning state apply a score of -1. AI wants to maxamize the human chance of lossing.
function score(state) {
        if (wins(state, "X")) {
            return 1;
        } else if (wins(state, "O")) {
            return -1;
        } else {
            return 0;
        }
    }

// Finds the best decision for the AI. Returns best value for max and min player. 
function minimax(state, player, depth) {
    //check if it reached the set Depth by the player or if the game has ended by one of the ending states then return score.
    if (depth >= MAX_DEPTH || terminal(state)) {
        return score(state);
    }
    var max_score; //maximizing player score
    var min_score; //mininizing player score
    var scores = []; //keeps track of score of current board state
    var moves = []; //keeps track of all available moves of current board state.
    var opponent; 
    
    if (player == "X"){ 
        opponent = "O";}
    else 
        opponent = "X";
    
    var successors = get_available_moves(state); //get's all the available moves from a given board.
    
    for (var s in successors) {
        var possible_state = state; //makes a copy of the current board
        possible_state[successors[s]] = player; //sets player in all possible squares in current board
        scores.push(minimax(possible_state, opponent, depth + 1)); //call minimax with new board of opponents states and increase the height of tree by 1. Add it to score array.
        possible_state[successors[s]] = ""; //clear playes move from the board
        moves.push(successors[s]); //keeps track of moves made
    }
    
    //If a human is playing then we check to see what moves it will win the game 
    if (player == "X") {
        AI_MOVE = moves[0]; //set AI_Move to the first move
        max_score = scores[0]; //set max score to the first score
        for (var s in scores) { //iterate through all the scores
            if (scores[s] > max_score) { //looks for all scores then is greater then max
                max_score = scores[s]; //set max_score to that score
                AI_MOVE = moves[s]; //set AI_Move to the best possible move
            }
        }
        return max_score; //return max_score
    } else {
        AI_MOVE = moves[0]; //Set ai_move and min_score to the first move and score
        min_score = scores[0];
        for (var s in scores) {
            if (scores[s] < min_score) {
                min_score = scores[s];
                AI_MOVE = moves[s];
            }
        }
        return min_score;
    }
}
