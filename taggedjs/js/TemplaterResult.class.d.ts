import { Context, Tag } from './Tag.class';
import { BaseTagSupport } from './TagSupport.class';
import { Props } from './Props';
import { TagChildren } from './tag';
import { Provider } from './providers';
import { OnDestroyCallback } from './onDestroy';
import { TagSubject } from './Tag.utils';
import { OnInitCallback } from './onInit';
import { Subscription } from './subject/Subject.utils';
import { InsertBefore } from './Clones.type';
export type Wrapper = ((tagSupport: BaseTagSupport, subject: TagSubject) => Tag) & {
    original: () => Tag;
};
export declare class TemplaterResult {
    props: Props;
    children: TagChildren;
    isTag: boolean;
    tagged: boolean;
    wrapper: Wrapper;
    global: {
        newestTemplater: TemplaterResult;
        oldest?: Tag;
        newest?: Tag;
        context: Context;
        providers: Provider[];
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: number;
        deleted: boolean;
        isApp?: boolean;
        insertBefore?: InsertBefore;
        placeholderElm?: InsertBefore;
        subscriptions: Subscription[];
        destroyCallback?: OnDestroyCallback;
        init?: OnInitCallback;
    };
    tagSupport: BaseTagSupport;
    constructor(props: Props, children: TagChildren);
    isTemplater: boolean;
}
export declare function renderWithSupport(tagSupport: BaseTagSupport, existingTag: Tag | undefined, subject: TagSubject, ownerTag?: Tag): Tag;
