import { processSubjectComponent } from './processSubjectComponent.function.js';
import { processTagArray } from './processTagArray.js';
import { processFirstRegularValue } from './processRegularValue.function.js';
import { processTag, tagFakeTemplater } from './processTag.function.js';
import { renderTagOnly } from '../render/renderTagOnly.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { oneRenderToTagSupport } from './oneRenderToTagSupport.function.js';
import { getValueType } from '../getValueType.function.js';
export function processFirstSubjectValue(value, subject, // could be tag via result.tag
insertBefore, // <template end interpolate /> (will be removed)
ownerSupport, // owner
options) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.templater:
            processTag(value, insertBefore, ownerSupport, subject);
            return;
        case ValueTypes.tag:
            const tag = value;
            let templater = tag.templater;
            if (!templater) {
                templater = tagFakeTemplater(tag);
            }
            processTag(templater, insertBefore, ownerSupport, subject);
            return;
        case ValueTypes.tagArray:
            return processTagArray(subject, value, insertBefore, ownerSupport, options);
        case ValueTypes.tagComponent:
            const newSupport = processSubjectComponent(value, subject, insertBefore, ownerSupport, options);
            return newSupport;
        case ValueTypes.function:
            const v = value;
            if (v.oneRender) {
                const tagSupport = oneRenderToTagSupport(v, subject, ownerSupport);
                renderTagOnly(tagSupport, tagSupport, subject, ownerSupport);
                processTag(tagSupport.templater, insertBefore, ownerSupport, subject);
                return;
            }
            break;
    }
    processFirstRegularValue(value, subject, insertBefore);
}
//# sourceMappingURL=processFirstSubjectValue.function.js.map