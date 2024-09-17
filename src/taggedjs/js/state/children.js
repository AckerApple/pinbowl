import { setUse } from './setUse.function.js';
function setCurrentSupport(support) {
    setUse.memory.childrenCurrentSupport = support;
}
export function children() {
    const support = setUse.memory.childrenCurrentSupport;
    const children = support.templater.children;
    return children;
}
setUse({
    beforeRender: support => setCurrentSupport(support),
    beforeRedraw: support => setCurrentSupport(support),
});
//# sourceMappingURL=children.js.map