/*
Melissa Kepler 2016 FreeCodeCamp TicTacToe Project


*/
//https://jsfiddle.net/xb9mr7bn/9/?utm_source=website&utm_medium=embed&utm_campaign=xb9mr7bn

"use strict";

/*VARIABLES*/

var board = [null, null, null, null, null, null, null, null, null];
var playerWins = 0;
var compWins = 0;
var playerIcon = ""; //updated when player chooses
var compIcon = "";
var compMove = false; 
var win = "You Win!";
var lose = "You lose";
var tie = "Tie Game!";
var numNodes = 0;//might not need


/*Sets up game choice screen*/

$("#playerScore").html(playerWins);
$("#compScore").html(compWins);
$("#choiceScreen").show();
$(".inside").hide();
$(".outside").hide();
$(".middle").hide();
$("#newGame").hide();
$("#message").hide();


/*Makes sure that computer takes it's move*/
if (compMove) {
  moveAI();
}


/*FUNCTIONS*/


//adds the players chosen icon, & assigns comp icon
function choice(icon) {
  playerIcon = icon;
  if(playerIcon === "X"){
    compIcon = "O";
  } else {
    compIcon = "X";
    compMove = true;
    console.log(compMove);
    moveAI();
  }
      
    $("#choiceScreen").hide();
    $(".inside").show();
    $(".middle").show();
    $(".outside").show();
  }

//resets everything back to the choice screen
function restartGame() {
  board = [null, null, null, null, null, null, null, null, null];
  $(".tic").prop("disabled", false);
  $(".tic").text("");
  $(".inside").hide();
  $(".middle").hide();
  $(".outside").hide();
  $("#choiceScreen").show();
  compMove = false;
  updateState();
}

//restarts the board, but not the player/comp icons and scores
function resetBoard(){
  $(".tic").prop("disabled", false);
  $(".tic").empty();
  board = [null, null, null, null, null, null, null, null, null];
  if(playerIcon == "X"){
    compMove = false;
  }else{
    compMove = true;
  }
  $("#reset").animate({"margin-top": "24px"}, 500);
}

function disableBoard(){
    $(".tic").prop("disabled", true);
}

//checks for a terminal state: win, lose, tie
function updateState() {
  updateBoard();
    
  var win = winCheck(board);
   if(win !== null){
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

//animation that moves the newGame and reset buttons when there is a terminal state
function endGame(){
  $("#reset").animate({"margin-top": "0"},500).promise().done (function(){
      $("#message").fadeIn(200);
  });
  setTimeout(function(){
    $("#message").fadeOut(200).hide(200).promise().done(function(){
      $("#newGame").fadeIn(600);
		});
  }, 3000);
}


//checks for win configurations on the board
function winCheck(board){
      //columns check
      for (var i = 0; i <= 6; i = i + 3) {
        if (board[i] !== null && board[i] === board[i + 1] && board[i + 1] === board[i + 2]) {
          if(board[i] === false){
              return 0;
          } else {
              return 1;
          }
        }
      }
    
      //rows check
      for (var j = 0; j <= 2; j++) {
        if (board[j] !== null && board[j] === board[j + 3] && board[j + 3] === board[j + 6]) {
          if(board[j] === false){
              return 0;
          } else {
              return 1;
          }
       }
     }
     
    //diagonal check
    if(board[0] !== null && board[0] === board[4] && board[4] === board[8]){
      if(board[0] === false){
              return 0;
          } else {
              return 1;
          }
    }
    
    if(board[2] !== null && board[2] === board[4] && board[4] === board[6]){
      if(board[2] === false){
              return 0;
          } else {
              return 1;
          }
    }
    
    //check for tie
    if ($.inArray(null, board) === -1) {
        return -1;
      }
    return null;
  }


//checks the board array to properly display icons on the buttons
function updateBoard() {
    
    for (var i = 0; i < 9; i++) {
      var buttonText;
      switch(board[i]){
        case false:
          buttonText = playerIcon;
          break;
        case true:
          buttonText = compIcon;
          break;
        case null:
          buttonText = "";
          break
      }
      $("#t" + i ).text(buttonText);
      if(board[i] !== null){
        $("#t" + i ).prop("disabled", true);
      }
    }	
}



function moveAI() {
  board = minimaxMove(board);
  console.log(numNodes);
  compMove = false;
  //setTimeout(function(){updateState();}, 500); 
updateState();
}

function minimaxMove(board) {
  numNodes = 0;
  return recurseMinimax(board, true)[1];
}


function recurseMinimax(board, player) {

  numNodes++;
  var win = winCheck(board);
  if (win !== null) {
    switch(winner) {
      case 1:
        // highest number, AI is the max player
        return [100, board];
								
      case 0:
        // lowest number, player is the min player
        return [-100, board];
								
      case -1:
        // mid number for a tie game
        return [0, board];
								
      }
    } else {
      // sets to null initially
      var nextValue = null;
      var nextBoard = null;
        
        for (var i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = player;
            //reruns with the oppoiste player(human)
            var value = recurseMinimax(board, !player)[0];
            if((nextValue === null) || (player && value > nextValue) || (!player && value < nextValue) ){
              nextBoard = board.slice(0);
              nextValue = value;
            }
              //if the above criteria isn't met, that spot goes back to empty
              board[i] = null;
          }
        }
      
      return [nextValue, nextBoard];
  }
}

updateState();



/*Buttons*/


$(document).ready(function() {
	
  $(".tic").click(function() {
    var id = $(this).attr("id");
    var space = id[1];
    if (!compMove) {
      board[space] = false;
      console.log(board);
      compMove = true;
      updateState();
      moveAI();     
    }
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


