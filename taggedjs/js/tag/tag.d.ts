import { Tag } from './Tag.class';
import { TemplaterResult } from '../TemplaterResult.class';
import { ValueSubject } from '../subject/ValueSubject';
export type TagChildren = ValueSubject<Tag[]> & {
    lastArray?: Tag[];
};
export type TagChildrenInput = Tag[] | Tag | TagChildren;
type FirstArgOptional<T extends any[]> = T['length'] extends 0 ? true : false;
export type TagComponentBase<T extends any[]> = (arg: FirstArgOptional<T> extends true ? (T[0] | void) : T[0], children?: TagChildrenInput) => Tag;
export declare const tags: TagWrapper<any>[];
export type TagComponent = TagComponentBase<[any?, TagChildren?]> | TagComponentBase<[]>;
export type TagWrapper<T> = ((...props: T[]) => TemplaterResult) & {
    original: (...args: any[]) => any;
    compareTo: string;
    isTag: boolean;
};
export type TagMaker = ((...args: any[]) => Tag) | ((...args: any[]) => (...args: any[]) => Tag);
/** Wraps a tag component in a state manager and always push children to last argument as an array */
export declare function tag<T>(tagComponent: T): T & {
    original: Function;
};
export declare function kidsToTagArraySubject(children?: TagChildrenInput): {
    childSubject: ValueSubject<Tag[]>;
    madeSubject: boolean;
};
export {};
