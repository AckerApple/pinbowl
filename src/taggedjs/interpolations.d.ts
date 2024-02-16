export declare const interpolateReplace: RegExp;
export type InterpolatedTemplates = {
    string: string;
    keys: string[];
};
/** replaces ${x} with <template id="x-start"></template><template id="x-end"></template> */
export declare function interpolateToTemplates(template: string): InterpolatedTemplates;
