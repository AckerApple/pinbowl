import { Clones } from "./Clones.type.js";
import { Tag } from "./Tag.class.js";
import { Counts } from "./interpolateTemplate.js";
export declare function processTagArray(result: any, value: Tag[], // arry of Tag classes
template: Element, // <template end interpolate />
ownerTag: Tag, options: {
    counts: Counts;
    forceElement?: boolean;
}): Clones;
