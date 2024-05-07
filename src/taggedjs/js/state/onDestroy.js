import { setUse } from "./setUse.function";
function setCurrentTagSupport(support) {
    setUse.memory.destroyCurrentSupport = support;
}
export function onDestroy(callback) {
    const tagSupport = setUse.memory.destroyCurrentSupport;
    tagSupport.global.destroyCallback = callback;
}
setUse({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
    beforeDestroy: (tagSupport) => {
        const callback = tagSupport.global.destroyCallback;
        if (callback) {
            callback();
        }
    }
});
//# sourceMappingURL=onDestroy.js.map