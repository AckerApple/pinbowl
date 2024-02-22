import { TagArraySubject } from "./processTagArray.js";
import { Clones } from "./Clones.type.js";
import { Tag } from "./Tag.class.js";
import { Counts, Template } from "./interpolateTemplate.js";
import { TagSubject } from "./Tag.utils.js";
type processOptions = {
    forceElement?: boolean;
    counts: Counts;
};
export type ClonesAndPromise = {
    clones: Clones;
    promise?: Promise<any>;
};
export declare function processSubjectValue(value: any, result: TagArraySubject | TagSubject, // could be tag via result.tag
template: Template, // <template end interpolate /> (will be removed)
tag: Tag, // owner
options: processOptions): ClonesAndPromise;
export declare function processTag(value: any, result: TagSubject | TagArraySubject, // could be tag via result.tag
template: Template, // <template end interpolate /> (will be removed)
tag: Tag, // owner
options: processOptions): Clones;
export {};
