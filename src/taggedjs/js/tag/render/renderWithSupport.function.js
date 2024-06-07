import { isLikeTags } from '../isLikeTags.function.js';
import { renderTagOnly } from './renderTagOnly.function.js';
import { destroyUnlikeTags } from './destroyUnlikeTags.function.js';
export function renderWithSupport(newTagSupport, lastSupport, // previous
subject, // events & memory
ownerSupport) {
    const reSupport = renderTagOnly(newTagSupport, lastSupport, subject, ownerSupport);
    const isLikeTag = !lastSupport || isLikeTags(lastSupport, reSupport);
    if (!isLikeTag) {
        // console.log('some unlike tag destroying going on START')
        destroyUnlikeTags(lastSupport, reSupport, subject);
        // console.log('some unlike tag destroying going on END', lastSupport.global.deleted)
        reSupport.global.oldest = reSupport;
        // console.log('some unlike tag destroying going on END', reSupport.global.deleted)
    }
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
    return reSupport;
}
//# sourceMappingURL=renderWithSupport.function.js.map