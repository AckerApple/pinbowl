import { Tag } from "./Tag.class.js";
import { TagSupport } from "./TagSupport.class.js";
import { Props } from "./Props.js";
import { TagChildren } from "./tag.js";
export type Wrapper = (() => Tag) & {
    original: () => Tag;
};
export declare class TemplaterResult {
    tagged: boolean;
    wrapper: Wrapper;
    insertBefore: Element | Text;
    newest?: Tag;
    oldest?: Tag;
    tagSupport: TagSupport;
    constructor(props: Props, children: TagChildren);
    redraw?: (force?: boolean) => Tag | undefined;
    isTemplater: boolean;
    renderWithSupport(tagSupport: TagSupport, existingTag: Tag | undefined, ownerTag?: Tag): {
        remit: boolean;
        retag: Tag;
    };
}
export interface TemplateRedraw extends TemplaterResult {
    redraw: () => Tag | undefined;
}
export declare function alterProps(props: Props, templater: TemplaterResult): any;
