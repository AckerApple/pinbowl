import { BaseTagSupport, TagSupport } from '../TagSupport.class.js';
import { TagSubject } from '../../subject.types.js';
export declare function renderWithSupport(newTagSupport: TagSupport | BaseTagSupport, lastSupport: TagSupport | BaseTagSupport | undefined, // previous
subject: TagSubject, // events & memory
ownerSupport?: TagSupport): TagSupport;
