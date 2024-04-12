import { processSubjectComponent } from './processSubjectComponent.function';
import { isTagArray, isTagComponent, isTagInstance } from './isInstance';
import { processTagArray } from './processTagArray';
import { processRegularValue } from './processRegularValue.function';
import { processTag } from './processTag.function';
var ValueTypes;
(function (ValueTypes) {
    ValueTypes["tag"] = "tag";
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["value"] = "value";
})(ValueTypes || (ValueTypes = {}));
function getValueType(value) {
    if (isTagComponent(value)) {
        return ValueTypes.tagComponent;
    }
    if (isTagInstance(value)) {
        return ValueTypes.tag;
    }
    if (isTagArray(value)) {
        return ValueTypes.tagArray;
    }
    return ValueTypes.value;
}
export function processSubjectValue(value, subject, // could be tag via result.tag
insertBefore, // <template end interpolate /> (will be removed)
ownerTag, // owner
options) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.tag:
            processTag(value, subject, insertBefore, ownerTag);
            return;
        case ValueTypes.tagArray:
            return processTagArray(subject, value, insertBefore, ownerTag, options);
        case ValueTypes.tagComponent:
            processSubjectComponent(value, subject, insertBefore, ownerTag, options);
            return;
    }
    processRegularValue(value, subject, insertBefore);
}
//# sourceMappingURL=processSubjectValue.function.js.map