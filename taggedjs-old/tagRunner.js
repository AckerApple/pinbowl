// TODO: This should be more like `new TaggedJs().use({})`
export const tagUse = [];
// Life cycle 1
export function runBeforeRender(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, tag));
}
// Life cycle 1.1
export function runAfterTagClone(oldTag, newTag) {
    tagUse.forEach(tagUse => tagUse.afterTagClone(oldTag, newTag));
}
// Life cycle 2
export function runAfterRender(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, tag));
}
// Life cycle 3
export function runBeforeRedraw(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, tag));
}
// Life cycle 4 - end of life
export function runBeforeDestroy(tagSupport, tag) {
    tagUse.forEach(tagUse => tagUse.beforeDestroy(tagSupport, tag));
}
export function setUse(use) {
    // must provide defaults
    const useMe = {
        beforeRender: use.beforeRender || (() => undefined),
        beforeRedraw: use.beforeRedraw || (() => undefined),
        afterRender: use.afterRender || (() => undefined),
        beforeDestroy: use.beforeDestroy || (() => undefined),
        afterTagClone: use.afterTagClone || (() => undefined),
    };
    tagUse.push(useMe);
}
//# sourceMappingURL=tagRunner.js.map