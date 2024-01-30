import { Context, ElementBuildOptions, Tag } from "./Tag.class.js";
import { InterpolateOptions } from "./interpolateElement.js";
import { Clones } from "./Clones.type.js";
export declare function interpolateTemplate(template: Template, // <template end interpolate /> (will be removed)
context: Context, // variable scope of {`__tagVar${index}`:'x'}
tag: Tag, // Tag class
counts: Counts, // {added:0, removed:0}
options: InterpolateOptions): Clones;
export type Template = Element & {
    clone: any;
};
export declare function updateBetweenTemplates(value: string | undefined | boolean | number, lastFirstChild: Element): Text;
export type Counts = {
    added: number;
    removed: number;
};
export declare function afterElmBuild(elm: Element | ChildNode, options: ElementBuildOptions): void;
