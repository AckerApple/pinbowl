import { moveProviders } from '../update/updateExistingTagComponent.function.js';
import { softDestroySupport } from './softDestroySupport.function.js';
import { renderTagOnly } from './renderTagOnly.function.js';
import { isLikeTags } from '../isLikeTags.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
/** TODO: This seems to support both new and updates and should be separated? */
export function renderWithSupport(newSupport, lastSupport, // previous
subject, // events & memory
ownerSupport) {
    const lastTemplater = lastSupport?.templater;
    const lastTag = lastTemplater?.tag;
    const reSupport = renderTagOnly(newSupport, lastSupport, subject, ownerSupport);
    const isLikeTag = !lastSupport || isLikeTags(lastSupport, reSupport);
    if (!isLikeTag) {
        moveProviders(lastSupport, reSupport);
        softDestroySupport(lastSupport);
        const global = reSupport.subject.global;
        global.oldest = reSupport;
        global.newest = reSupport;
    }
    else if (lastSupport) {
        const tag = lastSupport.templater.tag;
        if (tag && subject.renderCount > 0) {
            checkTagSoftDestroy(tag, lastSupport, lastTag);
        }
    }
    const lastOwnerSupport = lastSupport?.ownerSupport;
    reSupport.ownerSupport = (ownerSupport || lastOwnerSupport);
    return { support: reSupport, wasLikeTags: isLikeTag };
}
function checkTagSoftDestroy(tag, lastSupport, lastTag) {
    if (tag.tagJsType === ValueTypes.dom) {
        const lastDom = lastTag?.dom;
        const newDom = tag.dom;
        if (lastDom !== newDom) {
            softDestroySupport(lastSupport);
        }
        return;
    }
    if (lastTag) {
        const lastStrings = lastTag.strings;
        if (lastStrings) {
            const oldLength = lastStrings?.length;
            const newLength = tag.strings.length;
            if (oldLength !== newLength) {
                softDestroySupport(lastSupport);
            }
        }
    }
}
//# sourceMappingURL=renderWithSupport.function.js.map