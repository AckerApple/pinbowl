import { Context } from '../tag/Tag.class';
import { HowToSet } from './interpolateAttributes';
import { TagSupport } from '../tag/TagSupport.class';
export declare function processAttribute(attrName: string, value: string | null, child: Element, scope: Context, ownerSupport: TagSupport, howToSet: HowToSet): void;
export type NoDisplayValue = false | null | undefined;
