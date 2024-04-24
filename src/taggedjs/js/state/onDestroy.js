import { setUse } from "./setUse.function";
/** When undefined, it means a tag is being built for the first time so do run destroy(s) */
let destroyCurrentTagSupport;
export function onDestroy(callback) {
    destroyCurrentTagSupport.global.destroyCallback = callback;
}
setUse({
    beforeRender: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeRedraw: tagSupport => destroyCurrentTagSupport = tagSupport,
    beforeDestroy: (tagSupport, tag) => {
        const callback = tagSupport.global.destroyCallback;
        if (callback) {
            callback();
        }
    }
});
//# sourceMappingURL=onDestroy.js.map