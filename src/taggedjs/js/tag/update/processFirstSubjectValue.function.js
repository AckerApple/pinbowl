import { processSubjectComponent } from './processSubjectComponent.function';
import { processTagArray } from './processTagArray';
import { TemplaterResult } from '../../TemplaterResult.class';
import { processFirstRegularValue } from './processRegularValue.function';
import { newTagSupportByTemplater, processTag, tagFakeTemplater } from './processTag.function';
import { ValueTypes, getValueType } from './processFirstSubject.utils';
import { renderTagOnly } from '../render/renderTagOnly.function';
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
            processSubjectComponent(value, subject, insertBefore, ownerSupport, options);
            return;
        case ValueTypes.function:
            const v = value;
            if (v.oneRender) {
                const templater = new TemplaterResult([]);
                templater.tagJsType = 'oneRender';
                const tagSupport = newTagSupportByTemplater(templater, ownerSupport, subject);
                let tag;
                const wrap = () => {
                    templater.tag = tag || (v());
                    return tagSupport;
                };
                // const wrap = () => ((v as any)())
                templater.wrapper = wrap;
                wrap.parentWrap = wrap;
                wrap.oneRender = true;
                wrap.parentWrap.original = v;
                renderTagOnly(tagSupport, tagSupport, subject, ownerSupport);
                // call inner function
                // templater.tag = (v as any)() as Tag
                processTag(templater, insertBefore, ownerSupport, subject);
                return;
            }
            break;
    }
    processFirstRegularValue(value, subject, insertBefore);
}
//# sourceMappingURL=processFirstSubjectValue.function.js.map