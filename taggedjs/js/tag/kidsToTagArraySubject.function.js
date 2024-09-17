import { isSubjectInstance, isTagArray } from '../isInstance.js';
import { ValueSubject } from '../subject/ValueSubject.js';
export function kidsToTagArraySubject(children, templaterResult) {
    if (isSubjectInstance(children)) {
        return children;
    }
    const kidArray = children;
    if (isTagArray(kidArray)) {
        templaterResult.madeChildIntoSubject = true; // was converted into a subject
        return new ValueSubject(children);
    }
    const kid = children;
    if (kid) {
        templaterResult.madeChildIntoSubject = true // was converted into a subject
        ;
        kid.arrayValue = 0;
        return new ValueSubject([kid]);
    }
    templaterResult.madeChildIntoSubject = true; // was converted into a subject
    return new ValueSubject([]);
}
//# sourceMappingURL=kidsToTagArraySubject.function.js.map