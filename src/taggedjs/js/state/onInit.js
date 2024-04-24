import { setUse } from "./setUse.function";
function setCurrentTagSupport(support) {
    setUse.memory.initCurrentSupport = support;
}
export function onInit(callback) {
    const tagSupport = setUse.memory.initCurrentSupport;
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