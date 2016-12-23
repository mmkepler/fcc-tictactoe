/*
Melissa Kepler 2016, Free Code Camp Tic Tac Toe.
*/

"use strict";

/*VARIABLES*/

var state = [null, null, null, null, null, null, null, null, null];
var playerWins = 0;
var compWins = 0;
var playerIcon = ""; //updated when player chooses
var compIcon = ""; 
var win = "You Win!";
var lose = "You lose";
var tie = "Tie Game!";
var start = true;
var compMove = false;

checkForTerminal();

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

if(start){
  gameStart();
}

/*FUNCTIONS*/

//opens choice screen
function gameStart(){
  $("#playerScore").html(playerWins);
  $("#compScore").html(compWins);
  $("#choiceScreen").show();
  $(".inside").hide();
  $(".outside").hide();
  $(".middle").hide();
  $("#newGame").hide();
  $("#message").hide();
}

//adds the players chosen icon, & assigns comp icon
function choice(icon) {
  start = false;
  playerIcon = icon;
  if(playerIcon === "X"){
    compIcon = "O";
  } else {
    compIcon = "X";
    compMove = true;
    moveAI();
  }
  $("#choiceScreen").hide();
  $(".inside").show();
  $(".middle").show();
  $(".outside").show();
}

//resets everything back to the choice screen
function restartGame() {
  state = [null, null, null, null, null, null, null, null, null];
  $(".tic").prop("disabled", false).addClass("swing");
  $(".tic").text("");
  $(".inside").hide();
  $(".middle").hide();
  $(".outside").hide();
  $("#choiceScreen").show();
  compMove = false;
  compWins = 0;
  playerWins = 0;
  $("#playerScore").html(playerWins);
  $("#compScore").html(compWins);
  updateState();
}

//restarts the state, but not the player/comp icons and scores
function resetState(){
  $(".tic").prop("disabled", false).addClass("swing");
  state = [null, null, null, null, null, null, null, null, null];
  updateState();
  if(playerIcon === "X"){
    compMove = false;
  }else{
    compMove = true;
    moveAI();
  }
  
}


function disableTiles(){
  $(".tic").prop("disabled", true);
  $(".tic").removeClass("swing");
  
}

//checks for a terminal state: win, lose, tie
function checkForTerminal() {
  updateState();
    
  var winner = winCheck(state);
   if(winner !== null){
     switch(winner){
	  case 1:
	    compWins++;
	    disableTiles();
         
	    $("#compScore").text(compWins);
	    $("#alert").html(lose);
	    endGame();
	    console.log("ai wins");
	    break;
	  case 0:
	    playerWins++;
	    disableTiles();
	    $("#playerScore").html("player");
	    $("#alert").html(win);
	    endGame();
	    console.log("player wins");
	    break;
	  case -1:
	    $("#alert").html(tie);
	    disableTiles();
	    endGame();
	    console.log("tie");
	     break;
	  }
  } 
}


//animation that moves the newGame and reset buttons when there is a terminal state
function endGame(){
  $(".tic").prop("disabled", true);
  $("#message").fadeIn(200);
  setTimeout(function(){
    $("#message").fadeOut(200).hide(200).promise().done(function(){
    $(".tic").contents().fadeOut(300).empty();
      resetState();
		});
  }, 3000);
}


//checks for win configurations on the state
function winCheck(state){
      //columns check
      for (var i = 0; i <= 6; i = i + 3) {
        if (state[i] !== null && state[i] === state[i + 1] && state[i + 1] === state[i + 2]) {
          if(state[i] === false){
              return 0;
          } else {
              return 1;
          }
        }
      }
    
      //rows check
      for (var j = 0; j <= 2; j++) {
        if (state[j] !== null && state[j] === state[j + 3] && state[j + 3] === state[j + 6]) {
          if(state[j] === false){
              return 0;
          } else {
              return 1;
          }
       }
     }
     
    //diagonal check
    if(state[0] !== null && state[0] === state[4] && state[4] === state[8]){
      if(state[0] === false){
              return 0;
          } else {
              return 1;
          }
    }
    
    if(state[2] !== null && state[2] === state[4] && state[4] === state[6]){
      if(state[2] === false){
              return 0;
          } else {
              return 1;
          }
    }
    
    //check for tie
    if ($.inArray(null, state) === -1) {
        return -1;
      }
    return null;
  }


//checks the state array to properly display icons on the buttons
function updateState() {
    
    for (var i = 0; i < 9; i++) {
      var buttonText;
      switch(state[i]){
        case false:
          buttonText = playerIcon;
          break;
        case true:
          buttonText = compIcon;
          break;
        case null:
          buttonText = "";
          break;
      }
      $("#t" + i ).text(buttonText);
      if(state[i] !== null){
        $("#t" + i ).prop("disabled", true).removeClass("swing");
		
      }
    }	
}


//changes the state after the recursiveMinimax results were returned through minimax to this function
function moveAI() {
  state = minimax(state);
  compMove = false;
  checkForTerminal();
}

//calls the recursiveMinimax function and returns the results
function minimax(state) {
  return recursiveMinimax(state, true)[1];
}


//checks to see if the state is in a terminal state, and if not it calls itself until a move is chosen that will maximize the ai players chance of winning. 
function recursiveMinimax(state, player) {
  var winner = winCheck(state);
  if (winner !== null) {
    switch(winner) {
      case 1:
        // highest number, AI is the max player
        return [100, state];
								
      case 0:
        // lowest number, player is the min player
        return [-100, state];
								
      case -1:
        // mid number for a tie game
        return [0, state];
								
      }
    } else {
      // sets to null initially
      var nextValue = null;
      var nextState = null;
        
        for (var i = 0; i < 9; i++) {
          if (state[i] === null) {
            state[i] = player;
            //reruns with the oppoiste player(human)
            var value = recursiveMinimax(state, !player)[0];
            if((nextValue === null) || (player && value > nextValue) || (!player && value < nextValue) ){
              nextState = state.slice(0);
              nextValue = value;
            }
              //if the above criteria isn't met, that spot goes back to empty
              state[i] = null;
          }
        }
      
      return [nextValue, nextState];
  }
}


/*Buttons*/


$(document).ready(function() {
	
  $(".tic").click(function() {
    var id = $(this).attr("id");
    var space = id[1];
    if (!compMove) {
      state[space] = false;
      compMove = true;
      checkForTerminal();
      moveAI();     
    }
  });


  $("#reset").click(function(){
    restartGame();
  });
	
  $("#newGame").click(function(){
    $("#newGame").fadeOut(200).promise().done(function(){
      resetState();
    });
			
  });
    
  $(".choice").click(function() {
    choice($(this).val());
  });
    
});


