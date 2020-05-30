// const Player = require('./models/Player');
// const Game = require('./models/Game');

// class GameController {
//     constructor({ io, socket, room }) {
//         this.__io = io;
//         this.__socket = socket;
//         this.__room = room;
//     }

//     broadcastToRoom = ({ type, payload }) => {
//         this.__io.to(this.__room).emit(JSON.stringify(payload));
//     };

//     addPlayer = async name => {
//         const game = await Game.findActiveGameByRoom(this.__room);
//         if (!game) throw new Error('Game not found');

//         const players = await game.addPlayer();

//         this.broadcastToRoom(({ type: 'PLAYER_JOINED', players);
//     };
// }

// module.exports = GameController;
