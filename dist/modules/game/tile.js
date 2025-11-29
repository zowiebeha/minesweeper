function Tile(gameReference) {
    this._gameReference = gameReference;
    
    if (!Tile.gameReference) {
        Tile.gameReference = gameReference;
    }
    
    this.isRevealed = false;
    this.isFlagged = false;
    
    // Todo: I'll implement a better algorithm after the assignment.
    this.isBomb = Math.random() > Math.random();
    
    if (!this.prototype.classList) {
        throw new Error("Tile's inheritance of HTMLButtonElement failed.");
    }
    
    // Setup tile style 😎
    this.classList.add('tile');
    
    this.toggleFlag = function() {
        if (isRevealed) {
            throw new Error("Cannot toggle flag for a revealed tile!")
        }
        
        this.isFlagged = !this.isFlagged;
        this.classList.toggle('tile--flagged');
    };
    
    this.getCoordinates = function() {
            let tileX, tileY;
            const matrix = this.gameReference.tileMatrix;
            for (let x=0; x < matrix.length; x++) {
                for (let y=0; y < matrix[x].length; y++) {
                    if (matrix[x][y] === this) {
                        tileX = x;
                        tileY = y;
                    }
                }
            }
            
            if (!tileX || !tileY) {
                throw new Error('Tile not found in matrix');
            }
            
            return [tileX, tileY];
    }
    
    this.reveal = function () {
        this.isRevealed = true;
        
        if (tileElement.isBomb) {
            tileElement.classList.add('tile--bombed');
            
            this._gameReference._loseGame();
        }
        else {
            this.classList.toggle('tile--reveal');
            
            const [tileX, tileY] = this.getCoordinates();
            
            // Might be null if out of index is out of bounds.
            // Nullish checks below will properly handle that case.
            const tileAbove = Tile.getTileAt(tileX, tileY - 1);
            const tileBelow = Tile.getTileAt(tileX, tileY + 1);
            const tileLeft = Tile.getTileAt(tileX - 1, tileY);
            const tileRight = Tile.getTileAt(tileX + 1, tileY);
            
            // Don't trigger bombs around the revealed tile
            if (!tileAbove?.isBomb) {
                tileAbove.reveal();
            }
            if (!tileBelow?.isBomb) {
                tileBelow.reveal();
            }
            if (!tileLeft?.isBomb) {
                tileLeft.reveal();
            }
            if (!tileRight?.isBomb) {
                tileRight.reveal();
            }
        }
    };
}

Object.setPrototypeOf(Tile.prototype, HTMLButtonElement);

console.log(Tile.prototype,Tile.prototype.prototype)

// Static method
Tile.getTileAt = function(x, y) {
    if (!Tile.gameReference) {
        throw new Error("An instance of the Tile must be made for the Tile Function's gameReference to be created.");
    }
    
    const matrix = this.gameReference.tileMatrix;
    
    return matrix[x][y];    
}

export default Tile;