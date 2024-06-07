import { Tag } from './Tag.class.js';
import { TemplaterResult } from './TemplaterResult.class.js';
import { ValueSubject } from '../subject/ValueSubject.js';
import { setUse } from '../state/index.js';
export type TagChildren = ValueSubject<Tag[]> & {
    lastArray?: Tag[];
};
export type TagChildrenInput = Tag[] | Tag | TagChildren;
export type TagComponent = ((...args: any[]) => Tag) & {
    tags?: TagWrapper<any>[];
    setUse?: typeof setUse;
    tagIndex?: number;
};
export declare const tags: TagWrapper<any>[];
export type TagWrapper<T> = ((...props: T[]) => TemplaterResult) & {
    original: (...args: any[]) => any;
    compareTo: string;
    isTag: boolean;
    oneRender?: true;
};
export type TagMaker = ((...args: any[]) => Tag) | ((...args: any[]) => (...args: any[]) => Tag);
