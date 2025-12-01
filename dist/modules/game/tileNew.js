function Tile(gameReference) {
    if (new.target) {
        throw new Error("Tile should be called with regular invocation, not constructor instantiation.");
    }
    
    
    if (!gameReference) {
        throw new Error("gameReference argument required to invoke Tile function.")
    }
    
    const properties = {};
    
    properties.gameReference = gameReference;
    
    properties.buttonElement = document.createElement('button');
    // Setup tile style 😎
    properties.buttonElement.classList.add('tile');
    
    properties.isRevealed = false;
    properties.isFlagged = false;
    // Todo: I'll implement a better algorithm after the assignment.
    properties.isBomb = Math.random() > Math.random();

    properties.toggleFlag = function() {
        if (isRevealed) {
            throw new Error("Cannot toggle flag for a revealed tile!")
        }
        
        properties.isFlagged = !properties.isFlagged;
        properties.buttonElement.classList.toggle('tile--flagged');
    };
    
    properties.getCoordinates = function() {
            let tileX, tileY;
            const matrix = Tile.gameReference.tileMatrix;
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
    
    properties.reveal = function () {
        properties.isRevealed = true;
        
        if (properties.buttonElement.isBomb) {
            properties.buttonElement.classList.add('tile--bombed');
            
            properties.gameReference._loseGame();
        }
        else {
            properties.buttonElement.classList.toggle('tile--reveal');
            
            const [tileX, tileY] = properties.getCoordinates();
            
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
    
    properties.getTileAt = function(x, y) {
        const matrix = properties.gameReference.tileMatrix;
        
        return matrix[x][y];    
    }
    
    return properties;
}

export default Tile;