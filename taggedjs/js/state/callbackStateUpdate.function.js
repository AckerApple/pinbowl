import { renderSupport } from '../tag/render/renderSupport.function.js';
import { syncStates } from './syncStates.function.js';
import { isPromise } from '../isInstance.js';
export default function callbackStateUpdate(support, callback, oldState, ...args) {
    const global = support.subject.global;
    support = global.newest; // || support
    const state = support.state;
    // ensure that the oldest has the latest values first
    syncStates(state, oldState);
    // run the callback
    const maybePromise = callback(...args);
    // send the oldest state changes into the newest
    syncStates(oldState, state);
    renderSupport(support);
    if (isPromise(maybePromise)) {
        maybePromise.finally(() => {
            // send the oldest state changes into the newest
            syncStates(oldState, state);
            renderSupport(support);
        });
    }
    // return undefined as T
    return maybePromise;
}
//# sourceMappingURL=callbackStateUpdate.function.js.map