import { setUse } from "./setUse.function.js";
/** When undefined, it means a tag is being built for the first time so do run destroy(s) */
let destroyCurrentTagSupport;
export function onDestroy(callback) {
    destroyCurrentTagSupport.memory.destroyCallback = callback;
}
setUse({
    beforeRender: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeRedraw: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeDestroy: (tagSupport, tag) => {
        const callback = tagSupport.memory.destroyCallback;
        if (callback) {
            callback();
        }
    }
});
//# sourceMappingURL=onDestroy.js.map