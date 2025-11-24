function Tile(gameReference) {
    this._gameReference = gameReference;
    
    this.isRevealed = false;
    this.isFlagged = false;
    
    // Todo: I'll implement a better algorithm after the assignment.
    this.isBomb = Math.random() > Math.random();
    
    // Setup tile style 😎
    this.classList.add('tile');
    
    this.toggleFlag = function() {
        if (isRevealed) {
            throw new Error("Cannot toggle flag for a revealed tile!")
        }
        
        this.isFlagged = !this.isFlagged;
        this.classList.toggle('tile--flagged');
    };
    
    this.reveal = function () {
        this.isRevealed = true;
        
        if (tileElement.isBomb) {
            tileElement.classList.add('tile--bombed');
            
            this._gameReference._loseGame();
        }
        else {
            this.classList.toggle('tile--reveal');
            
            // recursively reveal based on tile matrix
            // ...
            // this._gameReference.tileMatrix
        }
    };
}

Object.setPrototypeOf(Tile, HTMLButtonElement);

export default Tile;