import { setUse } from "./setUse.function.js";
import { getStateValue } from "./state.js";
export let getCallback = () => (callback) => () => {
    throw new Error('The real callback function was called and that should never occur');
};
setUse({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    // afterRender: (tagSupport: TagSupport) => {},
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const fromValue = getStateValue(state);
        const callback = stateTo[index].callback;
        if (callback) {
            callback(fromValue); // set the value
        }
        stateTo[index].lastValue = fromValue; // record the value
    });
}
function initMemory(tagSupport) {
    getCallback = () => {
        const oldState = setUse.memory.stateConfig.array;
        const callbackMaker = (callback) => {
            const trigger = (...args) => triggerStateUpdate(tagSupport, callback, oldState, ...args);
            return trigger;
        };
        return callbackMaker;
    };
}
function triggerStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    const newest = state.newest;
    // ensure that the oldest has the latest values first
    updateState(newest, oldState);
    // run the callback
    const promise = callback(...args);
    // send the oldest state changes into the newest
    updateState(oldState, newest);
    tagSupport.render();
    // TODO: turn back on below
    if (promise instanceof Promise) {
        promise.finally(() => {
            // send the oldest state changes into the newest
            updateState(oldState, newest);
            tagSupport.render();
        });
    }
}
//# sourceMappingURL=getCallback.js.map