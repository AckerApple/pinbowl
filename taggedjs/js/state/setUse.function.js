import { firstLetState } from './letState.function.js';
import { runFirstState } from './stateHandlers.js';
export const setUseMemory = {
    stateConfig: {
        array: [], // state memory on the first render
        version: Date.now(),
        handlers: {
            handler: runFirstState,
            letHandler: firstLetState,
        }
    },
};
//# sourceMappingURL=setUse.function.js.map