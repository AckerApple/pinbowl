import { ValueSubject } from './subject/ValueSubject';
import { isSubjectInstance, isTagComponent, isTagInstance } from './isInstance';
export function processNewValue(hasValue, value, ownerTag) {
    if (isTagComponent(value)) {
        const tagSubject = new ValueSubject(value);
        return tagSubject;
    }
    if (value instanceof Function) {
        // return getSubjectFunction(value, ownerTag)
        return new ValueSubject(value);
    }
    if (!hasValue) {
        return; // more strings than values, stop here
    }
    if (isTagInstance(value)) {
        value.ownerTag = ownerTag;
        if (ownerTag.childTags.find(x => x === value)) {
            throw new Error('about to reattach tag already present - 2');
        }
        return new ValueSubject(value);
    }
    if (isSubjectInstance(value)) {
        return value; // its already a value subject
    }
    return new ValueSubject(value);
}
//# sourceMappingURL=processNewValue.function.js.map