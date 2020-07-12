/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useState } from 'react';

import Form from './Form';
import Input from './Input';
import Button from './Button';
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
        <Form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Input
                    id="create-game-name"
                    label="Name"
                    placeholder="your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <Input
                    id="create-game-room"
                    label="Room"
                    placeholder="room name"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                />
            </div>
            <div className="w-full">
                <Button className="mx-auto" type="submit">
                    Create Game
                </Button>
            </div>
        </Form>
    );
}

export default CreatGameForm;
