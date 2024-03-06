import { DisplaySubject, TagSubject } from "./Tag.utils.js";
import { TagSupport } from "./TagSupport.class.js";
import { Subject } from "./Subject.js";
import { TemplaterResult } from "./templater.utils.js";
import { Tag } from "./Tag.class.js";
import { TagArraySubject } from "./processTagArray.js";
export type ExistingSubject = Subject<Tag> | TagSubject | TagArraySubject | DisplaySubject;
export declare function updateExistingValue(subject: ExistingSubject, value: TemplaterResult | Tag[] | TagSupport | Function | Subject<any>, ownerTag: Tag): void;
