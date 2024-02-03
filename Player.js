class Player {
  constructor(name) {
    this.name = name;
    this.scoreChance = 0;
    this.playerSC = document.getElementById(`${name}SC`);
    this.playerButton = document.getElementById(name);
    this.battlescore = 0;
    this.dices = new Dices();
    this.gameLog = new GameLog();
  }
  
  launchDices() {
    this.dices.launchDices();
    var result = `${this.dices.dice1.diceValue} + ${this.dices.dice2.diceValue} + ${this.dices.dice3.diceValue}, total ${this.dices.total}`;
    let message = `${this.name} joue, ${result}`;
    let is_azar = this.dices.isAzar();
    message += is_azar ? " : Azar!" : " : Chance!";
    this.gameLog.addMessageToElem(message);
  };
  
  displaySC(){
    const message = `${this.name} reçoit ${this.scoreChance} comme score de chance.`;
    this.gameLog.addMessageToElem(message);
    this.playerSC.innerHTML = this.scoreChance;
  };
  
  
  launchBattleDice() {
    this.battlescore = Math.floor(Math.random() * 6 ) + 1;
  }
  
  displayBattleResult() {
    let message = `${this.name} joue, ${this.battlescore} : Battle!`;
    this.gameLog.addMessageToElem(message);
  };
}

module.exports = Player;
