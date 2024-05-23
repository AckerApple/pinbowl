import { TagSupport } from '../TagSupport.class';
import { TagSubject } from '../../subject.types';
export declare function renderWithSupport(newTagSupport: TagSupport, lastSupport: TagSupport | undefined, // previous
subject: TagSubject, // events & memory
ownerSupport?: TagSupport): TagSupport;
