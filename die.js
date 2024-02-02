class Die {
  constructor(name, age, car) {
      this.name = name;
      this.age = age;
      this.car = car; // Car object as a field for User
  }
}


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