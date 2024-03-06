import { getSubjectFunction, setValueRedraw } from "./Tag.utils.js";
import { ValueSubject } from "./ValueSubject.js";
import { isSubjectInstance, isTagComponent, isTagInstance } from "./isInstance.js";
export function processNewValue(hasValue, value, context, variableName, ownerTag) {
    if (isTagComponent(value)) {
        const existing = context[variableName] = new ValueSubject(value);
        setValueRedraw(value, existing, ownerTag);
        return;
    }
    if (value instanceof Function) {
        context[variableName] = getSubjectFunction(value, ownerTag);
        return;
    }
    if (!hasValue) {
        return; // more strings than values, stop here
    }
    if (isTagInstance(value)) {
        value.ownerTag = ownerTag;
        ownerTag.children.push(value);
        context[variableName] = new ValueSubject(value);
        return;
    }
    if (isSubjectInstance(value)) {
        context[variableName] = value; // its already a value subject
        return;
    }
    context[variableName] = new ValueSubject(value);
}
//# sourceMappingURL=processNewValue.function.js.map