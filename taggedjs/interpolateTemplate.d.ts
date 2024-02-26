import { Context, ElementBuildOptions, Tag } from "./Tag.class.js";
import { InterpolateOptions } from "./interpolateElement.js";
import { Clones } from "./Clones.type.js";
export type Template = Element & {
    clone: any;
};
export declare function interpolateTemplate(template: Template, // <template end interpolate /> (will be removed)
context: Context, // variable scope of {`__tagvar${index}`:'x'}
tag: Tag, // Tag class
counts: Counts, // used for animation stagger computing
options: InterpolateOptions): Clones;
export declare function updateBetweenTemplates(value: string | undefined | boolean | number, lastFirstChild: Element): Text;
export type Counts = {
    added: number;
    removed: number;
};
export declare function afterElmBuild(elm: Element | ChildNode, options: ElementBuildOptions): void;
