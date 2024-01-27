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
  this.total = this.dice1.launchDice() + this.dice2.launchDice() + this.dice3.launchDice();
  this.message = `${this.dice1.diceValue} + ${this.dice2.diceValue} + ${this.dice3.diceValue}, total ${this.total}`;
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

GameLog.prototype.clearLogArea = function(){
    this.logArea.innerHTML = "";
}

//-------------------------------------------------------
function Game(p1, p2){
  this.newGameButton = document.getElementById("new_game");
  this.players = [p1, p2];
  this.indexCurrentplayer = 0;
  this.gameLog = new GameLog();
  this.isInitPhase = true;
  this.isBattlePhase = true;
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
  this.indexCurrentplayer = (Math.floor(Math.random() * 2 ) + 1)%2;
  this.currentPlayer = this.players[this.indexCurrentplayer];
  this.otherPlayer = this.players[(this.indexCurrentplayer+1)%2];

  this.currentPlayer.scoreChance = 0;
  this.currentPlayer.battlescore = 0;
  this.currentPlayer.dices.total = 0;

  this.otherPlayer.scoreChance = 0;
  this.otherPlayer.battlescore = 0;
  this.otherPlayer.dices.total = 0;
  
  this.currentPlayer.playerButton.removeAttribute("disabled");
  this.otherPlayer.playerButton.setAttribute("disabled", "true");
  
  this.setDiceResults();
  this.wilfiedSC.innerHTML = "";
  this.herevaldSC.innerHTML = "";
  this.gameLog.clearLogArea();
  this.gameLog.addMessageToElem("Début de la battle");
}

Game.prototype.displayWinner = function(winnerPlayer) {
  this.players[0].playerButton.disabled = true;
  this.players[1].playerButton.disabled = true;
  message = `The winner is ${winnerPlayer.name}`;
  this.gameLog.addMessageToElem(message);
}

Game.prototype.togglePlayers = function(){
  this.indexCurrentplayer = (this.indexCurrentplayer+1)%2;
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
  });
  
  this.playerButtons.forEach(playerButton => {
    playerButton.addEventListener("click", ()  => {
      if (this.isBattlePhase) {
        this.handleBattlePhase();
      } else if (this.isInitPhase) {
        this.handleInitPhase();
      } else {
        this.handleChance();
      }
    });
  });
}

Game.prototype.handleBattlePhase = function() {
  this.players[this.indexCurrentplayer].launchBattleDice();
  this.players[this.indexCurrentplayer].displayBattleResult();

  var otherPlayerHasPlayed = this.players[(this.indexCurrentplayer+1)%2].battlescore > 0;
  var battleEquality = this.players[this.indexCurrentplayer].battlescore == this.players[(this.indexCurrentplayer+1)%2].battlescore;

  if (!otherPlayerHasPlayed || battleEquality) {
    game.togglePlayers();
    return;
  };

  this.displayBattleWinner();
  
  this.isBattlePhase = false;
}

Game.prototype.handleInitPhase = function() {
  var currentPlayer = this.players[this.indexCurrentplayer];
  var otherPlayer = this.players[(this.indexCurrentplayer+1)%2];
  var isFirstLaunch = currentPlayer.dices.total == 0;

  if (isFirstLaunch) {
    currentPlayer.launchDices();
    if (currentPlayer.dices.isAzar()) {
      this.displayWinner(this.players[this.indexCurrentplayer]);
    } else {
      otherPlayer.scoreChance = currentPlayer.dices.total;
      otherPlayer.displaySC();
    }
  } else {
    var currentPlayerScoreChance = otherPlayer.scoreChance;
    currentPlayer.launchDices();
    if (currentPlayer.dices.isAzar()) {
      this.displayWinner(this.players[(this.indexCurrentplayer+1)%2]);
    } else {
      if (currentPlayer.dices.total == currentPlayerScoreChance){
        currentPlayer.dices.total = 0;
        currentPlayer.scoreChance = 0;
        otherPlayer.scoreChance = 0;
        otherPlayer.dices.total = 0;
      } else {
        currentPlayer.scoreChance = currentPlayer.dices.total;
        currentPlayer.displaySC();
        this.togglePlayers();
        this.isInitPhase = false;
        this.gameLog.addMessageToElem("Fin de la phase d'initialisation.");
      }
    }
  }
}

Game.prototype.handleChance = function(){
  var currentPlayer = this.players[this.indexCurrentplayer];
  var otherPlayer = this.players[(this.indexCurrentplayer+1)%2];

  currentPlayer.launchDices();

  if (currentPlayer.dices.total == otherPlayer.scoreChance) {
    this.displayWinner(otherPlayer);
  }
  else if (currentPlayer.dices.total == currentPlayer.scoreChance) {
    this.displayWinner(currentPlayer);
  } else {
    this.togglePlayers();
  }
}

Game.prototype.displayBattleWinner = function() {
  var winner = "";
  if (this.players[this.indexCurrentplayer].battlescore < this.players[(this.indexCurrentplayer+1)%2].battlescore) {
    winner = `${this.players[(this.indexCurrentplayer+1)%2].name}`;
    this.togglePlayers();
  } else {
    winner = `${this.players[this.indexCurrentplayer].name}`;
  } 
  
  this.gameLog.addMessageToElem(`Fin de la battle. ${winner} commence à jouer.`);
  this.gameLog.addMessageToElem("Début de la phase d'initialisation.");
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


Player.prototype.launchBattleDice = function() {
  this.battlescore = Math.floor(Math.random() * 6 ) + 1;
}

Player.prototype.displayBattleResult = function() {
  let message = `${this.name} joue, ${this.battlescore} : Battle!`;
  this.gameLog.addMessageToElem(message);
};


//-------------------------------------------------------
//-------------------------------------------------------
var player1 = new Player("wilfied");
var player2 = new Player("herevald");
var game = new Game(player1, player2);
