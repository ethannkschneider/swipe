import React from 'react';

import * as UTILS from '../utils';

const GameStateContext = React.createContext();
const GameDispatchContext = React.createContext();

const localStorageKey = 'swipe-game';
const initialGameState = {
    room: '',
    progress: 'notStarted',
    players: [],
    currentPlayerName: '',
    flippedTiles: [],
    numUnflippedTiles: 98
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

function gameReducer(state, action) {
    switch (action.type) {
        case 'updateGameState': {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function GameStateProvider({ children }) {
    const withLocalStorage = UTILS.withLocalStorageCache(localStorageKey);

    const [state, dispatch] = React.useReducer(
        withLocalStorage(withLogging(gameReducer)),
        JSON.parse(localStorage.getItem(localStorageKey)) || initialGameState
    );

    return (
        <GameStateContext.Provider value={state}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameStateContext.Provider>
    );
}

export function useGameState() {
    const context = React.useContext(GameStateContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

export function useGameDispatch() {
    const context = React.useContext(GameDispatchContext);
    if (typeof context === 'undefined') {
        throw new Error('useGameState must be used within in a GameProvider');
    }

    return context;
}

export function useGame() {
    return [useGameState(), useGameDispatch()];
}

export default GameStateProvider;
