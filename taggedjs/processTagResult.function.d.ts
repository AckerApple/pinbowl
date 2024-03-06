import { Tag } from "./Tag.class.js";
import { Clones } from "./Clones.type.js";
import { Counts } from "./interpolateTemplate.js";
import { TagArraySubject } from "./processTagArray.js";
import { TagSubject } from "./Tag.utils.js";
export declare function processTagResult(tag: Tag, result: TagArraySubject | TagSubject | Function, // used for recording past and current value
insertBefore: Element, // <template end interpolate />
{ counts, forceElement, }: {
    counts: Counts;
    forceElement?: boolean;
}): Clones;
