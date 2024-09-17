import { getChildTagsToDestroy } from './getChildTagsToDestroy.function.js';
import { smartRemoveKids } from './smartRemoveKids.function.js';
import { runBeforeDestroy } from './tagRunner.js';
export function destroySupport(support, stagger) {
    const global = support.subject.global;
    global.deleted = true;
    support.subject.renderCount = 0; // if it comes back, wont be considered an update
    const context = global.context;
    getChildTagsToDestroy(context);
    if (global.destroy$) {
        global.destroy$.next();
        runBeforeDestroy(support);
    }
    // first paint
    const promises = [];
    stagger = smartRemoveKids(support, promises, stagger);
    if (promises.length) {
        return Promise.all(promises).then(() => stagger);
    }
    return stagger;
}
//# sourceMappingURL=destroySupport.function.js.map