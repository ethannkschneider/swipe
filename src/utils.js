export const withLocalStorageCache = localStorageKey => reducer => {
    return (state, action) => {
        const newState = reducer(state, action);
        localStorage.setItem(localStorageKey, JSON.stringify(newState));
        return newState;
    };
};
