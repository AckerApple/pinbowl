import { Tag } from './Tag.class.js';
import { RouteProps, RouteTag, StateToTag, ToTag } from './tag.types.js';
export type TaggedFunction<T> = T & {
    original: Function;
};
/** Wraps a function tag in a state manager and calls wrapped function on event cycles
 * For single rendering, no event cycles, use: tag.renderOnce = (props) => html``
 */
export declare function tag<T extends ToTag>(tagComponent: T): TaggedFunction<T>;
export declare namespace tag {
    var oneRender: (...props: any[]) => Tag | StateToTag;
    var route: (routeProps: RouteProps) => StateToTag;
    var app: (routeTag: RouteTag) => StateToTag;
}
