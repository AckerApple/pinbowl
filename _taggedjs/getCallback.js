import { getStateValue } from "./state.js";
import { setUse } from "./tagRunner.js";
export let getCallback = () => (callback) => () => {
    throw new Error('The real callback function was called and that should never occur');
};
setUse({
    beforeRender: (tagSupport) => {
        tagSupport.callbacks = [];
        getCallback = () => {
            const callbackMaker = (callback) => {
                const trigger = () => {
                    const state = tagSupport.state;
                    const oldest = callbackMaker.state; // state.oldest as StateConfigArray
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
                const state = tagSupport.state;
                trigger.state = state;
                return trigger;
            };
            const callbacks = tagSupport.callbacks;
            callbacks.push(callbackMaker);
            return callbackMaker;
        };
    },
    afterRender: (tagSupport) => {
        const callbacks = tagSupport.callbacks;
        callbacks.forEach(callback => {
            const state = tagSupport.state;
            callback.state = [...state.newest];
        });
    }
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const oldValue = getStateValue(state);
        const [checkValue] = stateTo[index](oldValue);
    });
}
//# sourceMappingURL=getCallback.js.map