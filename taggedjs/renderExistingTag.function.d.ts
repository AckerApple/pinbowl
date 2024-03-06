import { Tag } from "./Tag.class.js";
import { TagSupport } from "./TagSupport.class.js";
import { TemplaterResult } from "./templater.utils.js";
/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
export declare function renderExistingTag(tag: Tag, newTemplater: TemplaterResult, tagSupport: TagSupport): boolean;
