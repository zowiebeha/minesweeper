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
            const matrix = properties.gameReference.tileMatrix;
            
            // x = row
            // y = column
            rowLoop: for (let x = 0; x < matrix.length; x++) {
                columnLoop: for (let y = 0; y < matrix[x].length; y++) {
                    // not using `this` in this function
                    if (matrix[x][y].buttonElement === properties.buttonElement) {
                        tileX = x;
                        tileY = y;
                        break rowLoop;
                    }
                }
            }
            
            if (tileX === undefined || tileY === undefined) {
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
            const tileAbove = properties.getTileAt(tileX, tileY - 1);
            const tileBelow = properties.getTileAt(tileX, tileY + 1);
            const tileLeft = properties.getTileAt(tileX - 1, tileY);
            const tileRight = properties.getTileAt(tileX + 1, tileY);
            
            debugger;
            
            // Don't trigger bombs around the revealed tile
            // == or === works against undefined, since undefined ==[=] undefined and to null, but to no other type.
            if (tileAbove?.isBomb === false) {
                tileAbove.reveal();
            }
            if (tileBelow?.isBomb === false) {
                tileBelow.reveal();
            }
            if (tileLeft?.isBomb === false) {
                tileLeft.reveal();
            }
            if (tileRight?.isBomb === false) {
                tileRight.reveal();
            }
        }
    };
    
    properties.getTileAt = function(x, y) {
        // I need TypeScript...
        if (x === null || x === undefined) {
            throw new Error("getTileAt missing x argument.");
        }
        if (y === null || y === undefined) {
            throw new Error("getTileAt missing y argument.");
        }
        if (typeof x != "number") {
            throw new Error("getTileAt x argument must be a numeric integer.");
        }
        if (typeof y != "number") {
            throw new Error("getTileAt y argument must be a numeric integer.");
        }
        // No decimals allowed
        if (x % 1) {
            throw new Error("getTileAt x argument must be an integer.");
        }
        if (y % 1) {
            throw new Error("getTileAt y argument must be an integer.");
        }
        
        const matrix = properties.gameReference.tileMatrix;
        
        // If the tile to the left of the current is out of bounds, we'll need to return undefined
        // ... instead of attempting to perform array access on undefined.
        return matrix[x]?.[y];    
    }
    
    return properties;
}

export default Tile;