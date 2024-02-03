import Die from './Die.js';

class Dices {
    constructor() {
        this.dice1 = new Die("d1", 1);
        this.dice2 = new Die("d2", 2);
        this.dice3 = new Die("d3", 3);
        this.total = 0;
    }
  
    launchDices (){
      this.total = this.dice1.launchDice() + this.dice2.launchDice() + this.dice3.launchDice();
      this.message = `${this.dice1.diceValue} + ${this.dice2.diceValue} + ${this.dice3.diceValue}, total ${this.total}`;
    };
    
    isAzar () {
      return this.total <= 6 || this.total >= 15;
    };
    
    displayPlayerResult (name) {
      let message = `${name} joue, ${this.message}`;
      let is_azar = this.isAzar();
      message += is_azar ? " : Azar!" : " : Chance!";
    };
  }
  
export default Dices;