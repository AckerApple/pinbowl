import { isSimpleType } from './checkDestroyPrevious.function.js';
import { ValueTypes } from './ValueTypes.enum.js';
import { isSubjectInstance, isTagArray } from '../isInstance.js';
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
//# sourceMappingURL=getValueType.function.js.map