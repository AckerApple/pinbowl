import { getChildTagsToSoftDestroy } from '../getChildTagsToDestroy.function.js';
import { getNewGlobal } from '../update/getNewGlobal.function.js';
import { smartRemoveKids } from '../smartRemoveKids.function.js';
/** used when a tag swaps content returned */
export function softDestroySupport(lastSupport) {
    const global = lastSupport.subject.global;
    const { subs, tags } = getChildTagsToSoftDestroy(global.context);
    softDestroyOne(lastSupport);
    for (const child of tags) {
        softDestroyOne(child);
    }
    const mySubs = global.subscriptions;
    if (mySubs) {
        subs.forEach(sub => sub.unsubscribe());
    }
    getNewGlobal(lastSupport.subject);
}
function softDestroyOne(child) {
    const subject = child.subject;
    const global = subject.global;
    if (global.deleted === true) {
        return;
    }
    global.deleted = true; // the children are truly destroyed but the main support will be swapped
    subject.renderCount = 0;
    smartRemoveKids(child, [], 0);
}
//# sourceMappingURL=softDestroySupport.function.js.map