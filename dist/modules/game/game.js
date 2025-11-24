import Tile from "./tile.js";

// Prototypal inheritance is very verbose when it comes to
// ... mimicking the object-oriented requirements of complexity.
// JS was not designed to support the complexity that OOP allows for.
// Thus, some features may not be possible, or at the very least sane.
// So, the class system was designed to act as both a wrapper over prototypal inheritance,
// ... and to do some internal magic to pretend like class behavior exists in JS.

// I'll switch to the fake OOP after the assignment.

// Or maybe the imperfect and, at times, incorrect book YDKJS can assist?

function Game() {
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
    
    // I could use encapsulation and not understand how to implement private variables,
    // .. or I could just use convention:
    
    ////////////////////////////
    // Encapsulated Variables //
    ////////////////////////////
    
    const _gameContainerElement = document.getElementById('game-container');
    const _flagCounterElement = _gameContainerElement.querySelector('#flag-counter');
    const _timerElement = _gameContainerElement.querySelector('#timer');
    const _newGameButton = _gameContainerElement.querySelector('#btn--new-game');
    const _gameBoardElement = _gameContainerElement.querySelector('#game-board');
    
    let _time = 0;
    const _startingFlags = 40; // Around (9x9) / 2
    let _flagsAvailable; // This is initialized in newGame()
    
    //////////////////////
    // Public Variables //
    //////////////////////
    
    // Used to reveal adjacent tiles
    this.tileMatrix = [
        // ....
    ];
    
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
    
    this._showBombs = function() {
        // Remove TextNodes from the list of boardElement children:
        const boardElementTiles = Array.prototype.filter.call(
            _gameBoardElement.children,
            (child) => child.nodeType !== Node.TEXT_NODE
        );
        
        for (const tileElement of boardElementTiles) {
            if (tileElement.isBomb && !tileElement.isRevealed) {
                tileElement.classList.add('tile--bomb');
            }
        }
    }
    
    this._onTileLeftClick = function(event) {
        const tileElement = event.target;
        
        // Will also reveal adjacent tiles if they are empty
        tileElement.reveal();
    }
    
    this._onTileRightClick = function(event) {
        // Don't open browser's context menu
        event.preventDefault();
        
        const tileElement = event.target;
        
        // We shouldn't be able to flag a revealed tile.
        if (tileElement.isRevealed) {
            return;
        }
        
        tileElement.toggleFlag();
        
        // Add or subtract a tile depending on the tile state
        if (tileElement.isFlagged) {
            this._flagsAvailable -= 1;
            
            // Prevent ability to reveal a flagged tile:
            tileElement.removeEventListener('click', this._onTileLeftClick);
        }
        else {
            this._flagsAvailable += 1;
            
            // Enable ability to reveal an unflagged tile:
            tileElement.addEventListener('click', this._onTileLeftClick);
        }
    }
    
    this._generateBoard = function() {
        _gameBoardElement.innerHTML = '';
        
        for (let y = 0; y < 9; y++) {
            tileMatrix[y] = [];
            
            for (let x = 0; x < 9; x++) {
                const newTileButton = new Tile(this);
                
                tileMatrix[y].append(newTileButton);
                
                // Click listener
                newTileButton.addEventListener('click', this._onTileLeftClick);
                
                // Render to DOM
                _gameBoardElement.append(newTileButton);
            }
        }
    }

    this._loseGame = function() {
        // Stop the timer
        _stopTimer();
        
        // Prevent tile interaction:
        for (const tile of _gameBoardElement) {
            // Disable left-click handling
            tile.removeEventListener('click', _onTileLeftClick);
            
            // Disable right-click handling
            tile.removeEventListener('contextmenu', _onTileRightClick);
        }
    }
    
    let timerIntervalID;
    this._beginTimer = function() {
        if (timerIntervalID) {
            throw new Error(`A timer has already been started with ID: ${intervalID}.`);
        }
        
        // Add 1 to the timer every second.
        timerIntervalID = setInterval(function() {
            _time += 1;
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
        debugger;
        
        // Reset timer
        _time = 0;
        
        // Re-fill flags available
        _flagsAvailable = _startingFlags;
        _flagCounterElement.textContent = flagsAvailable;
        
        // Populate board with new tiles
        this._generateBoard();
        
        if (timerIntervalID === undefined) {
            // Start timer
            this._beginTimer();
        }
    }
    
    ////////////////////////////
    // New game event handler //
    ////////////////////////////
    
    _newGameButton.addEventListener('click', this._newGame);
}

export default Game;