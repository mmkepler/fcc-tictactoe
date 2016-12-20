//https://jsfiddle.net/xb9mr7bn/9/?utm_source=website&utm_medium=embed&utm_campaign=xb9mr7bn
//variables

var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];
var playerWins = 0;
var compWins = 0;
var playerIcon = ""; //updated when player chooses
var compIcon = "";
var myMove = false;
var win = "You Win!";
var lose = "You lose";
var tie = "Tie Game!";
console.log(myMove);


//choice screen display
$("#playerScore").html(playerWins);
$("#compScore").html(compWins);
$("#choiceScreen").show();
$(".inside").hide();
$(".outside").hide();
$(".middle").hide();
$("#newGame").hide();
$("#message").hide();

//moves from choice to start screen
//adds the players chosen icon, & assigns comp icon
function choice(icon) {
    playerIcon = icon;
    if(playerIcon === "X"){
      compIcon = "O";
    } else {
      compIcon = "X";
			myMove = true;
			console.log(myMove);
			makeMove();
    }
      
    $("#choiceScreen").hide();
    $(".inside").show();
    $(".middle").show();
    $(".outside").show();
  }

if (myMove) {
    makeMove();
}

//buttons
$(document).ready(function() {
	
    $(".tic").click(function() {
        //$(this).prop("disabled", true);
        var cell = $(this).attr("id");
        var row = parseInt(cell[1]);
        var col = parseInt(cell[2]);
        if (!myMove) {
            board[row][col] = false;
            myMove = true;
            updateMove();
						makeMove();
            
        }
			console.log("from click event " + board);
    });
	
    $("#reset").click(function(){
        restartGame();
    });
	
	  $("#newGame").click(function(){
			$("#newGame").fadeOut(200).promise().done(function(){
				resetBoard();
			});
			
		});
    
    $(".choice").click(function() {
    choice($(this).val());
    console.log(playerIcon);
    console.log(compIcon);
  });
    
});

//functions
function restartGame() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    $(".tic").prop("disabled", false);
    $(".tic").text("");
    $(".inside").hide();
    $(".middle").hide();
    $(".outside").hide();
    $("#choiceScreen").show();
    myMove = false;
    updateMove();
}

function disableBoard(){
	$(".tic").prop("disabled", true);
}

function resetBoard(){
    $(".tic").prop("disabled", false);
		$(".tic").empty();
    board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
    ];
    if(playerIcon == "X"){
			myMove = false;
		}else{
			myMove = true;
		}
	$("#reset").animate({"margin-top": "24px"}, 500);
}

function updateMove() {
    updateButtons();
    
    var winner = getWinner(board);
    
    
     if(winner !== null){
			switch(winner){
				case 1:
					compWins++;
					disableBoard();
					$("#compScore").text(compWins);
					$("#alert").html(lose);
					endGame();
					console.log("ai wins");
				  break;
				case 0:
					playerWins++;
					disableBoard();
					$("#playerScore").html("player");
					$("#alert").html(win);
					endGame();
					console.log("player wins");
					break;
				case -1:
					$("#alert").html(tie);
					disableBoard();
					endGame();
					console.log("tie");
					break;
			}
		}
    
}

function endGame(){
	$("#reset").animate({"margin-top": "0"},500).promise().done(function(){
		$("#message").fadeIn(200);
	});
	setTimeout(function(){
		$("#message").fadeOut(200).hide(200).promise().done(function(){
			$("#newGame").fadeIn(600);
		});
	}, 3000);
}

function getWinner(board) {
   
    // Check if someone won
    vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];
        
        // Check rows, columns, and diagonals
        var diagonalComplete1 = true;
        var diagonalComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonalComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagonalComplete2 = false;
            }
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] === null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonalComplete1 || diagonalComplete2) {
            return value ? 1 : 0;
        }
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}

//change this so it will show either playerIcon or compIcon
function updateButtons() {
	setTimeout(function(){
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $("#c" + i + "" + j).text(board[i][j] == false ? playerIcon : board[i][j] === true ? compIcon : "");
					if(board[i][j] !== null){
						$("#c" + i + "" + j).prop("disabled", true);
					}
        }
    }
	}, 500);
	
}

function makeMove() {
    board = minimaxMove(board);
    console.log(numNodes);
    myMove = false;
    setTimeout(function(){updateMove();}, 500); 
}

function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}

var numNodes = 0;

function recurseMinimax(board, player) {
    numNodes++;
    var winner = getWinner(board);
    if (winner !== null) {
        switch(winner) {
            case 1:
                // AI wins
                return [1, board];
								
            case 0:
                // opponent wins
                return [-1, board];
								
            case -1:
                // Tie
                return [0, board];
								
        }
    } else {
        // Next states
        var nextVal = null;
        var nextBoard = null;
        
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    board[i][j] = player;
                    var value = recurseMinimax(board, !player)[0];
                    if ((player && (nextVal === null || value > nextVal)) || (!player && (nextVal === null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}



updateMove();