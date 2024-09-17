import { checkArrayValueChange, checkSimpleValueChange, checkTagValueChange } from '../checkDestroyPrevious.function.js';
import { processFirstSubjectComponent, processReplacementComponent } from './processFirstSubjectComponent.function.js';
import { newSupportByTemplater, processTag, tagFakeTemplater } from './processTag.function.js';
import { castTextValue, updateBeforeTemplate } from '../../updateBeforeTemplate.function.js';
import { oneRenderToSupport } from './oneRenderToSupport.function.js';
import { renderTagOnly } from '../render/renderTagOnly.function.js';
import { isArray, isSubjectInstance } from '../../isInstance.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getNewGlobal } from './getNewGlobal.function.js';
import { processTagArray } from './processTagArray.js';
import { processNewSubjectTag } from './processNewSubjectTag.function.js';
export function processFirstSubjectValue(value, subject, // could be tag via result.tag
ownerSupport, // owning support
counts, // {added:0, removed:0}
valueId, appendTo) {
    const tagJsType = value?.tagJsType;
    if (tagJsType) {
        switch (tagJsType) {
            // TODO: Do we ever get in here? because dom, tag, and component are covered below
            case ValueTypes.templater:
                subject.checkValueChange = checkTagValueChange;
                if (appendTo) {
                    return processNewSubjectTag(value, ownerSupport, subject, appendTo);
                }
                return processTag(ownerSupport, subject);
            case ValueTypes.dom:
            case ValueTypes.tag: {
                subject.checkValueChange = checkTagValueChange;
                const tag = value;
                let templater = tag.templater;
                if (!templater) {
                    templater = tagFakeTemplater(tag); // TODO: most likely a not needed performance hit
                }
                const global = getNewGlobal(subject);
                if (appendTo) {
                    return processNewSubjectTag(templater, ownerSupport, subject, appendTo);
                }
                global.newest = newSupportByTemplater(templater, ownerSupport, subject);
                subject.checkValueChange = checkTagValueChange;
                return processTag(ownerSupport, subject);
            }
            case ValueTypes.stateRender:
            case ValueTypes.tagComponent: {
                getNewGlobal(subject);
                subject.checkValueChange = checkTagValueChange;
                if (appendTo) {
                    const processResult = processFirstSubjectComponent(value, subject, ownerSupport, counts, appendTo);
                    // ++subject.global.renderCount
                    return processResult;
                }
                const processResult = processReplacementComponent(value, subject, ownerSupport, counts);
                // ++subject.global.renderCount
                return processResult;
            }
            case ValueTypes.renderOnce: {
                getNewGlobal(subject);
                const support = oneRenderToSupport(value, subject, ownerSupport);
                renderTagOnly(support, undefined, // support (no prev support)
                subject, ownerSupport);
                const result = processNewSubjectTag(support.templater, ownerSupport, subject, appendTo);
                // ++subject.global.renderCount
                subject.checkValueChange = checkTagValueChange;
                return result;
            }
        }
    }
    if (isArray(value)) {
        processTagArray(subject, value, ownerSupport, counts, appendTo);
        subject.checkValueChange = checkArrayValueChange;
        return;
    }
    if (isSubjectInstance(value)) {
        return; // will be subscribed to for value
    }
    processFirstRegularValue(value, subject, subject.placeholder, valueId);
}
function processFirstRegularValue(value, subject, // could be tag via subject.tag
insertBefore, // <template end interpolate /> (will be removed)
valueId) {
    const castedValue = castTextValue(value);
    const clone = updateBeforeTemplate(castedValue, insertBefore);
    clone.id = valueId;
    subject.simpleValueElm = clone;
    subject.checkValueChange = checkSimpleValueChange;
}
//# sourceMappingURL=processFirstSubjectValue.function.js.map