class Die {
  constructor(elementId, positionInView) {
    this.elementId = elementId;
    this.positionInView = positionInView;
    this.diceValue = 0;
    let d = document.getElementById(elementId);
    d.innerHTML = loadPage();
  }

  loadPage()
  {
    const href = 'dice.html';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", href, false);
      xmlhttp.send();
      return xmlhttp.responseText;
  }

  launchDice (){
    this.diceValue = Math.floor(Math.random() * 6 ) + 1;
    this.displayDiceResult();
    return this.diceValue;
  }
  
  displayDiceResult (){
    for (var i=1; i<=6; i++) {
      var query = `#d${this.positionInView} .dice${i}`;
      (document.querySelector(query)).style.display = i == this.diceValue ? 'block' : 'none';
    }
  }
}

module.exports = Die;