import { addSupportEventListener } from './addSupportEventListener.function.js';
export function processAttributeFunction(element, newAttrValue, support, attrName) {
    const fun = function (...args) {
        return fun.tagFunction(element, args);
    };
    // access to original function
    fun.tagFunction = newAttrValue;
    fun.support = support;
    addSupportEventListener(support.appSupport, attrName, element, // support.appSupport.appElement as Element,
    fun);
}
//# sourceMappingURL=processAttributeCallback.function.js.map