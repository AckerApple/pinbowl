import { isLikeTags } from '../isLikeTags.function.js';
import { renderTagOnly } from './renderTagOnly.function.js';
import { destroyUnlikeTags } from './destroyUnlikeTags.function.js';
export function renderWithSupport(newTagSupport, lastSupport, // previous
subject, // events & memory
ownerSupport) {
    const reSupport = renderTagOnly(newTagSupport, lastSupport, subject, ownerSupport);
    const isLikeTag = !lastSupport || isLikeTags(lastSupport, reSupport);
    if (!isLikeTag) {
        destroyUnlikeTags(lastSupport, reSupport, subject);
        reSupport.global.oldest = reSupport;
    }
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
    return reSupport;
}
//# sourceMappingURL=renderWithSupport.function.js.map