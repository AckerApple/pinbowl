import { Context, Tag, TagTemplate } from "./Tag.class.js";
import { Clones } from "./Clones.type.js";
export type InterpolateOptions = {
    /** make the element go on document */
    forceElement?: boolean;
};
export declare function interpolateElement(element: Element, context: Context, // variables used to evaluate
interpolatedTemplates: TagTemplate, tagOwner: Tag, options: InterpolateOptions): Clones;
export declare function interpolateString(string: string): import("./interpolations.js").InterpolatedTemplates;
