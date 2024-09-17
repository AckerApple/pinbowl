// taggedjs-no-compile
import { setUseMemory } from '../state/index.js';
import { getTemplaterResult } from './TemplaterResult.class.js';
import { tags } from './tag.utils.js';
import { getTagWrap } from './getTagWrap.function.js';
import { ValueTypes } from './ValueTypes.enum.js';
import { key } from './key.js';
let tagCount = 0;
export var PropWatches;
(function (PropWatches) {
    PropWatches["DEEP"] = "deep";
    PropWatches["SHALLOW"] = "shallow";
    PropWatches["NONE"] = "none";
    PropWatches["IMMUTABLE"] = "immutable";
})(PropWatches || (PropWatches = {}));
/** Wraps a function tag in a state manager and calls wrapped function on event cycles
 * For single rendering, no event cycles, use: tag.renderOnce = (props) => html``
 */
export function tag(tagComponent, propWatch = PropWatches.SHALLOW) {
    /** function developer triggers */
    const parentWrap = (function tagWrapper(...props) {
        const templater = getTemplaterResult(propWatch, props);
        templater.tagJsType = ValueTypes.tagComponent;
        // attach memory back to original function that contains developer display logic
        const innerTagWrap = getTagWrap(templater, parentWrap);
        if (!innerTagWrap.parentWrap) {
            innerTagWrap.parentWrap = parentWrap;
        }
        templater.wrapper = innerTagWrap;
        return templater;
    }) // we override the function provided and pretend original is what's returned
    ;
    parentWrap.original = tagComponent;
    // parentWrap.compareTo = (tagComponent as any).toString()
    const tag = tagComponent;
    parentWrap.original = tag;
    // group tags together and have hmr pickup
    tag.tags = tags;
    tag.setUse = setUseMemory;
    tag.ValueTypes = ValueTypes;
    tag.tagIndex = tagCount++; // needed for things like HMR
    tags.push(parentWrap);
    return parentWrap;
}
/** Used to create a tag component that renders once and has no addition rendering cycles */
tag.renderOnce = function () {
    throw new Error('Do not call tag.renderOnce as a function but instead set it as: `(props) => tag.renderOnce = () => html`` `');
};
/** Used to create variable scoping when calling a function that lives within a prop container function */
tag.state = function () {
    throw new Error('Do not call tag.state as a function but instead set it as: `(props) => tag.state = (state) => html`` `');
};
// TODO???: Is tag.route and tag.app in use?
/** Use to structure and define a browser tag route handler
 * Example: export default tag.route = (routeProps: RouteProps) => (state) => html``
 */
tag.route = function (_routeProps) {
    throw new Error('Do not call tag.route as a function but instead set it as: `tag.route = (routeProps: RouteProps) => (state) => html`` `');
};
tag.key = key;
/** Use to structure and define a browser tag route handler
 * Example: export default tag.route = (routeProps: RouteProps) => (state) => html``
 */
tag.app = function (_routeTag) {
    throw new Error('Do not call tag.route as a function but instead set it as: `tag.route = (routeProps: RouteProps) => (state) => html`` `');
};
tag.deepPropWatch = tag;
tag.immutableProps = function immutableProps(tagComponent) {
    return tag(tagComponent, PropWatches.IMMUTABLE);
};
tag.watchProps = function watchProps(tagComponent) {
    return tag(tagComponent, PropWatches.SHALLOW);
};
Object.defineProperty(tag, 'renderOnce', {
    set(oneRenderFunction) {
        oneRenderFunction.tagJsType = ValueTypes.renderOnce;
    },
});
Object.defineProperty(tag, 'state', {
    set(renderFunction) {
        ;
        renderFunction.parentWrap = {
            original: {
                setUse: setUseMemory,
                tags,
            }
        };
        renderFunction.tagJsType = ValueTypes.stateRender;
    },
});
//# sourceMappingURL=tag.js.map