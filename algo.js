var isInitPhase = true;
var isBattlePhase = true;
var beginnerIndex = 0;

const new_game = document.getElementById("new_game");
const wilfied = document.getElementById("wilfied");
const herevald = document.getElementById("herevald");
const playerButtons = [wilfied, herevald];

const wilfiedSC = document.getElementById("wilfiedSC");
const herevaldSC = document.getElementById("herevaldSC");

function Player(name, score, sc, bs) {
  this.name = name;
  this.scoreChance = score;
  this.playerSC = sc;
  this.battlescore = bs;
}

Player.prototype.displayPlayerResult = function() {
  let message = `${this.name} joue, ${launchDiceResult.message}`;
  let is_azar = isAzar();
  message += is_azar ? " : Azar!" : " : Chance!";
  addMessageToElem(results, message);
};

Player.prototype.displayBattleResult = function() {
  let message = `${this.name} joue, ${launchDiceResult.message}`;
  message += " : Battle!";
  addMessageToElem(results, message);
};

var player1 = new Player("wilfied", 0, wilfiedSC, 0);
var player2 = new Player("herevald", 0, herevaldSC, 0);
var players = [player1, player2];

var beginnerPlayer = players[beginnerIndex];
var otherPlayer = players[(beginnerIndex+1)%2];

var launchDiceResult = {
  message : "",
  sum : 0
}

const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");

const results = document.getElementById("results");

new_game.addEventListener("click", ()  => {
  isInitPhase = true;
  isBattlePhase = true;
  results.innerHTML = "";

  beginnerIndex = (Math.floor(Math.random() * 6 ) + 1)%2;
  beginnerPlayer = players[beginnerIndex];
  otherPlayer = players[(beginnerIndex+1)%2];

  beginnerPlayer.scoreChance = 0;
  otherPlayer.scoreChance = 0;

  beginnerPlayer.battlescore = 0;
  otherPlayer.battlescore = 0;
  
  playerButtons.forEach(function(playerButton, index) {
    playerButton.disabled = index != beginnerIndex;
  });
  
  setDiceResults();
  wilfiedSC.innerHTML = "";
  herevaldSC.innerHTML = "";
  addMessageToElem(results, "Début de la battle");
});

playerButtons.forEach(function(player, index) {
  player.addEventListener("click", ()  => { 
    if (isBattlePhase) {
      handleBattlePhase(index);
    } else {
      play(index);
    }
  });
});

function handleBattlePhase(index){
  launchBattleDice();
  players[index].displayBattleResult();
  players[index].battlescore = launchDiceResult.sum;

  if (players[(index+1)%2].battlescore == 0 || players[index].battlescore == players[(index+1)%2].battlescore) {
    togglePlayers();
    return;
  };

  var winner = "";
  if (players[index].battlescore < players[(index+1)%2].battlescore) {
    togglePlayers();
    winner = `${players[(index+1)%2].name}`;
  } else {
    winner = `${players[index].name}`;
  }
  
  addMessageToElem(results, `Fin de la battle. ${winner} commence à jouer.`);
  addMessageToElem(results, "Début de la phase d'initialisation.");
  isBattlePhase = false;
}

function play(index){
  launchDice();
  players[index].displayPlayerResult();

  if (beginnerIndex == index){
    isInitPhase ? handleInitPhase() : checkWinner();
  } else {
    checkWinner();
  }
}

function handleInitPhase() {
  if (isAzar()) {
    displayWinner(otherPlayer.scoreChance ? otherPlayer : beginnerPlayer);
  } else {
    handleChance();
  }
}

function handleChance(){
  if (otherPlayer.scoreChance) {
    if(otherPlayer.scoreChance !== launchDiceResult.sum) {
      beginnerPlayer.scoreChance = launchDiceResult.sum;
      displaySC(beginnerPlayer);
      isInitPhase = false;
      addMessageToElem(results, "Fin de la phase d'initialisation.");
      togglePlayers();
    }
    else {
      otherPlayer.scoreChance = 0;
    }
  }
  else {
    otherPlayer.scoreChance = launchDiceResult.sum;
    displaySC(otherPlayer);
  }
}

function checkWinner(){
  if(otherPlayer.scoreChance === launchDiceResult.sum) {
    displayWinner(otherPlayer);
  }
  else if(beginnerPlayer.scoreChance === launchDiceResult.sum) {
    displayWinner(beginnerPlayer);
  }
  else { 
    togglePlayers();
  }
}

function togglePlayers(){
  playerButtons[0].disabled = !playerButtons[0].disabled;
  playerButtons[1].disabled = !playerButtons[1].disabled;
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

  launchDiceResult = {
    message : `${result1} + ${result2} + ${result3}, total ${total}`,
    sum : total
  };
}

function launchBattleDice() {
  var result1 = Math.floor(Math.random() * 6 ) + 1;

  launchDiceResult = {
    message : `${result1}`,
    sum : result1
  };
}

function setDiceResults() {
  if (arguments.length == 0) resetDiceResultsDice();
  for (let i=0; i<arguments.length; i++) setDiceResultsDice(arguments[i], i + 1);
}

function setDiceResultsDice(dice, diceIndex) {
  for (var i=1; i<=6; i++) {
    var query = `#d${diceIndex} .dice${i}`;
    (document.querySelector(query)).style.display = i == dice ? 'block' : 'none';
  }
}

function resetDiceResultsDice() {
  for (var i=1; i<=6; i++) {
    var query = `#d1 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
    query = `#d2 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
    query = `#d3 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
  }
}

function isAzar() {
  var sum = launchDiceResult.sum;
  return sum <= 6 || sum >= 15;
}

function displaySC(player){
  const message = `${player.name} reçoit ${player.scoreChance} comme score de chance.`;
  addMessageToElem(results, message);
  player.playerSC.innerHTML = player.scoreChance;
}

function addMessageToElem(elem, message) {
  var p = document.createElement("p");
  var node = document.createTextNode(message);
  p.appendChild(node);
  elem.appendChild(p);
}