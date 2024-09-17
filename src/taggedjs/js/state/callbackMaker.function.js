import { getSupportInCycle } from '../tag/getSupportInCycle.function.js';
import callbackStateUpdate from './callbackStateUpdate.function.js';
import { setUseMemory } from './setUse.function.js';
import { SyncCallbackError } from '../errors.js';
export const callbackMaker = () => {
    const support = getSupportInCycle();
    // callback as typeof innerCallback
    if (!support) {
        throw syncError;
    }
    const oldState = setUseMemory.stateConfig.array;
    return function triggerMaker(callback) {
        return createTrigger(support, oldState, callback);
    };
};
const syncError = new SyncCallbackError('callback() was called outside of synchronous rendering. Use `callback = callbackMaker()` to create a callback that could be called out of sync with rendering');
/** Wrap a function that will be called back. After the wrapper and function are called, a rendering cycle will update display */
export function callback(callback) {
    const support = getSupportInCycle();
    if (!support) {
        throw syncError;
    }
    return createTrigger(support, setUseMemory.stateConfig.array, callback);
}
function createTrigger(support, oldState, toCallback) {
    return function trigger(...args) {
        const callbackMaker = support.subject.renderCount > 0;
        if (callbackMaker) {
            return callbackStateUpdate(support, toCallback, oldState, ...args);
        }
        // we are in sync with rendering, just run callback naturally
        return toCallback(...args);
    };
}
//# sourceMappingURL=callbackMaker.function.js.map