/** @jsx jsx */
import { jsx } from 'theme-ui';

import { useForm } from 'react-hook-form';

import { useSocket } from './SocketProvider';
import Form from './Form';
import Input from './Input';
import Button from './Button';

function JoinGameForm() {
    const { register, handleSubmit, watch, errors } = useForm();
    const socket = useSocket();

    const onSubmit = ({ name, room }) => {
        socket.emit('joinGame', { name, roomId: room });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Input
                    id="join-game-name"
                    label="Name"
                    placeholder="your name"
                    name="name"
                    ref={register({
                        required: 'Name is required',
                        pattern: {
                            value: /^[\w-]+$/,
                            message:
                                'Please use only numbers, letters, dashes, and underscores'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Please limit your name to 20 characters'
                        }
                    })}
                    error={errors.name}
                />
            </div>
            <div className="mb-4">
                <Input
                    id="join-game-room"
                    label="Room"
                    placeholder="room name"
                    name="room"
                    ref={register({
                        required: 'Room name is required',
                        pattern: {
                            value: /^[\w-]+$/,
                            message:
                                'Please use only numbers, letters, dashes, and underscores'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Please limit your name to 20 characters'
                        }
                    })}
                    error={errors.room}
                />
            </div>
            <div className="w-full">
                <Button className="mx-auto" type="submit">
                    Join Game
                </Button>
            </div>
        </Form>
    );
}

export default JoinGameForm;
