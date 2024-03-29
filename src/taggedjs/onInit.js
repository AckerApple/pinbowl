import { setUse } from "./setUse.function.js";
function setCurrentTagSupport(support) {
    setUse.memory.initCurrentSupport = support;
}
export function onInit(callback) {
    if (!setUse.memory.initCurrentSupport.memory.init) {
        setUse.memory.initCurrentSupport.memory.init = callback;
        callback(); // fire init
    }
}
setUse({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});
//# sourceMappingURL=onInit.js.map