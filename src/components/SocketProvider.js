import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useGameDispatch } from './GameStateProvider';

export const SocketContext = React.createContext();

function SocketProvider({ children }) {
    const [socket, setSocket] = useState();
    const gameDispatch = useGameDispatch();

    useEffect(() => {
        const sock = io.connect();
        sock.on('connected', data => {
            console.log('connected');
        });
        sock.on('err', data => {
            console.log('err: ', data.message);
        });
        sock.on('gameCreated', data => {
            gameDispatch({ type: 'gameCreated', payload: data });
        });
        sock.on('playerJoined', data => {
            gameDispatch({ type: 'playerJoined', payload: data });
        });
        sock.on('gameStarted', data => {
            gameDispatch({ type: 'gameStarted', payload: data });
        });
        sock.on('tileFlipped', data => {
            gameDispatch({ type: 'tileFlipped', payload: data });
        });
        sock.on('wordTaken', data => {
            gameDispatch({ type: 'wordTaken', payload: data });
        });

        setSocket(sock);

        return () => sock.disconnect();
    }, []);
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
