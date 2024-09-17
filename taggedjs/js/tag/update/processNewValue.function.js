import { getTemplaterResult } from '../TemplaterResult.class.js';
import { checkTagValueChange } from '../checkDestroyPrevious.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getSupport } from '../Support.class.js';
import { getNewGlobal } from './getNewGlobal.function.js';
import { PropWatches } from '../tag.js';
export function processNewArrayValue(value, ownerSupport, contextItem) {
    const tagJsType = value.tagJsType;
    if (tagJsType) {
        switch (tagJsType) {
            case ValueTypes.templater: {
                const templater = value;
                const tag = templater.tag;
                processNewTag(tag, ownerSupport, contextItem);
                break;
            }
            case ValueTypes.tag:
            case ValueTypes.dom:
                processNewTag(value, ownerSupport, contextItem);
                break;
        }
    }
    return contextItem;
}
function processNewTag(value, ownerSupport, contextItem) {
    contextItem.checkValueChange = checkTagValueChange;
    const tag = value;
    let templater = tag.templater;
    // TODO: Can this ever happen?
    if (!templater) {
        templater = getTemplaterResult(PropWatches.DEEP);
        templater.tag = tag;
        tag.templater = templater;
    }
    const global = contextItem.global = getNewGlobal(contextItem); // contextItem.global as SupportTagGlobal
    const newest = global.newest = getSupport(templater, ownerSupport, ownerSupport.appSupport, contextItem);
    global.oldest = newest;
    return contextItem;
}
//# sourceMappingURL=processNewValue.function.js.map