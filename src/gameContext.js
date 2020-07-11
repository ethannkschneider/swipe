// import React from 'react';

// import * as API from './api';

// const GameStateContext = React.createContext();
// const GameDispatchContext = React.createContext();

// const localStorageKey = 'swipe-game';
// const initialGameState = {
//     player: { name: '', isCreator: false, id: '' },
//     game: { status: 'NOT_STARTED', players: [] },
//     room: '',
//     loading: false,
//     loadingMessage: '',
//     errorMessage: ''
// };

// const withLocalStorageCache = reducer => {
//     return (state, action) => {
//         const newState = reducer(state, action);
//         localStorage.setItem(localStorageKey, JSON.stringify(newState));
//         return newState;
//     };
// };

// function gameReducer(state, action) {
//     switch (action.type) {
//         case 'start_create_game':
//             return {
//                 ...state,
//                 loading: true,
//                 loadingMessage: 'Creating your game...'
//             };
//         case 'finish_create_game':
//             return {
//                 ...state,
//                 loading: false,
//                 loadingMessage: '',
//                 errorMessage: '',
//                 player: action.payload.player,
//                 room: action.payload.room
//             };
//         case 'fail_create_game':
//             return {
//                 ...state,
//                 loading: false,
//                 loadingMessage: '',
//                 errorMessage: 'Failed to create game. Please try again.'
//             };
//         case 'start_join_game': {
//             return {
//                 ...state,
//                 loading: true,
//                 loadingMessage: 'Creating your game...'
//             };
//         }
//         case 'finish_join_game': {
//             return {
//                 ...state,
//                 loading: false,
//                 loadingMessage: '',
//                 errorMessage: '',
//                 player: action.payload.player,
//                 room: action.payload.room
//             };
//         }
//         case 'fail_join_game': {
//             return {
//                 ...state,
//                 loading: false,
//                 loadingMessage: '',
//                 errorMessage: 'Failed to join game. Please try again.'
//             };
//         }
//         case 'update_players': {
//             return {
//                 ...state,
//                 game: {
//                     ...state.game,
//                     players: action.payload.players
//                 }
//             };
//         }
//         default: {
//             throw new Error(`Unhandled action tupe: ${action.type}`);
//         }
//     }
// }

// function GameProvider({ children }) {
//     const [state, dispatch] = React.useReducer(
//         withLocalStorageCache(gameReducer),
//         JSON.parse(localStorage.getItem(localStorageKey)) || initialGameState
//     );

//     return (
//         <GameStateContext.Provider value={state}>
//             <GameDispatchContext.Provider value={dispatch}>
//                 {children}
//             </GameDispatchContext.Provider>
//         </GameStateContext.Provider>
//     );
// }

// function useGameState() {
//     const context = React.useContext(GameStateContext);
//     if (typeof context === 'undefined') {
//         throw new Error('useGameState must be used within in a GameProvider');
//     }

//     return context;
// }

// function useGameDispatch() {
//     const context = React.useContext(GameDispatchContext);
//     if (typeof context === 'undefined') {
//         throw new Error('useGameState must be used within in a GameProvider');
//     }

//     return context;
// }

// function useGame() {
//     return [useGameState(), useGameDispatch()];
// }

// async function createGame(dispatch, data) {
//     dispatch({ type: 'start_create_game' });
//     try {
//         const { room, player } = await API.createGame(data);
//         dispatch({ type: 'finish_create_game', payload: { room, player } });
//     } catch (error) {
//         dispatch({ type: 'fail_create_game' });
//     }
// }

// async function joinGame(dispatch, data) {
//     dispatch({ type: 'start_join_game' });
//     try {
//         const { room, player } = await API.joinGame(data);
//         dispatch({ type: 'finish_join_game', payload: { room, player } });
//     } catch (error) {
//         dispatch({ type: 'fail_join_game' });
//     }
// }

// export {
//     GameProvider,
//     useGame,
//     useGameState,
//     useGameDispatch,
//     createGame,
//     joinGame
// };
