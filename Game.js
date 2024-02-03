const GameLog = require('./GameLog');

class Game {
  constructor(p1, p2) {
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
  }

  resetGame() {
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
  
  displayWinner(winnerPlayer) {
    this.players[0].playerButton.disabled = true;
    this.players[1].playerButton.disabled = true;
    message = `The winner is ${winnerPlayer.name}`;
    this.gameLog.addMessageToElem(message);
  }
  
  togglePlayers(){
    this.indexCurrentplayer = (this.indexCurrentplayer+1)%2;
    this.players[0].playerButton.disabled = !this.players[0].playerButton.disabled;
    this.players[1].playerButton.disabled = !this.players[1].playerButton.disabled;
  }
  
  setDiceResults() {
    if (arguments.length == 0) this.resetDiceResultsDice();
    for (let i=0; i<arguments.length; i++) this.setDiceResultsDice(arguments[i], i + 1);
  }
  
  setDiceResultsDice(dice, diceIndex) {
    for (var i=1; i<=6; i++) {
      var query = `#d${diceIndex} .dice${i}`;
      (document.querySelector(query)).style.display = i == dice ? 'block' : 'none';
    }
  }
  
  resetDiceResultsDice() {
    for (var i=1; i<=6; i++) {
      var query = `#d1 .dice${i}`;
      (document.querySelector(query)).style.display = 'none';
      query = `#d2 .dice${i}`;
      (document.querySelector(query)).style.display = 'none';
      query = `#d3 .dice${i}`;
      (document.querySelector(query)).style.display = 'none';
    }
  }
  
  registerClickEvents() {
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
  
  handleBattlePhase() {
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
  
  handleInitPhase() {
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
  
  handleChance(){
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
  
  displayBattleWinner() {
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
}

module.exports = Game;
