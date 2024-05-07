import { TagSupport } from './TagSupport.class';
import { TagSubject } from './subject.types';
export declare function renderWithSupport(tagSupport: TagSupport, // new
lastSupport: TagSupport | undefined, // previous
subject: TagSubject, // events & memory
ownerSupport?: TagSupport): TagSupport;
