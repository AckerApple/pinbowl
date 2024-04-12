import { TemplaterResult } from './TemplaterResult.class';
import { Counts } from './interpolateTemplate';
import { Tag } from './Tag.class';
import { TagSubject } from './Tag.utils';
import { InsertBefore } from './Clones.type';
export declare function processSubjectComponent(templater: TemplaterResult, subject: TagSubject, insertBefore: InsertBefore, ownerTag: Tag, options: {
    counts: Counts;
    forceElement?: boolean;
}): Tag;
