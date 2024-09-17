import { Context } from '../tag/Tag.class.js';
import { HowToSet } from './interpolateAttributes.js';
import { BaseSupport, Support } from '../tag/Support.class.js';
import { TagJsSubject } from '../tag/update/TagJsSubject.class.js';
export type AttrCombo = [
    string,
    (TagJsSubject<any> | string | null)?
];
/** Sets attribute value, subscribes to value updates  */
export declare function processAttribute(attrs: AttrCombo, element: Element, scope: Context, support: BaseSupport | Support, howToSet?: HowToSet): void;
export type NoDisplayValue = false | null | undefined;
