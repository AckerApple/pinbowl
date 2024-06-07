import { BaseTagSupport, TagSupport } from '../TagSupport.class.js';
import { TagSubject } from '../../subject.types.js';
export declare function renderTagOnly(newTagSupport: TagSupport | BaseTagSupport, prevSupport: TagSupport | BaseTagSupport | undefined, subject: TagSubject, ownerSupport?: TagSupport | BaseTagSupport): TagSupport;
