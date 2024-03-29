// TODO: This should be more like `new TaggedJs().use({})`
import { setUse } from "./setUse.function.js";
// Life cycle 1
export function runBeforeRender(tagSupport, tagOwner) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, tagOwner));
}
// Life cycle 2
export function runAfterRender(tagSupport, tag) {
    setUse.tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, tag));
}
// Life cycle 3
export function runBeforeRedraw(tagSupport, tag) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, tag));
}
// Life cycle 4 - end of life
export function runBeforeDestroy(tagSupport, tag) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeDestroy(tagSupport, tag));
}
//# sourceMappingURL=tagRunner.js.map