import { BaseTagSupport, TagSupport } from '../tag/TagSupport.class.js';
import { Config } from './state.utils.js';
interface TagUse {
    beforeRender: (tagSupport: BaseTagSupport | TagSupport, ownerTag?: TagSupport | BaseTagSupport) => void;
    beforeRedraw: (tagSupport: BaseTagSupport | TagSupport, tag: TagSupport | BaseTagSupport) => void;
    afterRender: (tagSupport: BaseTagSupport | TagSupport, ownerTagSupport?: TagSupport | BaseTagSupport) => void;
    beforeDestroy: (tagSupport: BaseTagSupport | TagSupport, tag: TagSupport | BaseTagSupport) => void;
}
export type UseOptions = {
    beforeRender?: (tagSupport: TagSupport | BaseTagSupport, ownerTag?: TagSupport | BaseTagSupport) => void;
    beforeRedraw?: (tagSupport: BaseTagSupport | TagSupport, tag: TagSupport | BaseTagSupport) => void;
    afterRender?: (tagSupport: BaseTagSupport | TagSupport, ownerTagSupport?: TagSupport | BaseTagSupport) => void;
    beforeDestroy?: (tagSupport: BaseTagSupport | TagSupport, tag: TagSupport | BaseTagSupport) => void;
};
export declare function setUse(use: UseOptions): void;
export declare namespace setUse {
    var tagUse: TagUse[];
    var memory: UseMemory;
}
type UseMemory = (Record<string, any> & {
    stateConfig: Config;
    currentSupport: TagSupport;
});
export {};
