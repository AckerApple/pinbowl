import { setUse } from '../state/index.js';
import { TemplaterResult } from './TemplaterResult.class.js';
import { tags } from './tag.utils.js';
import { getTagWrap } from './getTagWrap.function.js';
import { ValueTypes } from './ValueTypes.enum.js';
let tagCount = 0;
/** Wraps a function tag in a state manager and calls wrapped function on event cycles
 * For single rendering, no event cycles, use: tag.renderOnce = (props) => html``
 */
export function tag(tagComponent) {
    /** function developer triggers */
    const parentWrap = (function tagWrapper(...props) {
        const templater = new TemplaterResult(props);
        templater.tagJsType = ValueTypes.tagComponent;
        // attach memory back to original function that contains developer display logic
        const innerTagWrap = getTagWrap(templater, parentWrap);
        if (!innerTagWrap.parentWrap) {
            innerTagWrap.parentWrap = parentWrap;
        }
        templater.tagged = true;
        templater.wrapper = innerTagWrap;
        return templater;
    }) // we override the function provided and pretend original is what's returned
    ;
    parentWrap.original = tagComponent;
    parentWrap.compareTo = tagComponent.toString();
    const tag = tagComponent;
    parentWrap.isTag = true;
    parentWrap.original = tag;
    // group tags together and have hmr pickup
    tag.tags = tags;
    tag.setUse = setUse;
    tag.tagIndex = tagCount++; // needed for things like HMR
    tags.push(parentWrap);
    return parentWrap;
}
/** Used to create a tag component that renders once and has no addition rendering cycles */
tag.oneRender = (...props) => {
    throw new Error('Do not call function tag.oneRender but instead set it as: `(props) => tag.oneRender = (state) => html`` `');
};
/** Use to structure and define a browser tag route handler
 * Example: export default tag.route = (routeProps: RouteProps) => (state) => html``
 */
tag.route = (routeProps) => {
    throw new Error('Do not call function tag.route but instead set it as: `tag.route = (routeProps: RouteProps) => (state) => html`` `');
};
/** Use to structure and define a browser tag route handler
 * Example: export default tag.route = (routeProps: RouteProps) => (state) => html``
 */
tag.app = (routeTag) => {
    throw new Error('Do not call function tag.route but instead set it as: `tag.route = (routeProps: RouteProps) => (state) => html`` `');
};
Object.defineProperty(tag, 'oneRender', {
    set(oneRenderFunction) {
        oneRenderFunction.oneRender = true;
    },
});
//# sourceMappingURL=tag.js.map