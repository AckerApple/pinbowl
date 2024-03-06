import { TagArraySubject } from "./processTagArray.js";
import { Clones } from "./Clones.type.js";
import { Tag } from "./Tag.class.js";
import { Counts, Template } from "./interpolateTemplate.js";
import { DisplaySubject, TagSubject } from "./Tag.utils.js";
type processOptions = {
    forceElement?: boolean;
    counts: Counts;
};
export type ClonesAndPromise = {
    clones: Clones;
    promise?: Promise<any>;
};
export declare function processSubjectValue(value: any, result: TagArraySubject | TagSubject | DisplaySubject, // could be tag via result.tag
template: Template, // <template end interpolate /> (will be removed)
ownerTag: Tag, // owner
options: processOptions): ClonesAndPromise;
export declare function processTag(value: any, result: TagSubject, // could be tag via result.tag
template: Template, // <template end interpolate /> (will be removed)
ownerTag: Tag, // owner
options: processOptions): Clones;
export declare function destroySimpleValue(template: Element, subject: DisplaySubject): void;
export {};
