// TODO: This should be more like `new TaggedJs().use({})`
import { setUse } from '../state';
import { Subject } from '../subject';
import { getSupportInCycle } from './getSupportInCycle.function';
// Emits event at the end of a tag being rendered. Use tagClosed$.toPromise() to render a tag after a current tag is done rendering
setUse.memory.tagClosed$ = new Subject(undefined, subscription => {
    if (!getSupportInCycle()) {
        subscription.next(); // we are not currently processing so process now
    }
});
// Life cycle 1
export function runBeforeRender(tagSupport, ownerSupport) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeRender(tagSupport, ownerSupport));
}
// Life cycle 2
export function runAfterRender(tagSupport, ownerTagSupport) {
    setUse.tagUse.forEach(tagUse => tagUse.afterRender(tagSupport, ownerTagSupport));
    setUse.memory.tagClosed$.next(ownerTagSupport);
}
// Life cycle 3
export function runBeforeRedraw(tagSupport, ownerTagSupport) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeRedraw(tagSupport, ownerTagSupport));
}
// Life cycle 4 - end of life
export function runBeforeDestroy(tagSupport, ownerTagSupport) {
    setUse.tagUse.forEach(tagUse => tagUse.beforeDestroy(tagSupport, ownerTagSupport));
}
//# sourceMappingURL=tagRunner.js.map