import { InterpolateSubject } from './update/processFirstSubject.utils.js';
import { Counts } from '../interpolations/interpolateTemplate.js';
import { InsertBefore } from '../interpolations/InsertBefore.type.js';
import { BaseTagSupport, TagSupport } from './TagSupport.class.js';
import { ValueTypes } from './ValueTypes.enum.js';
export declare function checkDestroyPrevious(subject: InterpolateSubject, // existing.value is the old value
newValue: unknown, insertBefore: InsertBefore, valueType: ValueTypes): false | "changed-simple-value" | "array" | 2 | "different-tag";
export declare function isSimpleType(value: any): boolean;
export declare function destroyArrayTag(tagSupport: TagSupport, counts: Counts): void;
export declare function restoreTagMarker(lastSupport: BaseTagSupport | TagSupport): void;
