import { setUse } from "./tagRunner.js";
/** When undefined, it means a tag is being built for the first time so do run init(s) */
let initCurrentSupport;
function setCurrentTagSupport(support) {
    initCurrentSupport = support;
}
export function onInit(callback) {
    if (!initCurrentSupport.memory.init) {
        initCurrentSupport.memory.init = callback;
        callback();
    }
}
setUse({
    beforeRender: (tagSupport) => {
        setCurrentTagSupport(tagSupport);
    }
});
//# sourceMappingURL=onInit.js.map