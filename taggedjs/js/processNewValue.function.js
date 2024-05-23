import { ValueSubject } from './subject/ValueSubject';
import { isSubjectInstance, isTagClass, isTagComponent, isTagTemplater } from './isInstance';
import { TemplaterResult } from './TemplaterResult.class';
import { TagSupport } from './tag/TagSupport.class';
export function processNewValue(hasValue, value, ownerSupport) {
    if (isTagComponent(value)) {
        const tagSubject = new ValueSubject(value);
        return tagSubject;
    }
    if (value instanceof Function) {
        return new ValueSubject(value);
    }
    if (!hasValue) {
        return new ValueSubject(undefined);
    }
    if (isTagTemplater(value)) {
        const templater = value;
        const tag = templater.tag;
        return processNewTag(tag, ownerSupport);
    }
    if (isTagClass(value)) {
        return processNewTag(value, ownerSupport);
    }
    // is already a value subject?
    if (isSubjectInstance(value)) {
        return value;
    }
    return new ValueSubject(value);
}
function processNewTag(value, ownerSupport) {
    const tag = value;
    let templater = tag.templater;
    if (!templater) {
        const children = new ValueSubject([]);
        templater = new TemplaterResult(undefined, children);
        templater.tag = tag;
        tag.templater = templater;
    }
    const subject = new ValueSubject(templater);
    const tagSupport = subject.tagSupport = new TagSupport(templater, ownerSupport, subject);
    return subject;
}
//# sourceMappingURL=processNewValue.function.js.map