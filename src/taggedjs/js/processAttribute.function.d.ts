import { Context, Tag } from './Tag.class';
import { HowToSet } from './interpolateAttributes';
export declare function processAttribute(attrName: string, value: string | null, child: Element, scope: Context, ownerTag: Tag, howToSet: HowToSet): void;
export type NoDisplayValue = false | null | undefined;
