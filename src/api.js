import axios from 'axios';

export const createGame = async ({ room, name }) => {
    const res = await axios.post('/game/create', {
        room,
        name
    });

    return res.data;
};

export const joinGame = async ({ room, name }) => {
    const res = await axios.post('/game/join', {
        room,
        name
    });

    return res.data;
};
