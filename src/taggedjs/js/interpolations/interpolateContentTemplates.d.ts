import { Clones } from "./Clones.type";
import { TagSupport } from "../tag/TagSupport.class";
import { InterpolateOptions } from "./interpolateElement";
import { InterpolateComponentResult } from "./interpolateTemplate";
export type InterpolatedContentTemplates = {
    clones: Clones;
    tagComponents: InterpolateComponentResult[];
};
export declare function interpolateContentTemplates(context: any, tagSupport: TagSupport, options: InterpolateOptions, children: HTMLCollection): InterpolatedContentTemplates;
