import { deepClone, deepEqual } from './deepFunctions';
import { isTag } from './isInstance';
import { renderTagSupport } from './renderTagSupport.function';
import { setUse } from './state';
import { isInCycle } from './tagRunner';
/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
export function alterProps(props, ownerSupport) {
    const isPropTag = isTag(props);
    const watchProps = isPropTag ? 0 : props;
    const newProps = resetFunctionProps(watchProps, ownerSupport);
    return newProps;
}
function resetFunctionProps(props, ownerSupport) {
    if (typeof (props) !== 'object' || !ownerSupport) {
        return props;
    }
    const newProps = props;
    // BELOW: Do not clone because if first argument is object, the memory ref back is lost
    // const newProps = {...props} 
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            const toCall = newProps[name].toCall;
            if (toCall) {
                return; // already previously converted
            }
            newProps[name] = (...args) => {
                return newProps[name].toCall(...args); // what gets called can switch over parent state changes
            };
            // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
            newProps[name].toCall = (...args) => {
                return callbackPropOwner(value, args, ownerSupport);
            };
            newProps[name].original = value;
            return;
        }
    });
    return newProps;
}
export function callbackPropOwner(toCall, callWith, ownerSupport) {
    // const renderCount = ownerSupport.global.renderCount
    const cycle = isInCycle();
    const result = toCall(...callWith);
    const run = () => {
        const lastestOwner = ownerSupport.global.newest;
        if (cycle) {
            // appears a prop function was called sync/immediately so lets see if owner changed state
            const allMatched = lastestOwner.memory.state.every(state => {
                const lastValue = state.lastValue;
                const get = state.get();
                const equal = deepEqual(deepClone(lastValue), get);
                return equal;
            });
            if (allMatched) {
                return result; // owner did not change
            }
        }
        const newest = renderTagSupport(lastestOwner, true);
        lastestOwner.global.newest = newest;
        return result;
    };
    if (!cycle) {
        return run();
    }
    setUse.memory.tagClosed$.toCallback(run);
    return result;
}
//# sourceMappingURL=alterProps.function.js.map