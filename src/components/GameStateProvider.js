import React from 'react';
import _ from 'lodash';

const GameStateContext = React.createContext();
const GameDispatchContext = React.createContext();

const localStorageKey = 'swipe-game';
const initialGameState = {
    room: '',
    name: '',
    socketId: '',
    gameState: {}
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

const withCurrentPlayer = reducer => {
    return (state, action) => {
        const newState = reducer(state, action);

        const playerName = newState.name;

        const player = _.find(
            newState.gameState.players,
            player => player.name === playerName
        );

        return {
            ...newState,
            player
        };
    };
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'gameCreated': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'playerJoined': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'gameStarted': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'tileFlipped': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'wordTaken': {
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
    const [state, dispatch] = React.useReducer(
        withLogging(withCurrentPlayer(gameReducer)),
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
