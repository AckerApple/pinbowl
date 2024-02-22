import { TagSubject } from "./Tag.utils.js";
import { TagSupport } from "./TagSupport.class.js";
import { Subject } from "./Subject.js";
import { TemplaterResult } from "./templater.utils.js";
import { Tag } from "./Tag.class.js";
import { TagArraySubject } from "./processTagArray.js";
export declare function updateExistingValue(existing: Subject<Tag> | TemplaterResult | TagSubject | TagArraySubject, value: TemplaterResult | TagSupport | Function | Subject<any>, tag: Tag): void;
export declare function destroyTagMemory(existingTag: Tag, existingSubject: TagSubject, subjectValue: any): void;
