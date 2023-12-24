import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport";
interface TagUse {
    beforeRender: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender: (tagSupport: TagSupport, tag: Tag) => void;
}
export declare const tagUse: TagUse[];
export declare function runBeforeRender(tagSupport: TagSupport, tag?: Tag): void;
export declare function runAfterRender(tagSupport: TagSupport, tag: Tag): void;
export declare function runBeforeRedraw(tagSupport: TagSupport, tag: Tag): void;
export declare function setUse(use: {
    beforeRender?: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw?: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender?: (tagSupport: TagSupport, tag: Tag) => void;
}): void;
export {};
