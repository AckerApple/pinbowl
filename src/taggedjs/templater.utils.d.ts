import { Tag } from "./Tag.class.js";
import { TagSupport } from "./TagSupport.class.js";
import { Props } from "./Props.js";
import { ValueSubject } from "./ValueSubject.js";
import { TagChildren } from "./tag.js";
export type Wrapper = (() => Tag) & {
    original: () => Tag;
};
export declare class TemplaterResult {
    tagged: boolean;
    wrapper: Wrapper;
    newest?: Tag;
    oldest?: Tag;
    tagSupport: TagSupport;
    constructor(props: Props, children: TagChildren);
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
children?: ValueSubject<Tag[]>) => Tag;
export declare function alterProps(props: Props, templater: TemplaterResult): any;
