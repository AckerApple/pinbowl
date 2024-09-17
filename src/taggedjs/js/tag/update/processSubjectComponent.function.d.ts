import { TemplaterResult } from '../TemplaterResult.class.js';
import { Counts } from '../../interpolations/interpolateTemplate.js';
import { TagSubject } from '../../subject.types.js';
import { BaseSupport, Support } from '../Support.class.js';
import { InsertBefore } from '../../interpolations/InsertBefore.type.js';
/** create new support, connects globals to old support if one, and  */
export declare function processSubjectComponent(templater: TemplaterResult, subject: TagSubject, insertBefore: InsertBefore, ownerSupport: BaseSupport | Support, options: {
    counts: Counts;
}): BaseSupport | Support;
