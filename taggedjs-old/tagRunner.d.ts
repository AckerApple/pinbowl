import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport";
export type UseOptions = {
    beforeRender?: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw?: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender?: (tagSupport: TagSupport, tag: Tag) => void;
    beforeDestroy?: (tagSupport: TagSupport, tag: Tag) => void;
    afterTagClone?: (oldTag: Tag, newTag: Tag) => void;
};
interface TagUse {
    beforeRender: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender: (tagSupport: TagSupport, tag: Tag) => void;
    beforeDestroy: (tagSupport: TagSupport, tag: Tag) => void;
    afterTagClone: (oldTag: Tag, newTag: Tag) => void;
}
export declare const tagUse: TagUse[];
export declare function runBeforeRender(tagSupport: TagSupport, tag?: Tag): void;
export declare function runAfterTagClone(oldTag: Tag, newTag: Tag): void;
export declare function runAfterRender(tagSupport: TagSupport, tag: Tag): void;
export declare function runBeforeRedraw(tagSupport: TagSupport, tag: Tag): void;
export declare function runBeforeDestroy(tagSupport: TagSupport, tag: Tag): void;
export declare function setUse(use: UseOptions): void;
export {};
