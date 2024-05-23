import { isSubjectInstance, isTagComponent } from './isInstance';
import { TagSupport } from './tag/TagSupport.class';
export function updateContextItem(context, variableName, value) {
    const subject = context[variableName];
    const tagSubject = subject;
    const tagSupport = tagSubject.tagSupport;
    if (tagSupport) {
        if (value) {
            if (isTagComponent(value)) {
                const templater = value;
                let newSupport = new TagSupport(templater, tagSupport.ownerTagSupport, subject);
                if (isTagComponent(tagSupport)) {
                    shareTemplaterGlobal(tagSupport, newSupport);
                }
            }
        }
    }
    if (isSubjectInstance(value)) {
        return; // emits on its own
    }
    // listeners will evaluate updated values to possibly update display(s)
    subject.set(value);
    return;
}
function shareTemplaterGlobal(oldTagSupport, tagSupport) {
    const oldTemp = oldTagSupport.templater;
    const oldWrap = oldTemp.wrapper; // tag versus component
    const oldValueFn = oldWrap.original;
    const templater = tagSupport.templater;
    const newWrapper = templater.wrapper;
    const newValueFn = newWrapper?.original;
    const fnMatched = oldValueFn === newValueFn;
    if (fnMatched) {
        tagSupport.global = oldTagSupport.global;
        const newest = oldTagSupport.global.newest;
        if (newest) {
            const prevState = newest.memory.state;
            tagSupport.memory.state = [...prevState];
        }
    }
}
//# sourceMappingURL=updateContextItem.function.js.map