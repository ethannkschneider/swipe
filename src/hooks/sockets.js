import { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useGame } from '../gameContext';

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [gameState, gameDispatch] = useGame();
    const { room } = gameState;

    useEffect(() => {
        if (!room) return;

        setSocket(io.connect());
    }, [room]);

    useEffect(() => {
        if (!socket) return;

        console.log({ socket });
        socket.on('connect', () => {
            console.log('connected to socket');
            socket.emit('join_room', room);
        });
        socket.on('message', data => {
            console.log('Incoming message:', data);
        });
        socket.on('player_joined', data => {
            const players = JSON.parse(data);
            console.log('player_joined');
            console.log(players);
            gameDispatch({ type: 'update_players', payload: { players } });
        });

        return () => socket.disconnect();
    }, [room, socket]);

    return socket;
};
