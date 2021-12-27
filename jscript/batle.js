let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {  
        let cell = document.getElementById(location);
        console.log(cell);
        cell.setAttribute("class","hit");
        
    },

    displayMiss: function (location) {
        let cell = document.getElementById(location);
        console.log(cell);
        cell.setAttribute("class", "miss");
    }
}


let model = {
    boardSize : 7,
    numShips : 3,
    shipsLenght : 3,
    shipsSunk : 0,
    
    ships : [
        { locations: ["0", "0", "0"], hits:["","",""] },
        { locations: ["0", "0", "0"], hits:["","",""] },
        { locations: ["0", "0", "0"], hits:["","",""] }
    ],

    fire : function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            
            let index = ship.locations.indexOf(guess);
            console.log(guess);
            console.log(index);
            if ( index >= 0 ) {
                console.log("index");
                ship.hits[index]="hit";
                view.displayHit(guess);
                view.displayMessage("Попал");
                if (this.isSunk(ship)) {
                    view.displayMessage("потоп");
                    this.shipsSunk++; 
                }
                return true;
            } 
        }
        view.displayMessage("мимо");
        view.displayMiss(guess);
        return false;

    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipsLenght; i++) {
            if ( ship.hits[i]!=="hit" ) {
                return false;
            }            
        }
        return true;
    },

    generateShipsLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations))  
            this.ships[i].locations = locations;        
        }   
    },

    generateShip: function() {
        let direction = Math.floor(Math.random()*2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipsLenght))
        } else {

            row = Math.floor(Math.random() * (this.boardSize - this.shipsLenght))
            col = Math.floor(Math.random() * this.boardSize)
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipsLenght; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col+i));
            } else {
                newShipLocations.push((row + i )+ "" + col );
            }
            
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

}

let controller = {
     guesses: 0,
     processGuess: function(guess) {
        let location = parseGuess(guess);
        
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMiss("game over");
            } 
        }
     }
}

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if (guess===null || guess.length !== 2) {
        alert("error");
    }    else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("error");
        } else if (row < 0 || row > model.boardSize || column < 0 || column > model.boardSize) {
            alert("error");
        } else {
            return row+column;
        }
    
    }
    return null;
}

function init() {
    let firebutton = document.getElementById("fireButton");
    firebutton.onclick = handleFireButton;

    let guessInput = document.getElementById("guessInput");
    console.log(guessInput);
    // guessInput.onkeypress = handleKeyPress;
    guessInput.onkeydown = handleKeyPress;
    model.generateShipsLocations();
}

function handleFireButton(params) {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
   
    controller.processGuess(guess);
    guessInput.value = "";
    
}

function handleKeyPress(e) {
    
    let firebutton = document.getElementById("fireButton");
    if ( e.keyCode === 13 ) {
        console.log("wwwww");
        firebutton.onclick();
        return false;
    }
}

window.onload = init;