import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

import { useGameDispatch } from './GameStateProvider';
import { usePlayerDispatch } from './PlayerStateProvider';

export const SocketContext = React.createContext();

function SocketProvider({ children }) {
    const [socket, setSocket] = useState();
    const gameDispatch = useGameDispatch();
    const playerDispatch = usePlayerDispatch();

    useEffect(() => {
        const sock = io.connect();
        sock.on('connected', data => {
            console.log('connected');
        });
        sock.on('err', data => {
            console.log('err: ', data.message);
            toast.error(data.message);
        });
        sock.on('gameCreated', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
            playerDispatch({ type: 'playerJoined', payload: data.player });
        });
        sock.on('playerJoined', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
            playerDispatch({ type: 'playerJoined', payload: data.player });
        });
        sock.on('newPlayerJoined', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
        });
        sock.on('gameStarted', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
            playerDispatch({
                type: 'derivePlayerStateFromGameState',
                payload: data.game
            });
        });
        sock.on('tileFlipped', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
            playerDispatch({
                type: 'derivePlayerStateFromGameState',
                payload: data.game
            });
        });
        sock.on('wordTaken', data => {
            gameDispatch({ type: 'updateGameState', payload: data.game });
            playerDispatch({
                type: 'derivePlayerStateFromGameState',
                payload: data.game
            });
        });

        setSocket(sock);

        return () => sock.disconnect();
    }, [gameDispatch, playerDispatch]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    const { socket } = React.useContext(SocketContext);

    return socket;
};

export default SocketProvider;
