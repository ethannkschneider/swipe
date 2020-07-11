import React, { useState } from 'react';

import { useSocket } from './SocketProvider';

function JoinGameForm() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const socket = useSocket();

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('joinGame', { name, roomId: room });
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
