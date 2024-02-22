import { Tag } from "./Tag.class.js";
import { TagComponent } from "./templater.utils.js";
import { ValueSubject } from "./ValueSubject.js";
export type TagChildren = ValueSubject<Tag[]>;
export type TagChildrenInput = Tag[] | Tag | TagChildren;
export declare const tags: TagComponent[];
/** Wraps a tag component in a state manager and always push children to last argument as any array */
export declare function tag<T>(tagComponent: (((props: T, children: TagChildren) => Tag) | ((props: T) => Tag) | (() => Tag))): ((props?: T, children?: TagChildrenInput) => Tag);
