import React, { useEffect } from 'react';
import _ from 'lodash';

import useGameState from './GameStateProvider';

const PlayerStateContext = React.createContext();
const PlayerDispatchContext = React.createContext();

const localStorageKey = 'swipe-game';
const initialState = {
    name: '',
    socketId: '',
    words: [],
    isTurnToFlip: false,
    isHost: false
};

const withLocalStorageCache = reducer => {
    return (state, action) => {
        const newState = reducer(state, action);
        localStorage.setItem(localStorageKey, JSON.stringify(newState));
        return newState;
    };
};

const withLogging = reducer => {
    return (state, action) => {
        const newState = reducer(state, action);
        console.group('-------');
        console.log('Old State:');
        console.log(state);
        console.log('Action: ', action);
        console.log('New State:');
        console.log(newState);
        console.groupEnd();
        return newState;
    };
};

function getPlayer(players, playerName) {
    return _.find(players, player => player.name === playerName);
}

function playerReducer(state, action) {
    switch (action.type) {
        case 'playerJoined': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'derivePlayerStateFromGameState': {
            const player = getPlayer(action.payload.players, state.name);
            return {
                ...state,
                words: player.words,
                isTurnToFlip: state.name === action.payload.currentPlayerName
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function PlayerStateProvider({ children }) {
    const [state, dispatch] = React.useReducer(
        withLogging(playerReducer),
        JSON.parse(localStorage.getItem(localStorageKey)) || initialState
    );

    // const gameState = useGameState();

    // useEffect(() => {
    //     dispatch({
    //         type: 'derivePlayerStateFromGameState',
    //         payload: gameState
    //     });
    // });

    return (
        <PlayerStateContext.Provider value={state}>
            <PlayerDispatchContext.Provider value={dispatch}>
                {children}
            </PlayerDispatchContext.Provider>
        </PlayerStateContext.Provider>
    );
}

export function usePlayerState() {
    const context = React.useContext(PlayerStateContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

export function usePlayerDispatch() {
    const context = React.useContext(PlayerDispatchContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

export function usePlayer() {
    return [usePlayerState(), usePlayerDispatch()];
}

export default PlayerStateProvider;
