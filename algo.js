var isInitPhase = true;

const new_game = document.getElementById("new_game");
const wilfied = document.getElementById("wilfied");
const herevald = document.getElementById("herevald");

const wilfiedSC = document.getElementById("wilfiedSC");
const herevaldSC = document.getElementById("herevaldSC");

var player1 =  {"name" : "wilfied", scoreChance : 0, playerSC : wilfiedSC};
var player2 =  {"name" : "herevald", scoreChance : 0, playerSC : herevaldSC};
var players = [player1, player2];

const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");

const results = document.getElementById("results");

new_game.addEventListener("click", ()  => {
  isInitPhase = true;
  results.innerHTML = "";
  wilfied.disabled = false;
  herevald.disabled = true;
  
  player1.scoreChance = 0;
  player2.scoreChance = 0;
  
  setDiceResults("", "", "");
  wilfiedSC.innerHTML = "";
  herevaldSC.innerHTML = "";
});

wilfied.addEventListener("click", ()  => {
  const launchDiceResult = launchDice();
  displayPlayerResult(player1, launchDiceResult);

  var isBeginner = true;

  if (isBeginner){
    isInitPhase ? handleInitPhase(launchDiceResult) : checkWinner(launchDiceResult.sum);
  } else {
    checkWinner(launchDiceResult.sum);
  }
});

herevald.addEventListener("click", ()  => {
  const launchDiceResult = launchDice();
  displayPlayerResult(player2, launchDiceResult);

  var isBeginner = false;

  if (isBeginner){
    isInitPhase ? handleInitPhase(launchDiceResult) : checkWinner(launchDiceResult.sum);
  } else {
    checkWinner(launchDiceResult.sum);
  }
});

function handleInitPhase(launchDiceResult) {
  if (isAzar(launchDiceResult)) {
    if (player2.scoreChance) displayWinner(player2);
    else displayWinner(player1);
    
  } else {
    if (player2.scoreChance) {
      if(player2.scoreChance !== launchDiceResult.sum) {
        player1.scoreChance = launchDiceResult.sum;
        displaySC(player1);
        isInitPhase = false;
        wilfied.disabled = true;
        herevald.disabled = false;
      }
      else {
        player2.scoreChance = 0;
      }
    }
    else {
      player2.scoreChance = launchDiceResult.sum;
      displaySC(player2);
    }
  }
}

function checkWinner(score){
  if(player2.scoreChance === score) {
    displayWinner(player2);
  }
  else if(player1.scoreChance === score) {
    displayWinner(player1);
  }
  else { 
    wilfied.disabled = !wilfied.disabled;
    herevald.disabled = !herevald.disabled;
  }
}

function displayWinner(player) {
  wilfied.disabled = true;
  herevald.disabled = true;
  message = `The winner is ${player.name}`;
  addMessageToElem(results, message);
}

function launchDice() {
  var result1 = Math.floor(Math.random() * 6 ) + 1;
  var result2 = Math.floor(Math.random() * 6 ) + 1;
  var result3 = Math.floor(Math.random() * 6 ) + 1;
  var total = result1 + result2 + result3;
  
  setDiceResults(result1, result2, result3);

  return {
    message : `${result1} + ${result2} + ${result3}, total ${total}`,
    sum : total
  };
}

function setDiceResults(dice1, dice2, dice3) {
  setDiceResultsDice(dice1, 1);
  setDiceResultsDice(dice2, 2);
  setDiceResultsDice(dice3, 3);
}

function setDiceResultsDice(dice, diceIndex) {
  for (var i=1; i<=6; i++) {
    var query = `#d${diceIndex} .dice${i}`;
    (document.querySelector(query)).style.display = i == dice ? 'block' : 'none';
  }

  // if (dice1 == 1) {
  //   for (var i=1; i<=6; i++) {
  //    (document.querySelector(`#d1 .dice${i}`)).style.display = i == dice1 ? 'block' : 'none';
  //   }
  //   (document.querySelector('#d1 .dice1')).style.display = 'block';
  //   (document.querySelector('#d1 .dice2')).style.display = 'none';
  //   (document.querySelector('#d1 .dice3')).style.display = 'none';
  //   (document.querySelector('#d1 .dice4')).style.display = 'none';
  //   (document.querySelector('#d1 .dice5')).style.display = 'none';
  //   (document.querySelector('#d1 .dice6')).style.display = 'none';
  // } else if (dice1 == 2) {
  //   (document.querySelector('#d1 .dice1')).style.display = 'none';
  //   (document.querySelector('#d1 .dice2')).style.display = 'block';
  //   (document.querySelector('#d1 .dice3')).style.display = 'none';
  //   (document.querySelector('#d1 .dice4')).style.display = 'none';
  //   (document.querySelector('#d1 .dice5')).style.display = 'none';
  //   (document.querySelector('#d1 .dice6')).style.display = 'none';
  // } else if (dice1 == 3) {
  //   (document.querySelector('#d1 .dice1')).style.display = 'none';
  //   (document.querySelector('#d1 .dice2')).style.display = 'none';
  //   (document.querySelector('#d1 .dice3')).style.display = 'block';
  //   (document.querySelector('#d1 .dice4')).style.display = 'none';
  //   (document.querySelector('#d1 .dice5')).style.display = 'none';
  //   (document.querySelector('#d1 .dice6')).style.display = 'none';
  // } else if (dice1 == 4) {
  //   (document.querySelector('#d1 .dice1')).style.display = 'none';
  //   (document.querySelector('#d1 .dice2')).style.display = 'none';
  //   (document.querySelector('#d1 .dice3')).style.display = 'none';
  //   (document.querySelector('#d1 .dice4')).style.display = 'block';
  //   (document.querySelector('#d1 .dice5')).style.display = 'none';
  //   (document.querySelector('#d1 .dice6')).style.display = 'none';
  // } else if (dice1 == 5) {
  //   (document.querySelector('#d1 .dice1')).style.display = 'none';
  //   (document.querySelector('#d1 .dice2')).style.display = 'none';
  //   (document.querySelector('#d1 .dice3')).style.display = 'none';
  //   (document.querySelector('#d1 .dice4')).style.display = 'none';
  //   (document.querySelector('#d1 .dice5')).style.display = 'block';
  //   (document.querySelector('#d1 .dice6')).style.display = 'none';
  // } else if (dice1 == 6) {
  //   (document.querySelector('#d1 .dice1')).style.display = 'none';
  //   (document.querySelector('#d1 .dice2')).style.display = 'none';
  //   (document.querySelector('#d1 .dice3')).style.display = 'none';
  //   (document.querySelector('#d1 .dice4')).style.display = 'none';
  //   (document.querySelector('#d1 .dice5')).style.display = 'none';
  //   (document.querySelector('#d1 .dice6')).style.display = 'block';
  // }
}

function isAzar(launchDiceResult) {
  var sum = launchDiceResult.sum;
  return (sum >= 3 && sum <= 6) || (sum >= 15 && sum <= 18);
}

function displaySC(player){
  const message = `${player.name} reçoit ${player.scoreChance} comme score de chance.`;
  addMessageToElem(results, message);
  player.playerSC.innerHTML = player.scoreChance;
}

function displayPlayerResult(player, SC){
  let message = `${player.name} joue, ${SC.message}`;
  let is_azar = isAzar(SC);
  message += is_azar ? " : Azar!" : " : Chance!";
  addMessageToElem(results, message);
}

function addMessageToElem(elem, message) {
  var p = document.createElement("p");
  var node = document.createTextNode(message);
  p.appendChild(node);
  elem.appendChild(p);
}