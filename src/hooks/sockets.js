import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useGame } from '../gameContext';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [gameState, gameDispatch] = useGame();
    const { room, player } = gameState;

    useEffect(() => {
        if (!room) return;

        setSocket(io.connect());
    }, [room]);

    useEffect(() => {
        if (!socket || !player) return;

        console.log({ socket });
        socket.on('connect', () => {
            console.log('connected to socket');
            socket.emit(
                'join_room',
                JSON.stringify({ room, playerId: player._id })
            );
        });
        socket.on('message', data => {
            console.log('Incoming message:', data);
        });
        socket.on('player_joined', data => {
            const { name, players } = JSON.parse(data);

            console.log(`${name} has joined`);
            console.log(players);
            gameDispatch({ type: 'update_players', payload: { players } });
        });
        socket.on('player_disconnected', data => {
            const { name, players } = JSON.parse(data);
            console.log(`${name} has disconnected`);
            console.log(players);
            gameDispatch({ type: 'update_players', payload: { players } });
        });

        return () => socket.disconnect();
    }, [room, socket, gameDispatch, player]);

    return socket;
};
