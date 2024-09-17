import { getSupportInCycle } from "../tag/getSupportInCycle.function.js";
import { state } from "./state.function.js";
export function onDestroy(callback) {
    state(function stateDestroy() {
        const support = getSupportInCycle();
        const global = support.subject.global;
        global.destroy$.toCallback(callback);
    });
}
//# sourceMappingURL=onDestroy.js.map