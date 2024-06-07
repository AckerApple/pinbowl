import { getSupportInCycle } from "../tag/getSupportInCycle.function.js";
import { state } from "./state.function.js";
export function onDestroy(callback) {
    state(() => {
        const tagSupport = getSupportInCycle();
        tagSupport?.global.destroy$.toCallback(callback);
    });
}
//# sourceMappingURL=onDestroy.js.map