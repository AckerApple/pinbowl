import { Tag } from "./Tag.class.js";
import { Clones } from "./Clones.type.js";
import { Counts } from "./interpolateTemplate.js";
export declare function processTagResult(tag: Tag, result: any, // used for recording past and current value
insertBefore: Element, // <template end interpolate />
{ index, counts, forceElement, }: {
    index?: number;
    counts: Counts;
    forceElement?: boolean;
}): Clones;
