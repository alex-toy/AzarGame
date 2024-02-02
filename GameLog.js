




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
  