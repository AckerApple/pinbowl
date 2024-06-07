import { InsertBefore } from '../../interpolations/InsertBefore.type.js';
import { TagSupport } from '../TagSupport.class.js';
import { Tag } from '../Tag.class.js';
import { InterpolateSubject, TemplateValue, processOptions } from './processFirstSubject.utils.js';
export declare function processFirstSubjectValue(value: TemplateValue | Tag, subject: InterpolateSubject, // could be tag via result.tag
insertBefore: InsertBefore, // <template end interpolate /> (will be removed)
ownerSupport: TagSupport, // owner
options: processOptions): import("../TagSupport.class.js").BaseTagSupport | InsertBefore[] | undefined;
