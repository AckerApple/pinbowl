import { processSubjectComponent } from './processSubjectComponent.function';
import { isTagArray, isTagClass, isTagComponent, isTagTemplater } from './isInstance';
import { processTagArray } from './processTagArray';
import { processRegularValue } from './processRegularValue.function';
import { processTag, tagFakeTemplater } from './processTag.function';
var ValueTypes;
(function (ValueTypes) {
    ValueTypes["tag"] = "tag";
    ValueTypes["templater"] = "templater";
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["value"] = "value";
})(ValueTypes || (ValueTypes = {}));
function getValueType(value) {
    if (isTagComponent(value)) {
        return ValueTypes.tagComponent;
    }
    if (isTagTemplater(value)) {
        return ValueTypes.templater;
    }
    if (isTagClass(value)) {
        return ValueTypes.tag;
    }
    if (isTagArray(value)) {
        return ValueTypes.tagArray;
    }
    return ValueTypes.value;
}
// export type ExistingValue = TemplaterResult | Tag[] | TagSupport | Function | Subject<unknown> | RegularValue | Tag
export function processSubjectValue(value, subject, // could be tag via result.tag
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
    }
    processRegularValue(value, subject, insertBefore);
}
//# sourceMappingURL=processSubjectValue.function.js.map