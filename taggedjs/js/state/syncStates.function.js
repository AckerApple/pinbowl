export function syncStates(stateFrom, stateTo) {
    for (let index = stateFrom.length - 1; index >= 0; --index) {
        const state = stateFrom[index];
        const fromValue = state.get();
        const s = stateTo[index];
        setState(s, fromValue);
    }
}
function setState(s, fromValue) {
    const callback = s.callback;
    if (callback) {
        callback(fromValue); // set the value
    }
}
//# sourceMappingURL=syncStates.function.js.map