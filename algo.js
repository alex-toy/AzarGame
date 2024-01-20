var isInitPhase = true;
var beginnerIndex = 1;

const new_game = document.getElementById("new_game");
const wilfied = document.getElementById("wilfied");
const herevald = document.getElementById("herevald");
const playerButtons = [wilfied, herevald];

const wilfiedSC = document.getElementById("wilfiedSC");
const herevaldSC = document.getElementById("herevaldSC");

function Player(name, score, sc) {
  this.name = name;
  this.scoreChance = score;
  this.playerSC = sc;
}

Player.prototype.displayPlayerResult = function() {
  let message = `${this.name} joue, ${launchDiceResult.message}`;
  let is_azar = isAzar(launchDiceResult);
  message += is_azar ? " : Azar!" : " : Chance!";
  addMessageToElem(results, message);
};

var player1 = new Player("wilfied", 0, wilfiedSC);
var player2 = new Player("herevald", 0, herevaldSC);
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
  results.innerHTML = "";
  
  playerButtons.forEach(function(player, index) {
    player.disabled = index != beginnerIndex;
  });
  
  beginnerPlayer.scoreChance = 0;
  otherPlayer.scoreChance = 0;
  
  setDiceResults();
  wilfiedSC.innerHTML = "";
  herevaldSC.innerHTML = "";
});

playerButtons.forEach(function(player, index) {
  player.addEventListener("click", ()  => { 
    play(index);
  });
});

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
      playerButtons[beginnerIndex] = true;
      playerButtons[(beginnerIndex+1)%2] = false;
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

  launchDiceResult = {
    message : `${result1} + ${result2} + ${result3}, total ${total}`,
    sum : total
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

function resetDiceResultsDice(diceIndex) {
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