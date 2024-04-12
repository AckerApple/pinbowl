import { Clones, InsertBefore } from './Clones.type';
import { Tag } from './Tag.class';
import { ValueSubject } from './subject/ValueSubject';
import { Counts } from './interpolateTemplate';
export type LastArrayItem = {
    tag: Tag;
    index: number;
    deleted?: boolean;
};
export type TagArraySubject = ValueSubject<Tag[]> & {
    insertBefore: InsertBefore;
    placeholderElm?: InsertBefore;
    parentAsPlaceholder?: ParentNode;
    lastArray?: LastArrayItem[];
    isChildSubject?: boolean;
};
export declare function processTagArray(subject: TagArraySubject, value: Tag[], // arry of Tag classes
insertBefore: InsertBefore, // <template end interpolate />
ownerTag: Tag, options: {
    counts: Counts;
    forceElement?: boolean;
}): Clones;
