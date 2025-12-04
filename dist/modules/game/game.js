import Tile from "./tileNew.js";

// Prototypal inheritance is very verbose when it comes to
// ... mimicking the object-oriented requirements of complexity.
// JS was not designed to support the complexity that OOP allows for.
// Thus, some features may not be possible, or at the very least sane.
// So, the class system was designed to act as both a wrapper over prototypal inheritance,
// ... and to do some internal magic to pretend like class behavior exists in JS.

// I'll switch to the fake OOP after the assignment.

// Or maybe the imperfect and, at times, incorrect book YDKJS can assist?

function Game(settings) {
    /////////////////////////////////////
    // Encapsulated Element References //
    /////////////////////////////////////
    
    // How to provide override-able private state for functions which inherit this function,
    // while safe-guarding against a re-definition of the symbol itself in the succeeding class?
    // idk...
    // Python doesn't have this. It has name-mangling, but it's only convention.
    // I guess it's the responsibility of the consumer of this code to not mess it up.
    
    // And also the class system was developed to fix this design flaw in JS.
    
    // For now, everything is encapsulated.
    // Why use symbols though?
    
    // Syntactically, we need `this` to be present during the definition of a function
    // .. for the function to have access to `this` state.
    // But we don't want a key that is publicly accessibly (like a sring).
    // So, we use a symbol.
    // Yep, JS sucks. All the homies are not so fond of JS compared to Python or C#.
    
    // The amount one must consider to properly handle the `this` keyword during development
    // ... is nothing short of poor design. Classes definitely simplify things...
    
    // _gameContainerElement
    // const gameContainerElementSymbol = Symbol('gameContainerElement');
    // this[gameContainerElementSymbol] = document.getElementById('game-container');
    // const _gameContainerElement = this[gameContainerElementSymbol]
    
    // In JS, we only get encapsulation privacy, convention-based privacy (this._<name>), and
    // ... again convention-based privacy (this.private = {...}, this.public = {...}).
    // That is, until fake classes were added.
    
    // I could use encapsulation and not understand how to implement private variables,
    // .. or I could just use convention:
    
    ////////////////////////////
    // Encapsulated Variables //
    ////////////////////////////
    
    const _GAME_OVER_IMG_PATH = "./assets/img/game_over.png";
    const _NEW_GAME_IMG_PATH = "./assets/img/game_good.png";
    const _WON_GAME_IMG_PATH = "./assets/img/game_win.gif";
     
    const _gameContainerElement = document.getElementById('game-container');
    const _flagCounterElement = _gameContainerElement.querySelector('#flag-counter');
    const _timerElement = _gameContainerElement.querySelector('#timer');
    const _newGameButton = _gameContainerElement.querySelector('#btn--new-game');
    const _newGameButtonImage = _newGameButton.querySelector('.icon');
    const _gameBoardElement = _gameContainerElement.querySelector('#game-board');
    
    // JavaScript is an insane language made for the mentally deranged:
    const fuckThis = this;
    
    let _currentTime = 0;
    const _startingFlags = 40; // Around (9x9) / 2
    let _flagsAvailable; // This is initialized in newGame()
    
    //////////////////////
    // Public Variables //
    //////////////////////
    
    // Used to reveal adjacent tiles
    this.tileMatrix = [
        // ....
    ];
    
    // n x n
    const boardLength = settings.GRID_LENGTH;
    
    // Each tile is 2rem in length
    _gameBoardElement.style.width = `${boardLength * 2}rem`;
    _gameBoardElement.style.height = `${boardLength * 2}rem`;
    
    /*
        // Better?:
        // this would be easier to write. I could use getters/setters.
        // such complexity for something so simple in other languages. it isn't pure.
        const gameThis = this;
        this.publicState = {

        };
    */
    
    //////////////////////////
    // Encapsulated Methods //
    //////////////////////////
    
    // Note to self: arrow functions are weird with the `this` keyword...
    // An in-depth understanding of Classes will assist me in understanding
    // ... `this`'s specification details.
    
    // We could instead use a user-defined board size in the next version.
    const _tilesInMatrix = boardLength * boardLength;
    this.checkWinCondition = function() {
        // Don't run the algorithm and win code if we already won.
        // Makes this method idempotent, which is needed since tiles will reveal themselves
        // ... in crawl batches and then call this method, at which point all tiles may be revealed.
        // This can cause the method to be called multiple times.
        // Is there an optimization we can make to not do that?
        if (fuckThis.won)
            return;
        
        let bombTiles = 0; // We can instead cache this upon generation
        let revealedTiles = 0; // We can keep track of how many tiles are revealed with state instead
        
        for (const row of fuckThis.tileMatrix) {
            for (const tile of row) {
                if (tile.isRevealed) {
                    revealedTiles++;
                }
                else if (tile.isBomb) {
                    bombTiles++;
                }
                
                if (revealedTiles + bombTiles == _tilesInMatrix) {
                    fuckThis._winGame();
                }
            }
        }
    }
    
    this._showBombs = function() {
        for (const row of fuckThis.tileMatrix) {
            for (const tile of row) {
                if (tile.isBomb && !tile.isRevealed) {
                    tile.buttonElement.classList.add('tile--bomb');
                }
            }
        }
    }
    
    this._onTileLeftClick = function(event) {
        // Begin timer on first click
        if (timerIntervalID === undefined) {
            // Start timer
            fuckThis._beginTimer();
        }
        
        const clickedButtonElement = event.target;
        
        const tile = fuckThis._findTileFromButton(clickedButtonElement);
        
        // Will also reveal adjacent tiles if they are empty
        tile.reveal();
    }
    
    this._onTileRightClick = function(event) {
        // Don't open browser's context menu
        event.preventDefault();
        
        const tileElement = event.target;
        
        const tile = fuckThis._findTileFromButton(tileElement);
        
        // We shouldn't be able to flag a revealed tile.
        if (tile.isRevealed) {
            return;
        }
        
        tile.toggleFlag();
        
        // Add or subtract a tile depending on the tile state
        if (tile.isFlagged) {
            _flagsAvailable -= 1;
            _flagCounterElement.textContent = String(_flagsAvailable).padStart(3, '0');
            
            // Prevent ability to reveal a flagged tile:
            tileElement.removeEventListener('click', fuckThis._onTileLeftClick);
        }
        else {
            _flagsAvailable += 1;
            _flagCounterElement.textContent = String(_flagsAvailable).padStart(3, '0');
            
            // Enable ability to reveal an unflagged tile:
            tileElement.addEventListener('click', fuckThis._onTileLeftClick);
        }
    }
    
    this._findTileFromButton = function(tileButtonElement) {
        // search for associated tile data in the matrix:
        let tile;
        for (const row of fuckThis.tileMatrix) {
            const siftedTileFromRow = row.filter(
                (tileInstance) => tileInstance.buttonElement === tileButtonElement
            );
            
            tile = tile || siftedTileFromRow[0];
            
            // Tile found
            if (tile) {
                break;
            }
        }
        
        return tile;
    }
    
    this._generateBoard = function() {
        _gameBoardElement.innerHTML = '';
        
        for (let y = 0; y < boardLength; y++) {
            this.tileMatrix[y] = [];
            
            for (let x = 0; x < boardLength; x++) {
                // Pass a reference of this Game instance to the Tile
                const newTile = Tile(fuckThis);
                
                this.tileMatrix[y].push(newTile);
                
                // Click listener
                newTile.buttonElement.addEventListener('click', fuckThis._onTileLeftClick);
                newTile.buttonElement.addEventListener('contextmenu', fuckThis._onTileRightClick);
                
                // Render to DOM
                _gameBoardElement.append(newTile.buttonElement);
            }
        }
    }
    
    this._winGame = function() {
        fuckThis.won = true; // to prevent subsequent calls to _checkWinCondition during reveal() crawls.
        
        // Stop the timer
        fuckThis._stopTimer();
        
        // Update new game button icon
        _newGameButtonImage.setAttribute('src', _WON_GAME_IMG_PATH);
        _newGameButtonImage.setAttribute('alt', "smiling face");
        
        // Prevent tile interaction:
        for (const row of this.tileMatrix) {
            for (const tile of row) {
                // Disable left-click handling
                tile.buttonElement.removeEventListener('click', fuckThis._onTileLeftClick);
                
                // Disable right-click handling
                tile.buttonElement.removeEventListener('contextmenu', fuckThis._onTileRightClick);
            }
        }
    }

    this._loseGame = function() {
        // Stop the timer
        fuckThis._stopTimer();
        
        // Update new game button icon
        _newGameButtonImage.setAttribute('src', _GAME_OVER_IMG_PATH);
        _newGameButtonImage.setAttribute('alt', "frowning face with x characters as eyes");
        
        // Show other bombs
        fuckThis._showBombs();
        
        // Prevent tile interaction:
        for (const row of this.tileMatrix) {
            for (const tile of row) {
                // Disable left-click handling
                tile.buttonElement.removeEventListener('click', fuckThis._onTileLeftClick);
                
                // Disable right-click handling
                tile.buttonElement.removeEventListener('contextmenu', fuckThis._onTileRightClick);
            }
        }
    }
    
    let timerIntervalID;
    this._beginTimer = function() {
        if (timerIntervalID) {
            throw new Error(`A timer has already been started with ID: ${intervalID}.`);
        }
        
        // Add 1 to the timer every second.
        timerIntervalID = setInterval(function() {
            // We can optimize this by pausing the timer after 999 to save on performance.
            if (_currentTime < 999) {
                _currentTime += 1;
                // is there a gotcha with String(...), or was it new String(...)? (or instead Number?)
                _timerElement.textContent = String(_currentTime).padStart(3, "0");
            }
        }, 1000);
    }
    
    this._stopTimer = function() {
        if (timerIntervalID === undefined) {
            throw new Error(`A timer has not been started yet.`);
        }
        
        // Stop the timer
        clearInterval(timerIntervalID);
        timerIntervalID = undefined;
    }
    
    this._newGame = function() {
        fuckThis.won = false;
        
        // Stop timer from counting up, since that is to occur on first tile interaction.
        if (timerIntervalID) {
            fuckThis._stopTimer();
        }
        
        // Reset timer
        _currentTime = 0;
        _timerElement.textContent = String(_currentTime).padStart(3, "0");
        
        // Re-fill flags available
        _flagsAvailable = _startingFlags;
        _flagCounterElement.textContent = String(_flagsAvailable).padStart(3, "0");
        
        // If the player lost that round, update the new game button image
        // == or ===?
        if (_newGameButtonImage.getAttribute('src') != _NEW_GAME_IMG_PATH) {
            _newGameButtonImage.setAttribute('src', _NEW_GAME_IMG_PATH);
            _newGameButtonImage.setAttribute('alt', "smiley face");
        }
        
        // Populate board with new tiles
        fuckThis._generateBoard();
    }
    
    ////////////////////////////
    // New game event handler //
    ////////////////////////////
    
    _newGameButton.addEventListener('click', fuckThis._newGame);
    

    ////////////////////////////////
    // New instance functionality //
    ////////////////////////////////
    this._newGame();
}

export default Game;