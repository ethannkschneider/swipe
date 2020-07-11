import React, { useState } from 'react';

import { useSocket } from './SocketProvider';

function CreatGameForm() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const socket = useSocket();

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('createGame', { name, roomId: room });
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
            <button type="submit">Create Game</button>
        </form>
    );
}

export default CreatGameForm;
