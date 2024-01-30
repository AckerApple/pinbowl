import { Context, Tag } from "./Tag.class.js";
export declare function interpolateAttributes(child: Element, scope: Context, ownerTag: Tag): void;
/** Looking for (class | style) followed by a period */
export declare function isSpecialAttr(attrName: string): boolean;
