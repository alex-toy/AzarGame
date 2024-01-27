var isInitPhase = true;
var isBattlePhase = true;
var beginnerIndex = 0;

function loadPage(href)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

//-------------------------------------------------------

function Dices(){
  this.dice1 = new Die("d1", 1);
  this.dice2 = new Die("d2", 2);
  this.dice3 = new Die("d3", 3);
  this.total = 0;
}

Dices.prototype.launchDices = function(){
  // a deplacer dans une fonction la somme des dés
  this.total = this.dice1.launchDice() + this.dice2.launchDice() + this.dice3.launchDice();
  //à déplcaer dans une fonction pour l'affichage
  this.message = `${this.dice1.diceValue} + ${this.dice2.diceValue} + ${this.dice3.diceValue}, total ${this.total}`;
  //return this.total;
};

Dices.prototype.isAzar = function() {
  return this.total <= 6 || this.total >= 15;
};

Dices.prototype.displayPlayerResult = function(name) {
  let message = `${name} joue, ${this.message}`;
  let is_azar = this.isAzar();
  message += is_azar ? " : Azar!" : " : Chance!";
};

//-------------------------------------------------------
function Die(elementId, positionInView){
  this.diceValue = 0;
  this.elementId = elementId;
  this.positionInView = positionInView;
  let d = document.getElementById(elementId);
  d.innerHTML = loadPage('dice.html');
}

Die.prototype.launchDice = function(){
  this.diceValue = Math.floor(Math.random() * 6 ) + 1;
  this.displayDiceResult();
  return this.diceValue;
}

Die.prototype.displayDiceResult = function(){
  for (var i=1; i<=6; i++) {
    var query = `#d${this.positionInView} .dice${i}`;
    (document.querySelector(query)).style.display = i == this.diceValue ? 'block' : 'none';
  }
}

//-------------------------------------------------------
function GameLog(){
  this.logArea = document.getElementById("results");
}

GameLog.prototype.addMessageToElem = function(message){
    var p = document.createElement("p");
    var node = document.createTextNode(message);
    p.appendChild(node);
    this.logArea.appendChild(p);
}

//-------------------------------------------------------
function Game(p1, p2){
  this.newGameButton = document.getElementById("new_game");
  this.players = [p1, p2];
  this.indexCurrentplayer = 0;
  this.gameLog = new GameLog();
  this.isInitPhase = true;
  this.isBattlePhase = true;
  this.beginnerIndex = 0;
  p1.gameLog = this.gameLog;
  p2.gameLog = this.gameLog;

  this.wilfied = document.getElementById("wilfied");
  this.herevald = document.getElementById("herevald");
  this.playerButtons = [wilfied, herevald];

  this.wilfiedSC = document.getElementById("wilfiedSC");
  this.herevaldSC = document.getElementById("herevaldSC");
  this.registerClickEvents();
};

Game.prototype.resetGame = function() {
  this.isInitPhase = true;
  this.isBattlePhase = true;
  this.indexCurrentplayer = 0;
  this.beginnerIndex = (Math.floor(Math.random() * 2 ) + 1)%2;
  this.beginnerPlayer = this.players[this.beginnerIndex];
  this.otherPlayer = this.players[(this.beginnerIndex+1)%2];
  
  this.beginnerPlayer.scoreChance = 0;
  this.otherPlayer.scoreChance = 0;

  this.beginnerPlayer.battlescore = 0;
  this.otherPlayer.battlescore = 0;

  this.players[this.beginnerIndex].playerButton.disabled = false;
  this.players[(this.beginnerIndex++)%2].playerButton.disabled = true;
  
  // this.playerButtons.forEach(function(playerButton, index) {
  //   playerButton.disabled = index != beginnerIndex;
  // });
  
  this.setDiceResults();
  this.wilfiedSC.innerHTML = "";
  this.herevaldSC.innerHTML = "";
  this.gameLog.addMessageToElem("Début de la battle");
}

Game.prototype.checkWinner = function() {
  if(this.players[0].scoreChance === this.players[this.indexCurrentplayer].dices.total) {
    this.displayWinner(this.players[0]);
  }
  else if(this.players[1].scoreChance === this.players[this.indexCurrentplayer].dices.total) {
    this.displayWinner(this.players[1]);
  }
  else { 
    this.togglePlayers();
  }
}

