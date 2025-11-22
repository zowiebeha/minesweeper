import Tile from "./tile.js";

// Prototypal inheritance is very verbose when it comes to
// ... mimicking the object-oriented requirements of complexity.
// JS was not designed to support the complexity that OOP allows for.
// Thus, some features may not be possible, or at the very least sane.
// So, the class system was designed to act as both a wrapper over prototypal inheritance,
// ... and to do some internal magic to pretend like class behavior exists in JS.

// I'll switch to the fake OOP after the assignment.

// Or maybe the imperfect and, at times, incorrect book YDKJS can assist?

function Game(gameContainerElement) {
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
    
    // _flagCounterElement
    const flagCounterElementSymbol = Symbol('flagCounterElement');
    this[flagCounterElementSymbol] = document.findElementById('flag-counter');
    // Expose private variable with a simple-to-use identifier:
    const _flagCounterElement = this[flagCounterElementSymbol]
    
    // _timerElement
    const timerElementSymbol = Symbol('timerElement');
    this[timerElementSymbol] = document.findElementById('timer');
    const _timerElement = this[timerElementSymbol]
    
    // _newGameButton
    const newGameButtonSymbol = Symbol('newGameButton');
    this[newGameButtonSymbol] = document.findElementById('btn--new-game');
    const _newGameButton = this[newGameButtonSymbol]
    
    // _gameBoardElement
    const gameBoardElementSymbol = Symbol('gameBoardElement');
    this[gameBoardElementSymbol] = document.findElementById('game-board');
    const _gameBoardElement = this[gameBoardElementSymbol]
    
    const gameContainerElementSymbol = Symbol('gameContainerElement');
    this[gameContainerElementSymbol] = document.findElementById('game-container');
    const _gameContainerElement = this[gameContainerElementSymbol]
    
    ////////////////////////////
    // Encapsulated Variables //
    ////////////////////////////
    
    const timeVariableSymbol = Symbol('time');
    this[timeVariableSymbol] = 0;
    const _time = this[timeVariableSymbol];
    
    const startingFlagsVariableSymbol = Symbol('startingFlags');
    this[startingFlagsVariableSymbol] = 40; // Around (9x9) / 2
    const _startingFlags = this[startingFlagsVariableSymbol];
    
    const flagsAvailableSymbol = Symbol('flagsPlaced');
    this[flagsAvailableSymbol]; // This is initialized in newGame()
    const _flagsAvailable = this[flagsAvailable];
    
    // Better?:
    // this would be easier to write. I could use getters/setters.
    // such complexity for something so simple in other languages. it isn't pure.
    // const gameThis = this;
    // this.publicState = {

    // };
    
    //////////////////////////
    // Encapsulated Methods //
    //////////////////////////
    
    // Note to self: arrow functions are weird with the `this` keyword...
    // An in-depth understanding of Classes will assist me in understanding
    // ... `this`'s specification details.
    
    // showBombs()
    const showBombsSymbol = Symbol('showBombs function');
    this[showBombsSymbol] = function showBombs() {
        for (const tileElement of this.boardElement.children) {
            if (tileElement.isBomb) {
                tileElement.classList.add('tile--bomb');
            }
        }
    }
    const _showBombs = this[showBombsSymbol];
    
    // onTileLeftClick()
    const onTileLeftClickSymbol = Symbol('onTileLeftClick function');
    this[onTileLeftClickSymbol] = function onTileLeftClick(event) {
        if (event.target.isBomb) {
            event.target.classList.add('tile--bombed');
            
            // Trigger game loss
            // ...
        }
    }
    const _onTileLeftClick = this[onTileLeftClickSymbol];
    
    // onTileRightClick()
    const onTileRightClickSymbol = Symbol('onTileRightClick function');
    this[onTileRightClickSymbol] = function onTileRightClickClick(event) {
        // Don't open browser's context menu
        event.preventDefault();
        
        const tileElement = event.target;
        
        // We shouldn't be able to flag a revealed tile.
        if (tileElement.isRevealed)
            return;
        
        tileElement.toggleFlag();
        
        // Add or subtract a tile depending on the tile state
        if (tileElement.isFlagged) {
            this._flagsAvailable -= 1;
            
            // Prevent accidental left-click of a flagged tile:
            tileElement.removeEventListener('click', _onTileLeftClick);
        }
        else {
            this._flagsAvailable += 1;
            
            // Enable left-click again, as we've removed the flag:
            tileElement.addEventListener('click', _onTileLeftClick);
        }
    }
    const _onTileRightClick = this[onTileRightClickSymbol];
    
    // generateBoard()
    const generateBoardSymbol = Symbol('generateBoard function');
    this[generateBoardSymbol] = function generateBoard() {
        this.boardElement.innerHTML = '';
        
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                const newTileButton = Tile();
                
                // Click listener
                newTileButton.addEventListener('click', function(event) {
                    if (newTileButton.isBomb) {
                        tileElement.classList.add('tile--bombed');
                    }
                });
                
                this.boardElement.append(newTileButton);
            }
        }
    }
    
    // loseGame()
    const loseGameSymbol = Symbol('loseGame function');
    this[loseGameSymbol] = function loseGame() {
        // Stop the timer
        this[stopTimerSymbol]();
        
        // Prevent tile interaction:
        for (const tile of _gameBoardElement) {
            // Disable left-click handling
            tile.removeEventListener('click', _onTileLeftClick);
            
            // Disable right-click handling
            tile.removeEventListener('contextmenu', _onTileRightClick);
        }
    }
    
    // beginTimer()
    let timerIntervalID;
    const beginTimerSymbol = Symbol('beginTimer function');
    this[beginTimerSymbol] = function beginTimer() {
        if (timerIntervalID) {
            throw new Error(`A timer has already been started with ID: ${intervalID}.`);
        }
        
        // Add 1 to the timer every second.
        timerIntervalID = setInterval(function() {
            this[timeVariableSymbol] += 1;
        }, 1000);
    }
    const beginTimer = this[beginTimerSymbol];
    
    // stopTimer()
    const stopTimerSymbol = Symbol('stopTimer function');
    this[stopTimerSymbol] = function stopTimer() {
        if (timerIntervalID === undefined) {
            throw new Error(`A timer has not been started yet.`);
        }
        
        // Stop the timer
        clearInterval(timerIntervalID);
    }
    
    // newGame()
    const newGameSymbol = Symbol('newGame function');
    this[newGameSymbol] = function newGame() {
        // Reset timer
        this[timeVariableSymbol] = 0;
        
        // Re-fill flags available
        this[flagsAvailable] = this[startingFlagsVariableSymbol];
        _flagCounterElement.textContent = this[flagsAvailable];
        
        // Populate board with new tiles
        this[generateBoardSymbol]();
        
        // Start timer
        this[beginTimerSymbol]();
    }
}

export default Game;