import { Tag } from './Tag.class';
import { BaseTagSupport } from './TagSupport.class';
import { Config } from './set.function';
interface TagUse {
    beforeRender: (tagSupport: BaseTagSupport, ownerTag: Tag) => void;
    beforeRedraw: (tagSupport: BaseTagSupport, tag: Tag) => void;
    afterRender: (tagSupport: BaseTagSupport, tag: Tag) => void;
    beforeDestroy: (tagSupport: BaseTagSupport, tag: Tag) => void;
}
export type UseOptions = {
    beforeRender?: (tagSupport: BaseTagSupport, ownerTag: Tag) => void;
    beforeRedraw?: (tagSupport: BaseTagSupport, tag: Tag) => void;
    afterRender?: (tagSupport: BaseTagSupport, tag: Tag) => void;
    beforeDestroy?: (tagSupport: BaseTagSupport, tag: Tag) => void;
};
export declare function setUse(use: UseOptions): void;
export declare namespace setUse {
    var tagUse: TagUse[];
    var memory: Record<string, any> & {
        stateConfig: Config;
    };
}
export {};