Game.prototype.displayWinner = function(winnerPlayer) {
  this.players[0].playerButton.disabled = true;
  this.players[1].playerButton.disabled = true;
  message = `The winner is ${winnerPlayer.name}`;
  this.gameLog.addMessageToElem(message);
}

Game.prototype.togglePlayers = function(){
  this.players[0].playerButton.disabled = !this.players[0].playerButton.disabled;
  this.players[1].playerButton.disabled = !this.players[1].playerButton.disabled;
}

Game.prototype.setDiceResults = function() {
  if (arguments.length == 0) this.resetDiceResultsDice();
  for (let i=0; i<arguments.length; i++) this.setDiceResultsDice(arguments[i], i + 1);
}

Game.prototype.setDiceResultsDice = function(dice, diceIndex) {
  for (var i=1; i<=6; i++) {
    var query = `#d${diceIndex} .dice${i}`;
    (document.querySelector(query)).style.display = i == dice ? 'block' : 'none';
  }
}

Game.prototype.resetDiceResultsDice = function() {
  for (var i=1; i<=6; i++) {
    var query = `#d1 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
    query = `#d2 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
    query = `#d3 .dice${i}`;
    (document.querySelector(query)).style.display = 'none';
  }
}

Game.prototype.registerClickEvents = function() {
  this.newGameButton.addEventListener("click", ()  => {
    this.resetGame();
    // this.startGame();
  });
  this.players[0].registerClickEvents();
  this.players[1].registerClickEvents();
}


Game.prototype.play = function() {
  // this.resetGame();
  this.startGame();
}

Game.prototype.startGame = function() {
  this.players[this.beginnerIndex].dices.launchDices();
  this.players[this.beginnerIndex].dices.displayPlayerResult();
  this.gameLog.addMessageToElem(this.players[this.beginnerIndex].dices);

  // if (beginnerIndex == index){
  //   isInitPhase ? handleInitPhase() : checkWinner();
  // } else {
  //   checkWinner();
  // }

  isInitPhase ? this.handleInitPhase() : this.checkWinner();
  this.checkWinner();
}

Game.prototype.handleChance = function(){
  var otherPlayer = this.players[(this.indexCurrentplayer++)%2]
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
    otherPlayer.scoreChance = this.otherPlayer.dices.total;
    otherPlayer.displaySC();
  }
}

Game.prototype.handleInitPhase = function() {
  if (this.players[this.beginnerIndex].dices.isAzar()) {
    var current = this.players[this.beginnerIndex];
    var other = this.players[(this.beginnerIndex++)%2];
    this.displayWinner(other.scoreChance ? other : current);
  } else {
    this.handleChance();
  }
}

//-------------------------------------------------------
function Player(name) {
  this.name = name;
  this.scoreChance = 0;
  this.playerSC = document.getElementById(`${name}SC`);
  this.playerButton = document.getElementById(name);
  this.battlescore = 0;
  this.dices = new Dices();
  this.gameLog = {};
};

Player.prototype.launchDices = function() {
  this.dices.launchDices();
  var result = `${this.dices.dice1.diceValue} + ${this.dices.dice2.diceValue} + ${this.dices.dice3.diceValue}, total ${this.dices.total}`;
  let message = `${this.name} joue, ${result}`;
  let is_azar = this.dices.isAzar();
  message += is_azar ? " : Azar!" : " : Chance!";
  this.gameLog.addMessageToElem(message);
};

Player.prototype.displaySC = function(){
  const message = `${this.name} reçoit ${this.scoreChance} comme score de chance.`;
  this.gameLog.addMessageToElem(message);
  this.playerSC.innerHTML = this.scoreChance;
};

Player.prototype.registerClickEvents = function() {
  this.playerButton.addEventListener("click", ()  => {
    var isBattlePhase = false;
    if (isBattlePhase) {
      this.handleBattlePhase();
    } else {
      this.play();
    }
  });
};


//-------------------------------------------------------
//-------------------------------------------------------
var player1 = new Player("wilfied");
var player2 = new Player("herevald");
var game = new Game(player1, player2);