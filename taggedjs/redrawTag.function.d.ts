import { TagSupport } from "./TagSupport.class.js";
import { TemplaterResult } from "./templater.utils.js";
import { Tag } from "./Tag.class.js";
export declare function redrawTag(tagSupport: TagSupport, templater: TemplaterResult, // latest tag function to call for rendering
existingTag?: Tag, ownerTag?: Tag): {
    remit: boolean;
    retag: Tag;
};
