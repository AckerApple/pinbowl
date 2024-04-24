import { BaseTagSupport, TagSupport } from '../TagSupport.class';
import { ProviderConfig } from './providers';
import { Config } from './state.utils';
interface TagUse {
    beforeRender: (tagSupport: BaseTagSupport, ownerTag?: TagSupport) => void;
    beforeRedraw: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
    afterRender: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
    beforeDestroy: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
}
export type UseOptions = {
    beforeRender?: (tagSupport: BaseTagSupport, ownerTag?: TagSupport) => void;
    beforeRedraw?: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
    afterRender?: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
    beforeDestroy?: (tagSupport: BaseTagSupport, tag: TagSupport) => void;
};
export declare function setUse(use: UseOptions): void;
export declare namespace setUse {
    var tagUse: TagUse[];
    var memory: Record<string, any> & {
        stateConfig: Config;
        providerConfig: ProviderConfig;
        initCurrentSupport: TagSupport;
    };
}
export {};
