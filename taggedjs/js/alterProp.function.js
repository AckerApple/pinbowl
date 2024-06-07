import { deepClone, deepEqual } from './deepFunctions.js';
import { isStaticTag } from './isInstance.js';
import { renderTagSupport } from './tag/render/renderTagSupport.function.js';
import { setUse } from './state/index.js';
import { getSupportInCycle } from './tag/getSupportInCycle.function.js';
export function castProps(props, newTagSupport, stateArray) {
    return props.map(prop => alterProp(prop, newTagSupport.ownerTagSupport, stateArray, newTagSupport));
}
/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
export function alterProp(prop, ownerSupport, stateArray, newTagSupport) {
    if (isStaticTag(prop) || !prop) {
        return prop;
    }
    if (!ownerSupport) {
        return prop; // no one above me
    }
    return checkProp(prop, ownerSupport, stateArray, newTagSupport);
}
export function checkProp(value, ownerSupport, stateArray, newTagSupport, index, newProp, seen = []) {
    if (value instanceof Function) {
        return getPropWrap(value, ownerSupport, stateArray, newTagSupport, index, newProp);
    }
    if (seen.includes(value)) {
        return value;
    }
    seen.push(value);
    if (typeof (value) !== 'object' || !value) {
        return value; // no children to crawl through
    }
    if (value instanceof Array) {
        for (let index = value.length - 1; index >= 0; --index) {
            const subValue = value[index];
            value[index] = checkProp(subValue, ownerSupport, stateArray, newTagSupport, index, value, seen);
            if (subValue instanceof Function) {
                if (subValue.toCall) {
                    continue;
                }
                afterCheckProp(index, subValue, value, newTagSupport);
            }
        }
        return value;
    }
    for (const name in value) {
        const subValue = value[name];
        const result = checkProp(subValue, ownerSupport, stateArray, newTagSupport, name, value, seen);
        const hasSetter = Object.getOwnPropertyDescriptor(value, name)?.set;
        if (hasSetter) {
            continue;
        }
        value[name] = result;
        if (result instanceof Function) {
            if (subValue.toCall) {
                continue;
            }
            afterCheckProp(name, subValue, value, newTagSupport);
        }
    }
    return value;
}
function afterCheckProp(index, pastValue, newProp, newTagSupport) {
    if (pastValue?.toCall) {
        return; // already been done
    }
    // restore object to have original function on destroy
    newTagSupport.global.destroy$.toCallback(() => newProp[index] = pastValue);
}
export function getPropWrap(value, ownerSupport, stateArray, newTagSupport, name, newProp) {
    const toCall = value.toCall;
    // already previously converted by a parent?
    if (toCall) {
        return value;
    }
    const wrap = (...args) => wrap.toCall(...args); // what gets called can switch over parent state changes
    // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
    wrap.toCall = (...args) => {
        return callbackPropOwner(wrap.prop, args, ownerSupport, wrap.stateArray);
    };
    wrap.original = value;
    wrap.prop = value;
    wrap.stateArray = stateArray;
    // copy data properties that maybe on source function
    Object.assign(wrap, value);
    return wrap;
}
/** Function shared by alterProps() and updateExistingTagComponent... TODO: May want to have to functions to reduce cycle checking?  */
export function callbackPropOwner(toCall, callWith, ownerSupport, // <-- WHEN called from alterProp its owner OTHERWISE its previous
oldState) {
    const newest = ownerSupport.global.newest;
    //const newState = newest.memory.state
    const noCycle = getSupportInCycle() === undefined;
    //const sync = noCycle && oldState.length === newState.length
    //if(sync) {
    //  syncStates(newState, oldState)
    //}
    const result = toCall(...callWith);
    // if(sync) {
    //   syncStates(oldState, newState)
    // }
    const run = () => {
        // are we in a rendering cycle? then its being called by alterProps
        if (noCycle === false) {
            // appears a prop function was called sync/immediately so lets see if owner changed state
            const allMatched = newest.memory.state.every(state => {
                const lastValue = state.lastValue;
                const get = state.get();
                const equal = deepEqual(deepClone(lastValue), get);
                return equal;
            });
            if (allMatched) {
                return result; // owner did not change
            }
        }
        renderTagSupport(newest, true);
        return result;
    };
    if (noCycle) {
        return run();
    }
    setUse.memory.tagClosed$.toCallback(run);
    return result;
}
//# sourceMappingURL=alterProp.function.js.map