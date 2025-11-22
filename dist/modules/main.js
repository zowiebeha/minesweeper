import Game from './game/classes.js';
import removeServerAnnouncement from "./utils/removeServerAnnouncement.js";

// If the main.js module script is fetched and loaded successfully,
// ... remove the notice about CORs headers.
removeServerAnnouncement();

// Setup game state and interactivity
new Game();