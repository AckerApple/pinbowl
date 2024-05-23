export function syncStates(stateFrom, stateTo) {
    for (let index = stateFrom.length - 1; index >= 0; --index) {
        const state = stateFrom[index];
        const fromValue = state.get();
        const callback = stateTo[index].callback;
        if (callback) {
            callback(fromValue); // set the value
        }
        stateTo[index].lastValue = fromValue; // record the value
    }
}
//# sourceMappingURL=syncStates.function.js.map