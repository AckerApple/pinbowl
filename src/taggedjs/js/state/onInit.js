import { setUse } from "./setUse.function";
function setCurrentTagSupport(support) {
    setUse.memory.initCurrentTemplater = support.templater;
}
export function onInit(callback) {
    const templater = setUse.memory.initCurrentTemplater;
    if (!templater.global.init) {
        ;
        templater.global.init = callback;
        callback(); // fire init
    }
}
setUse({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});
//# sourceMappingURL=onInit.js.map