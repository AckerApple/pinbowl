import { isTag } from './isInstance';
import { renderTagSupport } from './renderTagSupport.function';
/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
export function alterProps(props, ownerSupport) {
    function callback(toCall, callWith) {
        return callbackPropOwner(toCall, callWith, ownerSupport);
    }
    const isPropTag = isTag(props);
    const watchProps = isPropTag ? 0 : props;
    const newProps = resetFunctionProps(watchProps, callback);
    return newProps;
}
function resetFunctionProps(props, callback) {
    if (typeof (props) !== 'object') {
        return props;
    }
    const newProps = props;
    // BELOW: Do not clone because if first argument is object, the memory ref back is lost
    // const newProps = {...props} 
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            const original = newProps[name].original;
            if (original) {
                return; // already previously converted
            }
            newProps[name] = (...args) => {
                return newProps[name].toCall(...args); // what gets called can switch over parent state changes
            };
            // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
            newProps[name].toCall = (...args) => callback(value, args);
            newProps[name].original = value;
            return;
        }
    });
    return newProps;
}
export function callbackPropOwner(toCall, callWith, ownerSupport) {
    const callbackResult = toCall(...callWith);
    const lastestOwner = ownerSupport.global.newest;
    renderTagSupport(lastestOwner, true);
    return callbackResult;
}
//# sourceMappingURL=alterProps.function.js.map