import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport.js";
export type Props = unknown;
export type Wrapper = (() => Tag) & {
    original: () => Tag;
};
export declare class TemplaterResult {
    props: Props;
    newProps: Props;
    cloneProps: Props;
    tagged: boolean;
    wrapper: Wrapper;
    newest?: Tag;
    oldest?: Tag;
    redraw?: () => Tag | undefined;
    isTemplater: boolean;
    forceRenderTemplate(tagSupport: TagSupport, ownerTag: Tag): Tag;
    renderWithSupport(tagSupport: TagSupport, runtimeOwnerTag: Tag, existingTag: Tag): {
        remit: boolean;
        retag: Tag;
    };
}
export interface TemplateRedraw extends TemplaterResult {
    redraw: () => Tag | undefined;
    tagSupport?: TagSupport;
}
type TagResult = (props: Props, // props or children
children?: Tag) => Tag;
export declare function tag<T>(tagComponent: T | TagResult): T;
export {};
