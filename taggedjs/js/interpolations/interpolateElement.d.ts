import { Context, TagTemplate } from '../tag/Tag.class.js';
import { Counts, InterpolateComponentResult, Template } from './interpolateTemplate.js';
import { Support } from '../tag/Support.class.js';
export type InterpolateOptions = {
    counts: Counts;
};
/** Review elements within an element */
export declare function interpolateElement(template: Template, // element containing innerHTML to review interpolations
context: Context, // variables used to evaluate
interpolatedTemplates: TagTemplate, ownerSupport: Support, options: InterpolateOptions): InterpolateComponentResult[];
export declare function interpolateString(string: string): import("./interpolations.js").InterpolatedTemplates;
