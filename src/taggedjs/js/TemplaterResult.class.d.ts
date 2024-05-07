import { Context, Tag } from './Tag.class';
import { BaseTagSupport, TagSupport } from './TagSupport.class';
import { Props } from './Props';
import { TagChildren } from './tag';
import { Provider } from './state/providers';
import { OnDestroyCallback } from './state/onDestroy';
import { TagSubject } from './subject.types';
import { OnInitCallback } from './state/onInit';
import { Subscription } from './subject/Subject.utils';
import { InsertBefore } from './Clones.type';
export type Wrapper = ((tagSupport: BaseTagSupport, subject: TagSubject) => TagSupport) & {
    original: () => Tag;
};
export type TagGlobal = {
    oldest?: TagSupport;
    newest?: TagSupport;
    context: Context;
    providers: Provider[];
    /** Indicator of re-rending. Saves from double rending something already rendered */
    renderCount: number;
    deleted: boolean;
    isApp?: boolean;
    insertBefore?: InsertBefore;
    placeholder?: Text;
    subscriptions: Subscription<any>[];
    destroyCallback?: OnDestroyCallback;
    init?: OnInitCallback;
};
export declare class TemplaterResult {
    props: Props;
    children: TagChildren;
    isTemplater: boolean;
    tagged: boolean;
    wrapper?: Wrapper;
    tag?: Tag;
    constructor(props: Props, children: TagChildren);
}
