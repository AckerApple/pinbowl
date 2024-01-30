import { TemplaterResult } from "./tag.js";
import { Tag } from "./Tag.class.js";
export declare function redrawTag(existingTag: Tag | undefined, templater: TemplaterResult, // latest tag function to call for rendering
ownerTag?: Tag): {
    remit: boolean;
    retag: Tag;
};
