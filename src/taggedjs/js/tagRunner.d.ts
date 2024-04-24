import { BaseTagSupport, TagSupport } from './TagSupport.class';
import { Subject } from './subject';
export declare const tagClosed$: Subject<TagSupport>;
export declare function runBeforeRender(tagSupport: BaseTagSupport, ownerSupport?: TagSupport): void;
export declare function runAfterRender(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
export declare function runBeforeRedraw(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
export declare function runBeforeDestroy(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
