import { isInlineHtml, renderInlineHtml } from './tag/render/renderSupport.function.js';
import { renderExistingReadyTag } from './tag/render/renderExistingTag.function.js';
import { getSupportInCycle } from './tag/getSupportInCycle.function.js';
import { deepCompareDepth } from './tag/hasSupportChanged.function.js';
import { isArray, isStaticTag } from './isInstance.js';
import { BasicTypes } from './tag/ValueTypes.enum.js';
import { setUseMemory } from './state/index.js';
export function castProps(props, newSupport, depth) {
    return props.map(prop => alterProp(prop, newSupport.ownerSupport, newSupport, depth));
}
/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
export function alterProp(prop, ownerSupport, newSupport, depth) {
    if (isStaticTag(prop) || !prop) {
        return prop;
    }
    if (!ownerSupport) {
        return prop; // no one above me
    }
    return checkProp(prop, ownerSupport, newSupport, depth);
}
export function checkProp(value, ownerSupport, newSupport, depth) {
    if (!value) {
        return value;
    }
    if (value.tagJsType) {
        return value;
    }
    if (typeof (value) === BasicTypes.function) {
        return getPropWrap(value, ownerSupport);
    }
    if (depth === deepCompareDepth) {
        return value;
    }
    const skip = isSkipPropValue(value);
    if (skip) {
        return value; // no children to crawl through
    }
    if (isArray(value)) {
        return checkArrayProp(value, newSupport, ownerSupport, depth);
    }
    return checkObjectProp(value, newSupport, ownerSupport, depth);
}
function checkArrayProp(value, newSupport, ownerSupport, depth) {
    for (let index = value.length - 1; index >= 0; --index) {
        const subValue = value[index];
        value[index] = checkProp(subValue, ownerSupport, newSupport, depth + 1);
        if (typeof (subValue) === BasicTypes.function) {
            if (subValue.mem) {
                continue;
            }
            afterCheckProp(depth + 1, index, subValue, value, newSupport);
        }
    }
    return value;
}
function checkObjectProp(value, newSupport, ownerSupport, depth) {
    const keys = Object.keys(value);
    for (const name of keys) {
        const subValue = value[name];
        const result = checkProp(subValue, ownerSupport, newSupport, depth + 1);
        const newSubValue = value[name];
        if (newSubValue === result) {
            continue;
        }
        const getset = Object.getOwnPropertyDescriptor(value, name);
        const hasSetter = getset?.get || getset?.set;
        if (hasSetter) {
            continue;
        }
        value[name] = result;
        if (typeof (result) === BasicTypes.function) {
            if (subValue.mem) {
                continue;
            }
            afterCheckProp(depth + 1, name, subValue, value, newSupport);
        }
    }
    return value;
}
function afterCheckProp(depth, index, originalValue, newProp, newSupport) {
    // restore object to have original function on destroy
    if (depth > 0) {
        const global = newSupport.subject.global;
        newProp[index].subscription = global.destroy$.toCallback(function alterCheckProcessor() {
            newProp[index] = originalValue;
        });
    }
}
export function getPropWrap(value, ownerSupport) {
    const already = value.mem;
    // already previously converted by a parent?
    if (already) {
        return value;
    }
    const wrap = function wrapRunner(...args) {
        return wrap.toCall(...args);
    }; // what gets called can switch over parent state changes
    wrap.original = value;
    wrap.mem = value;
    // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
    wrap.toCall = function toCallRunner(...args) {
        return callbackPropOwner(wrap.mem, args, ownerSupport);
    };
    // copy data properties that maybe on source function
    Object.assign(wrap, value);
    return wrap;
}
/** Function shared by alterProps() and updateExistingTagComponent... TODO: May want to have to functions to reduce cycle checking?  */
export function callbackPropOwner(toCall, callWith, ownerSupport) {
    const global = ownerSupport.subject.global;
    const newest = global?.newest || ownerSupport;
    const supportInCycle = getSupportInCycle();
    const noCycle = supportInCycle === undefined;
    const callbackResult = toCall(...callWith);
    const run = function propCallbackProcessor() {
        const global = newest.subject.global;
        // are we in a rendering cycle? then its being called by alterProps
        if (noCycle === false) {
            const allMatched = global.locked === true;
            if (allMatched) {
                return callbackResult; // owner did not change
            }
        }
        safeRenderSupport(newest, ownerSupport);
        return callbackResult;
    };
    if (noCycle) {
        return run();
    }
    setUseMemory.tagClosed$.toCallback(run);
    return callbackResult;
}
export function isSkipPropValue(value) {
    return typeof (value) !== BasicTypes.object || !value || value.tagJsType;
}
export function safeRenderSupport(newest, ownerSupport) {
    const subject = newest.subject;
    const isInline = isInlineHtml(newest.templater);
    if (isInline) {
        const result = renderInlineHtml(ownerSupport, newest);
        // TODO: below maybe never true
        /*
        const global = subject.global as TagGlobal
        if(global) {
          delete global.locked
        }
        */
        return result;
    }
    const global = subject.global;
    global.locked = true;
    renderExistingReadyTag(global.newest, newest, ownerSupport, subject);
    delete global.locked;
}
//# sourceMappingURL=alterProp.function.js.map