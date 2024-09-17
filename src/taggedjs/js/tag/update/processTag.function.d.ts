import { AnySupport, BaseSupport, Support } from '../Support.class.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
import { StringTag, DomTag } from '../Tag.class.js';
import { ContextItem } from '../Context.types.js';
/** When first time render, adds to owner childTags
 * Used for BOTH inserts & updates to values that were something else
 * Intended use only for updates
*/
export declare function processTag(ownerSupport: AnySupport, // owner
subject: ContextItem): Support;
export declare function tagFakeTemplater(tag: StringTag | DomTag): TemplaterResult;
export declare function getFakeTemplater(): TemplaterResult;
/** Create Support for a tag component */
export declare function newSupportByTemplater(templater: TemplaterResult, ownerSupport: BaseSupport | Support, subject: ContextItem): Support;
