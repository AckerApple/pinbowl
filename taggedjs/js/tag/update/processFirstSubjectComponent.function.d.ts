import { TemplaterResult } from '../TemplaterResult.class.js';
import { Counts } from '../../interpolations/interpolateTemplate.js';
import { BaseSupport, Support, SupportContextItem } from '../Support.class.js';
export declare function processReplacementComponent(templater: TemplaterResult, subject: SupportContextItem, ownerSupport: BaseSupport | Support, counts: Counts): BaseSupport | Support;
export declare function processFirstSubjectComponent(templater: TemplaterResult, subject: SupportContextItem, ownerSupport: BaseSupport | Support, counts: Counts, appendTo: Element): BaseSupport | Support;
