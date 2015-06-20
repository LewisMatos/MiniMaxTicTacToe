// Globals //
    var difficulty = 1; //default level is set to easy
    var NUM_ROWS = 3; //Defines the size of the board 3*3 tic tac toe
    var	NUM_COLS = 3;
    var	MAX_DEPTH; //Assigns how much you want to look ahead. Depth search of tree.
    var	AI_MOVE; //is given a value of a square after minimax determines best possible move
    var	NUM_SQUARES = NUM_ROWS * NUM_COLS;
    var	board = new Array(NUM_SQUARES); //array for the board.
    //X and O images for the board.
var turn = "";
    var X = new Image(); 
    var O = new Image(); 
    X.src = "tic-tac-toe-X.png";
    O.src = "tic-tac-toe-O.png";

//This listen to see if the page is fully loaded and then immediately calls the start function.
    document.addEventListener('DOMContentLoaded', function() {start();}, false);


//Changes difficulty when player chooses from drop down menu. The harder the difficulty the father the AI looks ahead.
function setDifficulty(){
    difficulty = document.getElementById("setLevel").value;
}

function playerTurn(){
    if(Math.random() < 0.5){
      turn = "X";
        document.getElementById("playerName").innerHTML = "Human Start";
    }else{
        turn = "O";
    document.getElementById("playerName").innerHTML = "AI Start";
        clickBox(99);
    }
    }


//Gets called by eventListener when page is loaded and starts the game.
    function start(){
    initializeBoard();
    playerTurn();
    }

//When a user selects a different difficulty the board is reset to start with that difficulty level.
function setDiffRestart(){
    setDifficulty();
    start();
   
    
}

//Resets the board by initializing both board and table data with empty string.
 function initializeBoard(){
   for(var i = 0; i < board.length; i++){
       board[i] = "";
       document.getElementById(i).innerHTML="";

   }

 }

	// Function clickBox(id) get's called when a player clicks a box in the table. If it's players turn and the box is empty an X is filled in that particular box else computer plays and minimax algorithm is called to check the best move for Comp.
//Player always starts first.
	function clickBox(id) {
        //Converts string id to a integer
		var pos = parseInt(id); 
        //Checks if that position is empty and if it is it marks an X at that position for player
		if (board[pos] == "" || pos == 99) {
            if(turn == "X"){
                 
            document.getElementById(id).innerHTML = "<img src =" + X.src + ">";
			board[pos] = "X";
            turn = "O";
            }
            //After Player makes a move it checks if the board is full which means game ended in a draw.
			if (full(board)) {
                 document.getElementById("playerName").innerHTML = "Sorry it's a tie";
                //If game isn't full then check for a winner by checking all winning possibilities for Player.
			} else if (wins(board, "X")) {
                 document.getElementById("playerName").innerHTML = "Player Won";
                //If player hasn't won then the computer calls minimax to check for best possible move.
			} else {
                //sets how many moves you want the comp to look ahead. 
				MAX_DEPTH = difficulty; 
				minimax(board, "O", 0); //minimax checks for best possible move and sets AI_MOVE to that position.
				board[AI_MOVE] = "O"; //after minimax choose the best move it's move gets assigned to the board.
                turn = "X";
			document.getElementById(AI_MOVE).innerHTML = "<img src =" + O.src + ">";
				if (wins(board, "O")) {
				 document.getElementById("playerName").innerHTML = "Computer WON!!!";
				}
			}
		}
	}
	


//Checks all available moves in a given game state.
function get_available_moves(state) {
    var all_moves = new Array();
    for(var i = 0; i< NUM_SQUARES; i++){
        if(state[i] == ""){
            all_moves.push(i);
        }
    }
	return all_moves
}

//Checks the state of the board and returns true if there are no longer any moves to be made. 
function full(state) {
	return !get_available_moves(state).length;
}

//Takes a board state and checks to see if AI or human won the match.
function wins(state, player) {
if ( 
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player) ){
    return true;
}else{
    return false;
}
    
}


/* Given a state of the board, returns true if the board is full or a player has won */
function terminal(state) {
	return full(state) || wins(state, "X") || wins(state, "O");
}

//If player has a winning state assign a score of 1 else if AI has a winning state apply a score of -1. AI wants to maxamize the human chance of lossing.
function score(state) {
	if (wins(state, "X")) {
		return 10;
	} else if (wins(state, "O")) {
		return -10;
	} else {
		return 0;
	}
}

/* Finds the optimal decision for the AI */
function minimax(state, player, depth) {
    //If depth reached is greater then max or the game has ended depending in it's state return score.
	if (depth >= MAX_DEPTH || terminal(state)) {
		return score(state);
	}
	var max_score;
    var min_score;
	var	scores = [];
    var	moves = [];
	var	opponent; 
    if (player == "X")
        opponent = "O";
    else
        opponent = "X";
    
    var successors = get_available_moves(state);
	
	for (var s in successors) {
		var possible_state = state;
		possible_state[successors[s]] = player;
		scores.push(minimax(possible_state, opponent, depth + 1));
		possible_state[successors[s]] = "";
		moves.push(successors[s]);	
	}
	//If a human is playing then we check to see what moves it will win the game 
	if (player == "X") {
		AI_MOVE = moves[0];
		max_score = scores[0];
		for (var s in scores) {
			if (scores[s] > max_score) {
				max_score = scores[s];
				AI_MOVE = moves[s];
			}
		}
		return max_score;
	} else {
		AI_MOVE = moves[0];
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