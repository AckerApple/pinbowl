import { setUse } from "./setUse.function";
function setCurrentTagSupport(support) {
    setUse.memory.currentSupport = support;
}
export function onInit(callback) {
    const tagSupport = setUse.memory.currentSupport;
    if (!tagSupport.global.init) {
        tagSupport.global.init = callback;
        callback(); // fire init
    }
}
setUse({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});
//# sourceMappingURL=onInit.js.map