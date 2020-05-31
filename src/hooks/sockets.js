import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { useGameState } from '../gameContext';

export const useSocket = () => {
    const { game } = useGameState();

    useEffect(() => {
        if (!game || !game.room) return;
        const { room } = game;

        const socket = io.connect();
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
        });

        return () => socket.disconnect();
    }, [game]);
};
