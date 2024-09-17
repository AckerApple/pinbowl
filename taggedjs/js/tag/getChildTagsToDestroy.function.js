import { isTagComponent } from '../isInstance.js';
import { runBeforeDestroy } from './tagRunner.js';
export function getChildTagsToDestroy(childTags) {
    for (const child of childTags) {
        const lastArray = child.lastArray;
        if (lastArray) {
            getChildTagsToDestroy(lastArray);
            continue;
        }
        const global = child.global;
        if (!global) {
            continue; // not a support contextItem
        }
        const support = global.newest;
        const iSubs = global.subscriptions;
        if (iSubs) {
            iSubs.forEach(iSub => iSub.unsubscribe());
        }
        if (isTagComponent(support.templater)) {
            runBeforeDestroy(support);
        }
        const subTags = global.context;
        getChildTagsToDestroy(subTags);
    }
}
export function getChildTagsToSoftDestroy(childTags, tags = [], subs = []) {
    for (const child of childTags) {
        const global = child.global;
        if (!global) {
            continue;
        }
        const support = global.newest;
        if (support) {
            tags.push(support);
            const iSubs = global.subscriptions;
            if (iSubs) {
                subs.push(...iSubs);
            }
        }
        const subTags = global.context;
        if (subTags) {
            getChildTagsToSoftDestroy(subTags, tags, subs);
        }
    }
    return { tags, subs };
}
//# sourceMappingURL=getChildTagsToDestroy.function.js.map