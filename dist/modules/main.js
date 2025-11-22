import Game from './game/classes.js';
import removeServerAnnouncement from "./utils/removeServerAnnouncement.js";

// If this module script is loaded successfully with correct CORs response headers,
// ... remove the notice about browser-required CORs headers.
removeServerAnnouncement();

// Setup game state and interactivity
new Game();