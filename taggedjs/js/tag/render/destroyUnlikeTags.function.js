import { softDestroySupport } from './softDestroySupport.function.js';
import { moveProviders } from '../update/updateExistingTagComponent.function.js';
export function destroyUnlikeTags(lastSupport, // old
reSupport, // new
subject) {
    const oldGlobal = lastSupport.global;
    const insertBefore = oldGlobal.insertBefore;
    // when a tag is destroyed, disconnect the globals
    const global = reSupport.global = { ...oldGlobal }; // break memory references
    moveProviders(lastSupport, reSupport);
    // destroyTagMemory(lastSupport)
    softDestroySupport(lastSupport);
    lastSupport.global.oldest = reSupport; // any outstanding callbacks/state like activities should refer to replacing tag
    global.insertBefore = insertBefore;
    delete global.deleted;
    global.oldest = reSupport;
    global.newest = reSupport;
    subject.tagSupport = reSupport;
    const placeParent = reSupport.global.placeholder?.parentNode;
    const insertParent = insertBefore.parentNode;
    if (placeParent && insertParent) {
        insertParent.removeChild(insertBefore);
    }
}
//# sourceMappingURL=destroyUnlikeTags.function.js.map