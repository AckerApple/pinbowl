import { deepClone } from '../deepFunctions.js';
import { ValueTypes } from './ValueTypes.enum.js';
import { isArray } from '../isInstance.js';
export function cloneValueArray(values) {
    return values.map(cloneTagJsValue);
}
/** clones only what is needed to compare differences later */
export function cloneTagJsValue(value, maxDepth) {
    const tag = value;
    const tagJsType = value?.tagJsType;
    if (tagJsType) {
        switch (tagJsType) {
            case ValueTypes.stateRender:
                return undefined;
            case ValueTypes.dom:
            case ValueTypes.tag:
            case ValueTypes.templater:
                return cloneValueArray(tag.values);
        }
    }
    if (isArray(value)) {
        return cloneValueArray(tag);
    }
    return deepClone(value, maxDepth);
}
//# sourceMappingURL=cloneValueArray.function.js.map