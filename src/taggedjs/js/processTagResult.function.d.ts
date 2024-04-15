import { Tag } from './Tag.class';
import { Counts } from './interpolateTemplate';
import { TagArraySubject } from './processTagArray';
import { TagSubject } from './Tag.utils';
import { InsertBefore } from './Clones.type';
export declare function processTagResult(tag: Tag, subject: TagArraySubject | TagSubject | Function, // used for recording past and current value
insertBefore: InsertBefore, // <template end interpolate />
{ counts, forceElement, }: {
    counts: Counts;
    forceElement?: boolean;
}): void;
