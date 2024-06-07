import { Context } from '../tag/Tag.class.js';
import { TagSupport } from '../tag/TagSupport.class.js';
export type HowToSet = (element: Element, name: string, value: string) => any;
export declare function interpolateAttributes(child: Element, scope: Context, ownerSupport: TagSupport): void;
