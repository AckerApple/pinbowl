import { specialAttribute } from './specialAttribute.js';
import { isSubjectInstance } from '../isInstance.js';
import { howToSetInputValue } from './interpolateAttributes.js';
import { bindSubjectCallback } from './bindSubjectCallback.function.js';
import { ImmutableTypes, ValueTypes, empty } from '../tag/ValueTypes.enum.js';
import { TagJsSubject } from '../tag/update/TagJsSubject.class.js';
const INPUT = 'INPUT';
const valueS = 'value';
const ondoubleclick = 'ondoubleclick';
/** Sets attribute value, subscribes to value updates  */
export function processAttribute(attrs, element, scope, support, howToSet = howToSetInputValue) {
    const attrName = attrs[0];
    const value = attrs[1];
    if (element.nodeName === INPUT && attrName === valueS) {
        howToSet = howToSetInputValue;
    }
    const isNameVar = attrs.length === 1; // isTagVar(attrName)
    if (isNameVar) {
        const contextValueSubject = attrName; // getContextValueByVarString(scope, attrName)
        let lastValue;
        // the above callback gets called immediately since its a ValueSubject()
        const sub = contextValueSubject.subscribe((value) => {
            if (value === lastValue) {
                return; // value did not change
            }
            processNameOnlyAttr(value, lastValue, element, support, howToSet);
            lastValue = value;
        });
        support.subject.global.subscriptions.push(sub); // this is where unsubscribe is picked up
        element.removeAttribute(attrName);
        return;
    }
    const isSubject = value && isSubjectInstance(value);
    // const isSubject = isTagVar(value)
    if (isSubject) {
        return processNameValueAttr(attrName, value, element, support, howToSet);
    }
    // Non dynamic
    const isSpecial = isSpecialAttr(attrName);
    if (isSpecial) {
        return specialAttribute(attrName, value, element);
    }
    howToSet(element, attrName, value);
}
function processNameOnlyAttr(attrValue, lastValue, child, ownerSupport, howToSet) {
    // check to remove previous attribute(s)
    if (lastValue && lastValue != attrValue) {
        if (typeof (lastValue) === ImmutableTypes.string) {
            child.removeAttribute(lastValue);
        }
        else if (lastValue instanceof Object) {
            for (const name in lastValue) {
                child.removeAttribute(name);
            }
        }
    }
    // regular attributes
    if (typeof (attrValue) === ImmutableTypes.string) {
        if (!attrValue.length) {
            return;
        }
        processNameValueAttr(attrValue, // name
        new TagJsSubject(empty), child, ownerSupport, howToSet);
        return;
    }
    // process an object of attributes ${{class:'something, checked:true}}
    if (attrValue instanceof Object) {
        for (const name in attrValue) {
            processNameValueAttr(name, attrValue[name], child, ownerSupport, howToSet);
        }
    }
}
/** Processor for flat attributes and object attributes */
function processNameValueAttr(attrName, result, child, support, howToSet) {
    // Most every variable comes in here since everything is made a ValueSubject
    if (isSubjectInstance(result)) {
        const isSpecial = isSpecialAttr(attrName);
        child.removeAttribute(attrName);
        let lastValue;
        const callback = (newAttrValue) => {
            // should the function be wrapped so every time its called we re-render?
            if (newAttrValue instanceof Function) {
                return callbackFun(support, newAttrValue, child, attrName, isSpecial, howToSet);
            }
            // TODO: we maybe able to block higher before instance of check
            if (lastValue === newAttrValue) {
                return lastValue;
            }
            lastValue = newAttrValue;
            return processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet);
        };
        // 🗞️ Subscribe. Above callback called immediately since its a ValueSubject()
        const sub = result.subscribe(callback);
        // Record subscription for later unsubscribe when element destroyed
        support.subject.global.subscriptions.push(sub);
        return;
    }
    howToSet(child, attrName, result._value);
    return;
}
function processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet) {
    if (newAttrValue instanceof Function) {
        const fun = function (...args) {
            return newAttrValue(child, args);
        };
        // access to original function
        fun.tagFunction = newAttrValue;
        // shorthand corrections
        if (attrName === ondoubleclick) {
            attrName = 'ondblclick';
        }
        ;
        child[attrName] = fun;
        return;
    }
    if (isSpecial) {
        specialAttribute(attrName, newAttrValue, child);
        return;
    }
    if (newAttrValue) {
        howToSet(child, attrName, newAttrValue);
        return;
    }
    const isDeadValue = [undefined, false, null].includes(newAttrValue);
    if (isDeadValue) {
        child.removeAttribute(attrName);
        return;
    }
    // value is 0
    howToSet(child, attrName, newAttrValue);
}
/** Looking for (class | style) followed by a period */
function isSpecialAttr(attrName) {
    return attrName.search(/^(class|style)(\.)/) >= 0;
}
function callbackFun(support, newAttrValue, child, attrName, isSpecial, howToSet) {
    const wrapper = support.templater.wrapper;
    const parentWrap = wrapper?.parentWrap;
    const tagJsType = wrapper?.tagJsType || parentWrap?.tagJsType;
    const oneRender = tagJsType === ValueTypes.oneRender;
    if (!oneRender) {
        // tag has state and will need all functions wrapped to cause re-renders
        newAttrValue = bindSubjectCallback(newAttrValue, support);
    }
    return processAttributeSubjectValue(newAttrValue, child, attrName, isSpecial, howToSet);
}
//# sourceMappingURL=processAttribute.function.js.map