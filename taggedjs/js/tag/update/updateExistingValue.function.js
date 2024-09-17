import { getSupport } from '../Support.class.js';
import { getFakeTemplater, newSupportByTemplater, processTag } from './processTag.function.js';
import { processNowRegularValue } from './processRegularValue.function.js';
import { processReplacementComponent } from './processFirstSubjectComponent.function.js';
import { updateExistingTagComponent } from './updateExistingTagComponent.function.js';
import { BasicTypes, ValueTypes } from '../ValueTypes.enum.js';
import { updateSupportBy } from '../updateSupportBy.function.js';
import { isArray, isTagComponent } from '../../isInstance.js';
import { getNewGlobal } from './getNewGlobal.function.js';
import { processTagArray } from './processTagArray.js';
export function updateExistingValue(contextItem, value, ownerSupport) {
    // Do not continue if the value is just the same
    if (value === contextItem.value) {
        return;
    }
    const wasDestroyed = contextItem.checkValueChange(value, contextItem);
    if (wasDestroyed === -1) {
        return; // do nothing
    }
    // handle already seen tag components
    const tagJsType = value && value.tagJsType;
    if (tagJsType) {
        if (tagJsType === ValueTypes.renderOnce) {
            return;
        }
        const isComp = isTagComponent(value);
        if (isComp) {
            if (!contextItem.global) {
                getNewGlobal(contextItem);
            }
            prepareUpdateToComponent(value, contextItem, ownerSupport);
            return;
        }
    }
    const global = contextItem.global;
    if (global) {
        // its html/dom based tag
        const support = global.newest;
        if (support) {
            updateContextItemBySupport(support, contextItem, value, ownerSupport);
            return;
        }
    }
    if (tagJsType) {
        switch (tagJsType) {
            case ValueTypes.templater:
                processTag(ownerSupport, contextItem);
                return;
            case ValueTypes.tag:
            case ValueTypes.dom: {
                const tag = value;
                let templater = tag.templater;
                if (!templater) {
                    templater = getFakeTemplater();
                    tag.templater = templater;
                    templater.tag = tag;
                }
                const nowGlobal = (contextItem.global ? contextItem.global : getNewGlobal(contextItem));
                nowGlobal.newest = newSupportByTemplater(templater, ownerSupport, contextItem);
                processTag(ownerSupport, contextItem);
                return;
            }
        }
    }
    if (isArray(value)) {
        processTagArray(contextItem, value, ownerSupport, { added: 0, removed: 0 });
        return;
    }
    if (typeof (value) === BasicTypes.function) {
        contextItem.value = value; // do not render functions that are not explicity defined as tag html processing
        return;
    }
    if (wasDestroyed) {
        processNowRegularValue(value, contextItem);
    }
}
function handleStillTag(lastSupport, subject, value, ownerSupport) {
    const templater = value.templater || value;
    const valueSupport = getSupport(templater, ownerSupport, ownerSupport.appSupport, subject);
    const lastSubject = lastSupport.subject;
    const newGlobal = lastSubject.global;
    const oldest = newGlobal.oldest;
    updateSupportBy(oldest, valueSupport);
}
function prepareUpdateToComponent(templater, contextItem, ownerSupport) {
    const global = contextItem.global;
    // When last value was not a component
    if (!global.newest) {
        processReplacementComponent(templater, contextItem, ownerSupport, { added: 0, removed: 0 });
        return;
    }
    const support = getSupport(templater, ownerSupport, ownerSupport.appSupport, contextItem);
    updateExistingTagComponent(ownerSupport, support, // latest value
    contextItem);
}
/** Used to destro */
function updateContextItemBySupport(support, contextItem, value, ownerSupport) {
    if (typeof (value) === BasicTypes.function) {
        return;
    }
    handleStillTag(support, contextItem, value, ownerSupport);
    return;
}
//# sourceMappingURL=updateExistingValue.function.js.map