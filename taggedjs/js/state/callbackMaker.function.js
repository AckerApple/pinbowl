import { setUse } from './setUse.function.js';
import { SyncCallbackError } from '../errors.js';
import { getSupportInCycle } from '../tag/getSupportInCycle.function.js';
import callbackStateUpdate from './callbackStateUpdate.function.js';
let innerCallback = (callback) => (a, b, c, d, e, f) => {
    throw new SyncCallbackError('Callback function was called immediately in sync and must instead be call async');
};
export const callbackMaker = () => innerCallback;
const originalGetter = innerCallback; // callbackMaker
setUse({
    beforeRender: tagSupport => initMemory(tagSupport),
    beforeRedraw: tagSupport => initMemory(tagSupport),
    afterRender: tagSupport => {
        ;
        tagSupport.global.callbackMaker = true;
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
/** Wrap a function that will be called back. After the wrapper and function are called, a rendering cycle will update display */
export function callback(callback) {
    const tagSupport = getSupportInCycle();
    if (!tagSupport) {
        const error = new SyncCallbackError('callback() was called outside of synchronous rendering. Use `callback = callbackMaker()` to create a callback that could be called out of sync with rendering');
        throw error;
    }
    const oldState = setUse.memory.stateConfig.array;
    const trigger = (...args) => {
        const callbackMaker = tagSupport.global.callbackMaker;
        if (callbackMaker) {
            return callbackStateUpdate(tagSupport, callback, oldState, ...args);
        }
        return callback(...args);
    };
    return trigger;
}
function initMemory(tagSupport) {
    const oldState = setUse.memory.stateConfig.array;
    innerCallback = (callback) => {
        const trigger = (...args) => {
            const callbackMaker = tagSupport.global.callbackMaker;
            if (callbackMaker) {
                return callbackStateUpdate(tagSupport, callback, oldState, ...args);
            }
            return callback(...args);
        };
        return trigger;
    };
}
//# sourceMappingURL=callbackMaker.function.js.map