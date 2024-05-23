import { InsertBefore } from '../../interpolations/Clones.type';
import { TagSupport } from '../TagSupport.class';
import { InterpolateSubject, TemplateValue, processOptions } from './processFirstSubject.utils';
export declare function processFirstSubjectValue(value: TemplateValue, subject: InterpolateSubject, // could be tag via result.tag
insertBefore: InsertBefore, // <template end interpolate /> (will be removed)
ownerSupport: TagSupport, // owner
options: processOptions): import("../../interpolations/Clones.type").Clones | undefined;
