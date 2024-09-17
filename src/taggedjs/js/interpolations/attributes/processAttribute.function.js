// taggedjs-no-compile
import { specialAttribute } from './specialAttribute.js';
import { isFunction, isObject, isSubjectInstance } from '../../isInstance.js';
import { bindSubjectCallback } from './bindSubjectCallback.function.js';
import { BasicTypes, ValueTypes, empty } from '../../tag/ValueTypes.enum.js';
import { paintContent } from '../../tag/paint.function.js';
import { processDynamicNameValueAttribute, processNonDynamicAttr } from './processNameValueAttribute.function.js';
import { addOneContext, checkSimpleValueChange } from '../../tag/index.js';
import { processAttributeFunction } from './processAttributeCallback.function.js';
import { isSpecialAttr } from './isSpecialAttribute.function.js';
/** Sets attribute value, subscribes to value updates  */
export function processAttribute(values, attrName, element, support, howToSet, //  = howToSetInputValue
context, value, isSpecial) {
    const nameVar = getTagJsVar(attrName);
    const isNameVar = nameVar >= 0;
    if (isNameVar) {
        const value = values[nameVar];
        const contextItem = addOneContext(value, context, true);
        contextItem.isAttr = true;
        contextItem.element = element;
        contextItem.howToSet = howToSet;
        contextItem.isNameOnly = true;
        processNameOnlyAttrValue(values, value, element, support, howToSet, context);
        return;
    }
    const valueVar = getTagJsVar(value);
    if (valueVar >= 0) {
        const value = values[valueVar];
        const contextItem = {
            isAttr: true,
            element,
            attrName: attrName,
            checkValueChange: checkSimpleValueChange,
            withinOwnerElement: true,
        };
        context.push(contextItem);
        const isSubject = isSubjectInstance(contextItem.value);
        if (isSubject) {
            return processNameValueAttributeAttrSubject(attrName, contextItem, element, support, howToSet, isSpecial);
        }
        processDynamicNameValueAttribute(attrName, value, contextItem, element, howToSet, support, isSpecial);
        contextItem.value = value;
        return;
    }
    return processNonDynamicAttr(attrName, value, element, howToSet, isSpecial);
}
export function updateNameOnlyAttrValue(values, attrValue, lastValue, element, ownerSupport, howToSet, context) {
    // check to remove previous attribute(s)
    if (lastValue) {
        if (isNoDisplayValue(attrValue)) {
            element.removeAttribute(lastValue);
            return;
        }
        if (typeof (lastValue) === BasicTypes.object) {
            const isObStill = typeof (attrValue) === BasicTypes.object;
            if (isObStill) {
                for (const name in lastValue) {
                    // if((attrValue as any)[name]) {
                    if (name in attrValue) {
                        continue;
                    }
                    paintContent.push(function paintContent() {
                        element.removeAttribute(name);
                    });
                }
            }
            else {
                for (const name in lastValue) {
                    paintContent.push(function paintContent() {
                        element.removeAttribute(name);
                    });
                }
            }
        }
    }
    processNameOnlyAttrValue(values, attrValue, element, ownerSupport, howToSet, context);
}
export function processNameOnlyAttrValue(values, attrValue, element, ownerSupport, howToSet, context) {
    if (isNoDisplayValue(attrValue)) {
        return;
    }
    // process an object of attributes ${{class:'something, checked:true}}
    if (typeof attrValue === BasicTypes.object) {
        for (const name in attrValue) {
            const value = attrValue[name];
            processAttribute(values, name, element, ownerSupport, howToSet, context, value, isSpecialAttr(name));
        }
        return;
    }
    // regular attributes
    if (attrValue.length === 0) {
        return; // ignore, do not set at this time
    }
    howToSet(element, attrValue, empty);
}
/** Processor for flat attributes and object attributes */
function processNameValueAttributeAttrSubject(attrName, result, element, support, howToSet, isSpecial) {
    if (isSpecial) {
        paintContent.push(function paintContent() {
            element.removeAttribute(attrName);
        });
    }
    const contextValueSubject = result.value;
    if (isSubjectInstance(contextValueSubject)) {
        const callback = function processAttrCallback(newAttrValue) {
            processAttributeEmit(newAttrValue, attrName, result, element, support, howToSet, isSpecial);
        };
        // 🗞️ Subscribe. Above callback called immediately since its a ValueSubject()
        const sub = contextValueSubject.subscribe(callback);
        // Record subscription for later unsubscribe when element destroyed
        const global = result.global;
        const subs = global.subscriptions = global.subscriptions || [];
        subs.push(sub);
    }
    processAttributeEmit(result.value, attrName, result, element, support, howToSet, isSpecial);
    return;
}
export function processAttributeEmit(newAttrValue, attrName, subject, element, support, howToSet, isSpecial) {
    // should the function be wrapped so every time its called we re-render?
    if (isFunction(newAttrValue)) {
        return callbackFun(support, newAttrValue, element, attrName, isSpecial, howToSet, subject);
    }
    return processAttributeSubjectValue(newAttrValue, element, attrName, isSpecial, howToSet, support);
}
export function processAttributeSubjectValue(newAttrValue, element, attrName, isSpecial, howToSet, support) {
    if (isFunction(newAttrValue)) {
        return processAttributeFunction(element, newAttrValue, support, attrName);
    }
    if (isSpecial) {
        specialAttribute(attrName, newAttrValue, element, isSpecial);
        return;
    }
    switch (newAttrValue) {
        case undefined:
        case false:
        case null:
            paintContent.push(function paintContentPush() {
                element.removeAttribute(attrName);
            });
            return;
    }
    // value is 0
    howToSet(element, attrName, newAttrValue);
}
function callbackFun(support, newAttrValue, element, attrName, isSpecial, howToSet, subject) {
    const wrapper = support.templater.wrapper;
    const parentWrap = wrapper?.parentWrap;
    const tagJsType = wrapper?.tagJsType || parentWrap?.tagJsType;
    const oneRender = tagJsType === ValueTypes.renderOnce;
    if (!oneRender) {
        return processTagCallbackFun(subject, newAttrValue, support, attrName, element);
    }
    return processAttributeSubjectValue(newAttrValue, element, attrName, isSpecial, howToSet, support);
}
export function processTagCallbackFun(subject, newAttrValue, support, attrName, element) {
    const prevFun = subject.value;
    if (prevFun && prevFun.tagFunction && prevFun.support) {
        prevFun.tagFunction = newAttrValue;
        prevFun.support = support;
        return prevFun;
    }
    // tag has state and will need all functions wrapped to cause re-renders
    newAttrValue = bindSubjectCallback(newAttrValue, support);
    return processAttributeFunction(element, newAttrValue, support, attrName);
}
function getTagJsVar(attrPart) {
    if (isObject(attrPart) && 'tagJsVar' in attrPart)
        return attrPart.tagJsVar;
    return -1;
    // return (attrPart as TagVarIdNum)?.tagJsVar || -1
}
export function isNoDisplayValue(attrValue) {
    return undefined === attrValue || null === attrValue || false === attrValue;
}
//# sourceMappingURL=processAttribute.function.js.map