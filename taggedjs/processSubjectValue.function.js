import { processSubjectComponent } from "./processSubjectComponent.function.js";
import { processTagResult } from "./processTagResult.function.js";
import { isTagArray, isTagComponent, isTagInstance } from "./isInstance.js";
import { processTagArray } from "./processTagArray.js";
import { TagSupport } from "./TagSupport.class.js";
import { ValueSubject } from "./ValueSubject.js";
import { processRegularValue } from "./processRegularValue.function.js";
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
export function processSubjectValue(value, result, // could be tag via result.tag
template, // <template end interpolate /> (will be removed)
ownerTag, // owner
options) {
    const valueType = getValueType(value);
    switch (valueType) {
        case ValueTypes.tag:
            return {
                clones: processTag(value, result, template, ownerTag, options)
            };
        case ValueTypes.tagArray:
            const clones = processTagArray(result, value, template, ownerTag, options);
            return { clones };
        case ValueTypes.tagComponent:
            return {
                clones: processSubjectComponent(value, result, template, ownerTag, options)
            };
    }
    return {
        clones: processRegularValue(value, result, template)
    };
}
export function processTag(value, result, // could be tag via result.tag
template, // <template end interpolate /> (will be removed)
ownerTag, // owner
options) {
    // first time seeing this tag?
    if (!value.tagSupport) {
        value.tagSupport = new TagSupport({}, // the template is provided via html`` call
        new ValueSubject([]));
        // asking me to render will cause my parent to render
        value.tagSupport.mutatingRender = () => {
            ownerTag.tagSupport.render();
        };
        value.tagSupport.oldest = value.tagSupport.oldest || value;
        ownerTag.children.push(value);
        value.ownerTag = ownerTag;
    }
    result.template = template;
    const clones = processTagResult(value, result, // Function will attach result.tag
    template, options);
    return clones;
}
export function destroySimpleValue(template, subject) {
    const clone = subject.clone;
    const parent = clone.parentNode;
    if (clone === template) {
        throw 'ok';
    }
    // put the template back down
    parent.insertBefore(template, clone);
    parent.removeChild(clone);
    delete subject.clone;
    delete subject.lastValue;
}
//# sourceMappingURL=processSubjectValue.function.js.map