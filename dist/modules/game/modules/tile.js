function Tile() {
    this.isRevealed = false;
    this.isFlagged = false;
    
    // I'll implement a better algorithm after the assignment.
    this.isBomb = Math.random() > Math.random();
    
    // Setup tile class
    this.classList.add('tile');
    
    this.toggleFlag = function() {
        if (isRevealed)
            return;
        
        this.isFlagged = !this.isFlagged;
        this.classList.toggle('tile--flagged');
    }
}

export default Tile;