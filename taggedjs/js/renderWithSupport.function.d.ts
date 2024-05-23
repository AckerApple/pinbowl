import { TagSupport } from './tag/TagSupport.class';
import { TagSubject } from './subject.types';
export declare function renderWithSupport(tagSupport: TagSupport, lastSupport: TagSupport | undefined, // previous
subject: TagSubject, // events & memory
ownerSupport?: TagSupport): TagSupport;
