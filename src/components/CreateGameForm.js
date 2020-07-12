/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useForm } from 'react-hook-form';

import Form from './Form';
import Input from './Input';
import Button from './Button';
import { useSocket } from './SocketProvider';

function CreatGameForm() {
    const { register, handleSubmit, watch, errors } = useForm();
    const socket = useSocket();

    const onSubmit = ({ name, room }) => {
        socket.emit('createGame', { name, roomId: room });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <Input
                    id="create-game-name"
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
                    label="Name"
                    placeholder="your name"
                    error={errors.name}
                />
            </div>
            <div className="mb-4">
                <Input
                    id="create-game-room"
                    name="room"
                    ref={register({
                        required: 'Room is required',
                        pattern: {
                            value: /^[\w-]+$/,
                            message:
                                'Please use only numbers, letters, dashes, and underscores'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Please limit room name to 20 characters'
                        }
                    })}
                    label="Room"
                    placeholder="room name"
                    error={errors.room}
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
