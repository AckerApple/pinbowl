import { deepClone } from '../deepFunctions';
import { isTagArray, isTagClass, isTagComponent, isTagTemplater } from '../isInstance';
export function cloneValueArray(values) {
    return values.map((value) => {
        const tag = value;
        if (isTagComponent(value)) {
            const tagComponent = value;
            return deepClone(tagComponent.props);
        }
        if (isTagClass(tag) || isTagTemplater(tag)) {
            return cloneValueArray(tag.values);
        }
        if (isTagArray(tag)) {
            return cloneValueArray(tag);
        }
        return deepClone(value);
    });
}
//# sourceMappingURL=cloneValueArray.function.js.map