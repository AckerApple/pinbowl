import { TagSupport } from '../TagSupport.class';
import { InterpolateSubject, TemplateValue } from './processFirstSubject.utils';
import { InsertBefore } from '../../interpolations/Clones.type';
export declare function updateExistingValue(subject: InterpolateSubject, value: TemplateValue, ownerSupport: TagSupport, insertBefore: InsertBefore): InterpolateSubject;
