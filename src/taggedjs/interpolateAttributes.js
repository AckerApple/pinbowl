import { Subject } from "./Subject.js";
import { inputAttribute } from "./inputAttribute.js";
const startRegX = /^\s*{/;
const endRegX = /}\s*$/;
export function interpolateAttributes(child, scope, ownerTag) {
    child.getAttributeNames().forEach(attrName => {
        const value = child.getAttribute(attrName);
        const isSpecial = isSpecialAttr(attrName);
        // An attempt to replicate React
        if (value && value.search(startRegX) >= 0 && value.search(endRegX) >= 0) {
            // get the code inside the brackets like "variable0" or "{variable0}"
            const code = value.replace('{', '').split('').reverse().join('').replace('}', '').split('').reverse().join('');
            const result = scope[code];
            // attach as callback
            if (result instanceof Function) {
                ;
                child[attrName] = function (...args) {
                    result(child, args);
                };
                return;
            }
            if (result instanceof Subject) {
                child.removeAttribute(attrName);
                const callback = (newAttrValue) => {
                    if (newAttrValue instanceof Function) {
                        ;
                        child[attrName] = function (...args) {
                            newAttrValue(child, args);
                        };
                        child[attrName].tagFunction = newAttrValue;
                        return;
                    }
                    if (isSpecial) {
                        inputAttribute(attrName, newAttrValue, child);
                    }
                    if (newAttrValue) {
                        child.setAttribute(attrName, newAttrValue);
                    }
                    const isDeadValue = newAttrValue === undefined || newAttrValue === false || newAttrValue === null;
                    if (isDeadValue) {
                        child.removeAttribute(attrName);
                        return;
                    }
                    // value is 0
                    child.setAttribute(attrName, newAttrValue);
                };
                const sub = result.subscribe(callback);
                ownerTag.cloneSubs.push(sub); // this is where unsubscribe is picked up
                return;
            }
            // child.setAttribute(attrName, result)
            /*
            if(attrName === 'style') {
              return
            }
            */
            child.setAttribute(attrName, result.value);
            return;
        }
        // Non dynamic
        if (isSpecial) {
            return inputAttribute(attrName, value, child);
        }
    });
}
export function isSpecialAttr(attrName) {
    return attrName.search(/^(class|style)(\.)/) >= 0;
}
//# sourceMappingURL=interpolateAttributes.js.map