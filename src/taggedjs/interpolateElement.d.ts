import { Context, Tag } from "./Tag.class.js";
import { Clones } from "./Clones.type.js";
export type InterpolateOptions = {
    /** make the element go on document */
    forceElement?: boolean;
    depth: number;
};
export declare function interpolateElement(element: Element, context: Context, // variables used to evaluate
tag: Tag, options: InterpolateOptions): Clones;
