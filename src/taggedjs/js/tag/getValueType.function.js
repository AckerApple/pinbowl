import { BasicTypes, ImmutableTypes, ValueTypes } from './ValueTypes.enum.js';
import { isSimpleType, isSubjectInstance } from '../isInstance.js';
export function getValueType(value) {
    if (value === undefined || value === null) {
        return ImmutableTypes.undefined;
    }
    const tagJsType = value.tagJsType;
    if (tagJsType) {
        return tagJsType; // oneRender, stateRender
    }
    if (value instanceof Function) {
        return BasicTypes.function;
    }
    if (value instanceof Date) {
        return BasicTypes.date;
    }
    if (value instanceof Array) {
        return ValueTypes.tagArray;
    }
    const type = typeof (value);
    if (isSimpleType(type)) {
        return type;
    }
    if (type === BasicTypes.object) {
        if (isSubjectInstance(value)) {
            return ValueTypes.subject;
        }
    }
    return BasicTypes.unknown;
}
//# sourceMappingURL=getValueType.function.js.map