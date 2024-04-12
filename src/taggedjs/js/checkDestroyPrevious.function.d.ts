import { Tag } from './Tag.class';
import { InterpolateSubject } from './processSubjectValue.function';
import { Counts } from './interpolateTemplate';
import { InsertBefore } from './Clones.type';
export declare function checkDestroyPrevious(subject: InterpolateSubject, // existing.value is the old value
newValue: unknown, insertBefore: InsertBefore): false | "array" | 2 | "different-tag" | 4;
export declare function destroyArrayTag(tag: Tag, counts: Counts): void;
export declare function restoreTagMarker(existingTag: Tag, insertBefore: InsertBefore): void;
