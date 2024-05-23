import { BaseTagSupport, TagSupport } from '../TagSupport.class';
import { TagSubject } from '../../subject.types';
/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
export declare function renderExistingTag(oldestSupport: TagSupport, // oldest with elements on html
newSupport: TagSupport, // new to be rendered
ownerSupport: BaseTagSupport, // ownerSupport
subject: TagSubject): TagSupport;
