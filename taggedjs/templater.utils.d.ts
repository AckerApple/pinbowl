import { Tag } from "./Tag.class.js";
import { TagSupport } from "./getTagSupport.js";
import { Props } from "./Props.js";
export type Wrapper = (() => Tag) & {
    original: () => Tag;
};
export declare class TemplaterResult {
    tagged: boolean;
    wrapper: Wrapper;
    newest?: Tag;
    oldest?: Tag;
    tagSupport: TagSupport;
    constructor(props: Props);
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
}
export type TagComponent = (props: Props, // props or children
children?: Tag) => Tag;
export declare function getNewProps(props: Props, templater: TemplaterResult): any;
