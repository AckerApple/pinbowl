import { Tag, TagMemory } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export interface TagSupport {
    memory: TagMemory;
    templater?: TemplaterResult;
    /** Indicator of re-rending. Saves from double rending something already rendered */
    renderCount: 0;
    mutatingRender: (force?: boolean) => any;
    render: (force?: boolean) => any;
    renderExistingTag: (tag: Tag, newTemplater: TemplaterResult) => any;
    /**
     *
     * @param {*} props value.props
     * @param {*} newProps value.newProps
     * @param {*} compareToProps compareSupport.templater.props
     * @returns {boolean}
     */
    hasPropChanges: (props: any, newProps: any, compareToProps: any) => boolean;
    oldest?: Tag;
    newest?: Tag;
}
export declare function getTagSupport(templater?: TemplaterResult): TagSupport;
