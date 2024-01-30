import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport";
interface TagUse {
    beforeRender: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender: (tagSupport: TagSupport, tag: Tag) => void;
    beforeDestroy: (tagSupport: TagSupport, tag: Tag) => void;
    afterTagClone: (oldTag: Tag, newTag: Tag) => void;
}
export type UseOptions = {
    beforeRender?: (tagSupport: TagSupport, tag?: Tag) => void;
    beforeRedraw?: (tagSupport: TagSupport, tag: Tag) => void;
    afterRender?: (tagSupport: TagSupport, tag: Tag) => void;
    beforeDestroy?: (tagSupport: TagSupport, tag: Tag) => void;
    afterTagClone?: (oldTag: Tag, newTag: Tag) => void;
};
export declare function setUse(use: UseOptions): void;
export declare namespace setUse {
    var tagUse: TagUse[];
    var memory: Record<string, any>;
}
export {};
