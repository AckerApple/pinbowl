import { isSubjectInstance, isTagArray } from '../../isInstance';
import { isSimpleType } from '../checkDestroyPrevious.function';
export var ValueTypes;
(function (ValueTypes) {
    ValueTypes["unknown"] = "unknown";
    ValueTypes["tag"] = "tag";
    ValueTypes["templater"] = "templater";
    ValueTypes["tagComponent"] = "tag-component";
    ValueTypes["tagArray"] = "tag-array";
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
    const type = typeof (value);
    if (value instanceof Function) {
        return ValueTypes.function;
    }
    if (type === 'object') {
        if (value instanceof Date) {
            return ValueTypes.date;
        }
        if (isSimpleType(type)) {
            return type;
        }
        const tagJsType = value.tagJsType;
        if (tagJsType) {
            const included = [
                ValueTypes.tagComponent,
                ValueTypes.templater,
                ValueTypes.tag,
            ].includes(tagJsType);
            if (included) {
                return tagJsType;
            }
        }
        if (isTagArray(value)) {
            return ValueTypes.tagArray;
        }
        if (isSubjectInstance(value)) {
            return ValueTypes.subject;
        }
    }
    return ValueTypes.unknown;
}
//# sourceMappingURL=processFirstSubject.utils.js.map