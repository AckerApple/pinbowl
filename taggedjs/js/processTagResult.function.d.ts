import { Counts } from './interpolations/interpolateTemplate';
import { TagArraySubject } from './processTagArray';
import { TagSubject } from './subject.types';
import { InsertBefore } from './Clones.type';
import { TagSupport } from './TagSupport.class';
export declare function processTagResult(tagSupport: TagSupport, subject: TagArraySubject | TagSubject | Function, // used for recording past and current value
insertBefore: InsertBefore, // <template end interpolate />
{ counts, forceElement, }: {
    counts: Counts;
    forceElement?: boolean;
}): void;
