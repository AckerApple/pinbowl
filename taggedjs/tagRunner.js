export const tagUse = [];
export function runBeforeRender(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, tag));
}
export function runAfterRender(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, tag));
}
export function runBeforeRedraw(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, tag));
}
export function setUse(use) {
    const useMe = {
        beforeRender: use.beforeRender || (() => undefined),
        beforeRedraw: use.beforeRedraw || (() => undefined),
        afterRender: use.afterRender || (() => undefined),
    };
    tagUse.push(useMe);
}
//# sourceMappingURL=tagRunner.js.map