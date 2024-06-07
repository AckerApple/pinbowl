import { ValueSubject } from '../../subject/ValueSubject.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
import { TagSupport } from '../TagSupport.class.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getValueType } from '../getValueType.function.js';
export function processNewValue(value, ownerSupport) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.tagComponent:
            const tagSubject = new ValueSubject(value);
            return tagSubject;
        case ValueTypes.templater:
            const templater = value;
            const tag = templater.tag;
            return processNewTag(tag, ownerSupport);
        case ValueTypes.tag:
            return processNewTag(value, ownerSupport);
        case ValueTypes.subject:
            return value;
    }
    return new ValueSubject(value);
}
function processNewTag(value, ownerSupport) {
    const tag = value;
    let templater = tag.templater;
    if (!templater) {
        templater = new TemplaterResult([]);
        templater.tag = tag;
        tag.templater = templater;
    }
    const subject = new ValueSubject(templater);
    subject.tagSupport = new TagSupport(templater, ownerSupport, subject);
    ownerSupport.global.childTags.push(subject.tagSupport);
    return subject;
}
//# sourceMappingURL=processNewValue.function.js.map