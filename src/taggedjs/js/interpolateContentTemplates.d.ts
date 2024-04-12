import { Clones } from "./Clones.type";
import { Tag } from "./Tag.class";
import { InterpolateOptions } from "./interpolateElement";
import { InterpolateComponentResult } from "./interpolateTemplate";
export type InterpolatedContentTemplates = {
    clones: Clones;
    tagComponents: InterpolateComponentResult[];
};
export declare function interpolateContentTemplates(element: Element, context: any, tag: Tag, options: InterpolateOptions, children: HTMLCollection): InterpolatedContentTemplates;
