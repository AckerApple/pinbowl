import { deepClone } from '../deepFunctions';
import { ValueTypes, getValueType } from './update/processFirstSubject.utils';
export function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        switch (getValueType(value)) {
            case ValueTypes.tagComponent:
                const tagComponent = value;
                return deepClone(tagComponent.props);
            case ValueTypes.tag:
            case ValueTypes.templater:
                return cloneValueArray(tag.values);
            case ValueTypes.tagArray:
                return cloneValueArray(tag);
        }
        return deepClone(value);
    });
}
//# sourceMappingURL=cloneValueArray.function.js.map