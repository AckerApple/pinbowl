import { isSubjectInstance } from '../../isInstance.js';
export function updateContextItem(context, variableName, value) {
    const subject = context[variableName];
    if (isSubjectInstance(value)) {
        return; // emits on its own
    }
    // listeners will evaluate updated values to possibly update display(s)
    subject.next(value);
    return;
}
//# sourceMappingURL=updateContextItem.function.js.map