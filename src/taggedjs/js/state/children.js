import { setUse } from "./setUse.function";
function setCurrentTagSupport(support) {
    setUse.memory.childrenCurrentSupport = support;
}
export function children() {
    const tagSupport = setUse.memory.childrenCurrentSupport;
    const children = tagSupport.templater.children;
    return children;
}
setUse({
    beforeRender: tagSupport => setCurrentTagSupport(tagSupport),
    beforeRedraw: tagSupport => setCurrentTagSupport(tagSupport),
});
//# sourceMappingURL=children.js.map