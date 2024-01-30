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
    redraw?: (force?: boolean) => Tag | undefined;
    isTemplater: boolean;
    forceRenderTemplate(tagSupport: TagSupport, ownerTag: Tag): Tag;
    renderWithSupport(tagSupport: TagSupport, existingTag: Tag | undefined, ownerTag?: Tag): {
        remit: boolean;
        retag: Tag;
    };
}
export interface TemplateRedraw extends TemplaterResult {
    redraw: () => Tag | undefined;
    tagSupport?: TagSupport;
}
export type TagComponent = (props: Props, // props or children
children?: Tag) => Tag;
export declare const tags: TagComponent[];
export declare function tag<T>(tagComponent: T | TagComponent): T;
