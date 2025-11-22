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
    ////////////////////////////////
    // Private Element References //
    ////////////////////////////////
    
    // How to provide override-able private state for functions which inherit this function,
    // while safe-guarding against a re-definition of the symbol itself in the succeeding class?
    // idk...
    // Python doesn't have this. It has name-mangling, but it's only convention.
    // I guess it's the responsibility of the consumer of this code to not mess it up.
    
    // And also the class system was developed to fix this design flaw in JS.
    
    // _flagCounterElement
    this["flagCounterElementSymbol"] = Symbol('flagCounterElement');
    this[this["flagCounterElementSymbol"]] = document.findElementById('flag-counter');
    // Expose private variable with a simple-to-use identifier:
    const _flagCounterElement = this[flagCounterElementSymbol]
    
    // _timerElement
    const _timerElementSymbol = Symbol('timerElement');
    this[_timerElementSymbol] = document.findElementById('timer');
    const _timerElement = this[_timerElementSymbol]
    
    // _newGameButton
    const newGameButtonSymbol = Symbol('newGameButton');
    this[newGameButtonSymbol] = document.findElementById('btn--new-game');
    const _newGameButton = this[newGameButtonSymbol]
    
    // _gameBoardElement
    const gameBoardElementSymbol = Symbol('gameBoardElement');
    this[gameBoardElementSymbol] = document.findElementById('game-board');
    const _gameBoardElement = this[gameBoardElementSymbol]
    
    ///////////////////////
    // Private Variables //
    ///////////////////////
    
    const timeVariableSymbol = Symbol('time')
    this[timeVariableSymbol] = 0;
    
    const startingFlagsVariableSymbol = Symbol('startingFlags')
    this[startingFlagsVariableSymbol] = 40; // Around (9x9) / 2
    
    const flagsAvailable = Symbol('flagsPlaced')
    this[flagsAvailable]; // This is set in newGame()
    
    // Better?:
    // this would be easier to write. I could use getters/setters.
    // such complexity for something so simple in other languages. it isn't pure.
    // const gameThis = this;
    // this.publicState = {

    // };
    
    /////////////////////
    // Private Methods //
    /////////////////////
    
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
    
    // onTileClick()
    const onTileClickSymbol = Symbol('onTileClick function');
    this[onTileClickSymbol] = function onTileClick(event) {
        if (event.target.isBomb) {
            event.target.classList.add('tile--bombed');
            
            // Trigger game loss
            // ...
        }
    }
    
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
            tile.removeEventListener('click');
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