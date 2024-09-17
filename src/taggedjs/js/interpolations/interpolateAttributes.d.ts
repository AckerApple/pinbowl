import { Context } from '../tag/Tag.class.js';
import { Support } from '../tag/Support.class.js';
export type HowToSet = (element: Element, name: string, value: string) => any;
export declare function howToSetInputValue(element: Element, name: string, value: string): void;
export declare function interpolateAttributes(element: Element, scope: Context, ownerSupport: Support): void;
