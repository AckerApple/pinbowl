import { BasicTypes, ValueTypes } from './ValueTypes.enum.js';
import { setUseMemory } from '../state/setUse.function.js';
export function executeWrap(templater, result, useSupport, castedProps) {
    const originalFunction = result.original; // (innerTagWrap as any).original as unknown as TagComponent
    const stateless = templater.tagJsType === ValueTypes.stateRender;
    let tag;
    if (stateless) {
        tag = templater();
    }
    else {
        tag = originalFunction(...castedProps);
        // CALL ORIGINAL COMPONENT FUNCTION
        if (typeof (tag) === BasicTypes.function) {
            tag = tag();
        }
    }
    tag.templater = templater;
    templater.tag = tag;
    const nowState = setUseMemory.stateConfig.array;
    useSupport.state = nowState;
    return useSupport;
}
//# sourceMappingURL=executeWrap.function.js.map