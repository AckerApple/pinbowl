import { TagSupport } from '../tag/TagSupport.class.js';
import { InsertBefore } from './InsertBefore.type.js';
import { InterpolateOptions } from './interpolateElement.js';
import { InterpolateComponentResult } from './interpolateTemplate.js';
export type InterpolatedContentTemplates = {
    clones: InsertBefore[];
    tagComponents: InterpolateComponentResult[];
};
export declare function interpolateContentTemplates(context: any, tagSupport: TagSupport, options: InterpolateOptions, children: HTMLCollection): InterpolatedContentTemplates;
