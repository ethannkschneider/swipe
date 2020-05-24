import React, { useState } from 'react';

import * as API from '../api';

function JoinGameForm() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        API.joinGame({ name, room })
            .then(data => {
                console.log('data: ', data);
            })
            .catch(error => {
                console.log('error: ', error);
            });
    };

    return (
        <form onSubmit={onSubmit}>
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
