import { AnySupport, Support } from '../Support.class.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
import { ContextItem } from '../Context.types.js';
export declare function processNewSubjectTag(templater: TemplaterResult, ownerSupport: AnySupport, // owner
subject: ContextItem, // could be tag via result.tag
appendTo: Element): Support;
