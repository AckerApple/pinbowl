import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport";
export declare function runBeforeRender(tagSupport: TagSupport, tag?: Tag): void;
export declare function runAfterTagClone(oldTag: Tag, newTag: Tag): void;
export declare function runAfterRender(tagSupport: TagSupport, tag: Tag): void;
export declare function runBeforeRedraw(tagSupport: TagSupport, tag: Tag): void;
export declare function runBeforeDestroy(tagSupport: TagSupport, tag: Tag): void;
