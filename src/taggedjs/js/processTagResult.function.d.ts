import { Tag } from './Tag.class';
import { Counts, Template } from './interpolateTemplate';
import { TagArraySubject } from './processTagArray';
import { TagSubject } from './Tag.utils';
export declare function processTagResult(tag: Tag, subject: TagArraySubject | TagSubject | Function, // used for recording past and current value
insertBefore: Element | Text | Template | ChildNode, // <template end interpolate />
{ counts, forceElement, }: {
    counts: Counts;
    forceElement?: boolean;
}): void;
