import { Tag } from "./Tag.class.js";
import { ValueSubject } from "./ValueSubject.js";
export type TagChildren = ValueSubject<Tag[]>;
export type TagChildrenInput = Tag[] | Tag | TagChildren;
export type TagComponentArg<T extends any[]> = (...args: T) => Tag;
type FirstArgOptional<T extends any[]> = T['length'] extends 0 ? true : false;
export type TagComponentBase<T extends any[]> = (arg: FirstArgOptional<T> extends true ? (T[0] | void) : T[0], children?: TagChildrenInput) => Tag;
export declare const tags: TagComponentBase<any>[];
export type TagComponent = TagComponentBase<[any?, TagChildren?]> | TagComponentBase<[]>;
/** Wraps a tag component in a state manager and always push children to last argument as any array */
export declare function tag<T extends any[]>(tagComponent: TagComponentArg<T>): (TagComponentBase<T>);
export {};
