export const withLocalStorageCache = localStorageKey => reducer => {
    return (state, action) => {
        const newState = reducer(state, action);
        localStorage.setItem(localStorageKey, JSON.stringify(newState));
        return newState;
    };
};

export const generateFrequencyHash = arr => {
    return arr.reduce((freqHash, el) => {
        const freq = freqHash.get(el);
        if (freq) {
            freqHash.set(el, freq + 1);
        } else {
            freqHash.set(el, 1);
        }
        return freqHash;
    }, new Map());
};

export const canWordBeFormedFromLetters = (word, letters) => {
    const letterFrequencies = generateFrequencyHash(letters);

    let enoughLetters = true;

    word.split('').forEach(letter => {
        const freq = letterFrequencies.get(letter);
        if (!freq) {
            enoughLetters = false;
            return;
        }
        letterFrequencies.set(letter, freq - 1);
    });

    return enoughLetters;
};

export const calculatePoints = words =>
    words.reduce((total, word) => total + word.length, 0);
