import { renderWithSupport } from './renderWithSupport.function.js';
import { processTag } from '../update/processTag.function.js';
import { updateSupportBy } from '../updateSupportBy.function.js';
// TODO: This function is being called for 1st time renders WHEN renderCount === 1
export function renderExistingReadyTag(lastSupport, newSupport, // new to be rendered
ownerSupport, // ownerSupport
subject) {
    const global = subject.global;
    const { support, wasLikeTags } = renderWithSupport(newSupport, lastSupport, // renderCount <= 0 ? undefined : lastSupport
    subject, ownerSupport);
    if (wasLikeTags) {
        updateSupportBy(global.oldest, support);
        return support;
    }
    processTag(ownerSupport, subject);
    return support;
}
//# sourceMappingURL=renderExistingTag.function.js.map