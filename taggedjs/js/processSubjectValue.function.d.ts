import { TagArraySubject } from './processTagArray';
import { TemplaterResult } from './TemplaterResult.class';
import { Clones, InsertBefore } from './Clones.type';
import { Tag } from './Tag.class';
import { Counts } from './interpolateTemplate';
import { DisplaySubject, TagSubject } from './Tag.utils';
import { ValueSubject } from './subject/ValueSubject';
import { Callback } from './bindSubjectCallback.function';
type processOptions = {
    forceElement?: boolean;
    counts: Counts;
};
export type ClonesAndPromise = {
    clones: Clones;
};
export type InterpolateSubject = TagArraySubject | TagSubject | DisplaySubject | ValueSubject<Callback>;
export declare function processSubjectValue(value: any | TemplaterResult, subject: InterpolateSubject, // could be tag via result.tag
insertBefore: InsertBefore, // <template end interpolate /> (will be removed)
ownerTag: Tag, // owner
options: processOptions): Clones | undefined;
export {};
