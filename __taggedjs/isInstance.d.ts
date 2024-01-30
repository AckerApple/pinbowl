import { Subject } from "./Subject.js";
import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export declare function isTagComponent(value?: TemplaterResult): boolean;
export declare function isTagInstance(tag?: Tag | unknown): boolean;
export declare function isSubjectInstance(subject?: Subject): boolean;
