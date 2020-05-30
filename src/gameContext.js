import React from 'react';

import * as API from './api';

const GameStateContext = React.createContext();
const GameDispatchContext = React.createContext();

const initialGameState = {
    player: '',
    game: null,
    loading: false,
    loadingMessage: '',
    errorMessage: ''
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'start_create_game':
            return {
                ...state,
                loading: true,
                loadingMessage: 'Creating your game...'
            };
        case 'finish_create_game':
            return {
                ...state,
                loading: false,
                loadingMessage: '',
                errorMessage: '',
                player: action.payload.player,
                game: action.payload.game
            };
        case 'fail_create_game':
            return {
                ...state,
                loading: false,
                loadingMessage: '',
                errorMessage: 'Failed to create game. Please try again.'
            };
        case 'join_game': {
            return { ...state, name: action.payload.name };
        }
        default: {
            throw new Error(`Unhandled action tupe: ${action.type}`);
        }
    }
}

function GameProvider({ children }) {
    const [state, dispatch] = React.useReducer(gameReducer, initialGameState);

    return (
        <GameStateContext.Provider value={state}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
}

function useGameState() {
    const context = React.useContext(GameStateContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

function useGameDispatch() {
    const context = React.useContext(GameDispatchContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

function useGame() {
    return [useGameState(), useGameDispatch()];
}

async function createGame(dispatch, { name, room }) {
    dispatch({ type: 'start_create_game' });
    try {
        const { game, player } = await API.createGame({ name, room });
        dispatch({ type: 'finish_create_game', payload: { game, player } });
    } catch (error) {
        dispatch({ type: 'fail_create_game' });
    }
}

export { GameProvider, useGame, useGameState, useGameDispatch, createGame };
