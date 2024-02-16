import { Clones } from "./Clones.type.js";
import { Tag } from "./Tag.class.js";
import { ValueSubject } from "./ValueSubject.js";
import { Counts } from "./interpolateTemplate.js";
export type LastArrayItem = {
    tag: Tag;
    index: number;
};
export type TagArraySubject = ValueSubject<Tag[]> & {
    lastArray: LastArrayItem[];
    template: Element;
};
export declare function processTagArray(result: TagArraySubject, value: Tag[], // arry of Tag classes
template: Element, // <template end interpolate />
ownerTag: Tag, options: {
    counts: Counts;
    forceElement?: boolean;
}): Clones;
