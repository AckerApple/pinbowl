import { Clones } from "./Clones.type.js";
import { Tag } from "./Tag.class.js";
import { InterpolateOptions } from "./interpolateElement.js";
/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export declare function interpolateContentTemplates(element: Element, context: any, tag: Tag, options: InterpolateOptions, children: HTMLCollection): Clones;
