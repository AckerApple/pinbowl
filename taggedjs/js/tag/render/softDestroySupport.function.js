import { checkRestoreTagMarker, resetTagSupport } from '../TagSupport.class.js';
import { getChildTagsToDestroy } from '../destroy.support.js';
/** used when a tag swaps content returned */
export function softDestroySupport(lastSupport, options = { byParent: false, stagger: 0 }) {
    lastSupport.global.deleted = true;
    lastSupport.global.context = {};
    const childTags = getChildTagsToDestroy(lastSupport.global.childTags);
    lastSupport.destroySubscriptions();
    childTags.forEach(child => {
        const subGlobal = child.global;
        delete subGlobal.newest;
        subGlobal.deleted = true;
    });
    checkRestoreTagMarker(lastSupport, options);
    resetTagSupport(lastSupport);
    lastSupport.destroyClones();
    childTags.forEach(child => softDestroySupport(child, { byParent: true, stagger: 0 }));
}
//# sourceMappingURL=softDestroySupport.function.js.map