import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export interface TagSupport {
    templater?: TemplaterResult;
    /** Indicator of re-rending. Saves from double rending something already rendered */
    renderCount: 0;
    mutatingRender: () => any;
    render: () => any;
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
