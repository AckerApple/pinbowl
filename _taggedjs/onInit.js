import { setUse } from "./tagRunner.js";
/** When undefined, it means a tag is being built for the first time so do run init(s) */
export let initCurrentTag;
export function setCurrentInitTag(tag) {
    initCurrentTag = tag;
}
export function onInit(callback) {
    if (!initCurrentTag) {
        callback();
    }
}
setUse({
    beforeRender: (_tagSupport, tag) => {
        setCurrentInitTag(tag);
    }
});
//# sourceMappingURL=onInit.js.map