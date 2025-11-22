import Game from './game/classes.js';

// If the main.js module script executes successfully, remove the server notice.
const serverNoticeDiv = document.getElementById('server-notice');
serverNoticeDiv.remove();

const gameContainerElement = document.getElementById('game-container');
Game(gameContainerElement);