import { Tag } from './Tag.class';
import { ValueSubject } from '../subject/ValueSubject';
import { TagChildrenInput } from './tag.utils';
/** Wraps a function tag in a state manager and calls wrapped function on event cycles
 * For single rendering, no event cycles, use: tag.renderOnce = (props) => html``
 */
export declare function tag<T extends Function>(tagComponent: T): T & {
    original: Function;
};
export declare namespace tag {
    var oneRender: (...props: any[]) => Tag | ((...args: any[]) => Tag);
}
export declare function kidsToTagArraySubject(children?: TagChildrenInput): {
    childSubject: ValueSubject<Tag[]>;
    madeSubject: boolean;
};
