import { SubjectLike } from "./Subject.js";
import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./templater.utils.js";
export declare function isTagComponent(value?: TemplaterResult): boolean;
export declare function isTagInstance(tag?: Tag | unknown): boolean;
export declare function isSubjectInstance(subject?: SubjectLike): Boolean;
