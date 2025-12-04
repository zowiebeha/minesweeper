const SETTINGS_OBJECT = {
    // Integer number of tiles to act as the two terms of the grid's square area. (i.e GRID_LENGTH x GRID_LENGTH)
    GRID_LENGTH: 2,
}

////////////////
// BOARD_AREA //

// Check integer value
if (SETTINGS_OBJECT.GRID_LENGTH % 0) {
    throw new Error("BOARD_AREA setting must be an integer.")
}

// Check positivity
if (SETTINGS_OBJECT.GRID_LENGTH < 0) {
    throw new Error("BOARD_AREA setting must not be negative.")
}

export default SETTINGS_OBJECT;