import { TagSupport } from '../TagSupport.class.js';
import { InterpolateSubject, TemplateValue } from './processFirstSubject.utils.js';
import { InsertBefore } from '../../interpolations/InsertBefore.type.js';
export declare function updateExistingValue(subject: InterpolateSubject, value: TemplateValue, ownerSupport: TagSupport, insertBefore: InsertBefore): InterpolateSubject;
