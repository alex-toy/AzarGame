class GameLog {
    constructor() {
        this.logArea = document.getElementById("results");
    }

    addMessageToElem (message){
        var p = document.createElement("p");
        var node = document.createTextNode(message);
        p.appendChild(node);
        this.logArea.appendChild(p);
    }

    clearLogArea (){
        this.logArea.innerHTML = "";
    }
}
  
export default GameLog;
