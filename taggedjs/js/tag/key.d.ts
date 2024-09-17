import { DomTag, StringTag } from "./index.js";
import { ToTag } from "./tag.types.js";
/** Used to give unique value to an array of tag content. Should not be an object */
export declare function key(arrayValue: string | number | null): {
    html: StringTag | DomTag | ToTag;
};
