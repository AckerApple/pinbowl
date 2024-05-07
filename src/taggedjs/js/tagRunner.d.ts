import { BaseTagSupport, TagSupport } from './TagSupport.class';
export declare function isInCycle(): BaseTagSupport | undefined;
export declare function runBeforeRender(tagSupport: BaseTagSupport, ownerSupport?: TagSupport): void;
export declare function runAfterRender(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
export declare function runBeforeRedraw(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
export declare function runBeforeDestroy(tagSupport: BaseTagSupport, ownerTagSupport: TagSupport): void;
