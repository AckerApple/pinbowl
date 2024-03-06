import { TagSubject } from "./Tag.utils.js";
import { Tag } from "./Tag.class.js";
import { ExistingSubject } from "./updateExistingValue.function.js";
export declare function checkDestroyPrevious(existing: ExistingSubject, // existing.value is the old value
newValue: unknown): false | 1 | 2 | 3 | 4;
export declare function destroyTagMemory(existingTag: Tag, existingSubject: TagSubject): void;
