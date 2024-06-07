import { BaseTagSupport, TagSupport } from './TagSupport.class.js';
export declare function runBeforeRender(tagSupport: BaseTagSupport | TagSupport, ownerSupport?: TagSupport): void;
export declare function runAfterRender(tagSupport: BaseTagSupport | TagSupport, ownerTagSupport?: TagSupport | BaseTagSupport): void;
export declare function runBeforeRedraw(tagSupport: BaseTagSupport | TagSupport, ownerTagSupport: TagSupport | BaseTagSupport): void;
export declare function runBeforeDestroy(tagSupport: TagSupport | BaseTagSupport, ownerTagSupport: TagSupport | BaseTagSupport): void;
