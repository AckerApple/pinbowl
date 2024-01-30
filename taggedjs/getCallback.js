import { setUse } from "./setUse.function.js";
import { getStateValue } from "./state.js";
export let getCallback = () => (callback) => () => {
    throw new Error('The real callback function was called and that should never occur');
};
setUse({
    beforeRender: (tagSupport) => {
        tagSupport.memory.callbacks = [];
        getCallback = () => {
            const callbackMaker = (callback) => {
                const trigger = () => {
                    const state = tagSupport.memory.state;
                    const oldest = callbackMaker.state;
                    const newest = state.newest;
                    // ensure that the oldest has the latest values first
                    updateState(newest, oldest);
                    // run the callback
                    const promise = callback();
                    // send the oldest state changes into the newest
                    updateState(oldest, newest);
                    tagSupport.render();
                    if (promise instanceof Promise) {
                        promise.finally(() => {
                            // send the oldest state changes into the newest
                            updateState(oldest, newest);
                            tagSupport.render();
                        });
                    }
                };
                const state = tagSupport.memory.state;
                trigger.state = state;
                return trigger;
            };
            const callbacks = tagSupport.memory.callbacks;
            callbacks.push(callbackMaker);
            return callbackMaker;
        };
    },
    afterRender: (tagSupport) => {
        const callbacks = tagSupport.memory.callbacks;
        callbacks.forEach(callback => {
            const state = tagSupport.memory.state;
            callback.state = [...state.newest];
        });
    },
    afterTagClone(_oldTag, newTag) {
        // do not transfer callbacks
        newTag.tagSupport.memory.callbacks = [];
    },
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const oldValue = getStateValue(state.callback);
        // const [checkValue] = stateTo[index].callback( oldValue )
        stateTo[index].callback(oldValue);
        stateTo[index].lastValue = oldValue;
    });
}
//# sourceMappingURL=getCallback.js.map