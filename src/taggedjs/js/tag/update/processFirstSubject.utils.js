import { isSubjectInstance, isTagArray, isTagClass, isTagComponent, isTagTemplater } from '../../isInstance';
import { isSimpleType } from '../checkDestroyPrevious.function';
export var ValueTypes;
(function (ValueTypes) {
    ValueTypes["unknown"] = "unknown";
    ValueTypes["tag"] = "tag";
    ValueTypes["templater"] = "templater";
    ValueTypes["tagArray"] = "tag-array";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["subject"] = "subject";
    ValueTypes["date"] = "date";
    ValueTypes["string"] = "string";
    ValueTypes["boolean"] = "boolean";
    ValueTypes["function"] = "function";
    ValueTypes["undefined"] = "undefined";
})(ValueTypes || (ValueTypes = {}));
export function getValueType(value) {
    if (value === undefined || value === null) {
        return ValueTypes.undefined;
    }
    if (value instanceof Date) {
        return ValueTypes.date;
    }
    if (value instanceof Function) {
        return ValueTypes.function;
    }
    const type = typeof (value);
    if (isSimpleType(type)) {
        return type;
    }
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
    if (isSubjectInstance(value)) {
        return ValueTypes.subject;
    }
    return ValueTypes.unknown;
}
//# sourceMappingURL=processFirstSubject.utils.js.map