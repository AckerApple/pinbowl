import { BaseTagSupport, TagSupport } from '../TagSupport.class.js';
import { TagSubject } from '../../subject.types.js';
/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
export declare function renderExistingTag(oldestSupport: TagSupport | BaseTagSupport, // oldest with elements on html
newSupport: TagSupport | BaseTagSupport, // new to be rendered
ownerSupport: BaseTagSupport | TagSupport, // ownerSupport
subject: TagSubject): TagSupport;
