import { Context } from '../tag/Tag.class.js';
import { HowToSet } from './interpolateAttributes.js';
import { TagSupport } from '../tag/TagSupport.class.js';
export declare function processAttribute(attrName: string, value: string | null, // current attribute value by using .getAttribute
child: Element, scope: Context, ownerSupport: TagSupport, howToSet: HowToSet): void;
export type NoDisplayValue = false | null | undefined;
