import { Context, Tag } from "./Tag.class.js";
export type InterpolateOptions = {
    /** make the element go on document */
    forceElement?: boolean;
};
export declare function interpolateElement(element: Element, context: Context, // variables used to evaluate
ownerTag: Tag, options: InterpolateOptions): void;
