import { InterpolatedContentTemplates } from './interpolateContentTemplates.js';
import { Context, TagTemplate } from '../tag/Tag.class.js';
import { Counts } from './interpolateTemplate.js';
import { TagSupport } from '../tag/TagSupport.class.js';
export type InterpolateOptions = {
    counts: Counts;
};
/** Review elements within an element */
export declare function interpolateElement(container: DocumentFragment, // element containing innerHTML to review interpolations
context: Context, // variables used to evaluate
interpolatedTemplates: TagTemplate, ownerSupport: TagSupport, options: InterpolateOptions): InterpolatedContentTemplates;
export declare function interpolateString(string: string): import("./interpolations.js").InterpolatedTemplates;
