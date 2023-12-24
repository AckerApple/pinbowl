import { Context, Tag } from "./Tag.class.js";
/**
 *
 * @param {*} element
 * @param {*} context
 * @param {Tag} ownerTag
 */
export declare function interpolateElement(element: Element, context: Context, // variables used to evaluate
ownerTag: Tag): void;
/** Convert interpolations into template tags */
export declare function interpolateElementChild(child: Element): {
    string: string;
    keys: string[];
};
