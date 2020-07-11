import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

import { useGame } from '../gameContext';
import { SocketContext } from '../components/SocketProvider';

// export const useSocket = () => {
//     const [socket, setSocket] = useState(null);
//     // const [gameState, gameDispatch] = useGame();
//     // const { room, player } = gameState;

//     // useEffect(() => {
//     //     if (!room) return;
//     // }, [room]);

//     useEffect(() => {
//         setSocket(io.connect());

//         console.log({ socket });
//         socket.on('connected', data => {
//             console.log('connected');
//             console.log(data);
//         });
//         socket.on('err', data => {
//             console.log('err');
//             console.log(data);
//         });
//         socket.on('newGame', data => {
//             console.log('newGame');
//             console.log(data);
//         });
//         socket.on('gameStarted', data => {
//             console.log('gameStarted');
//             console.log(data);
//         });
//         socket.on('playerJoined', data => {
//             console.log('playerJoined');
//             console.log(data);
//         });
//         // socket.on('player_joined', data => {
//         //     const { name, players } = JSON.parse(data);

//         //     console.log(`${name} has joined`);
//         //     console.log(players);
//         //     gameDispatch({ type: 'update_players', payload: { players } });
//         // });
//         // socket.on('player_disconnected', data => {
//         //     const { name, players } = JSON.parse(data);
//         //     console.log(`${name} has disconnected`);
//         //     console.log(players);
//         //     gameDispatch({ type: 'update_players', payload: { players } });
//         // });

//         return () => socket.disconnect();
//     }, []);

//     return socket;
// };
