import { Subject } from '../subject/Subject.class.js';
import { BaseSupport, Support } from '../tag/Support.class.js';
import { Config } from './state.utils.js';
export type UseOptions = {
    beforeRender?: (support: Support | BaseSupport, ownerTag?: Support | BaseSupport) => void;
    beforeRedraw?: (support: BaseSupport | Support, tag: Support | BaseSupport) => void;
    afterRender?: (support: BaseSupport | Support, ownerSupport?: Support | BaseSupport) => void;
    beforeDestroy?: (support: BaseSupport | Support, tag: Support | BaseSupport) => void;
};
export declare const setUseMemory: UseMemory;
export type UseMemory = (Record<string, unknown> & {
    stateConfig: Config;
    currentSupport: Support;
    tagClosed$: Subject<Support>;
});
