import React, { useState } from 'react';

import { useGameDispatch, joinGame } from '../gameContext';

function JoinGameForm() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const gameDispatch = useGameDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        joinGame(gameDispatch, { name, room });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="your name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="room name"
                value={room}
                onChange={e => setRoom(e.target.value)}
            />
            <button type="submit">Join Game</button>
        </form>
    );
}

export default JoinGameForm;
