import { Counts } from '../../interpolations/interpolateTemplate.js';
import { AnySupport } from '../Support.class.js';
import { TemplateValue } from './processFirstSubject.utils.js';
import { StringTag } from '../Tag.class.js';
import { ContextItem } from '../Context.types.js';
export declare function processFirstSubjectValue(value: TemplateValue | StringTag, subject: ContextItem, // could be tag via result.tag
ownerSupport: AnySupport, // owning support
counts: Counts, // {added:0, removed:0}
valueId: string, appendTo?: Element): AnySupport | undefined;
