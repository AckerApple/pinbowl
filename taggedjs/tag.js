import { Tag } from "./Tag.class.js";
import { deepClone } from "./deepFunctions.js";
export class TemplaterResult {
    props;
    newProps;
    cloneProps;
    tagged;
    wrapper;
    newest;
    oldest;
    redraw;
}
export function tag(tagComponent) {
    return ((props, children) => {
        const callback = (toCall, callWith) => {
            const callbackResult = toCall(...callWith);
            templater.newest?.ownerTag?.tagSupport.render();
            return callbackResult;
        };
        const isPropTag = props instanceof Tag;
        const watchProps = isPropTag ? 0 : props;
        const newProps = resetFunctionProps(watchProps, callback);
        let argProps = newProps;
        if (isPropTag) {
            children = props;
            argProps = noPropsGiven;
        }
        const wrapper = () => tagComponent(argProps, children);
        const templater = new TemplaterResult();
        templater.tagged = true;
        templater.props = props; // used to call function
        templater.newProps = newProps;
        templater.cloneProps = deepClone(newProps);
        templater.wrapper = wrapper;
        return templater;
    }); // we override the function provided and pretend original is what's returned
}
class NoPropsGiven {
}
const noPropsGiven = new NoPropsGiven();
function resetFunctionProps(props, callback) {
    if (typeof (props) !== 'object') {
        return props;
    }
    const newProps = { ...props };
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            newProps[name] = (...args) => {
                return callback(value, args);
            };
            return;
        }
        newProps[name] = value;
    });
    return newProps;
}
//# sourceMappingURL=tag.js.map