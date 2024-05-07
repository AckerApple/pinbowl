import { Tag } from './Tag.class';
import { TemplaterResult } from './TemplaterResult.class';
import { ValueSubject } from './subject/ValueSubject';
export type TagChildren = ValueSubject<Tag[]> & {
    lastArray?: Tag[];
};
export type TagChildrenInput = Tag[] | Tag | TagChildren;
export type TagComponentArg<T extends any[]> = ((...args: T) => Tag) & {
    lastResult?: TagWrapper<T>;
};
type FirstArgOptional<T extends any[]> = T['length'] extends 0 ? true : false;
export type TagComponentBase<T extends any[]> = (arg: FirstArgOptional<T> extends true ? (T[0] | void) : T[0], children?: TagChildrenInput) => Tag;
export declare const tags: TagComponentBase<any>[];
export type TagComponent = TagComponentBase<[any?, TagChildren?]> | TagComponentBase<[]>;
type TagWrapper<T> = ((props?: T | Tag | Tag[], children?: TagChildrenInput) => TemplaterResult) & {
    original: (...args: any[]) => any;
    isTag: boolean;
};
/** Wraps a tag component in a state manager and always push children to last argument as an array */
export declare function tag<T extends any[]>(tagComponent: TagComponentArg<T>): TagComponentBase<T>;
export {};
