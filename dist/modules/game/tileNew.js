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
    properties.isBomb = Math.random() < Math.random() / 3;
    
    properties.toggleFlag = function() {
        if (properties.isRevealed) {
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
        // Don't reveal already revealed adjacent tiles
        if (properties.isRevealed) {
            return;
        }
        
        properties.isRevealed = true;
        
        if (properties.isBomb) {
            properties.buttonElement.classList.add('tile--bombed');
            
            properties.gameReference._loseGame();
        }
        else {
            // diagonal tiles to ones with 0 bombs around them aren't revealed because...
            // ...
            // so we can reveal them to reduce unnecessary clicks and make the game harder
            properties.buttonElement.classList.toggle('tile--revealed');
            
            const [tileX, tileY] = properties.getCoordinates();
            
            // Might be null if out of index is out of bounds.
            // Nullish checks for reveals will properly handle that case.
            const tileAbove = properties.getTileAt(tileX, tileY - 1);
            const tileBelow = properties.getTileAt(tileX, tileY + 1);
            const tileLeft = properties.getTileAt(tileX - 1, tileY);
            const tileRight = properties.getTileAt(tileX + 1, tileY);
            
            const adjacentTiles = [
                tileAbove,
                tileBelow,
                tileLeft,
                tileRight,
                properties.getTileAt(tileX - 1, tileY - 1), // top left
                properties.getTileAt(tileX + 1, tileY - 1), // top right
                properties.getTileAt(tileX + 1, tileY + 1), // bottom right
                properties.getTileAt(tileX - 1, tileY + 1), // bottom left
            ];
            
            // we could optimize this by calculating it first when the board is generated...
            let adjacentBombCount = 0;
            for (const tile of adjacentTiles) {
                // Sometimes an adjacent tile might not exist if it would be beyond the game board:
                if (tile) {
                    if (tile.isBomb) {
                        adjacentBombCount++;
                    }
                }
            }
            
            // Reveal unless a bomb is adjacent.
            // This prevents one click from revealing the whole board apart from mines
            // ... and safe tiles surrounded by mines.
            if (adjacentBombCount == 0) {                
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
            else if (adjacentBombCount > 0) {
                // Set visual for number of bombs adjacent to tile
                properties.buttonElement.classList.add(`number--${adjacentBombCount}`);
                properties.buttonElement.textContent = adjacentBombCount;
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