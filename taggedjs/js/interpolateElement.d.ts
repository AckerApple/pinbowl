import { InterpolatedContentTemplates } from "./interpolateContentTemplates";
import { Context, Tag, TagTemplate } from "./Tag.class";
import { Counts } from "./interpolateTemplate";
export type InterpolateOptions = {
    /** make the element go on document */
    forceElement?: boolean;
    counts: Counts;
};
/** Review elements within an element */
export declare function interpolateElement(container: Element, // element containing innerHTML to review interpolations
context: Context, // variables used to evaluate
interpolatedTemplates: TagTemplate, tagOwner: Tag, options: InterpolateOptions): InterpolatedContentTemplates;
export declare function interpolateString(string: string): import("./interpolations").InterpolatedTemplates;
